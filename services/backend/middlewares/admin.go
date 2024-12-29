package middlewares

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/gatekeeper"
	"alertflow-backend/functions/httperror"
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func Admin(db *bun.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		tokenString := context.GetHeader("Authorization")
		if tokenString == "" {
			httperror.Unauthorized(context, "Request does not contain an access token", errors.New("request does not contain an access token"))
			return
		}
		err := auth.ValidateToken(tokenString)
		if err != nil {
			httperror.Unauthorized(context, "Token is not valid", err)
			return
		}

		// check if user is admin on db | second layer check
		userID, err := auth.GetUserIDFromToken(tokenString)
		if err != nil {
			httperror.InternalServerError(context, "Error receiving userID from token", err)
			return
		}
		isAdmin, err := gatekeeper.CheckAdmin(userID, db)
		if err != nil {
			httperror.InternalServerError(context, "Error checking for user role", err)
			return
		}
		if !isAdmin {
			httperror.Unauthorized(context, "You are not an admin", errors.New("user is not admin"))
			return
		}
		context.Next()
	}
}
