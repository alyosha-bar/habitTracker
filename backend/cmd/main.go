package main

import (
	"time"

	"github.com/alyosha-bar/golang-react/database"
	"github.com/alyosha-bar/golang-react/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	// connect to DB
	database.ConnectDB()

	// set up GIN router
	router := gin.Default()

	// set up CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{}, // specify allowed origins
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// set up routes
	routes.SetupRoutes(router)

	router.Run(":8080") // start the server on port 8080

}
