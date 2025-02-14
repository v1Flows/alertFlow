package flows

import (
	"alertflow-backend/functions/gatekeeper"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/pkg/models"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func DeletePayload(context *gin.Context, db *bun.DB) {
	payloadID := context.Param("payloadID")

	// get payload data from db
	var payload models.Payloads
	err := db.NewSelect().Model(&payload).Where("id = ?", payloadID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting payload data from db", err)
		return
	}

	// get flow data
	var flow models.Flows
	err = db.NewSelect().Model(&flow).Where("id = ?", payload.FlowID).Scan(context)
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

	// check the requestors role in project
	canModify, err := gatekeeper.CheckRequestUserProjectModifyRole(flow.ProjectID, context, db)
	if err != nil {
		httperror.InternalServerError(context, "Error checking your user permissions on flow", err)
		return
	}
	if !canModify {
		httperror.Unauthorized(context, "You are not allowed to make modifications on this flow", errors.New("unauthorized"))
		return
	}

	_, err = db.NewDelete().Model((*models.Payloads)(nil)).Where("id = ?", payloadID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error deleting payload from db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"result": "success"})
}
