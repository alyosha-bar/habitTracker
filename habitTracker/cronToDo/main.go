package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type ToDo struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Task      string `json:"task"`
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
		if err := db.Where("completed = ?", true).Delete(&ToDo{}).Error; err != nil {
			log.Println("Error clearing completed to-dos:", err)
		}
	})

	c.Start()

	// Keep the main function running
	select {}
}
