package users

import (
	"alertflow-backend/config"
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/sub"
	"github.com/uptrace/bun"
)

func GetSubscription(context *gin.Context, db *bun.DB) {
	// Create a PaymentIntent
	stripe.Key = config.Config.Stripe.Secret

	token := context.GetHeader("Authorization")
	userID, _ := auth.GetUserIDFromToken(token)

	// get user data from db
	var user models.Users
	err := db.NewSelect().Model(&user).Column("customer_id").Where("id = ?", userID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error getting user data", err)
		return
	}

	params := &stripe.SubscriptionListParams{
		Customer: user.CustomerID,
	}
	result := sub.List(params)

	subscriptions := make([]stripe.Subscription, 0)
	for result.Next() {
		subscriptions = append(subscriptions, *result.Subscription())
	}

	context.JSON(http.StatusOK, gin.H{
		"result":        "success",
		"subscriptions": subscriptions,
	})
}
