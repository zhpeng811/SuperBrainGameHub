package main

import (
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	// apiUrl := os.Getenv("API_URL")

	// body, err := httpPost(apiUrl+"/blackWhiteTile/initialize", []byte(`{"clicks": 10, "length": 10, "width": 10}`))
	// if err != nil {
	// 	fmt.Print(err.Error())
	// 	return
	// }

	// var board models.Board
	// err = json.Unmarshal(body, &board)
	// if err != nil {
	// 	fmt.Println("Error:", err)
	// 	return
	// }

	stateMachine()
}
