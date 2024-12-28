package users

import (
	"alertflow-backend/config"
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/setupintent"
	"github.com/uptrace/bun"
)

func SetupNewCard(context *gin.Context, db *bun.DB) {
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

	params := &stripe.SetupIntentParams{
		PaymentMethodTypes: []*string{
			stripe.String("card"),
		},
		Customer: &user.CustomerID,
	}
	si, err := setupintent.New(params)
	if err != nil {
		httperror.InternalServerError(context, "Error creating setup intent", err)
		return
	}

	context.JSON(200, gin.H{
		"client_secret": si.ClientSecret,
	})
}
