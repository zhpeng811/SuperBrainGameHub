package router

import (
	"github.com/gin-gonic/gin"
	"github.com/zhpeng811/superbraingamehub/api"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Sample Application
	r.GET("/items", api.GetAllItems)
	r.GET("/items/:id", api.GetItemByID)
	r.POST("/items", api.CreateItem)

	return r
}
