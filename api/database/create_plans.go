package database

import (
	"alertflow-backend/models"
	"context"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func createDefaultPlans(db *bun.DB) {
	ctx := context.Background()

	defaultPlans := []models.Plans{
		{
			ID:                 "hobby",
			Name:               "Hobby",
			Description:        "Hobby",
			IsDefault:          true,
			Price:              0,
			Period:             "month",
			Projects:           1,
			ProjectMembers:     0,
			OAuth:              false,
			Flows:              1,
			SelfHostedRunners:  1,
			AlertFlowRunners:   1,
			ExecutionsPerMonth: 10,
		},
		{
			ID:                 "pro",
			Name:               "Pro",
			Description:        "Pro",
			IsDefault:          false,
			Price:              5,
			Period:             "month",
			Projects:           2,
			ProjectMembers:     3,
			OAuth:              false,
			Flows:              3,
			SelfHostedRunners:  3,
			AlertFlowRunners:   3,
			ExecutionsPerMonth: 50,
		},
		{
			ID:                 "advanced",
			Name:               "Advanced",
			Description:        "Advanced",
			IsDefault:          false,
			Price:              15,
			Period:             "month",
			Projects:           5,
			ProjectMembers:     999,
			OAuth:              false,
			Flows:              15,
			SelfHostedRunners:  15,
			AlertFlowRunners:   15,
			ExecutionsPerMonth: 999,
		},
		{
			ID:                 "enterprise",
			Name:               "Enterprise",
			Description:        "Enterprise",
			IsDefault:          false,
			Price:              999,
			Period:             "month",
			Projects:           999,
			ProjectMembers:     999,
			OAuth:              true,
			Flows:              999,
			SelfHostedRunners:  999,
			AlertFlowRunners:   16,
			ExecutionsPerMonth: 999,
		},
	}

	var plans []models.Plans
	count, err := db.NewSelect().Model(&plans).ScanAndCount(ctx)
	if err != nil && count != 0 {
		panic(err)
	}

	if count == 0 {
		log.Info("No existing plans found. Creating default...")
		_, err := db.NewInsert().Ignore().Model(&defaultPlans).Exec(ctx)
		if err != nil {
			panic(err)
		}
	}
}
