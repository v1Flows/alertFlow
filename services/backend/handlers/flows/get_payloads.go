package flows

import (
	"alertflow-backend/functions/encryption"
	"alertflow-backend/functions/gatekeeper"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func GetFlowPayloads(context *gin.Context, db *bun.DB) {
	flowID := context.Param("flowID")

	// get flow
	var flow models.Flows
	err := db.NewSelect().Model(&flow).Where("id = ?", flowID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting flow data from db", err)
		return
	}

	// check if user has access to project
	access, err := gatekeeper.CheckUserProjectAccess(flow.ProjectID, context, db)
	if err != nil {
		httperror.InternalServerError(context, "Error checking for flow access", err)
		return
	}
	if !access {
		httperror.Unauthorized(context, "You do not have access to this flow", errors.New("you do not have access to this flow"))
		return
	}

	payloads := make([]models.Payloads, 0)
	err = db.NewSelect().Model(&payloads).Where("flow_id = ?", flowID).Order("created_at DESC").Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting flow payloads from db", err)
		return
	}

	for i := range payloads {
		if payloads[i].Encrypted {
			payloads[i].Payload, err = encryption.DecryptPayload(payloads[i].Payload)
			if err != nil {
				httperror.InternalServerError(context, "Error decrypting payload", err)
				return
			}
		}
	}

	context.JSON(http.StatusOK, gin.H{"payloads": payloads})
}
