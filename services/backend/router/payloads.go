package router

import (
	"github.com/v1Flows/alertFlow/services/backend/handlers/payloads"
	"github.com/v1Flows/alertFlow/services/backend/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func Payloads(router *gin.RouterGroup, db *bun.DB) {
	payload := router.Group("/payloads").Use(middlewares.Mixed(db))
	{
		payload.GET("/", func(c *gin.Context) {
			payloads.GetMultiple(c, db)
		})
		payload.GET("/:payloadID", func(c *gin.Context) {
			payloads.GetSingle(c, db)
		})
		payload.DELETE("/:payloadID", func(c *gin.Context) {
			payloads.Delete(c, db)
		})
	}
}
