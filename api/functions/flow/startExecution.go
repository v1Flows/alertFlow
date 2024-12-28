package functions

import (
	"alertflow-backend/models"
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

func StartExecution(flowID string, payloadID uuid.UUID, flow models.Flows, db *bun.DB) error {
	context := context.Background()
	var execution models.Executions

	if flow.RunnerID != "" {
		execution.RunnerID = flow.RunnerID
	}

	execution.FlowID = flowID
	execution.PayloadID = payloadID.String()
	execution.Pending = true
	execution.ExecutedAt = time.Now()
	_, err := db.NewInsert().Model(&execution).Column("flow_id", "payload_id", "pending", "executed_at").Exec(context)
	if err != nil {
		return err
	}

	return nil
}
