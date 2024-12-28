package docs

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
)

func GetDocs(context *gin.Context, db *bun.DB) {
	userID, err := auth.GetUserIDFromToken(context.GetHeader("Authorization"))
	if err != nil {
		httperror.InternalServerError(context, "Error receiving userID from token", err)
		return
	}

	// check if user is an admin
	user := models.Users{}
	err = db.NewSelect().Model(&user).Where("id = ?", userID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting user from db", err)
		return
	}

	show_hidden := false

	if user.Role == "admin" {
		show_hidden = true
	} else {
		show_hidden = false
	}

	docs := make([]models.Docs, 0)
	if show_hidden {
		count, err := db.NewSelect().Model(&docs).ScanAndCount(context)
		if err != nil {
			httperror.InternalServerError(context, "Error collecting docs from db", err)
			return
		}

		context.JSON(http.StatusOK, gin.H{"docs": docs, "count": count})
	} else {
		count, err := db.NewSelect().Model(&docs).Where("hidden = false").ScanAndCount(context)
		if err != nil {
			httperror.InternalServerError(context, "Error collecting docs from db", err)
			return
		}

		context.JSON(http.StatusOK, gin.H{"docs": docs, "count": count})
	}
}
