package main

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Todo struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Task      string `json:"task"`
	Completed bool   `json:"completed"`
	UserID    uint   `gorm:"column:user_id" json:"user_id"`
}

type DailyHabit struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Name      string `json:"name"`
	Completed bool   `json:"completed"`
	UserID    uint   `gorm:"column:user_id" json:"user_id"`
}

func clearCompletedTodos(db *gorm.DB) {

	log.Println("Runs every day at 23:59:59")

	// clear completed to-dos
	if err := db.Where("completed = ?", true).Delete(&Todo{}).Error; err != nil {
		log.Println("Error clearing completed to-dos:", err)
	}

	log.Println("Completed to-dos cleared.")

}

func saveDailyHabitSnapshot(db *gorm.DB) {
	log.Println("Saving daily habit snapshots for all users...")

	// 1. Get the date string
	date := time.Now().Format("2006-01-02")

	type DailySnapshot struct {
		ID     uint   `gorm:"primaryKey" json:"id"`
		Date   string `json:"date"`
		Count  int    `json:"count"`
		Habits string `json:"habits"`
		UserID uint   `gorm:"column:user_id" json:"user_id"`
	}

	// 2. Fetch all habits from the database
	var allHabits []DailyHabit
	if err := db.Find(&allHabits).Error; err != nil {
		log.Println("Error fetching habits:", err)
		return
	}

	if len(allHabits) == 0 {
		log.Println("No habits found to snapshot.")
		return
	}

	// 3. Group habits by UserID
	// This ensures we create one snapshot per user rather than one global snapshot
	userHabitsMap := make(map[uint][]DailyHabit)
	for _, h := range allHabits {
		userHabitsMap[h.UserID] = append(userHabitsMap[h.UserID], h)
	}

	// 4. Create a snapshot for each user
	var snapshots []DailySnapshot
	for userID, habits := range userHabitsMap {
		// Calculate completed count for THIS user
		count := 0
		for _, habit := range habits {
			if habit.Completed {
				count++
			}
		}

		// Convert THIS user's habits to JSON
		habitsJSON, err := json.Marshal(habits)
		if err != nil {
			log.Printf("Error converting habits to JSON for user %d: %v", userID, err)
			continue
		}

		snapshots = append(snapshots, DailySnapshot{
			Date:   date,
			Count:  count,
			Habits: string(habitsJSON),
			UserID: userID, // Explicitly setting the owner of this snapshot
		})
	}

	// 5. Batch insert all snapshots in one transaction
	if len(snapshots) > 0 {
		if err := db.Create(&snapshots).Error; err != nil {
			log.Println("Error saving daily habit snapshots:", err)
			return
		}
	}

	log.Printf("Daily habit snapshots saved successfully for %d users.", len(snapshots))
}

func resetDailyHabits(db *gorm.DB) {
	log.Println("Resetting daily habits...")

	if err := db.Model(&DailyHabit{}).Where("completed = ?", true).Update("completed", false).Error; err != nil {
		log.Println("Error resetting daily habits:", err)
		return
	}

	log.Println("Daily habits reset successfully.")
}

func main() {
	// connect to DB
	// load .env
	if os.Getenv("RAILWAY_ENVIRONMENT") == "" {
		// Only load .env file locally
		err := godotenv.Load(".env")
		if err != nil {
			log.Println("Warning: .env file not found (expected in local dev only)")
		}
	}

	connStr, exists := os.LookupEnv("DB_URL")
	if !exists {
		log.Fatal("DB_URL environment variable not set.")
	}

	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// run the functions

	// TODO: add checks for whether that date already has a snapshot

	clearCompletedTodos(db)
	saveDailyHabitSnapshot(db)
	resetDailyHabits(db)
}
