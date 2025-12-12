package handlers

import (
	"net/http"
	"strconv"

	"github.com/alyosha-bar/golang-react/models"
	"github.com/gin-gonic/gin"
)

type ManyTodosResponse struct {
	Todos []models.Todo `json:"todos"`
}

type TodoService interface {
	GetAllTodos() ([]models.Todo, error)
	AddToDo(models.Todo) error
	CompleteToDo(id uint64) error
	DeleteToDo(id uint64) error
}

type TodoHandler struct {
	Service TodoService
}

func NewTodoHandler(service TodoService) *TodoHandler {
	return &TodoHandler{Service: service}
}

func (h *TodoHandler) GetAllTodos(c *gin.Context) {
	todos, err := h.Service.GetAllTodos()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch todos"})
		return
	}

	c.JSON(http.StatusOK, ManyTodosResponse{Todos: todos})
}

func (h *TodoHandler) AddTodo(c *gin.Context) {
	var newTodo models.Todo

	if err := c.ShouldBindJSON(&newTodo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := h.Service.AddToDo(newTodo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add todo"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Todo added successfully"})
}

func (h *TodoHandler) CompleteTodo(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
		return
	}

	err = h.Service.CompleteToDo(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete todo"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo marked as completed"})
}

func (h *TodoHandler) DeleteTodo(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
		return
	}

	err = h.Service.DeleteToDo(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete todo"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted successfully"})
}
