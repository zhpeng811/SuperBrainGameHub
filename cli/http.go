package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

func httpGet(url string) ([]byte, error) {
	response, err := http.Get(url)
	if err != nil {
		fmt.Print(err.Error())
		return nil, err
	}

	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

func httpPost(url string, requestBody []byte) ([]byte, error) {
	response, err := http.Post(url, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	responseBody, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	return responseBody, nil
}
