package auth

import (
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func GenerateServiceJWT(days int, id uuid.UUID) (tokenString string, expirationTime time.Time, err error) {
	// Set expiration time by adding days to current time
	expirationTime = time.Now().AddDate(0, 0, days)
	claims := &models.JWTClaim{
		ID:   id,
		Type: "service",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString(jwtKey)
	return
}
