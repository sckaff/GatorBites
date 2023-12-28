import React, { useState } from "react";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login(props: {
  loggedIn: boolean;
  setLoggedIn: Function;
}) {
  let navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [inputOneClassName, setInputOneClassName] = useState<string>(
    "text-sm text-gray-base w-full mr-3 py-5 px-11 h-2 border border-gray-200 rounded mb-2 overflow-hidden shadow-lg"
  );
  const [errorMsgClassName, setErrorMsgClassName] = useState<string>(
    "flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-10 invisible"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submitting");
    e.preventDefault();
    setInputOneClassName(
      "text-sm text-gray-base w-full mr-3 py-5 px-11 h-2 border border-gray-200 rounded mb-2 overflow-hidden shadow-lg"
    );
    setErrorMsgClassName(
      "flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-10 invisible"
    );

    AuthService.login(username, password)
      .then((res) => {
        console.log(res);
        if (res.token) {
          props.setLoggedIn(true);
          navigate("/profile");
        }
      })
      .catch((err) => {
        console.log(err);
        setInputOneClassName(
          "text-sm text-gray-base w-full mr-3 py-5 px-11 h-2 border border-gray-200 rounded mb-2 overflow-hidden shadow-lg border-red-500"
        );
        setErrorMsgClassName(
          "flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-10 visible"
        );
      });
  };

  if (props.loggedIn) {
    navigate("/profile");
    return <div>Already logged in!</div>;
  } else {
    return (
      <div className="pt-36 flex flex-col overflow-hidden h-full p-2">
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <input
            className={inputOneClassName}
            data-cy="username-input"
            id="username"
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />{" "}
          <br />
          <input
            className={inputOneClassName}
            data-cy="password-input"
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <br />
          <div className={errorMsgClassName}>
            Username or Password was Incorrect!
          </div>
          <button
            className="bg-amber-500 w-full text-slate-900 py-2 mt-4 rounded mb-2 overflow-hidden shadow-lg text-white"
            data-cy="submit-button"
            data-testid="loginBtn"
            type="submit"
          >
            Login
          </button>
          <br />
          <br />
          <div className="footer block text-sm font-medium leading-6 text-white flex justify-center">
            <Link to="/profile/register">
              Don't have an account? Register here!
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
