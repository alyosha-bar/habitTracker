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

func (s *TodoService) GetAllTodos(uid uint) ([]models.Todo, error) {
	return s.Repo.GetAllTodos(uid)
}

func (s *TodoService) AddToDo(todo models.Todo, uid uint) error {
	return s.Repo.AddToDo(todo, uid)
}

func (s *TodoService) CompleteToDo(id uint64, uid uint) error {
	return s.Repo.CompleteToDo(id, uid)
}

func (s *TodoService) DeleteToDo(id uint64, uid uint) error {
	return s.Repo.DeleteToDo(id, uid)
}
