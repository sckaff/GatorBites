import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../routes/Home";

import CreatePost from "../Post/CreatePost";
import PostView from "../Post/PostView";
import Login from "../profile/Login";
import Homebar from "./Homebar";
import Search from "../routes/Search";
import authService from "../../services/auth.service";
import ProfileView from "../profile/ProfileView";
import Register from "../profile/Register";
import CategoriesPage from "../routes/CategoriesPage";

import WeeklyPrompt from "../Home/WeeklyPrompt";
import SortByCuisine from "../Home/SortByCuisine";
import Comp from "../routes/Comp";
import Ital from "../routes/ital";
import Mex from "../routes/mex";
import Amer from "../routes/amer";
import Indi from "../routes/india";
import Asia from "../routes/asia";

export default function Authenticator() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    //console.log("Authenticator useEffect");
    (async () => {
      setLoggedIn(await authService.isLoggedIn());
    })();
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen">
      <BrowserRouter>
        <Homebar loggedIn={loggedIn} />

        <div className="flex justify-center">
          <SortByCuisine />

          <div>
            <Routes>
              <Route path="/" element={<Home loggedIn={loggedIn} />} />
              <Route
                path="/competition"
                element={<Comp loggedIn={loggedIn} />}
              />
              <Route path="/italian" element={<Ital loggedIn={loggedIn} />} />
              <Route path="/mexican" element={<Mex loggedIn={loggedIn} />} />
              <Route path="/indian" element={<Indi loggedIn={loggedIn} />} />
              <Route path="/american" element={<Amer loggedIn={loggedIn} />} />
              <Route path="/asian" element={<Asia loggedIn={loggedIn} />} />
              <Route
                path="/posts/create"
                element={<CreatePost loggedIn={loggedIn} />}
              />
              <Route path="/posts/:id" element={<PostView />} />
              <Route
                path="/profile"
                element={
                  <ProfileView loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                }
              />
              <Route
                path="/profile/login"
                element={
                  <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                }
              />
              <Route
                path="/profile/register"
                element={
                  <Register loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                }
              />
              <Route
                path="/posts/search"
                element={<Search loggedIn={loggedIn} />}
              />
              <Route
                path="/categories/:category"
                element={<CategoriesPage />}
              />
            </Routes>
          </div>

          <WeeklyPrompt />
        </div>
      </BrowserRouter>
    </div>
  );
}
