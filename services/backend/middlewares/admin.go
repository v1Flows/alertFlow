package middlewares

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/gatekeeper"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
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

		tokenType, err := auth.GetTypeFromToken(tokenString)
		if err != nil {
			httperror.InternalServerError(context, "Error receiving token type", err)
			return
		}

		if tokenType == "user" {
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
		} else if tokenType == "service" {
			tokenID, err := auth.GetIDFromToken(tokenString)
			if err != nil {
				httperror.InternalServerError(context, "Error receiving tokenID from token", err)
				return
			}

			// check for token in tokens table
			var token models.Tokens
			err = db.NewSelect().Model(&token).Where("id = ?", tokenID).Scan(context)
			if err != nil {
				httperror.Unauthorized(context, "Token is not valid", err)
				return
			}
			// check if token is disabled
			if token.Disabled {
				httperror.Unauthorized(context, "Token is currently disabled", errors.New("token is disabled"))
				return
			}

			context.Next()
		} else {
			httperror.Unauthorized(context, "Token is not valid", errors.New("token is not valid"))
			return
		}
	}
}
