package tokens

import (
	"github.com/v1Flows/alertFlow/services/backend/functions/auth"
	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func RefreshToken(context *gin.Context, db *bun.DB) {
	token := context.GetHeader("Authorization")
	newToken, expiresAt, err := auth.RefreshToken(token)
	if err != nil {
		if err.Error() == "token is not close to expiration" {
			httperror.StatusBadRequest(context, "Token is not close to expiration", err)
			return
		}
		httperror.InternalServerError(context, "Error refreshing active token", err)
		return
	}

	userID, err := auth.GetUserIDFromToken(newToken)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting userID from token", err)
		return
	}

	var user models.Users
	err = db.NewSelect().Model(&user).Column("id", "username", "email", "disabled", "role").Where("id = ?", userID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting user informations from db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"result": "success", "token": newToken, "expires_at": expiresAt, "user": user})
}
