package admins

import (
	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func GetRunners(context *gin.Context, db *bun.DB) {
	selfhostedRunners := make([]models.Runners, 0)
	err := db.NewSelect().Model(&selfhostedRunners).Where("alertflow_runner = false").Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting runners data on db", err)
		return
	}

	alertflowRunners := make([]models.Runners, 0)
	err = db.NewSelect().Model(&alertflowRunners).Where("alertflow_runner = true").Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting runners data on db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"self_hosted_runners": selfhostedRunners, "alertflow_runners": alertflowRunners})
}
