import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegCommentDots, FaSmile, FaSearch, FaTrash } from "react-icons/fa";

export default function ForumCommentList() {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [thread, setThread] = useState("");
  const [threads, setThreads] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [page, search, thread]);

  async function fetchThreads() {
    try {
      const res = await axios.get(
        "http://localhost:9999/api/admin/forumthreads",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setThreads(res.data.threads);
    } catch {}
  }

  async function fetchComments() {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:9999/api/admin/forumcomments",
        {
          params: { page, limit, search, thread_id: thread },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments(res.data.comments);
      setTotal(res.data.total);
    } catch (err) {
      setError("Không thể tải danh sách bình luận");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) return;
    await axios.delete(`http://localhost:9999/api/admin/forumcomments/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchComments();
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-300 mb-4"></div>
        <span className="text-green-400 font-semibold text-lg">
          Đang tải bình luận...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center font-semibold mt-8">{error}</div>
    );

  return (
    <div className="p-6 min-h-screen bg-[url('https://images.pexels.com/photos/51953/mother-daughter-love-sunset-51953.jpeg')] bg-cover bg-center">
      <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-green-400">
        <FaRegCommentDots className="text-green-300 text-3xl" /> Quản lý bình
        luận forum
      </h1>
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm nội dung..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border-2 border-green-200 rounded-2xl px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white/80 text-gray-700 shadow-sm"
          />
          <FaSearch className="absolute right-3 top-3 text-green-300" />
        </div>
        <div className="relative">
          <select
            value={thread}
            onChange={(e) => {
              setThread(e.target.value);
              setPage(1);
            }}
            className="border-2 border-pink-200 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white/80 text-gray-700 shadow-sm"
          >
            <option value="">Tất cả chủ đề</option>
            {threads.map((thr) => (
              <option key={thr._id} value={thr._id}>
                {thr.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/80 rounded-2xl shadow-xl">
          <thead>
            <tr className="bg-green-100 text-green-600">
              <th className="px-4 py-3 rounded-tl-2xl font-bold text-left">
                Nội dung
              </th>
              <th className="px-4 py-3 font-bold text-left">Chủ đề</th>
              <th className="px-4 py-3 rounded-tr-2xl font-bold text-left">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 text-center text-green-300">
                  <div className="flex flex-col items-center gap-2">
                    <FaSmile className="text-5xl mb-2 animate-bounce" />
                    <span className="font-semibold">
                      Không có bình luận nào!
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              comments.map((comment) => (
                <tr
                  key={comment._id}
                  className="hover:bg-green-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FaRegCommentDots className="text-green-200" />
                    <span className="font-medium">{comment.content}</span>
                  </td>
                  <td className="px-4 py-3">
                    {threads.find((thr) => thr._id === comment.thread_id)
                      ?.title || ""}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="px-4 py-2 rounded-2xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 text-white bg-red-400 hover:bg-red-500"
                    >
                      <FaTrash /> Xóa
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
                ? "bg-green-400 text-white scale-110"
                : "bg-white/80 text-green-400 hover:bg-green-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
