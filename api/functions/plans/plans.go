package functions

import (
	"alertflow-backend/models"
	"context"

	"github.com/uptrace/bun"
)

func GetPlans(db *bun.DB) ([]models.Plans, error) {
	ctx := context.Background()
	plans := make([]models.Plans, 0)
	err := db.NewSelect().Model(&plans).Order("price ASC").Scan(ctx)
	if err != nil {
		return nil, err
	}
	return plans, nil
}
