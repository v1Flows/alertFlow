package runners

import (
	"net/http"

	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func SetRunnerPayloadEndpoints(context *gin.Context, db *bun.DB) {
	id := context.Param("id")

	var runner models.Runners
	if err := context.ShouldBindJSON(&runner); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	_, err := db.NewUpdate().Model(&runner).Where("id = ?", id).Set("alert_endpoints = ?", runner.AlertEndpoints).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating runner alert endpoints on db", err)
		return
	}

	context.JSON(http.StatusCreated, gin.H{"result": "success"})
}
