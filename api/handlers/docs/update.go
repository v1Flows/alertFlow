package docs

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func UpdateDoc(context *gin.Context, db *bun.DB) {
	docID := context.Param("docID")

	var doc models.Docs
	if err := context.ShouldBindJSON(&doc); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	_, err := db.NewUpdate().Model(&doc).Column("category", "title", "content", "hidden").Where("id = ?", docID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating doc on db", err)
		return
	}

	context.JSON(http.StatusCreated, gin.H{"result": "success"})
}
