package migrations

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addNewColumnsToFlows(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeNewColumnsFromFlows(ctx, db)
	})

	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		return addNewColumnsToAlerts(ctx, db)
	}, func(ctx context.Context, db *bun.DB) error {
		return removeNewColumnsFromAlerts(ctx, db)
	})
}

func addNewColumnsToFlows(ctx context.Context, db *bun.DB) error {
	// add group_alerts column
	exists, err := columnExists(ctx, db, "flows", "group_alerts")
	if err != nil {
		return fmt.Errorf("failed to check if group_alerts column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("flows").
			ColumnExpr("group_alerts BOOL DEFAULT true").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add group_alerts column to flows table: %v", err)
		}
	} else {
		log.Debug("group_alerts column already exists in flows table")
	}

	// add group_alerts_identifier column
	exists, err = columnExists(ctx, db, "flows", "group_alerts_identifier")
	if err != nil {
		return fmt.Errorf("failed to check if group_alerts_identifier column exists: %v", err)
	}
	if !exists {
		_, err = db.NewAddColumn().
			Table("flows").
			ColumnExpr("group_alerts_identifier TEXT DEFAULT ''").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add group_alerts_identifier column to flows table: %v", err)
		}
		log.Info("Added group_alerts_identifier column to flows table")
	} else {
		log.Debug("group_alerts_identifier column already exists in flows table")
	}

	// add alert_threshold column
	exists, err = columnExists(ctx, db, "flows", "alert_threshold")
	if err != nil {
		return fmt.Errorf("failed to check if alert_threshold column exists: %v", err)
	}
	if !exists {
		_, err = db.NewAddColumn().
			Table("flows").
			ColumnExpr("alert_threshold INT DEFAULT 0").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add alert_threshold column to flows table: %v", err)
		}
		log.Info("Added alert_threshold column to flows table")
	} else {
		log.Debug("alert_threshold column already exists in flows table")
	}

	return nil
}

func addNewColumnsToAlerts(ctx context.Context, db *bun.DB) error {
	// add updated_at column
	exists, err := columnExists(ctx, db, "alerts", "updated_at")
	if err != nil {
		return fmt.Errorf("failed to check if updated_at column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("alerts").
			ColumnExpr("updated_at timestamptz").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add updated_at column to alerts table: %v", err)
		}
	} else {
		log.Debug("updated_at column already exists in alerts table")
	}

	// add resolved_at column
	exists, err = columnExists(ctx, db, "alerts", "resolved_at")
	if err != nil {
		return fmt.Errorf("failed to check if resolved_at column exists: %v", err)
	}
	if !exists {
		_, err := db.NewAddColumn().
			Table("alerts").
			ColumnExpr("resolved_at timestamptz").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add resolved_at column to alerts table: %v", err)
		}
	} else {
		log.Debug("resolved_at column already exists in alerts table")
	}

	// add group_key column
	exists, err = columnExists(ctx, db, "alerts", "group_key")
	if err != nil {
		return fmt.Errorf("failed to check if group_key column exists: %v", err)
	}
	if !exists {
		_, err = db.NewAddColumn().
			Table("alerts").
			ColumnExpr("group_key text DEFAULT ''").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add group_key column to alerts table: %v", err)
		}
		log.Info("Added group_key column to alerts table")
	} else {
		log.Debug("group_key column already exists in alerts table")
	}

	// add sub_alerts column
	exists, err = columnExists(ctx, db, "alerts", "sub_alerts")
	if err != nil {
		return fmt.Errorf("failed to check if sub_alerts column exists: %v", err)
	}
	if !exists {
		_, err = db.NewAddColumn().
			Table("alerts").
			ColumnExpr("sub_alerts jsonb DEFAULT '[]'").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to add sub_alerts column to alerts table: %v", err)
		}
		log.Info("Added sub_alerts column to alerts table")
	} else {
		log.Debug("sub_alerts column already exists in alerts table")
	}

	return nil
}

func removeNewColumnsFromFlows(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "flows", "group_alerts")
	if err != nil {
		return fmt.Errorf("failed to check if group_alerts column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("flows").
			Column("group_alerts").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove group_alerts column from flows table: %v", err)
		}
	} else {
		log.Debug("group_alerts column already removed from flows table")
	}

	exists, err = columnExists(ctx, db, "flows", "group_alerts_identifier")
	if err != nil {
		return fmt.Errorf("failed to check if group_alerts_identifier column exists: %v", err)
	}
	if exists {
		_, err = db.NewDropColumn().
			Table("flows").
			Column("group_alerts_identifier").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove group_alerts_identifier column from flows table: %v", err)
		}
		fmt.Println("Removed group_alerts_identifier column from flows table")
	} else {
		log.Debug("group_alerts_identifier column already removed from flows table")
	}

	exists, err = columnExists(ctx, db, "flows", "alert_threshold")
	if err != nil {
		return fmt.Errorf("failed to check if alert_threshold column exists: %v", err)
	}
	if exists {
		_, err = db.NewDropColumn().
			Table("flows").
			Column("alert_threshold").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove alert_threshold column from flows table: %v", err)
		}
		fmt.Println("Removed alert_threshold column from flows table")
	} else {
		log.Debug("alert_threshold column already removed from flows table")
	}

	return nil
}

func removeNewColumnsFromAlerts(ctx context.Context, db *bun.DB) error {
	exists, err := columnExists(ctx, db, "alerts", "updated_at")
	if err != nil {
		return fmt.Errorf("failed to check if updated_at column exists: %v", err)
	}
	if exists {
		_, err := db.NewDropColumn().
			Table("alerts").
			Column("updated_at").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove updated_at column from alerts table: %v", err)
		}
	} else {
		log.Debug("updated_at column already removed from alerts table")
	}

	exists, err = columnExists(ctx, db, "alerts", "resolved_at")
	if err != nil {
		return fmt.Errorf("failed to check if resolved_at column exists: %v", err)
	}
	if exists {
		_, err = db.NewDropColumn().
			Table("alerts").
			Column("resolved_at").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove resolved_at column from alerts table: %v", err)
		}
		fmt.Println("Removed resolved_at column from alerts table")
	} else {
		log.Debug("resolved_at column already removed from alerts table")
	}

	exists, err = columnExists(ctx, db, "alerts", "group_key")
	if err != nil {
		return fmt.Errorf("failed to check if group_key column exists: %v", err)
	}
	if exists {
		_, err = db.NewDropColumn().
			Table("alerts").
			Column("group_key").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove group_key column from alerts table: %v", err)
		}
		fmt.Println("Removed group_key column from alerts table")
	} else {
		log.Debug("group_key column already removed from alerts table")
	}

	exists, err = columnExists(ctx, db, "alerts", "sub_alerts")
	if err != nil {
		return fmt.Errorf("failed to check if sub_alerts column exists: %v", err)
	}
	if exists {
		_, err = db.NewDropColumn().
			Table("alerts").
			Column("sub_alerts").
			Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to remove sub_alerts column from alerts table: %v", err)
		}
		fmt.Println("Removed sub_alerts column from alerts table")
	} else {
		log.Debug("sub_alerts column already removed from alerts table")
	}

	return nil
}
