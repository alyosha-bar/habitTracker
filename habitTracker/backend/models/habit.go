package models

type Habit struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	TargetHours int    `json:"targetHours"`
	LoggedHours int    `json:"loggedHours"`
}
