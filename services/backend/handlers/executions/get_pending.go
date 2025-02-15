package executions

import (
	"fmt"
	"net/http"

	"github.com/v1Flows/alertFlow/services/backend/functions/auth"
	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func GetPendingExecutions(context *gin.Context, db *bun.DB) {
	_, projectID, _, err := auth.GetRunnerDataFromToken(context.GetHeader("Authorization"))
	if err != nil {
		httperror.Unauthorized(context, "Error receiving runner data from token", err)
		return
	}

	runnerID := context.Param("runnerID")

	// get runner data is assigned to
	var runner models.Runners
	err = db.NewSelect().Model(&runner).Where("id = ?", runnerID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting runner data on db", err)
		return
	}

	executions := make([]models.Executions, 0)

	if !runner.AlertFlowRunner {
		err = db.NewSelect().Model(&executions).Where("flow_id::text IN (SELECT id::text FROM flows WHERE project_id = ?)", projectID).Where("status = 'pending' AND runner_id = ''").Scan(context)
		if err != nil {
			httperror.InternalServerError(context, "Error collecting executions from db", err)
			fmt.Println(err.Error())
			return
		}
	} else {
		err = db.NewSelect().Model(&executions).Where("status = 'pending' AND runner_id = ''").Scan(context)
		if err != nil {
			httperror.InternalServerError(context, "Error collecting executions from db", err)
			return
		}
	}

	context.JSON(http.StatusOK, gin.H{"executions": executions})
}
