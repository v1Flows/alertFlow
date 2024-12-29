package flows

import (
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func UpdateFlowAction(context *gin.Context, db *bun.DB) {
	// flowID := context.Param("flowID")
	// actionID := context.Param("actionID")

	// var action models.FlowActions
	// if err := context.ShouldBindJSON(&action); err != nil {
	// 	httperror.StatusBadRequest(context, "Error parsing incoming data", err)
	// 	return
	// }

	// // get flow
	// var flow models.Flows
	// err := db.NewSelect().Model(&flow).Where("id = ?", flowID).Scan(context)
	// if err != nil {
	// 	httperror.InternalServerError(context, "Error collecting flow data from db", err)
	// 	return
	// }

	// // check if user has access to project
	// access, err := gatekeeper.CheckUserProjectAccess(flow.ProjectID, context, db)
	// if err != nil {
	// 	httperror.InternalServerError(context, "Error checking for flow access", err)
	// 	return
	// }
	// if !access {
	// 	httperror.Unauthorized(context, "You do not have access to this flow", errors.New("you do not have access to this flow"))
	// 	return
	// }

	// // check the requestors role in project
	// canModify, err := gatekeeper.CheckRequestUserProjectModifyRole(flow.ProjectID, context, db)
	// if err != nil {
	// 	httperror.InternalServerError(context, "Error checking your user permissions on flow", err)
	// 	return
	// }
	// if !canModify {
	// 	httperror.Unauthorized(context, "You are not allowed to make modifications on this flow", errors.New("unauthorized"))
	// 	return
	// }

	// _, err = db.NewUpdate().Model(&action).Where("id = ?", actionID).Exec(context)
	// if err != nil {
	// 	httperror.InternalServerError(context, "Error updating action on db", err)
	// 	return
	// }

	// // Audit
	// err = functions_project.CreateAuditEntry(flow.ProjectID, "update", "Flow action updated: "+action.Name, db, context)
	// if err != nil {
	// 	log.Error(err)
	// }

	// context.JSON(http.StatusCreated, gin.H{"result": "success"})
}
