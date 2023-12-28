import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import Logo1 from "../Image/Logo1.png";
export default function Homebar(props: { loggedIn: boolean }) {
  const [prompt, setPrompt] = useState({
    title: "This Week's Prompt!",
    imageUrl: Logo1,
    altText: "Spaghetti",
  });
  const loginButton = () => {
    if (props.loggedIn === false) {
      return (
        <Link data-cy="login-button" to="/profile/login" data-testid="LogInBtn">
          <div className="block mt-4 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4 font-bold">
            Login
          </div>
        </Link>
      );
    } else {
      // console.log("token: " + localStorage.getItem("token"));
      return (
        <Link data-cy="profile-button" to="/profile">
          <div className="block mt-4 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4 font-bold">
            Profile
          </div>
        </Link>
      );
    }
  };

  const createPostButton = () => {
    if (props.loggedIn === true) {
      return (
        <Link
          data-cy="create-post-button"
          to="/posts/create"
          className="block mt-4 ml-auto lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4 font-bold"
        >
          Create Post
        </Link>
      );
    } else {
      return;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-10 flex flex-row justify-between bg-sky-600 px-5 py-2">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <a href="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            className="rounded-md custom-image"
            src={prompt.imageUrl}
            alt={prompt.altText}
            width="60px"
            height="60px"
          />
          <span
            className="font-semibold text-xl tracking-tight"
            style={{ marginLeft: "8px" }}
          >
            GatorBites
          </span>
        </a>
      </div>
      <div className="flex flex-row justify-end items-center text-sm space-x-2">
        {" "}
        {/* Added space-x-4 for spacing */}
        {/*<Link
          data-cy="home-button"
          to="/"
          className="block mt-4 lg:inline-block lg:mt-0 text-sky-200 hover:text-white"
          data-testid="HomeBtn"
        >
          Home
          
        </Link>
        */}
        {/* 
        <Link
          data-cy="search_button"
          to="/posts/search"
          className="block mt-4 lg:inline-block lg:mt-0 text-sky-200 hover:text-white"
          data-testid="SearchBtn"
        >
          Search
        </Link>
        */}
        {createPostButton()}
        {loginButton()}
      </div>
    </div>
  );
}
