package payloads

import (
	"alertflow-backend/functions/gatekeeper"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"errors"
	"net/http"

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

	context.JSON(http.StatusOK, gin.H{"payload": payload})
}
