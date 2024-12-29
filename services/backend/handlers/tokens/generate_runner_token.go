package tokens

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/gatekeeper"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

func GenerateRunnerToken(context *gin.Context, db *bun.DB) {
	id := context.Param("id")

	var key models.Tokens
	if err := context.ShouldBindJSON(&key); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	key.ID = uuid.New()
	key.CreatedAt = time.Now()
	key.ProjectID = id
	key.Type = "runner"

	// check the requestors role in project
	canModify, err := gatekeeper.CheckRequestUserProjectModifyRole(id, context, db)
	if err != nil {
		httperror.InternalServerError(context, "Error checking your user permissions on project", err)
		return
	}
	if !canModify {
		httperror.Unauthorized(context, "You are not allowed to make modifications on this project", errors.New("unauthorized"))
		return
	}

	key.Key, err = auth.GenerateRunnerJWT(id, key.ID)
	if err != nil {
		httperror.InternalServerError(context, "Error generating runner token", err)
		return
	}

	_, err = db.NewInsert().Model(&key).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error creating runner token on db", err)
		return
	}

	context.JSON(http.StatusCreated, gin.H{"result": "success", "key": key.Key})
}
