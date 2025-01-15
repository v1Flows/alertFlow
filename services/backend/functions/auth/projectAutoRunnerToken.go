package auth

import (
	"alertflow-backend/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func GenerateProjectAutoRunnerJWT(projectID string, id uuid.UUID) (tokenString string, err error) {
	expirationTime := time.Now().Add(50 * 365 * 24 * time.Hour) // 10 years
	claims := &models.JWTProjectClaim{
		ProjectID: projectID,
		ID:        id,
		Type:      "project_auto_runner",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString(jwtKey)
	return
}
