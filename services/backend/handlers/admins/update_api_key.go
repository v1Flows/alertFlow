package admins

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func UpdateProjectAPIKey(context *gin.Context, db *bun.DB) {
	tokenID := context.Param("tokenID")

	var token models.Tokens
	if err := context.ShouldBindJSON(&token); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	_, err := db.NewUpdate().Model(&token).Column("disabled", "disabled_reason").Where("id = ?", tokenID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating token informations on db", err)
	}

	context.JSON(http.StatusCreated, gin.H{"result": "success"})
}
