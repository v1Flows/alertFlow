package alerts

import (
	"net/http"

	"github.com/v1Flows/alertFlow/services/backend/functions/encryption"
	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func GetMultiple(context *gin.Context, db *bun.DB) {
	var alerts []models.Alerts
	err := db.NewSelect().Model(&alerts).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting alerts data from db", err)
		return
	}

	for i := range alerts {
		if alerts[i].Encrypted {
			alerts[i].Payload, err = encryption.DecryptPayload(alerts[i].Payload)
			if err != nil {
				httperror.InternalServerError(context, "Error decrypting payload", err)
				return
			}
		}
	}

	context.JSON(http.StatusOK, gin.H{"alerts": alerts})
}
