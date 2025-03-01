package admins

import (
	"net/http"

	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func GetAlerts(context *gin.Context, db *bun.DB) {
	alerts := make([]models.Alerts, 0)
	err := db.NewSelect().Model(&alerts).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting alerts data on db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"alerts": alerts})
}
