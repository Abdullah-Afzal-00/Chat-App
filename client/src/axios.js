import axios from "axios";

if (window.localStorage.getItem("token")) {
  axios.interceptors.request.use(function (config) {
    config.headers.Authorization =
      "Token " + window.localStorage.getItem("token");
    return config;
  });
}

export default axios;
