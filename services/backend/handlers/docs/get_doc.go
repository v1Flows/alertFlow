package docs

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func GetDoc(context *gin.Context, db *bun.DB) {
	docID := context.Param("docID")

	userID, err := auth.GetUserIDFromToken(context.GetHeader("Authorization"))
	if err != nil {
		httperror.InternalServerError(context, "Error receiving userID from token", err)
		return
	}

	user := models.Users{}
	err = db.NewSelect().Model(&user).Where("id = ?", userID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting user from db", err)
		return
	}

	var doc models.Docs
	err = db.NewSelect().Model(&doc).Where("id = ?", docID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting doc data from db", err)
		return
	}

	// check if doc is hidden
	if doc.Hidden && user.Role != "admin" {
		httperror.Unauthorized(context, "This doc is hidden", errors.New("this doc is hidden"))
		return
	}

	context.JSON(http.StatusOK, gin.H{"doc": doc})
}
