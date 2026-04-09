package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/datatypes"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Habit struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	TargetHours int    `json:"targetHours"`
	LoggedHours int    `json:"loggedHours"`
	UserID      uint   `gorm:"column:user_id" json:"user_id"`
}

type Snapshot struct {
	ID        uint           `gorm:"primaryKey"`
	WeekStart time.Time      `json:"week_start"`
	WeekEnd   time.Time      `json:"week_end"`
	Habits    datatypes.JSON `json:"habits"`
	UserID    uint           `gorm:"column:user_id" json:"user_id"`
}

func main() {
	// Load environment variables for local development
	if os.Getenv("RAILWAY_ENVIRONMENT") == "" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Println("Warning: .env file not found (expected in local dev only)")
		}
	}

	connStr, exists := os.LookupEnv("DB_URL")
	if !exists {
		log.Fatal("DB_URL environment variable not set.")
	}

	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run both operations in a single transaction for safety.
	// If snapshotting fails, hours won't be cleared.
	// If clearing hours fails, the snapshot will be rolled back.
	err = db.Transaction(func(tx *gorm.DB) error {
		// 1. Create snapshots for all users
		if err := createSnapshot(tx); err != nil {
			return err
		}

		// 2. Reset hours for all habits
		if err := clearLoggedHours(tx); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		log.Fatalf("Maintenance job failed: %v", err)
	}

	fmt.Println("Snapshot created and hours reset successfully for all users.")
}

func createSnapshot(tx *gorm.DB) error {

	// Truncate to start of day to keep snapshot windows clean (00:00:00)
	now := time.Now().Truncate(24 * time.Hour)
	weekStart := now.AddDate(0, 0, -7)

	var allHabits []Habit

	// Fetch all habits. Order by user_id for predictable processing.
	if err := tx.Order("user_id").Find(&allHabits).Error; err != nil {
		return fmt.Errorf("failed to fetch habits: %w", err)
	}

	if len(allHabits) == 0 {
		log.Println("No habits found to snapshot.")
		return nil
	}

	userHabitsMap := make(map[uint][]Habit)
	for _, h := range allHabits {
		userHabitsMap[h.UserID] = append(userHabitsMap[h.UserID], h)
	}

	var snapshots []Snapshot
	for userID, habits := range userHabitsMap {
		habitsJSON, err := json.Marshal(habits)
		if err != nil {
			log.Printf("Warning: Skipping user %d due to JSON error: %v", userID, err)
			continue
		}

		snapshots = append(snapshots, Snapshot{
			WeekStart: weekStart,
			WeekEnd:   now,
			Habits:    datatypes.JSON(habitsJSON),
			UserID:    userID,
		})
	}

	// Batch insert all snapshots at once for efficiency
	if len(snapshots) > 0 {
		if err := tx.Create(&snapshots).Error; err != nil {
			return fmt.Errorf("failed to batch insert snapshots: %w", err)
		}
	}

	return nil
}

func clearLoggedHours(tx *gorm.DB) error {
	result := tx.Model(&Habit{}).Where("logged_hours > ?", 0).Updates(map[string]interface{}{
		"logged_hours": 0,
	})

	if result.Error != nil {
		return fmt.Errorf("failed to reset logged hours: %w", result.Error)
	}

	log.Printf("Successfully reset hours for %d habits.", result.RowsAffected)
	return nil
}
