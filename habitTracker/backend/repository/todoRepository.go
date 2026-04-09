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

func (r *TodoRepository) GetAllTodos(uid uint) ([]models.Todo, error) {
	var todos []models.Todo
	result := r.DB.Select("id", "task", "completed").Where("user_id = ?", uid).Find(&todos)
	if result.Error != nil {
		return nil, result.Error
	}

	return todos, result.Error
}

// make new Todo
func (r *TodoRepository) AddToDo(todo models.Todo, uid uint) error {
	todo.UserID = uid
	result := r.DB.Create(&todo)
	return result.Error
}

// mark a Todo as completed
func (r *TodoRepository) CompleteToDo(id uint64, uid uint) error {
	var todo models.Todo
	result := r.DB.Select("id", "task", "completed", "user_id").Where("user_id = ?", uid).First(&todo, id)
	if result.Error != nil {
		return result.Error
	}
	todo.Completed = !todo.Completed
	r.DB.Save(&todo)
	return nil
}

// delete a Todo
func (r *TodoRepository) DeleteToDo(id uint64, uid uint) error {
	result := r.DB.Where("user_id = ?", uid).Delete(&models.Todo{}, id)
	return result.Error
}
