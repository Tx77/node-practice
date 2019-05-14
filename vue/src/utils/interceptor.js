import axios from "axios";

axios.interceptors.request.use(
  config => {},
  err => {
    return Promise.reject(err);
  }
);
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
  }
);

export default axios;
