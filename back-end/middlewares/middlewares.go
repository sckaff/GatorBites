package middlewares

import (
	"cen/backend/utils/token"
	"encoding/csv"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

var (
	compCounterLock sync.Mutex
	compCounter     = make(map[string]int) // Map with date as key
)

func initCompetitionCSVWriter() *csv.Writer {
	file, err := os.OpenFile("competition_log.csv", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Failed to open competition csv file: %v", err)
	}
	writer := csv.NewWriter(file)

	// Write headers if file is new
	if info, _ := file.Stat(); info.Size() == 0 {
		headers := []string{"Date", "VisitCount"}
		if err := writer.Write(headers); err != nil {
			log.Fatalf("Failed to write headers to competition csv file: %v", err)
		}
		writer.Flush()
	}
	return writer
}

func CompetitionLogger() gin.HandlerFunc {
	writer := initCompetitionCSVWriter()

	return func(c *gin.Context) {
		// Use the current date as the key
		currentDate := time.Now().Format("2006-01-02") // YYYY-MM-DD format
		compCounterLock.Lock()
		compCounter[currentDate]++
		count := compCounter[currentDate]
		compCounterLock.Unlock()

		// Write the current date and count to the CSV
		record := []string{currentDate, strconv.Itoa(count)}
		writer.Write(record)
		writer.Flush()

		c.Next()
	}
}

var (
	csvLock sync.Mutex
	writer  *csv.Writer
)

func initCSVWriter() {
	// Initialize the CSV writer in a separate function
	file, err := os.OpenFile("gin.csv", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Failed to open csv file: %v", err)
	}

	writer = csv.NewWriter(file)

	// Write headers if file is new
	if info, _ := file.Stat(); info.Size() == 0 {
		headers := []string{"Method", "URI", "Client IP", "User Agent", "Duration"}
		if err := writer.Write(headers); err != nil {
			log.Fatalf("Failed to write headers to csv file: %v", err)
		}
		writer.Flush()
	}
}

func LoggerToCSV() gin.HandlerFunc {
	// Initialize the CSV writer
	initCSVWriter()

	return func(c *gin.Context) {
		start := time.Now()

		// Process request
		c.Next()

		// Prepare log entry as a CSV row
		record := []string{
			c.Request.Method,
			c.Request.RequestURI,
			c.ClientIP(),
			c.Request.UserAgent(),
			time.Since(start).String(),
		}

		// Synchronize access to the CSV writer
		csvLock.Lock()
		defer csvLock.Unlock()

		// Write the log entry to CSV
		if err := writer.Write(record); err != nil {
			log.Printf("Failed to write to csv file: %v", err)
		} else {
			writer.Flush() // Flush after every write
			if err := writer.Error(); err != nil {
				log.Printf("Error flushing csv writer: %v", err)
			}
		}
	}
}

func JwtAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := token.TokenValid(c)
		if err != nil {
			c.String(http.StatusUnauthorized, "Unauthorized")
			c.Abort()
			return
		}
		c.Next()
	}
}

func LoggerToFile() gin.HandlerFunc {
	file, err := os.OpenFile("gin.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Failed to log to file, using default stderr: %v", err)
	}
	logger := log.New(file, "", log.LstdFlags)

	return func(c *gin.Context) {
		start := time.Now()

		// Process request
		c.Next()

		// Log the request and response details
		logger.Printf("%s %s %s %s %s",
			c.Request.Method,
			c.Request.RequestURI,
			c.ClientIP(),
			c.Request.UserAgent(),
			time.Since(start),
		)
	}
}
