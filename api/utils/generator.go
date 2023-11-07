package utils

import (
	"math/rand"
	"strconv"
	"time"
)

// ===== Public Exported Functions =====
func GenerateClicks(steps, boardWidth, boardLength int) [][]int {
	clicks := make([][]int, steps)
	for i := 0; i < steps; i++ {
		randRow := generateRandomInt(0, boardLength)
		randCol := generateRandomInt(0, boardWidth)
		clicks[i] = []int{randRow, randCol}
	}
	return clicks
}

// StringToInt converts a string to an integer.
//
// It takes a string as input and returns an integer.
func StringToInt(str string) int {
	int, err := strconv.Atoi(str)
	if err != nil {
		panic(err)
	}
	return int
}

// ===== Private Functions =====

// generate a random integer between [min, max) - min included, max excluded
func generateRandomInt(min, max int) int {
	rand.Seed(time.Now().UnixNano())
	return rand.Intn(max-min) + min
}
