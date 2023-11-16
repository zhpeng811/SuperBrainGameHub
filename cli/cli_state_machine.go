package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/zhpeng811/superbraingamehub/models"
)

var Games = []string{
	"Black White Tile",
}

func promptPickGame() string {
	for {
		fmt.Println("Pick A game to play: ")
		for i, game := range Games {
			fmt.Printf("%d. %s\n", i+1, game)
		}
		var choice int
		fmt.Scanf("%d\r", &choice)
		if choice < 1 || choice > len(Games) {
			fmt.Println("Invalid choice. Please input a number between 1 and", len(Games))
			continue
		}
		return Games[choice-1]
	}
}

func processGameChoice(game string) {
	switch game {
	case "Black White Tile":
		GameBlackWhiteTile()
	default:
		fmt.Println("Invalid Game")
	}
}

func printBoard(board models.Board) {
	fmt.Print("  ")
	for colInx := range board.Tiles[0] {
		fmt.Printf("%d ", colInx)
	}
	fmt.Println()
	for rowInx, row := range board.Tiles {
		fmt.Printf("%d ", rowInx)
		for _, tile := range row {
			if tile {
				fmt.Print("▮ ")
			} else {
				fmt.Print("▯ ")
			}
		}
		fmt.Println()
	}
}

func GameBlackWhiteTile() {
	apiUrl := os.Getenv("API_URL")

	body, err := httpPost(apiUrl+"/blackWhiteTile/initialize", []byte(`{"clicks": 10, "length": 10, "width": 10}`))
	if err != nil {
		fmt.Print(err.Error())
		return
	}

	var board models.Board
	err = json.Unmarshal(body, &board)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	for {
		printBoard(board)
		fmt.Println("Enter Your Move:")
		var row, col int
		fmt.Scanf("%d %d\r", &row, &col)
		if row < 0 || row >= board.Length || col < 0 || col >= board.Width {
			fmt.Println("Invalid Move")
			continue
		}

		type RequestBody struct {
			Tiles [][]bool `json:"tiles"`
			Row   int      `json:"row"`
			Col   int      `json:"col"`
		}
		requestBody, err := json.Marshal(RequestBody{
			Tiles: board.Tiles,
			Row:   row,
			Col:   col,
		})
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		body, err := httpPost(apiUrl+"/blackWhiteTile/handleClick", requestBody)

		if err != nil {
			fmt.Printf("GameBlackWhiteTile post error: %s", err.Error())
			return
		}
		err = json.Unmarshal(body, &board)
		if err != nil {
			fmt.Println("Unmarshal Error:", err)
			return
		}
	}
}

func stateMachine() {
	game := promptPickGame()
	processGameChoice(game)
}
