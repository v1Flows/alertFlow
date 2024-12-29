package router

import (
	"alertflow-backend/handlers/admins"
	pages "alertflow-backend/handlers/page"
	"alertflow-backend/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func Page(router *gin.RouterGroup, db *bun.DB) {
	page := router.Group("/page")
	{
		page.GET("/settings", func(c *gin.Context) {
			admins.GetSettings(c, db)
		})
		page.Use(middlewares.Auth(db)).GET("/plans", func(c *gin.Context) {
			pages.GetPlans(c, db)
		})
	}
}
