package executions

import (
	"github.com/v1Flows/alertFlow/services/backend/functions/encryption"
	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"
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

	for i := range steps {
		if steps[i].Encrypted {
			steps[i].Messages, err = encryption.DecryptExecutionStepActionMessage(steps[i].Messages)
			if err != nil {
				httperror.InternalServerError(context, "Error decrypting execution step action messages", err)
				return
			}
		}
	}

	context.JSON(http.StatusOK, gin.H{"steps": steps})
}
