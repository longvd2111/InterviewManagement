import axios from "axios";

const instance = axios.create({
  baseURL: "https://ims-pjb03.ddns.net:8443/",

  // baseURL: "http://localhost:8080/",
});

instance.interceptors.request.use(
  (config) => {
    let token = sessionStorage.getItem("token")
      ? sessionStorage.getItem("token")
      : localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data ? response.data : { statusCode: response.status };
  },
  (error) => {
    let res = {};
    if (error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    } else if (error.request) {
    } else {
      // Handle other errors
    }
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(res);
  }
);

export default instance;
