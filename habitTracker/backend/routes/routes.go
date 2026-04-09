package routes

import (
	"github.com/alyosha-bar/golang-react/database"
	"github.com/alyosha-bar/golang-react/handlers"
	"github.com/alyosha-bar/golang-react/middleware"
	"github.com/alyosha-bar/golang-react/repository"
	"github.com/alyosha-bar/golang-react/services"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {

	// Initialise repositories
	habitRepo := repository.NewHabitRepository(database.DB)
	todoRepo := repository.NewTodoRepository(database.DB)
	authRepo := repository.NewAuthRepository(database.DB)

	// Initialise services
	habitService := services.NewHabitService(habitRepo)
	todoService := services.NewTodoService(todoRepo)
	authService := services.NewAuthService(authRepo)

	// Initialise handlers
	habitHandler := handlers.NewHabitHandler(habitService)
	todoHandler := handlers.NewTodoHandler(todoService)
	authHandler := handlers.NewAuthHandler(authService)

	// Auth Routes
	authRoutes := router.Group("/auth")
	{
		authRoutes.POST("/login", authHandler.Login)
		authRoutes.POST("/signup", authHandler.SignUp)
	}

	habitRoutes := router.Group("/habits")
	habitRoutes.Use(middleware.AuthMiddleware())
	{
		habitRoutes.PUT("/log/:id", habitHandler.LogHour)

		habitRoutes.GET("/habits", habitHandler.GetHabits)

		habitRoutes.GET("/habits/:id", habitHandler.GetHabit)

		habitRoutes.PUT("/minuslog/:id", habitHandler.MinusLogHour)

		habitRoutes.POST("/create", habitHandler.CreateHabit)

		habitRoutes.DELETE("/delete/:id", habitHandler.DeleteHabit)

		// Daily Habit Routes
		habitRoutes.GET("/daily", habitHandler.GetDailyHabits)

		habitRoutes.GET("/daily/snapshots", habitHandler.GetDailyHabitSnapshots)

		habitRoutes.POST("/daily/add", habitHandler.AddDailyHabit)

		habitRoutes.PUT("/daily/:id", habitHandler.MarkDailyHabit)

		habitRoutes.DELETE("/daily/:id", habitHandler.DeleteDailyHabit)

	}

	todoRoutes := router.Group("/todos")
	todoRoutes.Use(middleware.AuthMiddleware())
	{
		// Define todo routes here
		todoRoutes.GET("/all", todoHandler.GetAllTodos)

		todoRoutes.POST("/add", todoHandler.AddTodo)

		todoRoutes.PUT("/complete/:id", todoHandler.CompleteTodo)

		// Delete a todo
		todoRoutes.DELETE("/delete/:id", todoHandler.DeleteTodo)
	}

	reportRoutes := router.Group("/report")
	{
		reportRoutes.GET("/report") // by week / month / year
	}

}
