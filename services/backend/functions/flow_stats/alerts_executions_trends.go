package flow_stats

import (
	"errors"
	"math"
	"strconv"
	"strings"
	"time"

	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func AlertExecutionsTrends(interval string, flowID string, context *gin.Context, db *bun.DB) (models.StatsAlertExecutionsTotals, error) {
	// Parse the interval
	intervalParts := strings.Split(interval, "-")
	intervalValue, _ := strconv.Atoi(intervalParts[0])
	intervalUnit := intervalParts[1]

	var duration time.Duration
	switch intervalUnit {
	case "hours":
		duration = time.Duration(intervalValue) * time.Hour
	case "days":
		duration = time.Duration(intervalValue) * 24 * time.Hour
	case "months":
		duration = time.Duration(intervalValue) * 30 * 24 * time.Hour
	default:
		httperror.InternalServerError(context, "Invalid interval format", nil)
		return models.StatsAlertExecutionsTotals{}, errors.New("invalid interval format")
	}

	// Calculate the start date based on the duration
	startDate := time.Now().UTC().Add(-duration).Format("2006-01-02 15:04:05")
	previousStartDate := time.Now().UTC().Add(-2 * duration).Format("2006-01-02 15:04:05")

	// Query for executions
	var executions []models.Executions
	executionCount, err := db.NewSelect().Model(&executions).Where("flow_id = ?", flowID).Where("created_at >= ?", startDate).ScanAndCount(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting alert stats from db", err)
		return models.StatsAlertExecutionsTotals{}, err
	}

	// Query for previous executions
	var previousExecutions []models.Executions
	previousExecutionCount, err := db.NewSelect().Model(&previousExecutions).Where("flow_id = ?", flowID).Where("created_at >= ?", previousStartDate).Where("created_at < ?", startDate).ScanAndCount(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting alert stats from db", err)
		return models.StatsAlertExecutionsTotals{}, err
	}

	// Query for alerts
	var alerts []models.Alerts
	alertCount, err := db.NewSelect().Model(&alerts).Where("flow_id = ?", flowID).Where("created_at >= ?", startDate).ScanAndCount(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting alert stats from db", err)
		return models.StatsAlertExecutionsTotals{}, err
	}

	// Query for previous alerts
	var previousAlerts []models.Alerts
	previousAlertCount, err := db.NewSelect().Model(&previousAlerts).Where("flow_id = ?", flowID).Where("created_at >= ?", previousStartDate).Where("created_at < ?", startDate).ScanAndCount(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting alert stats from db", err)
		return models.StatsAlertExecutionsTotals{}, err
	}

	// Handle cases where there are no alerts or executions
	if executionCount == 0 && previousExecutionCount == 0 && alertCount == 0 && previousAlertCount == 0 {
		return models.StatsAlertExecutionsTotals{
			ExecutionCount: 0,
			ExecutionTrend: models.Trend{Direction: "neutral", Percentage: 0},
			AlertCount:     0,
			AlertTrend:     models.Trend{Direction: "neutral", Percentage: 0},
		}, nil
	}

	// Calculate trends
	executionTrend := calculateTrend(previousExecutionCount, executionCount)
	alertTrend := calculateTrend(previousAlertCount, alertCount)

	return models.StatsAlertExecutionsTotals{
		ExecutionCount: executionCount,
		ExecutionTrend: executionTrend,
		AlertCount:     alertCount,
		AlertTrend:     alertTrend,
	}, nil
}

func calculateTrend(previousCount, currentCount int) models.Trend {
	var trend models.Trend
	if previousCount == 0 {
		if currentCount > 0 {
			trend.Direction = "positive"
			trend.Percentage = 100
		} else {
			trend.Direction = "neutral"
			trend.Percentage = 0
		}
	} else {
		change := float64(currentCount-previousCount) / float64(previousCount) * 100
		trend.Percentage = math.Round(change*100) / 100
		if change > 0 {
			trend.Direction = "positive"
		} else if change < 0 {
			trend.Direction = "negative"
		} else {
			trend.Direction = "neutral"
		}
	}
	return trend
}
