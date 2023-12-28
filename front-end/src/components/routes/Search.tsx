import React, { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { Category } from "../types/Category";
import PostCard from "../Post/PostCard";

export default function Home(props: {loggedIn: boolean}) {

    const [posts, setPosts] = useState<Array<Post>>([]);
    const [searchText, setSearchText] = useState<String>("");
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [category, setCategory] = useState<String>("");

    const updateSearchedPosts = () => {
        let search_posts: Post[] = [];
            posts.forEach((post) => {
                if (category === "") {
                    console.log("category is null yay")
                    if (post.title.toLowerCase().includes(searchText.toLowerCase())) {
                        search_posts.push(post);
                    }
                }
                else {
                    if (post.title.toLowerCase().includes(searchText.toLowerCase()) && post.category === category) {
                            search_posts.push(post);
                        }
                    }
                });
                return search_posts.map((post, i) => {
                    let outline_color;
                    if (i % 2 === 0) {
                        outline_color = "border-sky-500";
                    } else {
                        outline_color = "border-orange-500";
                    }

                    return (
                        <PostCard post={post} color={outline_color} />
                    )
                });
    
    }

    useEffect(() => {
        fetch('/api/posts')
        .then((res) => res.json())
        .then((json) => {
            let post_data: Post[] = json.data;
            setPosts(post_data);
        });
        fetch('/api/categories')
            .then((res) => res.json())
            .then((json) => {
                let category_data: Category[] = json.data;
                setCategories(category_data);
            });
    }, []);

    const html_categories = categories.map((category, i) => {
        return (
            <option key={category.id} value={category.title}>{category.title}</option>
        )
    });

    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-1">
                <div className="flex flex-col w-3/4">
                    <p className="text-xl font-bold">Search</p>
                    <form>
                        <input className="m-1 border-2 p-1 rounded border-slate-300" data-cy="search-box" type="text" placeholder="Post Title" onChange={(e) => setSearchText(e.target.value)} />
                        <br></br>
                        <select data-cy="category-selector" id="category m-1" onChange={(e) => setCategory(e.target.value)} className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold w-1/4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" required>
                            <option value="" disabled selected>Select Category</option>
                            {html_categories}
                        </select>
                    </form>
                </div>
                <div className="grid grid-cols-3 w-3/4">
                    {updateSearchedPosts()}
                </div>
            </div>
        </div>
    )
}