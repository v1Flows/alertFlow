package payloads

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func GetMultiple(context *gin.Context, db *bun.DB) {
	var payloads []models.Payloads
	err := db.NewSelect().Model(&payloads).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting payloads data from db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"payloads": payloads})
}
