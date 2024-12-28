package admins

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func ChangeTokenStatus(context *gin.Context, db *bun.DB) {
	tokenID := context.Param("tokenID")

	var tokens models.Tokens
	if err := context.ShouldBindJSON(&tokens); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	_, err := db.NewUpdate().Model(&tokens).Column("disabled", "disabled_reason").Where("id = ?", tokenID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating token informations on db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"result": "success"})
}
