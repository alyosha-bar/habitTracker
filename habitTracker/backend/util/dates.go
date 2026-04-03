package util

import (
	"strconv"
	"time"
)

// GetDateRange returns the start and end time for a given week or month.
// For week: uses ISO 8601 logic.
// For month: returns the first and last day of that month.
func GetDateRange(year int, month int, week int, graphRange string) (start time.Time, end time.Time) {
	switch graphRange {
	case "month":
		// Start of the month
		start = time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		// End of the month: Go handles overflow, so 1st of next month minus 1 nanosecond
		end = start.AddDate(0, 1, 0).Add(-time.Nanosecond)

	case "week":
		// ISO 8601 rule: Jan 4th is always in Week 1
		jan4 := time.Date(year, 1, 4, 0, 0, 0, 0, time.UTC)

		// Find the Monday of that first week
		// ISO weekday: Mon=1...Sun=7. Go's Weekday: Sun=0...Sat=6
		isoDay := int(jan4.Weekday())
		if isoDay == 0 {
			isoDay = 7
		}

		mondayFirstWeek := jan4.AddDate(0, 0, -(isoDay - 1))

		// Move forward to the target week
		start = mondayFirstWeek.AddDate(0, 0, (week-1)*7)
		// End is 7 days later minus 1 nanosecond
		end = start.AddDate(0, 0, 7).Add(-time.Nanosecond)
	}

	return start, end
}

func QueryInt(s string) int {
	i, _ := strconv.Atoi(s)
	return i
}
