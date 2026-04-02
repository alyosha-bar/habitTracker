package models

import "gorm.io/datatypes"

type DailySnapshot struct {
	ID     uint `gorm:"primaryKey"`
	Date   string
	Habits datatypes.JSON
	Count  uint
}
