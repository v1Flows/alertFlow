package executions

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func UpdateStep(context *gin.Context, db *bun.DB) {
	stepID := context.Param("stepID")

	var step models.ExecutionSteps
	if err := context.ShouldBindJSON(&step); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	// get current action messages
	var dbStep models.ExecutionSteps
	err := db.NewSelect().Model(&dbStep).Where("id = ?", stepID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting current step messages from db", err)
		return
	}

	// append new message to existing
	step.ActionMessages = append(dbStep.ActionMessages, step.ActionMessages...)

	if step.Icon == "" {
		step.Icon = dbStep.Icon
	}

	if step.StartedAt.IsZero() {
		step.StartedAt = dbStep.StartedAt
	}

	if step.RunnerID == "" {
		step.RunnerID = dbStep.RunnerID
	}

	_, err = db.NewUpdate().Model(&step).Column(
		"action_messages",
		"runner_id",
		"interactive",
		"interacted",
		"interaction_approved",
		"interaction_rejected",
		"interacted_by",
		"interacted_at",
		"pending",
		"running",
		"paused",
		"canceled",
		"canceled_by",
		"canceled_at",
		"no_pattern_match",
		"no_result",
		"error",
		"finished",
		"started_at",
		"finished_at",
	).Where("id = ?", stepID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating step on db", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"result": "success"})
}
