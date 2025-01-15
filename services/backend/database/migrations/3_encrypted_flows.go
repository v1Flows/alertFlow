package migrations

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addEncryptPayloadsToFlows(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeEncryptPayloadsFromFlows(ctx, db)
	})
}

func addEncryptPayloadsToFlows(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "flows", "encrypt_payloads")
	if err != nil {
		return fmt.Errorf("failed to check if encrypt_payloads column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("flows").
			ColumnExpr("encrypt_payloads BOOL DEFAULT true").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add encrypt_payloads column to flows table: %v", err)
		}
	} else {
		log.Debug("encrypt_payloads column already exists in flows table")
	}

	exists, err = columnExists(ctx, db, "flows", "encrypt_executions")
	if err != nil {
		return fmt.Errorf("failed to check if encrypt_executions column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("flows").
			ColumnExpr("encrypt_executions BOOL DEFAULT true").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add encrypt_executions column to flows table: %v", err)
		}
	} else {
		log.Debug("encrypt_executions column already exists in flows table")
	}

	return nil
}

func removeEncryptPayloadsFromFlows(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "flows", "encrypt_payloads")
	if err != nil {
		return fmt.Errorf("failed to check if encrypt_payloads column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("flows").
			Column("encrypt_payloads").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove encrypt_payloads column from flows table: %v", err)
		}
	} else {
		log.Debug("encrypt_payloads column already removed from flows table")
	}

	exists, err = columnExists(ctx, db, "flows", "encrypt_executions")
	if err != nil {
		return fmt.Errorf("failed to check if encrypt_executions column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("flows").
			Column("encrypt_executions").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove encrypt_executions column from flows table: %v", err)
		}
	} else {
		log.Debug("encrypt_executions column already removed from flows table")
	}

	return nil
}
