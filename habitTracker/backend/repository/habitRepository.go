package repository

import (
	"time"

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
func (r *HabitRepository) GetAllHabits(uid uint) ([]models.Habit, error) {
	var habits []models.Habit
	result := r.DB.Select("id", "name", "target_hours", "logged_hours").Where("user_id = ?", uid).Find(&habits)

	if result.Error != nil {
		return nil, result.Error
	}

	return habits, result.Error
}

// Get a specific Habit -- not used currently
func (r *HabitRepository) GetHabitByID(id uint64, uid uint) (models.Habit, error) {
	var habit models.Habit
	result := r.DB.First(&habit, id).Where("user_id = ?", uid)

	// Check if record not found
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			// return unauthorized if habit doesn't exist or doesn't belong to user
			return models.Habit{}, gorm.ErrRecordNotFound
		}
		return models.Habit{}, result.Error
	}

	return habit, result.Error
}

// Log hours for a Habit --> SLOW right now, needs optimisation
func (r *HabitRepository) LogHour(id uint64, uid uint) error {
	var habit models.Habit
	result := r.DB.Select("id", "name", "target_hours", "logged_hours", "user_id").First(&habit, id).Where("user_id = ?", uid)
	if result.Error != nil {
		return result.Error
	}
	habit.LoggedHours += 1
	r.DB.Save(&habit)
	return nil
}

func (r *HabitRepository) MinusLogHour(id uint64, uid uint) error {
	var habit models.Habit
	result := r.DB.Select("id", "name", "target_hours", "logged_hours", "user_id").First(&habit, id).Where("user_id = ?", uid)
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
func (r *HabitRepository) CreateHabit(habit models.Habit, uid uint) (models.Habit, error) {
	habit.UserID = uid
	result := r.DB.Create(&habit)
	return habit, result.Error
}

func (r *HabitRepository) DeleteHabit(id uint64, uid uint) error {
	result := r.DB.Delete(&models.Habit{}, id).Where("user_id = ?", uid)
	return result.Error
}

// Daily Habits Repository function
func (r *HabitRepository) MarkDailyHabit(id uint64, completed bool, uid uint) error {
	var habit models.DailyHabit
	result := r.DB.Select("id", "name", "completed", "user_id").First(&habit, id).Where("user_id = ?", uid)
	if result.Error != nil {
		return result.Error
	}
	habit.Completed = completed
	r.DB.Save(&habit)
	return nil
}

func (r *HabitRepository) GetAllDailyHabits(uid uint) ([]models.DailyHabit, error) {
	var dailyHabits []models.DailyHabit
	result := r.DB.Select("id", "name", "completed").Where("user_id = ?", uid).Find(&dailyHabits)

	if result.Error != nil {
		return nil, result.Error
	}

	return dailyHabits, result.Error
}

func (r *HabitRepository) GetDailyHabitSnapshots(startDate time.Time, endDate time.Time, uid uint) ([]models.DailySnapshot, error) {

	// strip time component from startDate and endDate to ensure we are comparing only dates
	startDateStr := startDate.Format("2006-01-02")
	endDateStr := endDate.Format("2006-01-02")

	var snapshots []models.DailySnapshot
	result := r.DB.Select("id", "date", "count").Where("date >= ? AND date <= ? AND user_id = ?", startDateStr, endDateStr, uid).Order("id ASC").Find(&snapshots)
	if result.Error != nil {
		return nil, result.Error
	}

	return snapshots, nil
}

func (r *HabitRepository) AddDailyHabit(name string, uid uint) (models.DailyHabit, error) {
	habit := models.DailyHabit{Name: name, Completed: false, UserID: uid}
	result := r.DB.Create(&habit)
	return habit, result.Error
}

func (r *HabitRepository) DeleteDailyHabit(id uint64, uid uint) error {
	result := r.DB.Delete(&models.DailyHabit{}, id).Where("user_id = ?", uid)
	return result.Error
}
