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
	todoRepo := repository.NewTodoRepository(database.DB)

	// Initialise services
	habitService := services.NewHabitService(habitRepo)
	todoService := services.NewTodoService(todoRepo)

	// Initialise handlers
	habitHandler := handlers.NewHabitHandler(habitService)
	todoHandler := handlers.NewTodoHandler(todoService)

	habitRoutes := router.Group("/habits")
	{
		habitRoutes.POST("/log/:id", habitHandler.LogHour) // change to PUT

		habitRoutes.GET("/habits", habitHandler.GetHabits)

		habitRoutes.GET("/habits/:id", habitHandler.GetHabit)
	}

	todoRoutes := router.Group("/todos")
	{
		// Define todo routes here
		todoRoutes.GET("/all", todoHandler.GetAllTodos)

		todoRoutes.POST("/add", todoHandler.AddTodo)

		todoRoutes.PUT("/complete/:id", todoHandler.CompleteTodo)
	}

	reportRoutes := router.Group("/report")
	{
		reportRoutes.GET("/report") // by week / month / year
	}

}
