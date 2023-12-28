import React, { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { Category } from "../types/Category";
import PostCard from "../Post/PostCard";
import { Link } from "react-router-dom";

export default function Home(props: { loggedIn: boolean }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((json) => {
        let post_data: Post[] = json.data;
        setPosts(post_data);
      });
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        let category_data: Category[] = json.data;
        setCategories(category_data);
      });
  }, []);

  // Currently uses the same html as the posts, but will be changed to display posts in the event category
  const html_events = posts.map((post, i) => {
    let outline_color;
    if (i % 2 === 0) {
      outline_color = "border-sky-500";
    } else {
      outline_color = "border-orange-500";
    }
    if (post.category === "Events") {
      return <PostCard post={post} color={outline_color} />;
    } else {
      return null;
    }
  });

  const html_categories = categories.map((category, i) => {
    const categories_url = "/categories/" + category.title;
    let outline_color;
    if (i % 2 === 0) {
      outline_color = "border-sky-500";
    } else {
      outline_color = "border-orange-500";
    }

    return (
      <div
        data-cy={category.title}
        key={category.id}
        className={
          "rounded shadow-lg m-2 border-2 border-sky-500 " + outline_color
        }
      >
        <div className="relative m-2">
          <div className="">
            <React.Fragment>
              <Link data-cy={`category-${category.title}`} to={categories_url}>
                <p className="url_styling text-lg font-semibold">
                  {category.title}
                </p>
              </Link>
            </React.Fragment>
          </div>
          <div>
            <p className="font-light">{category.description}</p>
          </div>
        </div>
      </div>
    );
  });

  let j = 0;

  const html_recents = [...posts].reverse().map((post, i) => {
    let outline_color = "border-slate-700";
    return <PostCard post={post} color={outline_color} />;
  });

  return (
    <div className="pt-20 flex flex-col overflow-hidden h-full p-2 ">
      <div className="max-w-7xl mx-auto gap-2 h-full overflow-hidden">
        <div className="col-start-4 col-span-6 h-full overflow-y-auto">
          <div
            data-cy="recents-tab"
            className="text-center text-xl font-bold text-white"
          >
            Feed
          </div>
          <div className="w-[600px] gap-y-1 flex flex-col">{html_recents}</div>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-1/4 mr-[-90px] bg-amber-500 text-slate-900 rounded-full hover:scale-105 duration-500 flex items-center justify-center"
          style={{ width: "40px", height: "40px", padding: "5px" }}
        >
          ↑
        </button>
        {/* This is the events and categories
        <div className="col-span-4 h-full overflow-y-auto">
          <div data-cy="events-tab" className="text-center text-xl font-bold">
            Events
          </div>
          <div className="grid gap-y-1">{html_events}</div>
        </div>
        <div className="col-span-4 h-full overflow-y-auto">
          <div
            data-cy="categories-tab"
            className="text-center text-xl font-bold"
          >
            Categories
          </div>
          <div className="grid gap-y-1">{html_categories}</div>
        </div>
        */}
      </div>
      <br />
    </div>
  );
}
