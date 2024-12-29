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

func CreateCustomer(context *gin.Context, db *bun.DB) {
	// Create a PaymentIntent
	stripe.Key = config.Config.Stripe.Secret

	token := context.GetHeader("Authorization")
	userID, _ := auth.GetUserIDFromToken(token)

	// get user data from db
	var user models.Users
	err := db.NewSelect().Model(&user).Column("username", "email").Where("id = ?", userID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error getting user data", err)
		return
	}

	params := &stripe.CustomerParams{
		Name:  &user.Username,
		Email: &user.Email,
	}
	c, err := customer.New(params)
	if err != nil {
		httperror.InternalServerError(context, "Error creating customer", err)
		return
	}

	// add customer_id to users table
	_, err = db.NewUpdate().Model(&user).Set("customer_id = ?", c.ID).Where("id = ?", userID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating user data", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"customer_id": c.ID,
	})
}
