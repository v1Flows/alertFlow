package users

import (
	"alertflow-backend/config"
	"alertflow-backend/functions/auth"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/paymentmethod"
	"github.com/uptrace/bun"
)

func RemoveCard(context *gin.Context, db *bun.DB) {
	// Create a PaymentIntent
	stripe.Key = config.Config.Stripe.Secret

	cardID := context.Param("cardID")

	token := context.GetHeader("Authorization")
	userID, _ := auth.GetUserIDFromToken(token)

	// get user data from db
	var user models.Users
	err := db.NewSelect().Model(&user).Column("default_card").Where("id = ?", userID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error getting user data", err)
		return
	}

	if user.DefaultCard == cardID {
		httperror.StatusBadRequest(context, "Cannot remove default card", errors.New("cannot remove default card"))
		return
	}

	params := &stripe.PaymentMethodDetachParams{}
	_, err = paymentmethod.Detach(cardID, params)
	if err != nil {
		httperror.InternalServerError(context, "Error removing card from customer", err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"result": "success"})
}
