package main

import (
	"bufio"
	"bytes"
	"os"
	"fmt"
	"net/http"
	"time"
	"strings"
)

func main() {
	err := loadEnv("../.env")
	if err != nil {
		fmt.Println("ERROR:", err)
		return
	}

	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	jsonData := `{"key": "`+os.Getenv("WATCH_DOG_KEY")+`","id":"polingTest","data":"{\"name\":\"Poling Test\"}"}`
	url := os.Getenv("API_ENDPOINT")
	
	sendHttpPostRequest(url, jsonData, "SecretToken", os.Getenv("API_SECRET"))

	for range ticker.C {
		err := sendHttpPostRequest(url, jsonData, "SecretToken", os.Getenv("API_SECRET"))
		if err != nil {
			fmt.Println("ERROR:", err)
			continue
		}
	}
}

func sendHttpPostRequest(url string, jsonData string, headerKey string, headerValue string) error {
	reqBody := bytes.NewBufferString(jsonData)

	req, err := http.NewRequest("POST", url, reqBody)
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set(headerKey, headerValue)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	fmt.Println("URL:", url)
	fmt.Println("statusCode:", resp.Status)

	return nil
}

func loadEnv(filePath string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])
		os.Setenv(key, value)
	}

	return scanner.Err()
}
