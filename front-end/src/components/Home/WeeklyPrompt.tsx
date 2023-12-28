import React, { useState, useEffect } from "react";
import thanksgiving from "../Image/thanksgiving-hero.jpg";
import { Link , useLocation } from "react-router-dom";

const WeeklyPrompt: React.FC = () => {
  const location = useLocation();
  const [prompt, setPrompt] = useState({
    title: "This Week's Prompt: Thanksgiving!",
    imageUrl: thanksgiving,
    altText: "thanksgiving",
  });
  const isLogin = location.pathname === "/profile/login";
  const isRegister = location.pathname === "/profile/register";
  const isCompetition = location.pathname === "/competition";
  if ( isLogin || isRegister) {
    return null; // or return a different component, message, etc.
  }
  return (
    <div className="pt-20 p-4 rounded-md flex flex-col w-1/5">
      <div className="sticky top-20 p-6 max-w-md rounded-md shadow mx-auto flex flex-col items-center">
        <h3 className="text-xl font-semibold text-white mb-2 border-b border-amber-500 pb-2 text-center">
          {prompt.title}
        </h3>
        <div className="flex justify-center mt-4">
          <img
            className="rounded-md"
            src={prompt.imageUrl}
            alt={prompt.altText}
          />
        </div>
        {!isCompetition && (
          <div className="flex justify-center mt-4">
            <Link to="/competition">
              <button className="bg-sky-600 text-white px-4 py-2 rounded hover:scale-105 duration-500">
                Check out the competition!
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyPrompt;
