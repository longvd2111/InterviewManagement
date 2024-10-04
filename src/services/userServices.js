import { jwtDecode } from "jwt-decode";
import axios from "./customize-axios";

const loginApi = (username, password) => {
  return axios.post("/api/login", { username, password });
};

const resetPwApi = (email) => {
  return axios.post(`/api/forgot-pw?email=${email}`);
};

const fetchAllUser = (index, pageSize) => {
  return axios.get(`/api/users?index=${index}&size=${pageSize}`);
};

const getUserInfoFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return {
      username: decodedToken.username,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return {};
  }
};

export { loginApi, resetPwApi, fetchAllUser, getUserInfoFromToken };
