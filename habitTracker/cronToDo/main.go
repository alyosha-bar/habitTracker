package main

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Todo struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Task      string `json:"task"`
	Completed bool   `json:"completed"`
}

type DailyHabit struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Name      string `json:"name"`
	Completed bool   `json:"completed"`
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

	c := cron.New(cron.WithSeconds())

	c.AddFunc("59 59 23 * * *", func() {
		log.Println("Runs every day at 23:59:59")

		// clear completed to-dos
		if err := db.Where("completed = ?", true).Delete(&Todo{}).Error; err != nil {
			log.Println("Error clearing completed to-dos:", err)
		}

		log.Println("Completed to-dos cleared.")
	})

	// add another daily cron job
	// save a snapshot of daily habits to a separate table for historical tracking

	c.AddFunc("59 59 23 * * *", func() {
		log.Println("Saving daily habit snapshot...")

		// store daily habits and their completed status into a jsonb column in the DailyHabitSnapshot table
		type DailySnapshot struct {
			ID     uint   `gorm:"primaryKey" json:"id"`
			Date   string `json:"date"`
			Habits string `json:"habits"` // JSON string of habits and their status
		}

		// Example: Fetch habits and their status, convert to JSON, and save to DailyHabitSnapshot
		var habits []DailyHabit
		if err := db.Find(&habits).Error; err != nil {
			log.Println("Error fetching habits:", err)
			return
		}

		// Convert habits to JSON string
		habitsJSON, err := json.Marshal(habits)
		if err != nil {
			log.Println("Error converting habits to JSON:", err)
			return
		}

		snapshot := DailySnapshot{
			Date:   time.Now().Format("2006-01-02"), // Save the date of the snapshot
			Habits: string(habitsJSON),
		}

		if err := db.Create(&snapshot).Error; err != nil {
			log.Println("Error saving daily habit snapshot:", err)
			return
		}

		log.Println("Daily habit snapshot saved successfully.")

	})

	c.Start()

	// Keep the main function running
	select {}
}
