package migrations

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addEncryptedToFlowComponents(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeEncryptedFromFlowComponents(ctx, db)
	})
}

func addEncryptedToFlowComponents(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "payloads", "encrypted")
	if err != nil {
		return fmt.Errorf("failed to check if encrypted column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("payloads").
			ColumnExpr("encrypted BOOL DEFAULT false").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add encrypted column to payloads table: %v", err)
		}
	} else {
		log.Debug("encrypted column already exists in payloads table")
	}

	exists, err = columnExists(ctx, db, "execution_steps", "encrypted")
	if err != nil {
		return fmt.Errorf("failed to check if encrypted column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("execution_steps").
			ColumnExpr("encrypted BOOL DEFAULT false").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add encrypted column to execution_steps table: %v", err)
		}
	} else {
		log.Debug("encrypted column already exists in execution_steps table")
	}

	return nil
}

func removeEncryptedFromFlowComponents(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "payloads", "encrypted")
	if err != nil {
		return fmt.Errorf("failed to check if encrypted column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("payloads").
			Column("encrypted").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove encrypted column from payloads table: %v", err)
		}
	} else {
		log.Debug("encrypted column already removed from payloads table")
	}

	exists, err = columnExists(ctx, db, "execution_steps", "encrypted")
	if err != nil {
		return fmt.Errorf("failed to check if encrypted column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("execution_steps").
			Column("encrypted").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove encrypted column from execution_steps table: %v", err)
		}
	} else {
		log.Debug("encrypted column already removed from execution_steps table")
	}

	return nil
}
