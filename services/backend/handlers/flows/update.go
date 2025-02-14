package flows

import (
	"alertflow-backend/functions/gatekeeper"
	"alertflow-backend/functions/httperror"
	functions_project "alertflow-backend/functions/project"
	"alertflow-backend/pkg/models"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func UpdateFlow(context *gin.Context, db *bun.DB) {
	flowID := context.Param("flowID")

	var flow models.Flows
	if err := context.ShouldBindJSON(&flow); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
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

	flow.UpdatedAt = time.Now()
	_, err = db.NewUpdate().Model(&flow).Column("name", "description", "project_id", "runner_id", "encrypt_action_params", "encrypt_payloads", "encrypt_executions", "updated_at").Where("id = ?", flowID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating flow on db", err)
		return
	}

	// Audit
	err = functions_project.CreateAuditEntry(flow.ProjectID, "update", "Flow updated: "+flow.Name, db, context)
	if err != nil {
		log.Error(err)
	}

	context.JSON(http.StatusCreated, gin.H{"result": "success"})
}
