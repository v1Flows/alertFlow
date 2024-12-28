package router

import (
	"alertflow-backend/handlers/docs"
	"alertflow-backend/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func Docs(router *gin.RouterGroup, db *bun.DB) {
	doc := router.Group("/docs").Use(middlewares.Mixed(db))
	{
		// docs
		doc.GET("/", func(c *gin.Context) {
			docs.GetDocs(c, db)
		})
		doc.GET("/:docID", func(c *gin.Context) {
			docs.GetDoc(c, db)
		})

		doc.Use(middlewares.Admin(db)).POST("/", func(c *gin.Context) {
			docs.CreateDoc(c, db)
		})
		doc.Use(middlewares.Admin(db)).PUT("/:docID", func(c *gin.Context) {
			docs.UpdateDoc(c, db)
		})
		doc.Use(middlewares.Admin(db)).DELETE("/:docID", func(c *gin.Context) {
			docs.DeleteDoc(c, db)
		})
	}
}
