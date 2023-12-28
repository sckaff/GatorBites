package controllers

import (
	"cen/backend/models"
	"cen/backend/utils/token"
	"context"
	"fmt"
	"mime/multipart"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
)

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

type UpdateProfilePictureInput struct {
	Image *multipart.FileHeader `form:"image"`
}

func CurrentUser(c *gin.Context) {

	user_id, err := token.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u, err := models.GetUserByID(user_id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": u})
}

func Login(c *gin.Context) {

	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := models.User{}

	u.Username = input.Username
	u.Password = input.Password

	token, err := models.LoginCheck(u.Username, u.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username or password is incorrect."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})

}

func Register(c *gin.Context) {

	var input RegisterInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := models.User{Username: input.Username, Password: input.Password, Email: input.Email, UpvoteCount: 0}

	_, err := user.SaveUser()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "registration success"})

}

func UpdateProfilePicture(c *gin.Context) {
	var updateInput UpdateProfilePictureInput

	if err := c.ShouldBind(&updateInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error1": err.Error()})
		return
	}

	// Extract user ID from the token or any other authentication method you're using
	userID, err := token.ExtractTokenID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error2": err.Error()})
		return
	}

	// Get the existing user from the database
	existingUser, err := models.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error3": err.Error()})
		return
	}

	// Upload the new image to S3
	uploader := initS3Client() // Assuming initS3Client is declared in posts.go
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error4": "Failed to upload image"})
		return
	}

	f, openErr := file.Open()
	if openErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error5": "Failed to open uploaded file"})
		return
	}

	result, uploadErr := uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String("foodimagekarl"),
		Key:    aws.String(file.Filename),
		Body:   f, // Use the file content as the body
		ACL:    "public-read",
	})

	if uploadErr != nil {
		// Log the specific error details
		fmt.Println("S3 Upload Error:", uploadErr)

		// Respond with an error message
		c.JSON(http.StatusInternalServerError, gin.H{"error6": "Failed to upload image to S3"})
		return
	}

	// Update the user's profile picture URL
	existingUser.ImageUrl = result.Location

	// Save the updated user to the database
	_, err = existingUser.UpdateImage()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error7": err.Error()})
		return
	}

	// Return the updated user information (optional)
	c.JSON(http.StatusOK, gin.H{"message": "profile picture updated successfully", "user": existingUser})
}
