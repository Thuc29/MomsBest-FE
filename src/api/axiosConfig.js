import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "https://momsbest-be.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "Tài khoản của bạn đã bị vô hiệu hóa"
    ) {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Tài khoản của bạn đã bị vô hiệu hóa",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
    }
    return Promise.reject(error);
  }
);

export default api;

export const fetchForumThreads = async () => {
  const response = await api.get("/forumthreads");
  return response.data;
};
