package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/alyosha-bar/golang-react/models"
	"github.com/alyosha-bar/golang-react/util"
	"github.com/gin-gonic/gin"
)

type ManyHabitsResponse struct {
	Habits []models.Habit `json:"habits"`
}

type HabitResponse struct {
	Habit models.Habit `json:"habit"`
}

type HabitService interface {
	GetAllHabits() ([]models.Habit, error)
	GetHabitByID(id uint64) (models.Habit, error)
	LogHour(habitID uint64) error
	MinusLogHour(habitID uint64) error
	CreateHabit(habit models.Habit) (models.Habit, error)
	DeleteHabit(id uint64) error

	// Daily Habits
	MarkDailyHabit(id uint64, completed bool) error
	GetAllDailyHabits() ([]models.DailyHabit, error)
	GetDailyHabitSnapshots(startDate time.Time, endDate time.Time) ([]models.DailySnapshot, error)
	AddDailyHabit(name string) (models.DailyHabit, error)
	DeleteDailyHabit(id uint64) error
}

type HabitHandler struct {
	Service HabitService
}

func NewHabitHandler(service HabitService) *HabitHandler {
	return &HabitHandler{Service: service}
}

func (h *HabitHandler) GetHabits(c *gin.Context) {
	// fetch all habits
	fmt.Println("Fetching all habits")

	habits, err := h.Service.GetAllHabits()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch habits"})
		return
	}

	c.JSON(http.StatusOK, ManyHabitsResponse{Habits: habits})

}

func (h *HabitHandler) GetHabit(c *gin.Context) {
	// fetch specific habit based on habit_id
	habit_id := c.Param("habit_id")

	// cnvert habit_id to uint
	habitID, err := strconv.ParseUint(habit_id, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid habit ID"})
		return
	}

	// return habit as json
	habit, err := h.Service.GetHabitByID(habitID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch habit"})
		return
	}
	c.JSON(http.StatusOK, HabitResponse{Habit: habit})
}

func (h *HabitHandler) LogHour(c *gin.Context) {
	// get habit id and user id from request
	habit_id := c.Param("id")

	// convert habit id to uint64
	habitID, err := strconv.ParseUint(habit_id, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid habit ID"})
		return
	}

	// increment hours for that entry
	err = h.Service.LogHour(habitID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to log hour"})
		return
	}
	// return simple json message
	c.JSON(http.StatusOK, gin.H{"message": "Hour logged successfully"})
}

func (h *HabitHandler) MinusLogHour(c *gin.Context) {
	// get habit id and user id from request
	habit_id := c.Param("id")
	// convert habit id to uint64
	habitID, err := strconv.ParseUint(habit_id, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid habit ID"})
		return
	}

	// decrement hours for that entry
	err = h.Service.MinusLogHour(habitID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to minus log hour"})
		return
	}
	// return simple json message
	c.JSON(http.StatusOK, gin.H{"message": "Hour removed successfully"})
}

// ISSUES WITH THIS ROUTE
func (h *HabitHandler) CreateHabit(c *gin.Context) {
	var newHabit models.Habit

	// bind json to newHabit
	if err := c.ShouldBindJSON(&newHabit); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}

	// create new habit
	habit, err := h.Service.CreateHabit(newHabit)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create habit"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Habit created successfully",
		"newHabit": habit,
	})
}

func (h *HabitHandler) DeleteHabit(c *gin.Context) {
	habit_id := c.Param("id")

	habitID, err := strconv.ParseUint(habit_id, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid habit ID"})
		return
	}

	err = h.Service.DeleteHabit(habitID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete habit"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Habit deleted successfully"})
}

// Daily Habits
func (h *HabitHandler) MarkDailyHabit(c *gin.Context) {
	habit_id := c.Param("id")

	habitID, err := strconv.ParseUint(habit_id, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid habit ID"})
		return
	}

	completed := c.Query("completed") == "true"

	err = h.Service.MarkDailyHabit(habitID, completed)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to mark daily habit"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Daily habit marked successfully"})

}

func (h *HabitHandler) GetDailyHabits(c *gin.Context) {
	dailyHabits, err := h.Service.GetAllDailyHabits()

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch daily habits"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dailyHabits": dailyHabits})
}

func (h *HabitHandler) GetDailyHabitSnapshots(c *gin.Context) {

	// Get week, month, and year from query params
	y := util.QueryInt(c.Query("year"))
	m := util.QueryInt(c.Query("month"))
	w := util.QueryInt(c.Query("week"))
	graphRange := c.Query("graphRange")

	fmt.Printf("Received query params - week: %s, month: %s, year: %s, graphRange: %s\n", w, m, y, graphRange)

	// Calculate Date start and end date
	Start, End := util.GetDateRange(y, m, w, graphRange)

	fmt.Printf("Calculated date range - start: %s, end: %s\n", Start.Format("2006-01-02"), End.Format("2006-01-02"))

	snapshots, err := h.Service.GetDailyHabitSnapshots(Start, End)

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch daily habit snapshots"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"snapshots": snapshots})
}

func (h *HabitHandler) AddDailyHabit(c *gin.Context) {

	// Get habit from query params
	name := c.Query("name")
	if name == "" {
		c.JSON(400, gin.H{"error": "Habit name is required"})
		return
	}

	habit, err := h.Service.AddDailyHabit(name)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to add daily habit"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Daily habit added successfully",
		"habit":   habit,
	})
}

func (h *HabitHandler) DeleteDailyHabit(c *gin.Context) {
	habit_id := c.Param("id")

	habitID, err := strconv.ParseUint(habit_id, 10, 64)

	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid habit ID"})
		return
	}

	err = h.Service.DeleteDailyHabit(habitID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete daily habit"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Daily habit deleted successfully"})
}
