package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zhpeng811/superbraingamehub/models"
)

func GetAllItems(c *gin.Context) {
	c.JSON(http.StatusOK, models.Items)
}

func GetItemByID(c *gin.Context) {
	id := c.Param("id")
	for _, item := range models.Items {
		if item.ID == id {
			c.JSON(http.StatusOK, item)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
}

func CreateItem(c *gin.Context) {
	var newItem models.Item
	if err := c.BindJSON(&newItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(newItem)
	models.Items = append(models.Items, newItem)
	c.Status(http.StatusNoContent)
}
