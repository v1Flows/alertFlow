package functions

import (
	"alertflow-backend/models"
	"context"

	"github.com/uptrace/bun"
)

func GetPlanLimits(planID string, db *bun.DB) (models.PlanLimits, error) {
	ctx := context.Background()
	var planLimits models.PlanLimits
	err := db.NewSelect().Model(&planLimits).Where("id = ?", planID).Scan(ctx)
	if err != nil {
		return planLimits, err
	}
	return planLimits, nil
}
