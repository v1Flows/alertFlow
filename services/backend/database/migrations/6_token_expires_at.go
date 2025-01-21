package migrations

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addExpiresAtToTokens(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeExpiresAtFromTokens(ctx, db)
	})
}

func addExpiresAtToTokens(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "tokens", "expires_at")
	if err != nil {
		return fmt.Errorf("failed to check if expires_at column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("tokens").
			ColumnExpr("expires_at TIMESTAMPTZ").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add expires_at column to tokens table: %v", err)
		}
	} else {
		log.Debug("expires_at column already exists in tokens table")
	}

	// remove expired column
	exists, err = columnExists(ctx, db, "tokens", "expired")
	if err != nil {
		return fmt.Errorf("failed to check if expired column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("tokens").
			Column("expired").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove expired column from tokens table: %v", err)
		}
	} else {
		log.Debug("expired column already removed from tokens table")
	}

	return nil
}

func removeExpiresAtFromTokens(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "tokens", "expires_at")
	if err != nil {
		return fmt.Errorf("failed to check if expires_at column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("tokens").
			Column("expires_at").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove expires_at column from tokens table: %v", err)
		}
	} else {
		log.Debug("expires_at column already removed from tokens table")
	}

	// add expired column
	exists, err = columnExists(ctx, db, "tokens", "expired")
	if err != nil {
		return fmt.Errorf("failed to check if expired column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("tokens").
			ColumnExpr("expired BOOLEAN DEFAULT false").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add expired column to tokens table: %v", err)
		}
	} else {
		log.Debug("expired column already exists in tokens table")
	}

	return nil
}
