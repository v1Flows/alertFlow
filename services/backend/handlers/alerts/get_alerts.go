package alerts

import (
	"net/http"

	"github.com/v1Flows/alertFlow/services/backend/functions/auth"
	"github.com/v1Flows/alertFlow/services/backend/functions/encryption"
	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func GetMultiple(context *gin.Context, db *bun.DB) {
	userID, err := auth.GetUserIDFromToken(context.GetHeader("Authorization"))
	if err != nil {
		httperror.InternalServerError(context, "Error receiving userID from token", err)
		return
	}

	// get all flows where the user is a member
	flows := make([]models.Flows, 0)
	err = db.NewSelect().Model(&flows).Where("project_id::uuid IN (SELECT project_id::uuid FROM project_members WHERE user_id = ? AND invite_pending = false)", userID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting flows from db", err)
		return
	}

	var alerts []models.Alerts

	// get all alerts for each flow
	for i := range flows {
		flowAlerts := make([]models.Alerts, 0)
		err = db.NewSelect().Model(&flowAlerts).Where("flow_id = ?", flows[i].ID).Scan(context)
		if err != nil {
			httperror.InternalServerError(context, "Error collecting alerts from db", err)
			return
		}
		alerts = append(alerts, flowAlerts...)
	}

	for i := range alerts {
		if alerts[i].Encrypted {
			alerts[i].Payload, err = encryption.DecryptPayload(alerts[i].Payload)
			if err != nil {
				httperror.InternalServerError(context, "Error decrypting alert", err)
				return
			}
		}
	}

	context.JSON(http.StatusOK, gin.H{"alerts": alerts})
}
