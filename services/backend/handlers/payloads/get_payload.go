package payloads

import (
	"errors"
	"net/http"

	"github.com/v1Flows/alertFlow/services/backend/functions/encryption"
	"github.com/v1Flows/alertFlow/services/backend/functions/gatekeeper"
	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func GetSingle(context *gin.Context, db *bun.DB) {
	payloadID := context.Param("payloadID")

	var payload models.Payloads
	err := db.NewSelect().Model(&payload).Where("id = ?", payloadID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting payload data from db", err)
		return
	}

	// get project_id from flow_id
	var flow models.Flows
	err = db.NewSelect().Model(&flow).Where("id = ?", payload.FlowID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting flow data from db", err)
		return
	}

	access, err := gatekeeper.CheckUserProjectAccess(flow.ProjectID, context, db)
	if err != nil {
		httperror.InternalServerError(context, "Error checking your user permissions on project", err)
		return
	}
	if !access {
		httperror.Unauthorized(context, "You are not allowed to view this payload", errors.New("unauthorized"))
		return
	}

	if payload.Encrypted {
		payload.Payload, err = encryption.DecryptPayload(payload.Payload)
		if err != nil {
			httperror.InternalServerError(context, "Error decrypting payload", err)
			return
		}
	}

	context.JSON(http.StatusOK, gin.H{"payload": payload})
}
