package executions

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

func CreateStep(context *gin.Context, db *bun.DB) {
	var step models.ExecutionSteps
	if err := context.ShouldBindJSON(&step); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	step.ID = uuid.New()
	_, err := db.NewInsert().Model(&step).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error creating execution step on db", err)
		return
	}

	context.JSON(http.StatusCreated, gin.H{"result": "success", "id": step.ID})
}
