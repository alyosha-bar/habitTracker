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
	result := r.DB.Find(&habits)

	if result.Error != nil {
		return nil, result.Error
	}

	return habits, result.Error
}

// Get a specific Habit
func (r *HabitRepository) GetHabitByID(id uint64) (models.Habit, error) {
	var habit models.Habit
	result := r.DB.First(&habit, id)
	return habit, result.Error
}

// Log hours for a Habit
func (r *HabitRepository) LogHour(id uint64) error {
	var habit models.Habit
	result := r.DB.First(&habit, id)
	if result.Error != nil {
		return result.Error
	}
	habit.LoggedHours += 1
	r.DB.Save(&habit)
	return nil
}
