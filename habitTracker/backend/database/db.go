package database

import (
	"fmt"
	"log"
	"os"
	"time" // Required for connection lifetime

	"github.com/alyosha-bar/golang-react/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// 1. Load .env only if not in a production environment like Railway
	if os.Getenv("RAILWAY_ENVIRONMENT") == "" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Println("Note: .env file not found, using system environment variables")
		}
	}

	connStr, exists := os.LookupEnv("DB_URL")
	if !exists {
		log.Fatal("DB_URL environment variable not set.")
	}

	// 2. Open connection with GORM
	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{
		PrepareStmt: true, // Optimization: caches prepared statements for faster repetitive queries
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 3. Configure the underlying SQL Connection Pool
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}

	// SetMaxIdleConns sets the maximum number of connections in the idle connection pool.
	sqlDB.SetMaxIdleConns(10)

	// SetMaxOpenConns sets the maximum number of open connections to the database.
	sqlDB.SetMaxOpenConns(100)

	// SetConnMaxLifetime sets the maximum amount of time a connection may be reused.
	// This prevents issues with stale connections or DB-side timeouts.
	sqlDB.SetConnMaxLifetime(time.Hour)

	err = sqlDB.Ping()
	if err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	DB = db

	// 4. AutoMigrate models
	err = DB.AutoMigrate(
		&models.Habit{},
		&models.DailySnapshot{},
		&models.Todo{},
		&models.DailyHabit{},
		&models.Snapshot{},
	)
	if err != nil {
		log.Fatal("AutoMigrate failed:", err)
	}

	fmt.Println("Database connection established with optimized pooling.")
}
