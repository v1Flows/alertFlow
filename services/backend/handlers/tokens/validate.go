package tokens

import (
	"github.com/v1Flows/alertFlow/services/backend/functions/auth"
	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ValidateToken(context *gin.Context) {
	token := context.GetHeader("Authorization")
	err := auth.ValidateToken(token)
	if err != nil {
		httperror.Unauthorized(context, "Token is invalid", err)
		return
	}
	context.JSON(http.StatusOK, gin.H{"result": "success"})
}
