import React, { useState, useEffect } from "react";
import axios from "axios";
import { Category } from "../types/Category";
import authService from "../../services/auth.service";

type post_input = {
  title: string;
  body: string;
  category: string;
  image: File | null;
};

const postBody_class = "text-sm text-gray-base w-96 border rounded m-2";
const postTitleClassName = "text-sm text-gray-base w-96 border rounded m-2";
const selectionClassName =
  "inline-flex w-2/3 m-2 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold w-36 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50";
const postRespo = "Post Submitted!";
const fileInputLabelStyle =
  "cursor-pointer text-gray-500 flex items-center justify-center w-full h-40 rounded border-solid border-2 border-gray-300";

  const fileInputStyle =
  "hidden appearance-none relative block w-full h-full cursor-pointer";
export default function CreatePost(props: { loggedIn: boolean }) {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [recipe, setRecipe] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [postAffirm, setPostAffirm] = useState<string>(
    "font-medium tracking-wide text-green-500 text-xs mt-1 ml-2 invisible"
  );
  const [postResponse, setPostResponse] = useState<string>(postRespo);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        let category_data: Category[] = json.data;
        setCategories(category_data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostResponse(postRespo);
    setPostAffirm(
      "font-medium tracking-wide text-green-500 text-xs mt-1 ml-2 invisible"
    );
    const token = authService.getToken();
    if (category === "") {
      setPostResponse("Please select a category");
      setPostAffirm(
        " font-medium tracking-wide text-red-500 text-xs mt-1 ml-2 visible"
      );
      return;
    }

    if (!selectedImage) {
      setPostResponse("Please select an image");
      setPostAffirm(
        "font-medium tracking-wide text-red-500 text-xs mt-1 ml-2 visible"
      );
      return; // Exit the function if no image is selected
    }
    let fetchedRecipe = '';
  // Fetch recipe based on the title
  if (title.trim()) {
    try {
      const response = await axios.get(`http://localhost:5000/get_recipe?food=${encodeURIComponent(title)}`);
      fetchedRecipe = response.data.recipe;
      console.log(response.data);
      console.log(recipe);
      setRecipe(recipe)
    } catch (error) {
      console.error('Error fetching recipe:', error);
      // Handle error (e.g., set an error message state and return)
      return;
    }
  }

    if (token !== null) {
      const post: post_input = {
        title: title,
        body: fetchedRecipe,
        category: category,
        image: selectedImage,
      };
      console.log(body);
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("body", post.body);
      formData.append("category", post.category);
      if (post.image) {
        formData.append("image", post.image, post.image.name);
      }

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      axios
        .post("/api/user/createpost", formData, headers)
        .then((res) => {
          setPostAffirm(
            " font-medium tracking-wide text-green-500 text-xs mt-1 ml-2 visible"
          );
          setTitle("");
          setBody("");
          setCategory("");
          setPreviewImage(null);
        });
    } else {
      // Handle not logged in case if needed
    }
  };

  const html_categories = categories.map((category, i) => (
    <option key={category.id} value={category.title}>
      {category.title}
    </option>
  ));

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="pt-28 flex flex-col items-center justify-center mt-1 w-[616px]">
      <div className="min-w-96 rounded overflow-hidden shadow-lg border-2 border-slate-500 flex flex-col items-center justify-center">
        <div className="text-xl font-sans font-bold text-white">
          Create New Post!
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className={postTitleClassName}
            data-cy="post-title-input"
            id="title"
            value={title}
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br />
          <textarea
            className={postBody_class}
            data-cy="post-body-input"
            id="body"
            value={body}
            placeholder="Body"
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <br />

          <select
            data-cy="post-category-select"
            id="category"
            onChange={(e) => setCategory(e.target.value)}
            className={selectionClassName}
            required
          >
            <option value="null" disabled selected>
              Select Category
            </option>
            {html_categories}
          </select>
<br></br>
<br></br>
          <label htmlFor="fileInput" className={fileInputLabelStyle}>
  {previewImage ? (
    <img
      src={previewImage}
      alt="Selected Image"
      className="w-full h-full object-cover rounded"
    />
  ) : (
    <span>{previewImage ? "Change Image" : "Click to Upload"}</span>
  )}
</label>
<input
  type="file"
  id="fileInput"
  accept="image/*"
  className={fileInputStyle}
  onChange={(e) => handleImageSelection(e)}
/>
<br></br>
          <button
            className="bg-amber-500 w-full rounded mb-1 text-white "
            data-cy="post-submit-button"
            type="submit"
          >
            Create
          </button>
          <div className={postAffirm}>{postResponse}</div>
        </form>
      </div>
    </div>
  );
}
