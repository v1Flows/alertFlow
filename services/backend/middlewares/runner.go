package middlewares

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func Runner(db *bun.DB) gin.HandlerFunc {
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

		context.Next()
	}
}
