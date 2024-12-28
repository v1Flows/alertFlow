package flows

import (
	"alertflow-backend/functions/flow_stats"
	"alertflow-backend/functions/httperror"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func GetStats(context *gin.Context, db *bun.DB) {
	flowID := context.Param("flowID")
	interval := context.DefaultQuery("interval", "24-hours")

	payloadExecutionsStats := flow_stats.PayloadExecutionsStats(interval, flowID, context, db)
	if payloadExecutionsStats == nil {
		httperror.InternalServerError(context, "Error collecting stats", nil)
		return
	}

	payloadExectuionsTrends, err := flow_stats.PayloadExecutionsTrends(interval, flowID, context, db)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting trends", nil)
		return
	}

	// Return the stats
	context.JSON(http.StatusOK, gin.H{
		"payloads_executions_stats":  payloadExecutionsStats,
		"payloads_executions_trends": payloadExectuionsTrends,
	})
}
