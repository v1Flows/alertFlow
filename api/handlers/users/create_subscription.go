package users

import (
	"alertflow-backend/config"
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/sub"
	"github.com/uptrace/bun"
)

func CreateSubscription(context *gin.Context, db *bun.DB) {
	stripe.Key = config.Config.Stripe.Secret

	token := context.GetHeader("Authorization")
	userID, _ := auth.GetUserIDFromToken(token)

	var plan models.Plans
	if err := context.ShouldBindJSON(&plan); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	// get user data from db
	var user models.Users
	err := db.NewSelect().Model(&user).Column("customer_id", "default_card").Where("id = ?", userID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error getting user data", err)
		return
	}

	if user.CustomerID == "" {
		httperror.StatusBadRequest(context, "Please create an customer account first", errors.New("User has no customer_id"))
		return
	}

	if user.DefaultCard == "" {
		httperror.StatusBadRequest(context, "Please select an default payment method", errors.New("User has no default_card"))
		return
	}

	subscriptionParams := &stripe.SubscriptionParams{
		Customer: &user.CustomerID,
		Items: []*stripe.SubscriptionItemsParams{
			{
				Plan: &plan.StripeID,
			},
		},
		DefaultPaymentMethod: &user.DefaultCard,
	}
	sb, err := sub.New(subscriptionParams)
	if err != nil {
		httperror.InternalServerError(context, "Error creating setup intent", err)
		return
	}

	// add subscription_id and price_id to users table
	_, err = db.NewUpdate().Model(&user).Set("subscription_id = ?", sb.ID).Set("price_id = ?", sb.Items.Data[0].Price.ID).Set("plan = ?", plan.ID).Set("plan_valid_until = ?", time.Unix(sb.CurrentPeriodEnd, 0)).Set("updated_at = NOW()").Where("id = ?", userID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating user data", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"subscription": sb,
	})
}
