package migrations

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addAlertFlowRunnerSettingsToSettings(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeAlertFlowRunnerSettingsFromSettings(ctx, db)
	})
}

func addAlertFlowRunnerSettingsToSettings(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "settings", "allow_alertflow_runner_auto_join")
	if err != nil {
		return fmt.Errorf("failed to check if allow_alertflow_runner_auto_join column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("settings").
			ColumnExpr("allow_alertflow_runner_auto_join BOOL DEFAULT true").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add allow_alertflow_runner_auto_join column to settings table: %v", err)
		}
	} else {
		log.Debug("allow_alertflow_runner_auto_join column already exists in settings table")
	}

	exists, err = columnExists(ctx, db, "settings", "allow_alertflow_runner_join")
	if err != nil {
		return fmt.Errorf("failed to check if allow_alertflow_runner_join column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("settings").
			ColumnExpr("allow_alertflow_runner_join BOOL DEFAULT true").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add allow_alertflow_runner_join column to settings table: %v", err)
		}
	} else {
		log.Debug("allow_alertflow_runner_join column already exists in settings table")
	}

	exists, err = columnExists(ctx, db, "settings", "alertflow_runner_auto_join_token")
	if err != nil {
		return fmt.Errorf("failed to check if alertflow_runner_auto_join_token column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("settings").
			ColumnExpr("alertflow_runner_auto_join_token TEXT DEFAULT ''").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add alertflow_runner_auto_join_token column to settings table: %v", err)
		}
	} else {
		log.Debug("alertflow_runner_auto_join_token column already exists in settings table")
	}

	return nil
}

func removeAlertFlowRunnerSettingsFromSettings(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "settings", "allow_alertflow_runner_auto_join")
	if err != nil {
		return fmt.Errorf("failed to check if allow_alertflow_runner_auto_join column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("settings").
			Column("allow_alertflow_runner_auto_join").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove allow_alertflow_runner_auto_join column from settings table: %v", err)
		}
	} else {
		log.Debug("allow_alertflow_runner_auto_join column already removed from settings table")
	}

	exists, err = columnExists(ctx, db, "settings", "allow_alertflow_runner_join")
	if err != nil {
		return fmt.Errorf("failed to check if allow_alertflow_runner_join column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("settings").
			Column("allow_alertflow_runner_join").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove allow_alertflow_runner_join column from settings table: %v", err)
		}
	} else {
		log.Debug("allow_alertflow_runner_join column already removed from settings table")
	}

	exists, err = columnExists(ctx, db, "settings", "alertflow_runner_auto_join_token")
	if err != nil {
		return fmt.Errorf("failed to check if alertflow_runner_auto_join_token column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("settings").
			Column("alertflow_runner_auto_join_token").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove alertflow_runner_auto_join_token column from settings table: %v", err)
		}
	} else {
		log.Debug("alertflow_runner_auto_join_token column already removed from settings table")
	}

	return nil
}
