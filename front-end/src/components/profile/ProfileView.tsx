import React, { useEffect, useState } from "react";
import axios from "axios";
import { Post } from "../types/Post";
import authService from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

const ProfileView: React.FC<{ loggedIn: boolean; setLoggedIn: Function }> = (
  props
) => {
  let navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<Array<Post>>([]);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [creationDate, setCreationDate] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleLogoutButton = async () => {
    authService.logout();
    props.setLoggedIn(false);
    navigate("/profile/login");
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
      // Display a preview of the selected image
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDeletePost = (postid: number) => {
    const token = authService.getToken();
    if (props.loggedIn === false) {
      console.log("Error: not logged in");
    } else {
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios
        .delete("/api/user/deletepost/" + postid, headers)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            console.log("Post deleted");
            setUserPosts(userPosts.filter((post) => post.id !== postid));
          }
        });
    }
  };

  const handleImageUpload = async () => {
    try {
      const token = authService.getToken();

      if (!token) {
        console.error("Token is missing");
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedImage as Blob);

      // Send a request to the backend to upload the image
      const response = await axios.post(
        "/api/user/updateprofilepicture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      // Update the user's profile with the new image URL
      // This assumes that the backend returns the image URL in the response
      setPreviewImage(response.data.imageUrl);
      window.location.reload();
      // Optionally, you can update the user's profile in the database as well
      // This would depend on your backend implementation
      // Example: await updateProfile({ imageUrl: response.data.imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  useEffect(() => {
    const token = authService.getToken();
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.get("/api/user/", headers).then((res) => {
      let json = res.data.data;
      
      setUsername(json.username);
      setEmail(json.email);
      setCreationDate(json.CreatedAt);
      setPreviewImage(json.image_url);
    });
    axios.get("/api/user/posts", headers).then((res) => {
      let json = res.data.data;
      
      setUserPosts(json);
    });
  }, []);

  if (props.loggedIn) {
    const post_data = userPosts
      .slice()
      .reverse()
      .map((post) => {
        const post_url = "/posts/" + post.id;
        return (
          <div
            data-cy={"post-" + post.title}
            key={post.id}
            className={
              "rounded shadow-lg m-2 border-2 border-slate-700 text-white"
            }
          >
            <div className="relative m-2">
              <div className="">
                <React.Fragment>
                  <Link to={post_url}>
                    <p className="url_styling text-lg font-semibold w-5/6">
                      {post.title}
                    </p>
                  </Link>
                </React.Fragment>
              </div>
              <div>
                <p className="font-light w-5/6">
                  {post.body.slice(0, 50) + "..."}
                </p>
              </div>
              <div className="absolute bottom-0 right-0 font-thin italic">
                <br />
                <button
                  data-cy={"post-delete-" + post.title}
                  onClick={() => handleDeletePost(post.id)}
                  className="bg-amber-500 w-14 rounded overflow-hidden shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      });
    return (
      <div className="pt-20 flex flex-col items-center justify-center text-white w-[600px] mx-auto">
        <div className="grid grid-cols-3 gap-2 text-left">
          <div className="col-span-3 rounded overflow-hidden shadow-xl font-bold text-center text-3xl w-full h-14">
            {username}'s Profile Page
          </div>
          <div className="rounded overflow-hidden shadow-xl">
            <div className="text-center text-xl font-sans font-bold">
              Profile Info:
            </div>
            <div className="h-54 rounded shadow-lg m-2 border-2 p-2 border-slate-700">
              <div className="img-wrap img-upload">
              <label
                htmlFor="photo-upload"
                className="cursor-pointer text-gray-500 flex items-center justify-center w-full h-40 rounded border-solid border-2 border-gray-300"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span>{previewImage ? "Change Image" : "Click to Upload"}</span>
                )}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageSelection}
                className="hidden"
              />
                <button
                  onClick={handleImageUpload}
                  className="bg-amber-500 rounded overflow-hidden shadow-lg m-2 flex-grow"
                >
                  Save Profile Picture
                </button>
              </div>
            </div>
            <div className="h-54 rounded shadow-lg m-2 border-2 p-2 border-slate-700">
              <div className="font-sans">Username: {username}</div>
              <br />
              <div className="font-sans">Email: {email}</div>
              <br />
              <div className="font-sans">
                Member Since: {creationDate.slice(0, 10)}{" "}
              </div>
              <br />
              <button
                onClick={handleLogoutButton}
                className="bottom-0 left-0 bg-amber-500 w-14 rounded overflow-hidden shadow-lg m-2"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="col-span-2 rounded overflow-hidden shadow-xl">
            <div className="text-center text-xl font-sans font-bold">
              Posts:
            </div>
            <div className="grid grid-cols-1 gap-2 content-center">
              {post_data}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Please log-in to view profile!</div>;
  }
};

export default ProfileView;
