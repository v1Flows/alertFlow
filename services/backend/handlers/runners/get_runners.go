package runners

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/pkg/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func GetRunners(context *gin.Context, db *bun.DB) {
	userID, err := auth.GetUserIDFromToken(context.GetHeader("Authorization"))
	if err != nil {
		httperror.InternalServerError(context, "Error receiving userID from token", err)
		return
	}

	projectRunners := make([]models.Runners, 0)
	err = db.NewSelect().Model(&projectRunners).Where("project_id::text IN (SELECT project_id::text FROM project_members WHERE user_id = ?)", userID).Where("alertflow_runner = false").Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting project runners from db", err)
		return
	}

	alertflowRunners := make([]models.Runners, 0)
	err = db.NewSelect().Model(&alertflowRunners).Where("alertflow_runner = true").Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting alertflow runners from db", err)
		return
	}

	runners := append(projectRunners, alertflowRunners...)

	context.JSON(http.StatusOK, gin.H{"runners": runners})
}
