package users

import (
	"alertflow-backend/config"
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/sub"
	"github.com/uptrace/bun"
)

func CancelSubscription(context *gin.Context, db *bun.DB) {
	stripe.Key = config.Config.Stripe.Secret

	token := context.GetHeader("Authorization")
	userID, _ := auth.GetUserIDFromToken(token)

	// get user data from db
	var user models.Users
	err := db.NewSelect().Model(&user).Column("subscription_id").Where("id = ?", userID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error getting user data", err)
		log.Error(err)
		return
	}

	params := &stripe.SubscriptionParams{CancelAtPeriodEnd: stripe.Bool(true)}
	result, err := sub.Update(user.SubscriptionID, params)
	if err != nil {
		httperror.InternalServerError(context, "Error canceling subscription", err)
		log.Error(err)
		return
	}

	// update user plan_valid_until
	_, err = db.NewUpdate().Model(&user).Set("plan_valid_until = ?", time.Unix(result.CurrentPeriodEnd, 0)).Where("id = ?", userID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating user data", err)
		log.Error(err)
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"result": "success",
		"data":   result,
	})
}
