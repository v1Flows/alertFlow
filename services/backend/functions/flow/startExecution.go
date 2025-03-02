package functions

import (
	"context"

	"github.com/v1Flows/alertFlow/services/backend/pkg/models"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

func StartExecution(flowID string, alertID uuid.UUID, flow models.Flows, db *bun.DB) error {
	context := context.Background()
	var execution models.Executions

	if flow.RunnerID != "" {
		execution.RunnerID = flow.RunnerID
	}

	execution.ID = uuid.New()
	execution.FlowID = flowID
	execution.AlertID = alertID.String()
	execution.Status = "pending"
	_, err := db.NewInsert().Model(&execution).Column("id", "flow_id", "alert_id", "status", "executed_at").Exec(context)
	if err != nil {
		return err
	}

	// set execution id on alert
	var alert models.Alerts
	alert.ExecutionID = execution.ID.String()
	_, err = db.NewUpdate().Model(&alert).Column("execution_id").Where("id = ?", alertID).Exec(context)
	if err != nil {
		return err
	}

	return nil
}
