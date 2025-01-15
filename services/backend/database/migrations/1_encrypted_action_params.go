package migrations

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addEncryptActionParamsToFlows(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeEncryptActionParamsFromFlows(ctx, db)
	})
}

func addEncryptActionParamsToFlows(ctx context.Context, db *bun.DB) error {
	// add ghost column
	exists, err := columnExists(ctx, db, "flows", "encrypt_action_params")
	if err != nil {
		return fmt.Errorf("failed to check if encrypt_action_params column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("flows").
			ColumnExpr("encrypt_action_params BOOL DEFAULT true").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add encrypt_action_params column to flows table: %v", err)
		}
	} else {
		log.Debug("encrypt_action_params column already exists in flows table")
	}

	return nil
}

func removeEncryptActionParamsFromFlows(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "flows", "encrypt_action_params")
	if err != nil {
		return fmt.Errorf("failed to check if encrypt_action_params column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("flows").
			Column("encrypt_action_params").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove encrypt_action_params column from flows table: %v", err)
		}
	} else {
		log.Debug("encrypt_action_params column already removed from flows table")
	}

	return nil
}
