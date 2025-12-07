package repository

import (
	"github.com/alyosha-bar/golang-react/models"
	"gorm.io/gorm"
)

type TodoRepository struct {
	DB *gorm.DB
}

func NewTodoRepository(db *gorm.DB) *TodoRepository {
	return &TodoRepository{DB: db}
}

func (r *TodoRepository) GetAllTodos() ([]models.Todo, error) {
	var todos []models.Todo
	result := r.DB.Find(&todos)
	if result.Error != nil {
		return nil, result.Error
	}

	return todos, result.Error
}

// make new Todo
func (r *TodoRepository) AddToDo(todo models.Todo) error {
	result := r.DB.Create(&todo)
	return result.Error
}

// mark a Todo as completed
func (r *TodoRepository) CompleteToDo(id uint64) error {
	var todo models.Todo
	result := r.DB.First(&todo, id)
	if result.Error != nil {
		return result.Error
	}
	todo.Completed = !todo.Completed
	r.DB.Save(&todo)
	return nil
}
