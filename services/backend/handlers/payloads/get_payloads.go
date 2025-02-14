package payloads

import (
	"alertflow-backend/functions/encryption"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/pkg/models"
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

	for i := range payloads {
		if payloads[i].Encrypted {
			payloads[i].Payload, err = encryption.DecryptPayload(payloads[i].Payload)
			if err != nil {
				httperror.InternalServerError(context, "Error decrypting payload", err)
				return
			}
		}
	}

	context.JSON(http.StatusOK, gin.H{"payloads": payloads})
}
