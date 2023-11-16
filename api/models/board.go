package models

import "github.com/gin-gonic/gin"

type Board struct {
	Length int
	Width  int
	Tiles  [][]bool
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
		Length: length,
		Width:  width,
		Tiles:  tiles,
	}
}

func NewBoardFromTiles(tiles [][]bool) *Board {
	return &Board{
		Length: len(tiles),
		Width:  len(tiles[0]),
		Tiles:  tiles,
	}
}

func (board Board) RevertNearbyTiles(row, col int) {
	board.Tiles[row][col] = !board.Tiles[row][col]
	if row > 0 {
		board.Tiles[row-1][col] = !board.Tiles[row-1][col]
	}
	if row < board.Length-1 {
		board.Tiles[row+1][col] = !board.Tiles[row+1][col]
	}
	if col > 0 {
		board.Tiles[row][col-1] = !board.Tiles[row][col-1]
	}
	if col < board.Width-1 {
		board.Tiles[row][col+1] = !board.Tiles[row][col+1]
	}
}

func (board Board) ToGinResponse() gin.H {
	return gin.H{
		"length": board.Length,
		"width":  board.Width,
		"tiles":  board.Tiles,
	}
}

// ===== Getters =====
func (board Board) GetTiles() [][]bool {
	return board.Tiles
}

func (board Board) GetLength() int {
	return board.Length
}
