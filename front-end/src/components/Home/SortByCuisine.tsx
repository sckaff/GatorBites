import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";


const SortByCuisine: React.FC = () => {
  const location = useLocation();
  const [prompt, setPrompt] = useState({
    title: "Sort By Cuisine",
    imageUrl: "path-to-spaghetti-image.jpg",
    altText: "Spaghetti",
  });

  // Check if the current route is "/competition" or "/posts/create"
  const isCompetitionRoute = location.pathname === "/competition";
  const isLogin = location.pathname === "/profile/login";
  const isRegister = location.pathname === "/profile/register";
  const isCreatePostRoute = location.pathname === "/posts/create";
  const isProfile = location.pathname === "/profile";

  
  // Change the prompt text and image if it's the create post route
  useEffect(() => {
    if (isProfile) {
      setPrompt({
        title: "Check out these Cuisines",
        imageUrl: "path-to-guide-image.jpg",
        altText: "Guide Image Alt Text",
      });
    } else if (isCreatePostRoute) {
      setPrompt({
        title: "How to Post?",
        imageUrl: "path-to-guide-image.jpg",
        altText: "Guide Image Alt Text",
      });
    } else if (isCompetitionRoute) {
      setPrompt({
        title: "Join the Competition!",
        imageUrl: "path-to-guide-image.jpg",
        altText: "Guide Image Alt Text",
      });
    }else {
      setPrompt({
        title: "Sort By Cuisine",
        imageUrl: "path-to-spaghetti-image.jpg",
        altText: "Spaghetti",
      });
    }
  }, [isCreatePostRoute, isProfile, isCompetitionRoute]);

  if ( isLogin || isRegister ) {
    return null; // or return a different component, message, etc.
  }

  return (
    <div className={`pt-20 p-4 rounded-md flex flex-col w-1/5`}>
      <div className="sticky top-20 p-6 max-w-md rounded-md shadow mx-auto flex flex-col items-center">
    <h3 className="text-xl font-semibold text-white mb-2 border-b border-amber-500 pb-2 text-center">
      {prompt.title}
    </h3>
    {isCreatePostRoute ? (
      <div className="text-white text-center mb-4">
        <p>Please ensure that your posts are relevant to the themes of food, recipes, and culinary experiences. Let's maintain a positive and inclusive environment by avoiding inappropriate or unrelated content. Happy posting!</p>
        <br></br>
        <ol className="text-left pl-4">
          <li>Step 1: Provide a title of your recipe.</li>
          <li>Step 2: Provide details about your recipe.</li>
          <li>Step 3: Add a category for cuisine or if it is for the competition choose "Events".</li>
          <li>Step 4: Click the "Submit" button to share your post with the community.</li>
        </ol>
      </div>
    ) : isCompetitionRoute ? (
      <div className="text-white text-center mb-4">
        <p>Make a post related to the prompt and get a chance to win prizes. The post with the highest upvotes wins!</p>
        {/* Add more competition-specific content if needed */}
      </div>
    ) : (
      <div className="flex flex-col w-36">
        {/* Your cuisine buttons */}
        <Link to="/italian">
          <button className="bg-sky-600 text-white px-4 py-2 rounded w-full hover:scale-105 duration-500 mb-2">
            Italian
          </button>
        </Link>
        <Link to="/mexican">
          <button className="bg-sky-600 text-white px-4 py-2 rounded w-full hover:scale-105 duration-500 mb-2">
            Mexican
          </button>
        </Link>
        <Link to="/indian">
          <button className="bg-sky-600 text-white px-4 py-2 rounded w-full hover:scale-105 duration-500 mb-2">
            Indian
          </button>
        </Link>
        <Link to="/american">
          <button className="bg-sky-600 text-white px-4 py-2 rounded w-full hover:scale-105 duration-500 mb-2">
            American
          </button>
        </Link>
        <Link to="/asian">
          <button className="bg-sky-600 text-white px-4 py-2 rounded w-full hover:scale-105 duration-500 mb-2">
            Asian
          </button>
        </Link>
      </div>
    )}
  </div>
</div>

  );
};

export default SortByCuisine;