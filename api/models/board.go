package models

import "github.com/gin-gonic/gin"

type Board struct {
	length int
	width  int
	tiles  [][]bool
}

func NewBoard(length, width int) *Board {
	tiles := make([][]bool, length)
	for i := 0; i < length; i++ {
		tiles[i] = make([]bool, width)
		// default the board to all true
		for j := range tiles[i] {
			tiles[i][j] = true
		}
	}
	return &Board{
		length: length,
		width:  width,
		tiles:  tiles,
	}
}

func (board Board) RevertNearbyTiles(row, col int) {
	board.tiles[row][col] = !board.tiles[row][col]
	if row > 0 {
		board.tiles[row-1][col] = !board.tiles[row-1][col]
	}
	if row < board.length-1 {
		board.tiles[row+1][col] = !board.tiles[row+1][col]
	}
	if col > 0 {
		board.tiles[row][col-1] = !board.tiles[row][col-1]
	}
	if col < board.width-1 {
		board.tiles[row][col+1] = !board.tiles[row][col+1]
	}
}

func (board Board) ToGinResponse() gin.H {
	return gin.H{
		"length": board.length,
		"width":  board.width,
		"tiles":  board.tiles,
	}
}

// ===== Getters =====
func (board Board) GetTiles() [][]bool {
	return board.tiles
}

func (board Board) GetLength() int {
	return board.length
}
