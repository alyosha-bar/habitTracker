package services

import (
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
func (s *HabitService) GetAllHabits() ([]models.Habit, error) {
	return s.Repo.GetAllHabits()
}

// Get a specific Habit
func (s *HabitService) GetHabitByID(id uint64) (models.Habit, error) {
	return s.Repo.GetHabitByID(id)
}

// Log hours for a Habit
func (s *HabitService) LogHour(id uint64) error {
	return s.Repo.LogHour(id)
}

func (s *HabitService) MinusLogHour(id uint64) error {
	return s.Repo.MinusLogHour(id)
}

func (s *HabitService) CreateHabit(habit models.Habit) (models.Habit, error) {
	return s.Repo.CreateHabit(habit)
}
