import React, { useEffect, useState } from "react";
import {
  FaComments,
  FaSmile,
  FaUser,
  FaSearch,
  FaThumbtack,
} from "react-icons/fa";
import axios from "axios";

export default function ForumThreadList() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchThreads();
    // eslint-disable-next-line
  }, [search]);

  async function fetchThreads() {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/admin/forumthreads",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let data = res.data.threads || res.data; // API trả về {threads, total}
      if (search) {
        data = data.filter((t) =>
          t.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      setThreads(data);
    } catch (err) {
      setError("Không thể tải danh sách chủ đề");
    } finally {
      setLoading(false);
    }
  }

  async function handlePin(thread) {
    try {
      await axios.patch(
        `https://momsbest-be.onrender.com/api/admin/forumthreads/${thread._id}/toggle-pinned`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchThreads();
    } catch (err) {
      setError("Không thể cập nhật trạng thái ghim!");
    }
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-300 mb-4"></div>
        <span className="text-purple-400 font-semibold text-lg">
          Đang tải chủ đề...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center font-semibold mt-8">{error}</div>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200">
      <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-purple-800 drop-shadow-lg">
        <FaComments className="text-purple-500 text-4xl" /> Quản lý chủ đề forum
      </h1>
      <div className="mb-8 flex items-center gap-4 flex-wrap">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-purple-300 rounded-2xl px-5 py-3 w-72 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-700 shadow-md text-lg"
          />
          <FaSearch className="absolute right-4 top-4 text-purple-400 text-lg" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-3xl shadow-2xl border-b-2 border-purple-200 bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-purple-700 to-purple-500 text-white text-lg">
              <th className="px-8 py-5 rounded-tl-3xl font-bold text-left border-r border-purple-300">
                Tiêu đề
              </th>
              <th className="px-8 py-5 font-bold text-left border-r border-purple-300">
                Tác giả
              </th>
              <th className="px-8 py-5 font-bold text-center border-r border-purple-300">
                Ngày tạo
              </th>
              <th className="px-8 py-5 rounded-tr-3xl font-bold text-center">
                Pin
              </th>
            </tr>
          </thead>
          <tbody>
            {threads.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-16 text-center text-purple-400 bg-white/80"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FaSmile className="text-6xl mb-2 animate-bounce" />
                    <span className="font-semibold text-lg">
                      Không có chủ đề nào!
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              threads.map((thread, idx) => (
                <tr
                  key={thread._id}
                  className={`transition-colors duration-200 font-medium border-b border-purple-100 ${
                    idx % 2 === 0 ? "bg-purple-50" : "bg-white/90"
                  } hover:bg-purple-100`}
                >
                  <td className="px-8 py-5 flex items-center gap-3 text-purple-900 text-base font-semibold border-r border-purple-100">
                    <FaComments className="text-purple-300 text-xl" />
                    <span>{thread.title}</span>
                  </td>
                  <td className="px-8 py-5 text-pink-700 text-base font-semibold border-r border-purple-100">
                    <span className="flex items-center gap-2">
                      <FaUser className="text-pink-300 text-lg" />
                      {thread.author_id?.name ||
                        thread.author_id?.email ||
                        "Ẩn danh"}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-gray-700 text-base text-center font-semibold border-r border-purple-100">
                    {new Date(thread.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handlePin(thread)}
                      className={`flex items-center gap-2 px-4 py-2 mx-auto rounded-full font-bold shadow-lg transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                        thread.is_pinned
                          ? "bg-yellow-400 text-white hover:bg-yellow-500"
                          : "bg-purple-200 text-purple-700 hover:bg-purple-400"
                      }`}
                      style={{ minWidth: 110 }}
                    >
                      <FaThumbtack className="text-lg" />
                      {thread.is_pinned ? "Đã ghim" : "Ghim"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
