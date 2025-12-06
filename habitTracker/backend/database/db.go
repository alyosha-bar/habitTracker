package database

import (
	"fmt"
	"log"
	"os"

	"github.com/alyosha-bar/golang-react/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {

	// load .env
	if os.Getenv("RAILWAY_ENVIRONMENT") == "" {
		// Only load .env file locally
		err := godotenv.Load("../.env")
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

	DB = db

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}

	err = sqlDB.Ping()
	if err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	// AutoMigrate models
	err = DB.AutoMigrate(
		&models.Habit{},
	)
	if err != nil {
		log.Fatal("AutoMigrate failed:", err)
	}

	fmt.Println("Database connection established.")
}
