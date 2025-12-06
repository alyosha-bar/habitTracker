package routes

import (
	"github.com/alyosha-bar/golang-react/database"
	"github.com/alyosha-bar/golang-react/handlers"
	"github.com/alyosha-bar/golang-react/repository"
	"github.com/alyosha-bar/golang-react/services"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {

	// Initialise repositories
	habitRepo := repository.NewHabitRepository(database.DB)

	// Initialise services
	habitService := services.NewHabitService(habitRepo)

	// Initialise handlers
	habitHandler := handlers.NewHabitHandler(habitService)

	habitRoutes := router.Group("/habits")
	{
		habitRoutes.POST("/log/:id", habitHandler.LogHour)

		habitRoutes.GET("/habits", habitHandler.GetHabits)

		habitRoutes.GET("/habits/:id", habitHandler.GetHabit)
	}

	reportRoutes := router.Group("/report")
	{
		reportRoutes.GET("/report") // by week / month / year
	}

}
