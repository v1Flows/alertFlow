package users

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func SetDefaultCard(context *gin.Context, db *bun.DB) {
	token := context.GetHeader("Authorization")
	userID, _ := auth.GetUserIDFromToken(token)

	var user models.Users
	if err := context.ShouldBindJSON(&user); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	_, err := db.NewUpdate().Model(&user).Set("default_card = ?", user.DefaultCard).Where("id = ?", userID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating user data", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"result": "success"})
}
