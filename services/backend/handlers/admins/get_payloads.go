package admins

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/pkg/models"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func GetPayloads(context *gin.Context, db *bun.DB) {
	payloads := make([]models.Payloads, 0)
	err := db.NewSelect().Model(&payloads).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting payloads data on db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"payloads": payloads})
}
