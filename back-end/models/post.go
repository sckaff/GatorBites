package models

type Post struct {
	ID        uint   `json:"id" gorm:"primary_key"`
	Title     string `json:"title"`
	Body      string `json:"body"`
	Category  string `json:"category"`
	User      string `json:"user"`
	Likes     string `json:"likes"`
	Dislikes  string `json:"dislikes"`
	NetRating int    `json:"netRating"` // netRating = likes.length - dislikes.length //may become unsigned int
	ImageUrl  string `json:"imageUrl"`  // Add this field to store the image URL
	// Comment  []Comment `json:"comment" gorm:"foreignkey:ID"`
}
