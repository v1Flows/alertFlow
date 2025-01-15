package migrations

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addRegisteredAtToRunners(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeRegisteredAtFromRunners(ctx, db)
	})
}

func addRegisteredAtToRunners(ctx context.Context, db *bun.DB) error {
	// add ghost column
	exists, err := columnExists(ctx, db, "runners", "registered_at")
	if err != nil {
		return fmt.Errorf("failed to check if registered_at column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("runners").
			ColumnExpr("registered_at TIMESTAMPTZ DEFAULT now()").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add registered_at column to runners table: %v", err)
		}
	} else {
		log.Debug("registered_at column already exists in runners table")
	}

	return nil
}

func removeRegisteredAtFromRunners(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "runners", "registered_at")
	if err != nil {
		return fmt.Errorf("failed to check if registered_at column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("runners").
			Column("registered_at").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove registered_at column from runners table: %v", err)
		}
	} else {
		log.Debug("registered_at column already removed from runners table")
	}

	return nil
}
