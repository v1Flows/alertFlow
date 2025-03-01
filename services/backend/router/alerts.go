package router

import (
	"github.com/v1Flows/alertFlow/services/backend/handlers/alerts"
	"github.com/v1Flows/alertFlow/services/backend/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func Alerts(router *gin.RouterGroup, db *bun.DB) {
	alert := router.Group("/alerts").Use(middlewares.Mixed(db))
	{
		alert.GET("/", func(c *gin.Context) {
			alerts.GetMultiple(c, db)
		})
		alert.GET("/:alertID", func(c *gin.Context) {
			alerts.GetSingle(c, db)
		})
		alert.DELETE("/:alertID", func(c *gin.Context) {
			alerts.Delete(c, db)
		})

		alert.POST("/", func(c *gin.Context) {
			alerts.CreateAlert(c, db)
		})
	}
}
