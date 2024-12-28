package flow_stats

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"errors"
	"math"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func PayloadExecutionsTrends(interval string, flowID string, context *gin.Context, db *bun.DB) (models.StatsPayloadExecutionsTotals, error) {
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
		return models.StatsPayloadExecutionsTotals{}, errors.New("invalid interval format")
	}

	// Calculate the start date based on the duration
	startDate := time.Now().UTC().Add(-duration).Format("2006-01-02 15:04:05")
	previousStartDate := time.Now().UTC().Add(-2 * duration).Format("2006-01-02 15:04:05")

	// Query for executions
	var executions []models.Executions
	executionCount, err := db.NewSelect().Model(&executions).Where("flow_id = ?", flowID).Where("created_at >= ?", startDate).ScanAndCount(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting payload stats from db", err)
		return models.StatsPayloadExecutionsTotals{}, err
	}

	// Query for previous executions
	var previousExecutions []models.Executions
	previousExecutionCount, err := db.NewSelect().Model(&previousExecutions).Where("flow_id = ?", flowID).Where("created_at >= ?", previousStartDate).Where("created_at < ?", startDate).ScanAndCount(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting payload stats from db", err)
		return models.StatsPayloadExecutionsTotals{}, err
	}

	// Query for payloads
	var payloads []models.Payloads
	payloadCount, err := db.NewSelect().Model(&payloads).Where("flow_id = ?", flowID).Where("created_at >= ?", startDate).ScanAndCount(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting payload stats from db", err)
		return models.StatsPayloadExecutionsTotals{}, err
	}

	// Query for previous payloads
	var previousPayloads []models.Payloads
	previousPayloadCount, err := db.NewSelect().Model(&previousPayloads).Where("flow_id = ?", flowID).Where("created_at >= ?", previousStartDate).Where("created_at < ?", startDate).ScanAndCount(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting payload stats from db", err)
		return models.StatsPayloadExecutionsTotals{}, err
	}

	// Handle cases where there are no payloads or executions
	if executionCount == 0 && previousExecutionCount == 0 && payloadCount == 0 && previousPayloadCount == 0 {
		return models.StatsPayloadExecutionsTotals{
			ExecutionCount: 0,
			ExecutionTrend: models.Trend{Direction: "neutral", Percentage: 0},
			PayloadCount:   0,
			PayloadTrend:   models.Trend{Direction: "neutral", Percentage: 0},
		}, nil
	}

	// Calculate trends
	executionTrend := calculateTrend(previousExecutionCount, executionCount)
	payloadTrend := calculateTrend(previousPayloadCount, payloadCount)

	return models.StatsPayloadExecutionsTotals{
		ExecutionCount: executionCount,
		ExecutionTrend: executionTrend,
		PayloadCount:   payloadCount,
		PayloadTrend:   payloadTrend,
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
