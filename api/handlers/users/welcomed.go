package users

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func WelcomedUser(context *gin.Context, db *bun.DB) {
	token := context.GetHeader("Authorization")
	userID, _ := auth.GetUserIDFromToken(token)

	var user models.Users
	_, err := db.NewUpdate().Model(&user).Set("welcomed = ?", true).Where("id = ?", userID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating user data", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"result": "success"})
}
