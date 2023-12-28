package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CompetitionHandler(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{
		"message": "Competition page visited successfully",
	})
}
