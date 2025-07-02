import axios from "axios";

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

export default api;

export const fetchForumThreads = async () => {
  const response = await api.get("/forumthreads");
  return response.data;
};
