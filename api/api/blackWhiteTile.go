package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zhpeng811/superbraingamehub/models"
	"github.com/zhpeng811/superbraingamehub/utils"
)

func IntializeGame(c *gin.Context) {
	type RequestBody struct {
		Clicks int `json:"clicks"`
		Length int `json:"length" binding:"required"`
		Width  int `json:"width" binding:"required"`
	}
	var requestBody RequestBody

	// default to 10 clicks
	requestBody.Clicks = 10

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		// handle error
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	clicks := utils.GenerateClicks(requestBody.Clicks, requestBody.Length, requestBody.Width)
	board := models.NewBoard(requestBody.Length, requestBody.Width)
	for _, click := range clicks {
		fmt.Println(click)
		row := click[0]
		col := click[1]
		board.RevertNearbyTiles(row, col)
	}
	c.JSON(http.StatusOK, board.ToGinResponse())
}

func HandleClick(c *gin.Context) {
	type RequestBody struct {
		Tiles [][]bool `json:"tiles" binding:"required"`
		Row   int      `json:"row" binding:"required"`
		Col   int      `json:"col" binding:"required"`
	}
	var requestBody RequestBody

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		// handle error
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	board := models.NewBoardFromTiles(requestBody.Tiles)
	board.RevertNearbyTiles(requestBody.Row, requestBody.Col)
	c.JSON(http.StatusOK, board.ToGinResponse())
}
