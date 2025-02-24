package migrations

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addDetailsToAlerts(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeDetailsFromAlerts(ctx, db)
	})
}

func addDetailsToAlerts(ctx context.Context, db *bun.DB) error {
	// add ghost column
	exists, err := columnExists(ctx, db, "alerts", "details")
	if err != nil {
		return fmt.Errorf("failed to check if ghost column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("alerts").
			ColumnExpr("details jsonb DEFAULT jsonb('[]')").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add details column to alerts table: %v", err)
		}
	} else {
		log.Debug("details column already exists in alerts table")
	}

	return nil
}

func removeDetailsFromAlerts(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "alerts", "details")
	if err != nil {
		return fmt.Errorf("failed to check if ghost column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("alerts").
			Column("details").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove details column from alerts table: %v", err)
		}
	} else {
		log.Debug("details column already removed from alerts table")
	}

	return nil
}
