import React, { useEffect, useState } from "react";
import { FaComments, FaSmile, FaUser, FaSearch } from "react-icons/fa";

// Nếu chưa có API, dùng dữ liệu mẫu
const SAMPLE_THREADS = [];

export default function ForumThreadList() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchThreads();
  }, [search]);

  async function fetchThreads() {
    setLoading(true);
    try {
      let data = SAMPLE_THREADS;
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
    <div className="p-6 min-h-screen bg-[url('https://images.pexels.com/photos/1420440/pexels-photo-1420440.jpeg')] bg-cover bg-center">
      <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-purple-400">
        <FaComments className="text-purple-300 text-3xl" /> Quản lý chủ đề forum
      </h1>
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-purple-200 rounded-2xl px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/80 text-gray-700 shadow-sm"
          />
          <FaSearch className="absolute right-3 top-3 text-purple-300" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/80 rounded-2xl shadow-xl">
          <thead>
            <tr className="bg-purple-100 text-purple-600">
              <th className="px-4 py-3 rounded-tl-2xl font-bold text-left">
                Tiêu đề
              </th>
              <th className="px-4 py-3 font-bold text-left">Tác giả</th>
              <th className="px-4 py-3 rounded-tr-2xl font-bold text-left">
                Ngày tạo
              </th>
            </tr>
          </thead>
          <tbody>
            {threads.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 text-center text-purple-300">
                  <div className="flex flex-col items-center gap-2">
                    <FaSmile className="text-5xl mb-2 animate-bounce" />
                    <span className="font-semibold">Không có chủ đề nào!</span>
                  </div>
                </td>
              </tr>
            ) : (
              threads.map((thread) => (
                <tr
                  key={thread._id}
                  className="hover:bg-purple-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FaComments className="text-purple-200" />
                    <span className="font-medium">{thread.title}</span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FaUser className="text-pink-300" />
                    {thread.author}
                  </td>
                  <td className="px-4 py-3">{thread.created_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
