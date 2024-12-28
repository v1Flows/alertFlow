package router

import (
	"alertflow-backend/handlers/users"
	"alertflow-backend/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func User(router *gin.RouterGroup, db *bun.DB) {
	user := router.Group("/user").Use(middlewares.Auth(db))
	{
		user.GET("/", func(c *gin.Context) {
			users.GetUserDetails(c, db)
		})
		user.GET("/plan", func(c *gin.Context) {
			users.GetUserPlan(c, db)
		})
		user.GET("/stats", func(c *gin.Context) {
			users.GetUserStats(c, db)
		})
		user.GET("/notifications", func(c *gin.Context) {
			users.GetUserNotifications(c, db)
		})
		user.GET("/subscription", func(c *gin.Context) {
			users.GetSubscription(c, db)
		})
		user.GET("/payment/methods", func(c *gin.Context) {
			users.GetPaymentMethods(c, db)
		})

		user.PUT("/notifications/:notificationID/read", func(c *gin.Context) {
			users.ReadUserNotification(c, db)
		})
		user.PUT("/notifications/:notificationID/unread", func(c *gin.Context) {
			users.UnreadUserNotification(c, db)
		})
		user.PUT("/notifications/:notificationID/archive", func(c *gin.Context) {
			users.ArchiveUserNotification(c, db)
		})
		user.PUT("/notifications/:notificationID/unarchive", func(c *gin.Context) {
			users.UnarchiveUserNotification(c, db)
		})
		user.PUT("/", func(c *gin.Context) {
			users.ChangeUserDetails(c, db)
		})
		user.PUT("/password", func(c *gin.Context) {
			users.ChangeUserPassword(c, db)
		})
		user.PUT("/disable", func(c *gin.Context) {
			users.DisableUser(c, db)
		})
		user.PUT("/subscription", func(c *gin.Context) {
			users.CancelSubscription(c, db)
		})
		user.PUT("/welcomed", func(c *gin.Context) {
			users.WelcomedUser(c, db)
		})

		user.POST("/customer", func(c *gin.Context) {
			users.CreateCustomer(c, db)
		})
		user.POST("/payment/card", func(c *gin.Context) {
			users.SetupNewCard(c, db)
		})
		user.POST("/payment/card/default", func(c *gin.Context) {
			users.SetDefaultCard(c, db)
		})
		user.POST("/subscription", func(c *gin.Context) {
			users.CreateSubscription(c, db)
		})

		user.DELETE("/", func(c *gin.Context) {
			users.DeleteUser(c, db)
		})
		user.DELETE("/payment/card/:cardID", func(c *gin.Context) {
			users.RemoveCard(c, db)
		})
	}
}
