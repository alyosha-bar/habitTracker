package models

type DailySnapshot struct {
	ID    uint `gorm:"primaryKey"`
	Date  string
	Count uint
}
