import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Post } from "../types/Post";
import axios from "axios";
import authService from "../../services/auth.service";
import { User } from "../types/User";

export default function PostCard(props: { post: Post; color: string }) {
  const [upvotes, setUpvotes] = useState<number>(props.post.netRating);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {}, [userDetails]); // Run this effect whenever userDetails changes

  const fetchUserDetails = () => {
    const username =
      typeof props.post.user === "string"
        ? props.post.user
        : props.post.user.username;

    axios
      .get(`/api/users/${username}`)
      .then((response) => {
        // console.log("User details from API:", response.data);
        setUserDetails(response.data);
        // console.log("User details after setting state:", userDetails);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  const clearUpvotes = () => {
    const token = authService.getToken();
    if (token !== null) {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      axios
        .patch(
          `/api/user/clearrating/${props.post.id}`,
          {},
          headers
        )
        .then((res) => {
          if (res.status === 200) {
            // console.log("cleared the users upvote");
            setUpvotes(res.data.data.netRating);
          } else {
            // console.log("failed to clear the users upvote. Not upvoted");
          }
        });
    } else {
      // console.log("Not logged in");
    }
  };

  const handleUpvote = () => {
    const token = authService.getToken();
    if (token !== null) {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      axios
        .patch(
          `/api/user/likepost/${props.post.id}`,
          {},
          headers
        )
        .then((res) => {
          if (res.status === 200) {
            setUpvotes(upvotes + 1);
          } else {
            clearUpvotes();
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            clearUpvotes();
          } else {
            // console.log(err.response.status);
          }
        });
    } else {
      // console.log("Not logged in");
    }
  };

  const handleDownvote = () => {
    const token = authService.getToken();
    if (token !== null) {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      axios
        .patch(
          `/api/user/dislikepost/${props.post.id}`,
          {},
          headers
        )
        .then((res) => {
          if (res.status === 200) {
            setUpvotes(upvotes - 1);
          } else {
            clearUpvotes();
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            clearUpvotes();
          } else {
            // console.log(err.response.status);
          }
        });
    } else {
      // console.log("Not logged in");
    }
  };
  const post_url = "/posts/" + props.post.id;
  // console.log(userDetails?.image_url); // Log here

  return (
    <div
      key={props.post.id}
      className={`rounded shadow-lg m-2 border-2  ${props.color}`}
    >
      <div className="relative m-2">
        <div className="flex items-center">
          {userDetails && ( // Check if userDetails is not null
            <img
              src={
                userDetails.image_url ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              className="rounded-full object-cover w-10 h-10 mr-2"
              alt="Profile"
            />
          )}
          <div>
            <p className="url_styling text-lg font-semibold w-5/6 text-white">
              {props.post.title}
            </p>
            <span className="text-sm text-white ">
              {" "}
              by{" "}
              {typeof props.post.user === "string"
                ? props.post.user
                : props.post.user.username}
            </span>
          </div>
        </div>
        <Link
          to={post_url}
          data-cy={`post-${props.post.title}`}
          style={{ textDecoration: "none" }}
        >
          <div
            className="my-3"
            style={{ width: "100%", maxHeight: "300px", overflow: "hidden" }}
          >
            <img
              src={props.post.imageUrl}
              className="rounded-md object-cover w-full h-full text-white"
              alt={props.post.title}
            />
          </div>
        </Link>

        {/* The rest of your existing code remains unchanged */}

        <div className="text-white absolute top-0 right-0 flex gap-x-2">
          <span>{upvotes}</span>

          <button
            className="px-2 bg-amber-500 text-slate-900 hover:scale-105 duration-500 flex items-center justify-center rounded-sm"
            onClick={() => handleUpvote()}
          >
            ↑
          </button>
          <button
            className="px-2 bg-amber-500 text-slate-900 hover:scale-105 duration-500 flex items-center justify-center rounded-sm"
            onClick={() => handleDownvote()}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
