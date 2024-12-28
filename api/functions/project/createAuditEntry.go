package functions_project

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func CreateAuditEntry(projectID string, operation string, details string, db *bun.DB, context *gin.Context) error {
	userID, err := auth.GetUserIDFromToken(context.GetHeader("Authorization"))
	if err != nil {
		return err
	}

	audit := new(models.Audit)
	audit.ProjectID = projectID
	audit.UserID = userID.String()
	audit.Operation = operation
	audit.Details = details
	_, err = db.NewInsert().Model(audit).Exec(context)
	if err != nil {
		return err
	}
	return nil
}
