package executions

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func GetSteps(context *gin.Context, db *bun.DB) {
	executionID := context.Param("executionID")

	steps := make([]models.ExecutionSteps, 0)
	err := db.NewSelect().Model(&steps).Where("execution_id = ?", executionID).Order("created_at ASC").Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting execution steps from db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"steps": steps})
}
