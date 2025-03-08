package migrations

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addNoteToAlerts(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeNoteFromAlerts(ctx, db)
	})
}

func addNoteToAlerts(ctx context.Context, db *bun.DB) error {
	// add note column
	exists, err := columnExists(ctx, db, "alerts", "note")
	if err != nil {
		return fmt.Errorf("failed to check if note column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("alerts").
			ColumnExpr("note text DEFAULT ''").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add note column to alerts table: %v", err)
		}
	} else {
		log.Debug("note column already exists in alerts table")
	}

	return nil
}

func removeNoteFromAlerts(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "alerts", "note")
	if err != nil {
		return fmt.Errorf("failed to check if note column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("alerts").
			Column("note").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove note column from alerts table: %v", err)
		}
	} else {
		log.Debug("note column already removed from alerts table")
	}

	return nil
}
