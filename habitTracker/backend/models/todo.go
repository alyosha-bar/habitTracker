package models

type Todo struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Task      string `json:"task"`
	Completed bool   `json:"completed"`
}
