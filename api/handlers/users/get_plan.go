package users

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func GetUserPlan(context *gin.Context, db *bun.DB) {
	userID, err := auth.GetUserIDFromToken(context.GetHeader("Authorization"))
	if err != nil {
		httperror.Unauthorized(context, "Error receiving userID from token", err)
		return
	}

	var user models.Users
	err = db.NewSelect().Model(&user).Column("id", "plan").Where("id = ?", userID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting user plan details from db", err)
		return
	}

	var plan models.Plans
	err = db.NewSelect().Model(&plan).Where("id = ?", user.Plan).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting plan details from db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"plan": plan})
}
