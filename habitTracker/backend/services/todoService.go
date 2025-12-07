package services

import (
	"github.com/alyosha-bar/golang-react/models"
	"github.com/alyosha-bar/golang-react/repository"
)

type TodoService struct {
	Repo *repository.TodoRepository
}

func NewTodoService(repo *repository.TodoRepository) *TodoService {
	return &TodoService{Repo: repo}
}

func (s *TodoService) GetAllTodos() ([]models.Todo, error) {
	return s.Repo.GetAllTodos()
}

func (s *TodoService) AddToDo(todo models.Todo) error {
	return s.Repo.AddToDo(todo)
}

func (s *TodoService) CompleteToDo(id uint64) error {
	return s.Repo.CompleteToDo(id)
}
