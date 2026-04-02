package repository

import (
	"github.com/alyosha-bar/golang-react/models"
	"gorm.io/gorm"
)

type HabitRepository struct {
	DB *gorm.DB
}

func NewHabitRepository(db *gorm.DB) *HabitRepository {
	return &HabitRepository{DB: db}
}

// Get all Habits
func (r *HabitRepository) GetAllHabits() ([]models.Habit, error) {
	var habits []models.Habit
	result := r.DB.Select("id", "name", "target_hours", "logged_hours").Find(&habits)

	if result.Error != nil {
		return nil, result.Error
	}

	return habits, result.Error
}

// Get a specific Habit -- not used currently
func (r *HabitRepository) GetHabitByID(id uint64) (models.Habit, error) {
	var habit models.Habit
	result := r.DB.First(&habit, id)
	return habit, result.Error
}

// Log hours for a Habit --> SLOW right now, needs optimisation
func (r *HabitRepository) LogHour(id uint64) error {
	var habit models.Habit
	result := r.DB.Select("id", "name", "target_hours", "logged_hours").First(&habit, id)
	if result.Error != nil {
		return result.Error
	}
	habit.LoggedHours += 1
	r.DB.Save(&habit)
	return nil
}

func (r *HabitRepository) MinusLogHour(id uint64) error {
	var habit models.Habit
	result := r.DB.Select("id", "name", "target_hours", "logged_hours").First(&habit, id)
	if result.Error != nil {
		return result.Error
	}

	if habit.LoggedHours == 0 {
		return nil
	}

	habit.LoggedHours -= 1
	if habit.LoggedHours < 0 {
		habit.LoggedHours = 0
	}
	r.DB.Save(&habit)
	return nil
}

// Create a new Habit
func (r *HabitRepository) CreateHabit(habit models.Habit) (models.Habit, error) {
	result := r.DB.Create(&habit)
	return habit, result.Error
}

func (r *HabitRepository) DeleteHabit(id uint64) error {
	result := r.DB.Delete(&models.Habit{}, id)
	return result.Error
}

// Daily Habits Repository function
func (r *HabitRepository) MarkDailyHabit(id uint64, completed bool) error {
	var habit models.DailyHabit
	result := r.DB.Select("id", "name", "completed").First(&habit, id)
	if result.Error != nil {
		return result.Error
	}
	habit.Completed = completed
	r.DB.Save(&habit)
	return nil
}

func (r *HabitRepository) GetAllDailyHabits() ([]models.DailyHabit, error) {
	var dailyHabits []models.DailyHabit
	result := r.DB.Select("id", "name", "completed").Find(&dailyHabits)

	if result.Error != nil {
		return nil, result.Error
	}

	return dailyHabits, result.Error
}

func (r *HabitRepository) GetDailyHabitSnapshots() ([]models.DailySnapshot, error) {
	var snapshots []models.DailySnapshot
	result := r.DB.Select("id", "date", "count").Order("date ASC").Find(&snapshots)
	if result.Error != nil {
		return nil, result.Error
	}

	return snapshots, nil
}

func (r *HabitRepository) AddDailyHabit(name string) (models.DailyHabit, error) {
	habit := models.DailyHabit{Name: name, Completed: false}
	result := r.DB.Create(&habit)
	return habit, result.Error
}

func (r *HabitRepository) DeleteDailyHabit(id uint64) error {
	result := r.DB.Delete(&models.DailyHabit{}, id)
	return result.Error
}
