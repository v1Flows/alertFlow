package docs

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func DeleteDoc(context *gin.Context, db *bun.DB) {
	docID := context.Param("docID")

	var doc models.Docs
	_, err := db.NewDelete().Model(&doc).Where("id = ?", docID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting doc data from db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"result": "success"})
}
