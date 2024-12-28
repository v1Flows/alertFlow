package middlewares

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/gatekeeper"
	"alertflow-backend/functions/httperror"
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func Mixed(db *bun.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		tokenString := context.GetHeader("Authorization")
		if tokenString == "" {
			httperror.Unauthorized(context, "Request does not contain an access token", errors.New("request does not contain an access token"))
			return
		}
		err := auth.ValidateToken(tokenString)
		if err != nil {
			httperror.Unauthorized(context, "The provided token is not valid", err)
			return
		}

		tokenType, err := auth.GetTypeFromToken(tokenString)
		if err != nil {
			httperror.InternalServerError(context, "Error checking for token type", err)
			return
		}

		if tokenType == "runner" {
			context.Next()
		} else if tokenType == "user" {
			userId, err := auth.GetUserIDFromToken(tokenString)
			if err != nil {
				httperror.InternalServerError(context, "Error receiving userID from token", err)
				return
			}
			userDisabled, err := gatekeeper.CheckAccountStatus(userId.String(), db)
			if err != nil {
				httperror.InternalServerError(context, "Error checking for users account status", err)
				return
			}
			if userDisabled {
				httperror.Unauthorized(context, "Your Account is currently disabled", errors.New("user is disabled"))
				return
			}
			context.Next()
		} else {
			httperror.Unauthorized(context, "Token type is invalid", errors.New("invalid token type"))
			return
		}
	}
}
