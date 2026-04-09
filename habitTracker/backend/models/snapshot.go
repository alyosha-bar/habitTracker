package models

import (
	"time"

	"gorm.io/datatypes"
)

type Snapshot struct {
	ID        uint `gorm:"primaryKey"`
	WeekStart time.Time
	WeekEnd   time.Time
	Habits    datatypes.JSON
	UserID    uint `json:"userId"`
}
