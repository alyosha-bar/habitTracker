package models

type DailyHabit struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Name      string `json:"name"`
	Completed bool   `json:"completed"`
	UserID    uint   `json:"userId"`
}
