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
)

type Habit struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	TargetHours int    `json:"targetHours"`
	LoggedHours int    `json:"loggedHours"`
}

type Snapshot struct {
	ID        uint `gorm:"primaryKey"`
	WeekStart time.Time
	WeekEnd   time.Time
	Habits    datatypes.JSON
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

	createSnapshot(db)
	clearLoggedHours(db)

}

// FOR NOW --> just one user
// FUTURE --> use go rountines to handle multiple users concurrently

func createSnapshot(db *gorm.DB) {
	// aggregate habits
	var habits []Habit
	result := db.Find(&habits)
	if result.Error != nil {
		log.Println("Error fetching habits:", result.Error)
		return
	}

	// create snapshot
	snapshotData := make([]map[string]interface{}, len(habits))
	for i, habit := range habits {
		snapshotData[i] = map[string]interface{}{
			"name":        habit.Name,
			"targetHours": habit.TargetHours,
			"loggedHours": habit.LoggedHours,
		}
	}
	fmt.Println(snapshotData)

	// make JSON data
	habitsJSON, err := json.Marshal(snapshotData)
	if err != nil {
		log.Println("Error marshalling habits to JSON:", err)
		return
	}

	snapshot := Snapshot{
		WeekStart: time.Now().AddDate(0, 0, -6),
		WeekEnd:   time.Now(),
		Habits:    datatypes.JSON(habitsJSON),
	}

	fmt.Println(snapshot)

	// insert into snapshots
	if err := db.Create(&snapshot).Error; err != nil {
		log.Println("Error creating snapshot:", err)
		return
	}

	fmt.Println("Snapshot created successfully")
}

func clearLoggedHours(db *gorm.DB) {
	// reset logged hours for all habits
	if err := db.Model(&Habit{}).Where("1 = 1").Update("logged_hours", 0).Error; err != nil {
		log.Println("Error resetting logged hours:", err)
		return
	}
	fmt.Println("Logged hours reset successfully")
}

// func sendReportEmails(db *gorm.DB) {

// }
