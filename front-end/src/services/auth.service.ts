import axios from "axios";
// import User from "../types/User";

const API_URL = "/api";

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "/login", {
        username,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("token", JSON.stringify(response.data.token));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("token");
  }

  register(username: string, email: string, password: string) {
    return axios
      .post(API_URL + "/register", {
        username,
        email,
        password
      });
  }

  getToken() {
    const token = localStorage.getItem("token");
    if (token) return JSON.parse(token);

    return null;
  }

  isLoggedIn() {
    const token = this.getToken();
    const headers = {
      headers: { 
          'Authorization': `Bearer ${token}`,
      }
  }
    return axios.get(API_URL + "/user/", headers )
      .then((res) => {
        if (res.status === 200) return true
        else return false;
      })
      .catch((err) => {
        return false;
      });
    }
}

let authService = new AuthService();

export default authService;