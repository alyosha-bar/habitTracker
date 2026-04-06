package handlers

import (
	"net/http"

	"github.com/alyosha-bar/golang-react/models"
	"github.com/alyosha-bar/golang-react/util"
	"github.com/gin-gonic/gin"
)

type AuthResponse struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
	Error string      `json:"error,omitempty"`
}

type AuthService interface {
	Login(username, password string) (models.User, error)
	SignUp(username, password string) (string, error)
}

type AuthHandler struct {
	Service AuthService
}

func NewAuthHandler(service AuthService) *AuthHandler {
	return &AuthHandler{Service: service}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user, err := h.Service.Login(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// remove password from response
	user.Password = "" // Janky but okay for now

	// generate JWT token
	token, err := util.GenerateJWT(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Make response object
	resp := AuthResponse{
		Token: token,
		User:  user,
	}

	c.JSON(http.StatusOK, resp)
}

func (h *AuthHandler) SignUp(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := h.Service.SignUp(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}
