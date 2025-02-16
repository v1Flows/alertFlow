package admins

import (
	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	functions_runner "github.com/v1Flows/alertFlow/services/backend/functions/runner"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func GetSettings(context *gin.Context, db *bun.DB) {
	var settings models.Settings
	err := db.NewSelect().Model(&settings).Where("id = 1").Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting settings data on db", err)
		return
	}

	// regenerate AlertFlowRunnerAutoJoinToken if it got deleted or is not existing
	if settings.AlertFlowRunnerAutoJoinToken == "" {
		settings.AlertFlowRunnerAutoJoinToken, err = functions_runner.GenerateAlertFlowAutoJoinToken(db)
		if err != nil {
			httperror.InternalServerError(context, "Error generating AlertFlowRunnerAutoJoinToken", err)
			return
		}
		_, err = db.NewUpdate().Model(&settings).Set("alertflow_runner_auto_join_token = ?", settings.AlertFlowRunnerAutoJoinToken).Where("id = 1").Exec(context)
		if err != nil {
			httperror.InternalServerError(context, "Error updating AlertFlowRunnerAutoJoinToken on db", err)
			return
		}
	}

	context.JSON(http.StatusOK, gin.H{"settings": settings})
}
