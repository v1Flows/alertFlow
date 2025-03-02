package flow_stats

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func AlertExecutionsStats(interval string, flowID string, context *gin.Context, db *bun.DB) []models.StatsAlertExecutions {
	// Parse the interval
	intervalParts := strings.Split(interval, "-")
	intervalValue, _ := strconv.Atoi(intervalParts[0])
	intervalUnit := intervalParts[1]

	var duration time.Duration
	var groupBy string
	switch intervalUnit {
	case "hours":
		duration = time.Duration(intervalValue) * time.Hour
		groupBy = "TO_CHAR(created_at, 'YYYY-MM-DD HH24:00')"
	case "days":
		duration = time.Duration(intervalValue) * 24 * time.Hour
		groupBy = "DATE(created_at)"
	case "months":
		duration = time.Duration(intervalValue) * 30 * 24 * time.Hour
		groupBy = "TO_CHAR(created_at, 'Mon YYYY')"
	default:
		httperror.InternalServerError(context, "Invalid interval format", nil)
		return nil
	}

	// Calculate the start date based on the duration
	startDate := time.Now().UTC().Add(-duration).Format("2006-01-02 15:04:05")

	// Query for executions
	var executionStats []struct {
		Date  string `bun:"date"`
		Value int    `bun:"value"`
	}
	err := db.NewSelect().
		TableExpr(fmt.Sprintf("(SELECT %s as date, COUNT(*) as value FROM executions WHERE created_at >= '%s' AND flow_id = '%s' GROUP BY %s) AS subquery", groupBy, startDate, flowID, groupBy)).
		Scan(context, &executionStats)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting execution stats from db", err)
		return nil
	}

	// Query for alerts
	var alertStats []struct {
		Date  string `bun:"date"`
		Value int    `bun:"value"`
	}
	err = db.NewSelect().
		TableExpr(fmt.Sprintf("(SELECT %s as date, COUNT(*) as value FROM alerts WHERE created_at >= '%s' AND flow_id = '%s' GROUP BY %s) AS subquery", groupBy, startDate, flowID, groupBy)).
		Scan(context, &alertStats)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting alert stats from db", err)
		return nil
	}

	// Create maps to store the stats by date
	executionStatsMap := make(map[string]int)
	for _, stat := range executionStats {
		executionStatsMap[stat.Date] = stat.Value
	}

	alertStatsMap := make(map[string]int)
	for _, stat := range alertStats {
		alertStatsMap[stat.Date] = stat.Value
	}

	// Generate the combined stats for the interval
	var resultStats []models.StatsAlertExecutions
	if intervalUnit == "months" {
		currentDate := time.Now().UTC().AddDate(0, -intervalValue, 0)
		for i := 0; i < intervalValue; i++ {
			dateString := currentDate.Format("Jan 2006")
			executionValue := executionStatsMap[dateString]
			alertValue := alertStatsMap[dateString]
			resultStats = append(resultStats, models.StatsAlertExecutions{Key: dateString, Alerts: alertValue, Executions: executionValue})
			currentDate = currentDate.AddDate(0, 1, 0) // Move to the next month
		}
	} else if intervalUnit == "hours" {
		intervalInt := int(duration.Hours())
		currentDate := time.Now().UTC().Add(-duration)
		for i := 0; i < intervalInt; i++ {
			dateString := currentDate.Format("2006-01-02 15:00")
			executionValue := executionStatsMap[dateString]
			alertValue := alertStatsMap[dateString]
			resultStats = append(resultStats, models.StatsAlertExecutions{Key: dateString, Executions: executionValue, Alerts: alertValue})
			currentDate = currentDate.Add(time.Hour) // Move to the next hour
		}
	} else {
		intervalInt := int(duration.Hours() / 24)
		currentDate := time.Now().UTC().Add(-duration)
		for i := 0; i < intervalInt; i++ {
			dateString := currentDate.Format("2006-01-02")
			executionValue := executionStatsMap[dateString]
			alertValue := alertStatsMap[dateString]
			resultStats = append(resultStats, models.StatsAlertExecutions{Key: dateString, Executions: executionValue, Alerts: alertValue})
			currentDate = currentDate.AddDate(0, 0, 1) // Move to the next day
		}
	}

	// Add the current date to the stats
	currentDateString := time.Now().UTC().Format("2006-01-02")
	if intervalUnit == "months" {
		currentDateString = time.Now().UTC().Format("Jan 2006")
	} else if intervalUnit == "hours" {
		currentDateString = time.Now().UTC().Format("2006-01-02 15:00")
	}
	executionValue := executionStatsMap[currentDateString]
	alertValue := alertStatsMap[currentDateString]
	resultStats = append(resultStats, models.StatsAlertExecutions{Key: currentDateString, Executions: executionValue, Alerts: alertValue})

	// Sort the stats by date
	sort.Slice(resultStats, func(i, j int) bool {
		date1, _ := time.Parse("2006-01-02", resultStats[i].Key)
		if intervalUnit == "months" {
			date1, _ = time.Parse("Jan 2006", resultStats[i].Key)
		} else if intervalUnit == "hours" {
			date1, _ = time.Parse("2006-01-02 15:00", resultStats[i].Key)
		}
		date2, _ := time.Parse("2006-01-02", resultStats[j].Key)
		if intervalUnit == "months" {
			date2, _ = time.Parse("Jan 2006", resultStats[j].Key)
		} else if intervalUnit == "hours" {
			date2, _ = time.Parse("2006-01-02 15:00", resultStats[j].Key)
		}
		return date1.Before(date2)
	})

	// Remove any entry with an empty key
	var filteredStats []models.StatsAlertExecutions
	for _, stat := range resultStats {
		if stat.Key != "" {
			filteredStats = append(filteredStats, stat)
		}
	}

	// Limit the results to the specified interval
	if intervalUnit == "months" && len(filteredStats) > intervalValue {
		filteredStats = filteredStats[len(filteredStats)-intervalValue:]
	}

	// Ensure the number of results matches the interval value
	if intervalUnit == "months" && len(filteredStats) < intervalValue {
		missingMonths := intervalValue - len(filteredStats)
		for i := 0; i < missingMonths; i++ {
			dateString := time.Now().UTC().AddDate(0, -intervalValue+i, 0).Format("Jan 2006")
			filteredStats = append([]models.StatsAlertExecutions{{Key: dateString, Executions: 0, Alerts: 0}}, filteredStats...)
		}
	}

	return filteredStats
}
