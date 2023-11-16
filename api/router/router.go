package router

import (
	"github.com/gin-gonic/gin"
	"github.com/zhpeng811/superbraingamehub/api"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Ping
	r.GET("/ping", api.Ping)

	// Sample Application
	r.GET("/items", api.GetAllItems)
	r.GET("/items/:id", api.GetItemByID)
	r.POST("/items", api.CreateItem)

	// Black-White Tile
	r.POST("/blackWhiteTile/initialize", api.IntializeGame)
	r.POST("/blackWhiteTile/handleClick", api.HandleClick)
	return r
}
