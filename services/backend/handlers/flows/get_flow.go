package flows

import (
	"alertflow-backend/config"
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

func GetFlow(context *gin.Context, db *bun.DB) {
	flowID := context.Param("flowID")

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

	// decrypt action params
	if config.Config.Encryption.Enabled && flow.EncryptActionParams && len(flow.Actions) > 0 {
		flow.Actions, err = encryption.DecryptParams(flow.Actions)
		if err != nil {
			httperror.InternalServerError(context, "Error decrypting action params", err)
			return
		}
	}

	context.JSON(http.StatusOK, gin.H{"flow": flow})
}
