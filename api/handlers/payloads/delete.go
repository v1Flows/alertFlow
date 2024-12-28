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

func Delete(context *gin.Context, db *bun.DB) {
	payloadID := context.Param("payloadID")

	// get flow_id from payload
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

	// check the requestors role in project
	canModify, err := gatekeeper.CheckRequestUserProjectModifyRole(flow.ProjectID, context, db)
	if err != nil {
		httperror.InternalServerError(context, "Error checking your user permissions on project", err)
		return
	}
	if !canModify {
		httperror.Unauthorized(context, "You are not allowed to delete this payload", errors.New("unauthorized"))
		return
	}

	_, err = db.NewDelete().Model((*models.Payloads)(nil)).Where("id = ?", payloadID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error deleting payload on db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"result": "success"})
}
