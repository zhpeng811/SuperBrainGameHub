package main

import (
	"github.com/zhpeng811/superbraingamehub/models"
	"github.com/zhpeng811/superbraingamehub/router"
)

func main() {
	// Initialize the items slice
	models.Items = []models.Item{}

	r := router.SetupRouter()

	r.Run(":8080")
}
