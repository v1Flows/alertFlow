package executions

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func GetPendingExecutions(context *gin.Context, db *bun.DB) {
	var runnerID = context.Param("executionID")

	// get runner data is assigned to
	var runner models.Runners
	err := db.NewSelect().Model(&runner).Where("id = ?", runnerID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting runner data on db", err)
		return
	}

	executions := make([]models.Executions, 0)

	if !runner.AlertFlowRunner {
		err = db.NewSelect().Model(&executions).Where("flow_id::text IN (SELECT id::text FROM flows WHERE project_id = ?)", runner.ProjectID).Where("pending = true AND runner_id = ''").Scan(context)
		if err != nil {
			httperror.InternalServerError(context, "Error collecting executions from db", err)
			return
		}
	} else {
		err = db.NewSelect().Model(&executions).Where("pending = true AND runner_id = ''").Scan(context)
		if err != nil {
			httperror.InternalServerError(context, "Error collecting executions from db", err)
			return
		}
	}

	context.JSON(http.StatusOK, gin.H{"executions": executions})
}
