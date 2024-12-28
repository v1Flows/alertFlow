package users

import (
	"alertflow-backend/config"
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/customer"
	"github.com/uptrace/bun"
)

func GetPaymentMethods(context *gin.Context, db *bun.DB) {
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

	paymentMethods := make([]stripe.PaymentMethod, 0)
	var result *customer.PaymentMethodIter
	if len(user.CustomerID) >= 1 {
		params := &stripe.CustomerListPaymentMethodsParams{
			Customer: stripe.String(user.CustomerID),
		}
		result = customer.ListPaymentMethods(params)
		for result.Next() {
			paymentMethods = append(paymentMethods, *result.PaymentMethod())
		}
	}

	context.JSON(http.StatusOK, gin.H{
		"result":          "success",
		"payment_methods": paymentMethods,
	})
}
