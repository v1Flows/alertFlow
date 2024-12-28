package admins

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func UpdatePlan(context *gin.Context, db *bun.DB) {
	planID := context.Param("planID")

	var plan models.Plans
	if err := context.ShouldBindJSON(&plan); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	_, err := db.NewUpdate().Model(&plan).Column("name", "description", "price", "projects", "project_members", "flows", "self_hosted_runners", "alertflow_runners", "executions_per_month", "stripe_id").Where("id = ?", planID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating plan on db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"result": "success"})
}
