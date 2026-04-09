package services

import (
	"time"

	"github.com/alyosha-bar/golang-react/models"
	"github.com/alyosha-bar/golang-react/repository"
)

type HabitService struct {
	Repo *repository.HabitRepository
}

func NewHabitService(repo *repository.HabitRepository) *HabitService {
	return &HabitService{Repo: repo}
}

// Get all Habits
func (s *HabitService) GetAllHabits(uid uint) ([]models.Habit, error) {
	return s.Repo.GetAllHabits(uid)
}

// Get a specific Habit
func (s *HabitService) GetHabitByID(id uint64, uid uint) (models.Habit, error) {
	return s.Repo.GetHabitByID(id, uid)
}

// Log hours for a Habit
func (s *HabitService) LogHour(id uint64, uid uint) error {
	return s.Repo.LogHour(id, uid)
}

func (s *HabitService) MinusLogHour(id uint64, uid uint) error {
	return s.Repo.MinusLogHour(id, uid)
}

func (s *HabitService) CreateHabit(habit models.Habit, uid uint) (models.Habit, error) {
	return s.Repo.CreateHabit(habit, uid)
}

func (r *HabitService) DeleteHabit(id uint64, uid uint) error {
	return r.Repo.DeleteHabit(id, uid)
}

// Daily Habits
func (s *HabitService) MarkDailyHabit(id uint64, completed bool, uid uint) error {
	return s.Repo.MarkDailyHabit(id, completed, uid)
}

func (s *HabitService) GetAllDailyHabits(uid uint) ([]models.DailyHabit, error) {
	return s.Repo.GetAllDailyHabits(uid)
}

func (s *HabitService) GetDailyHabitSnapshots(startDate time.Time, endDate time.Time, uid uint) ([]models.DailySnapshot, error) {
	return s.Repo.GetDailyHabitSnapshots(startDate, endDate, uid)
}

func (s *HabitService) AddDailyHabit(name string, uid uint) (models.DailyHabit, error) {
	return s.Repo.AddDailyHabit(name, uid)
}

func (s *HabitService) DeleteDailyHabit(id uint64, uid uint) error {
	return s.Repo.DeleteDailyHabit(id, uid)
}
