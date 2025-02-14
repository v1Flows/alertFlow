package tokens

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/pkg/models"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type TokenRequest struct {
	Email      string `json:"email"`
	Password   string `json:"password"`
	RememberMe bool   `json:"remember_me"`
}

func GenerateToken(db *bun.DB, context *gin.Context) {
	var request TokenRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()
		return
	}

	// get user
	var user models.Users
	err := db.NewSelect().Model(&user).Where("email = ? OR username = ?", request.Email, request.Email).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting user information from db", err)
		return
	}

	// check if user account is disabled
	if user.Disabled {
		httperror.Unauthorized(context, "Your Account is currently disabled", errors.New("user account is disabled"))
		return
	}
	// check if password is correct
	credentialError := user.CheckPassword(request.Password)
	if credentialError != nil {
		httperror.Unauthorized(context, "Invalid credentials", errors.New("invalid credentials"))
		return
	}

	// generate token
	tokenString, ExpiresAt, err := auth.GenerateJWT(user.ID, request.RememberMe)
	if err != nil {
		httperror.InternalServerError(context, "Error generating user token", err)
		return
	}

	type UserResponse struct {
		ID             uuid.UUID `json:"id"`
		Email          string    `json:"email"`
		Username       string    `json:"username"`
		Disabled       bool      `json:"disabled"`
		DisabledReason string    `json:"disabled_reason"`
		Role           string    `json:"role"`
	}
	userResponse := UserResponse{
		ID:             user.ID,
		Email:          user.Email,
		Username:       user.Username,
		Disabled:       user.Disabled,
		DisabledReason: user.DisabledReason,
		Role:           user.Role,
	}

	context.JSON(http.StatusOK, gin.H{"token": tokenString, "user": userResponse, "expires_at": ExpiresAt})
}
