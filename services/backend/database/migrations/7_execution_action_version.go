package migrations

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addActionVersionToExecutionSteps(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeActionVersionToExecutionSteps(ctx, db)
	})
}

func addActionVersionToExecutionSteps(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "execution_steps", "action_version")
	if err != nil {
		return fmt.Errorf("failed to check if action_version column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("execution_steps").
			ColumnExpr("action_version text DEFAULT ''").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add action_version column to execution_steps table: %v", err)
		}
	} else {
		log.Debug("action_version column already exists in execution_steps table")
	}

	return nil
}

func removeActionVersionToExecutionSteps(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "execution_steps", "action_version")
	if err != nil {
		return fmt.Errorf("failed to check if action_version column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("execution_steps").
			Column("action_version").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove action_version column from execution_steps table: %v", err)
		}
	} else {
		log.Debug("action_version column already removed from execution_steps table")
	}

	return nil
}
