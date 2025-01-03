package models

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type JWTClaim struct {
	ID   uuid.UUID `json:"id"`
	Type string    `json:"type"`
	jwt.RegisteredClaims
}

type JWTProjectClaim struct {
	RunnerID  string    `json:"runner_id"`
	ProjectID string    `json:"project_id"`
	ID        uuid.UUID `json:"id"`
	Type      string    `json:"type"`
	jwt.RegisteredClaims
}
