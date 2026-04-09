package repository

import (
	"fmt"

	"github.com/alyosha-bar/golang-react/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthRepository struct {
	DB *gorm.DB
}

func NewAuthRepository(db *gorm.DB) *AuthRepository {
	return &AuthRepository{DB: db}
}

// NOT FINISHED
func (r *AuthRepository) Login(username, password string) (models.User, error) {

	// Check if user exists
	var user models.User
	result := r.DB.Where("username = ?", username).First(&user)

	if result.Error != nil {
		return models.User{}, result.Error
	}

	// Check if password matches
	// use bcrypt to compare hashed password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return models.User{}, fmt.Errorf("invalid credentials")
	}

	fmt.Printf("Logging In. Username: %s, Password: %s\n", username, password)

	return user, nil

}

func (r *AuthRepository) SignUp(username, password string) (string, error) {

	// Check if user already exists
	var existingUser models.User
	result := r.DB.Where("username = ?", username).First(&existingUser)

	if result.Error == nil {
		return "", fmt.Errorf("user already exists")
	}

	// Create new user

	// hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", fmt.Errorf("failed to hash password")
	}

	newUser := models.User{
		Username: username,
		Password: string(hashedPassword),
	}

	// Save new user to database
	if err := r.DB.Create(&newUser).Error; err != nil {
		return "", fmt.Errorf("failed to create user: %v", err)
	}

	return "User created successfully.", nil

}
