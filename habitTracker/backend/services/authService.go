package services

import (
	"github.com/alyosha-bar/golang-react/models"
	"github.com/alyosha-bar/golang-react/repository"
)

type AuthService struct {
	Repo *repository.AuthRepository
}

func NewAuthService(repo *repository.AuthRepository) *AuthService {
	return &AuthService{Repo: repo}
}

func (s *AuthService) Login(username, password string) (models.User, error) {
	return s.Repo.Login(username, password)
}

func (s *AuthService) SignUp(username, password string) (string, error) {
	return s.Repo.SignUp(username, password)
}
