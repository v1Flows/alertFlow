package background_checks

import (
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func Init(db *bun.DB) {
	ticker := time.NewTicker(5 * time.Minute)
	quit := make(chan struct{})

	go func() {
		for {
			select {
			case <-ticker.C:
				log.Info("Bot: Checking for hanging executions")
				checkHangingExecutions(db)
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
}
