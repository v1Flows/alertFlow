package router

import (
	"alertflow-backend/handlers/admins"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func Page(router *gin.RouterGroup, db *bun.DB) {
	page := router.Group("/page")
	{
		page.GET("/settings", func(c *gin.Context) {
			admins.GetSettings(c, db)
		})
	}
}
