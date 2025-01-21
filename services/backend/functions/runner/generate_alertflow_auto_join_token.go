package functions_runner

import (
	"alertflow-backend/functions/auth"
	"alertflow-backend/models"
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

func GenerateAlertFlowAutoJoinToken(db *bun.DB) (token string, err error) {
	var key models.Tokens

	key.ID = uuid.New()
	key.CreatedAt = time.Now()
	key.ProjectID = "admin"
	key.Type = "alertflow_auto_runner"
	key.Description = "Token for AlertFlow Shared Auto Runner Join"

	key.Key, key.ExpiresAt, err = auth.GenerateAlertFlowAutoRunnerJWT(key.ID)
	if err != nil {
		return "", err
	}

	_, err = db.NewInsert().Model(&key).Exec(context.Background())
	if err != nil {
		return "", err
	}

	return key.Key, nil
}
