import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaListUl, FaSmile, FaCheckCircle, FaBan } from "react-icons/fa";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/admin/categories",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCategories(res.data);
    } catch (err) {
      setError("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async (id) => {
    await axios.patch(
      `https://momsbest-be.onrender.com/api/admin/categories/${id}/toggle-active`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    fetchCategories();
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-300 mb-4"></div>
        <span className="text-yellow-400 font-semibold text-lg">
          Đang tải danh mục...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center font-semibold mt-8">{error}</div>
    );

  return (
    <div className="p-6 min-h-screen text-blue-700 font-space-grotesk bg-[url('https://images.pexels.com/photos/3847874/pexels-photo-3847874.jpeg')] bg-cover bg-center">
      <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-yellow-400">
        <FaListUl className="text-yellow-300 text-3xl" /> Quản lý chuyên mục
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/80 rounded-2xl shadow-xl">
          <thead>
            <tr className="bg-yellow-100 text-yellow-600">
              <th className="px-4 py-3 rounded-tl-2xl font-bold text-left">
                Tên chuyên mục
              </th>
              <th className="px-4 py-3 font-bold text-left">Mô tả</th>
              <th className="px-4 py-3 font-bold text-left">Trạng thái</th>
              <th className="px-4 py-3 rounded-tr-2xl font-bold text-left">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-yellow-300">
                  <div className="flex flex-col items-center gap-2">
                    <FaSmile className="text-5xl mb-2 animate-bounce" />
                    <span className="font-semibold">
                      Không có danh mục nào!
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="hover:bg-yellow-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FaListUl className="text-yellow-200" />
                    <span className="font-medium">{cat.name}</span>
                  </td>
                  <td className="px-4 py-3">{cat.description}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        cat.is_active ? "text-green-500" : "text-gray-400"
                      }`}
                    >
                      {cat.is_active ? (
                        <>
                          <FaCheckCircle className="inline text-green-400" />{" "}
                          Đang sử dụng
                        </>
                      ) : (
                        <>
                          <FaBan className="inline text-gray-400" /> Đã ẩn
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(cat._id)}
                      className={`px-4 py-2 rounded-2xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 text-white ${
                        cat.is_active
                          ? "bg-yellow-400 hover:bg-yellow-500"
                          : "bg-green-300 hover:bg-green-400 text-gray-700"
                      }`}
                    >
                      {cat.is_active ? "Ẩn" : "Hiện"}
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
