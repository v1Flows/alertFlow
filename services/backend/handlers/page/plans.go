package page

import (
	"alertflow-backend/functions/httperror"
	functions "alertflow-backend/functions/plans"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func GetPlans(context *gin.Context, db *bun.DB) {
	plans, err := functions.GetPlans(db)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting plans data", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"plans": plans})
}
