# API Documentation

This documentation outlines the available endpoints and their functionalities in the API.

## General Functions:
* **GetPosts**
    - Retrieves all posts.
* **GetPostByID**
    - Retrieves an individual post based on its ID.
* **GetCategories**
    - Retrieves a list of all post categories.
* **GetUsers**
    - Retrieves a list of all users.
* **GetPostsByCategory**
    - Retrieves all posts within a specific category.
* **Register**
    - Registers a new user.
* **Login**
    - Performs a successful login if credentials are correct; outputs an error message otherwise.
* **GetCommentsByPostID**
    - Retrieves all comments for a given post ID.
* **CreateCategory**
    - Creates a new category. Note: Should be restricted to admin users once implemented.
* **SetUserAsAdmin**
    - Sets a user as an admin. Note: Should be restricted to admin users once implemented.


## User Functions:
* **CurrentUser**
    - Retrieves information about the currently logged-in user.
* **GetUserPosts**
    - Retrieves all posts created by the user.
* **CreatePost**
    - Creates a new post.
* **DeletePost**
    - Deletes a user's post. Only the post creator or an admin can delete the post.
* **PatchPost**
    - Updates a post. Only the post creator or an admin can update the post.
* **CreateComment**
    - Creates a new comment.
* **EditComment**
    - Edits a comment. Only the comment creator or an admin can edit the comment.
* **DeleteComment**
    - Deletes a comment. Only the comment creator or an admin can delete the comment.
* **LikePost**
    - Likes a post. The user's username is recorded in the post's like list.
* **DislikePost**
    - Dislikes a post. The user's username is recorded in the post's dislike list.
* **ClearPostLikes**
    - Clears any like or dislike a user has made on a post.
* **UpdateProfilePicture**
    - Updates the profile picture of the user.

## Admin Functions:
* **AdminDeletePost**
    - Deletes any post. Restricted to admin users.
* **AdminDeleteComment**
    - Deletes any comment. Restricted to admin users.
* **CreateCategory (Admin)**
    - Creates a new category. Restricted to admin users.
* **EditCategory**
    - Edits an existing category. Restricted to admin users.

Please note that certain functions should be restricted to admin users once the appropriate access control is implemented. The API is designed for a community platform, providing functionalities for post and comment management, user registration and profile management, and admin-specific controls.
