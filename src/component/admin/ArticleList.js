import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaRegNewspaper,
  FaSmile,
  FaSearch,
  FaCheckCircle,
  FaRegEdit,
  FaBook,
} from "react-icons/fa";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line
  }, [page, search, category]);

  async function fetchCategories() {
    try {
      const res = await axios.get(
        "https://momsbest-be-r1im.onrender.com/api/admin/categories",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCategories(res.data);
    } catch {}
  }

  async function fetchArticles() {
    setLoading(true);
    try {
      const res = await axios.get("https://momsbest-be-r1im.onrender.com/api/admin/articles", {
        params: { page, limit, search, category },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setArticles(res.data.articles);
      setTotal(res.data.total);
    } catch (err) {
      setError("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  }

  const handleTogglePublished = async (id) => {
    await axios.patch(
      `https://momsbest-be-r1im.onrender.com/api/admin/articles/${id}/toggle-published`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    fetchArticles();
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-300 mb-4"></div>
        <span className="text-pink-400 font-semibold text-lg">
          Đang tải danh sách bài viết...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center font-semibold mt-8">{error}</div>
    );

  return (
    <div className="p-6 min-h-screen bg-[url('https://images.pexels.com/photos/1544376/pexels-photo-1544376.jpeg')] bg-cover bg-center">
      <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-pink-400">
        <FaRegNewspaper className="text-pink-300 text-3xl" /> Quản lý bài viết
      </h1>
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tiêu đề..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border-2 border-pink-200 rounded-2xl px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/80 text-gray-700 shadow-sm"
          />
          <FaSearch className="absolute right-3 top-3 text-pink-300" />
        </div>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="border-2 border-purple-200 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white/80 text-gray-700 shadow-sm"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/80 rounded-2xl shadow-xl">
          <thead>
            <tr className="bg-pink-100 text-pink-600">
              <th className="px-4 py-3 rounded-tl-2xl font-bold text-left">
                Tiêu đề
              </th>
              <th className="px-4 py-3 font-bold text-left">Danh mục</th>
              <th className="px-4 py-3 font-bold text-left">Trạng thái</th>
              <th className="px-4 py-3 rounded-tr-2xl font-bold text-left">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-pink-300">
                  <div className="flex flex-col items-center gap-2">
                    <FaSmile className="text-5xl mb-2 animate-bounce" />
                    <span className="font-semibold">
                      Không có bài viết nào!
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr
                  key={article._id}
                  className="hover:bg-pink-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FaBook className="text-purple-200" />
                    <span className="font-medium">{article.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    {categories.find((cat) => cat._id === article.category_id)
                      ?.name || ""}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        article.is_published
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    >
                      {article.is_published ? (
                        <>
                          <FaCheckCircle className="inline text-green-400" /> Đã
                          xuất bản
                        </>
                      ) : (
                        <>
                          <FaRegEdit className="inline text-gray-400" /> Nháp
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublished(article._id)}
                      className={`px-4 py-2 rounded-2xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 text-white ${
                        article.is_published
                          ? "bg-pink-400 hover:bg-pink-500"
                          : "bg-purple-300 hover:bg-purple-400 text-gray-700"
                      }`}
                    >
                      {article.is_published ? "Ẩn" : "Xuất bản"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex gap-2 justify-center">
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-full font-bold shadow-sm transition-all duration-200 text-lg ${
              page === i + 1
                ? "bg-pink-400 text-white scale-110"
                : "bg-white/80 text-pink-400 hover:bg-pink-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
