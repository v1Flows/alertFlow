package functions

import (
	"alertflow-backend/models"
	"context"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
)

func PeriodicUserPlanValidCheck(db *bun.DB) {
	for {
		checkUserPlanValidTime(db)
		time.Sleep(1 * time.Hour)
	}
}

func checkUserPlanValidTime(db *bun.DB) {
	ctx := context.Background()

	log.Info("Checking user plan valid time")

	// get all users
	var users []models.Users
	err := db.NewSelect().Model(&users).Scan(ctx)
	if err != nil {
		log.Println(err)
	}

	for _, user := range users {
		if time.Now().After(user.PlanValidUntil) {
			if user.Plan != "hobby" {
				log.Info("Plan expired for user: ", user)

				// set plan to free
				user.Plan = "hobby"
				user.PlanValidUntil = time.Time{}
				_, err := db.NewUpdate().Model(&user).Column("plan", "plan_valid_until").Where("id = ?", user.ID).Exec(ctx)
				if err != nil {
					log.Error(err)
				}
			}
		}
	}
}
