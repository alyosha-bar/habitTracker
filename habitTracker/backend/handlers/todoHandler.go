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
	GetAllTodos(uid uint) ([]models.Todo, error)
	AddToDo(newTodo models.Todo, uid uint) error
	CompleteToDo(id uint64, uid uint) error
	DeleteToDo(id uint64, uid uint) error
}

type TodoHandler struct {
	Service TodoService
}

func NewTodoHandler(service TodoService) *TodoHandler {
	return &TodoHandler{Service: service}
}

func (h *TodoHandler) GetAllTodos(c *gin.Context) {

	user_id, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	// convert user_id to uint
	uid, ok := user_id.(uint)
	if !ok {
		c.JSON(500, gin.H{"error": "Failed to parse user ID"})
		return
	}

	todos, err := h.Service.GetAllTodos(uid)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch todos"})
		return
	}

	c.JSON(http.StatusOK, ManyTodosResponse{Todos: todos})
}

func (h *TodoHandler) AddTodo(c *gin.Context) {

	user_id, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	// convert user_id to uint
	uid, ok := user_id.(uint)
	if !ok {
		c.JSON(500, gin.H{"error": "Failed to parse user ID"})
		return
	}

	var newTodo models.Todo

	if err := c.ShouldBindJSON(&newTodo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := h.Service.AddToDo(newTodo, uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add todo"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Todo added successfully"})
}

func (h *TodoHandler) CompleteTodo(c *gin.Context) {
	idParam := c.Param("id")

	user_id, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	// convert user_id to uint
	uid, ok := user_id.(uint)
	if !ok {
		c.JSON(500, gin.H{"error": "Failed to parse user ID"})
		return
	}

	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
		return
	}

	err = h.Service.CompleteToDo(id, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete todo"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo marked as completed"})
}

func (h *TodoHandler) DeleteTodo(c *gin.Context) {
	idParam := c.Param("id")

	user_id, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	// convert user_id to uint
	uid, ok := user_id.(uint)
	if !ok {
		c.JSON(500, gin.H{"error": "Failed to parse user ID"})
		return
	}

	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
		return
	}

	err = h.Service.DeleteToDo(id, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete todo"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted successfully"})
}
