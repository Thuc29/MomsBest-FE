import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaListUl,
  FaSmile,
  FaCheckCircle,
  FaBan,
  FaEye,
  FaEyeSlash,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

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

  // Phân trang cho categories
  const totalPages = Math.ceil(categories.length / categoriesPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * categoriesPerPage,
    currentPage * categoriesPerPage
  );

  const handleToggleActive = async (id) => {
    setToggleLoadingId(id);
    try {
      await axios.patch(
        `https://momsbest-be.onrender.com/api/admin/categories/${id}/toggle-active`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchCategories();
    } catch (err) {
      setError("Không thể thay đổi trạng thái danh mục");
    } finally {
      setToggleLoadingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <div className="w-full max-w-3xl">
          <div className="animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 mb-4">
                <div className="rounded-full bg-yellow-200 h-10 w-10"></div>
                <div className="flex-1 h-6 bg-yellow-100 rounded"></div>
                <div className="w-24 h-6 bg-yellow-100 rounded"></div>
                <div className="w-24 h-6 bg-yellow-100 rounded"></div>
                <div className="w-24 h-8 bg-yellow-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <span className="text-yellow-400 font-semibold text-lg mt-6">
          Đang tải danh mục...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center mt-16">
        <div className="bg-red-100 border border-red-300 text-red-600 px-6 py-4 rounded-2xl shadow-md flex items-center gap-3">
          <FaBan className="text-2xl" />
          <span className="font-semibold">{error}</span>
        </div>
        <button
          onClick={fetchCategories}
          className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-xl flex items-center gap-2 shadow"
        >
          <FaSyncAlt /> Thử lại
        </button>
      </div>
    );

  return (
    <div className="p-6 min-h-screen text-blue-700 font-space-grotesk bg-[url('https://images.pexels.com/photos/3847874/pexels-photo-3847874.jpeg')] bg-cover bg-center">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold flex items-center gap-2 text-yellow-400">
          <FaListUl className="text-yellow-300 text-3xl" /> Quản lý chuyên mục
        </h1>
        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-semibold shadow">
          {/* Thông tin phân trang */}
          {categories.length > 0 && (
            <div className="text-center text-yellow-600 font-semibold">
              Hiển thị {(currentPage - 1) * categoriesPerPage + 1} -{" "}
              {Math.min(currentPage * categoriesPerPage, categories.length)}{" "}
              trong tổng số {categories.length} chuyên mục
            </div>
          )}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/80 rounded-2xl shadow-xl border-b border-yellow-200">
          <thead>
            <tr className="bg-yellow-100 text-yellow-600">
              <th className="px-4 py-3 rounded-tl-2xl w-1/6 font-bold text-left border-b border-yellow-200">
                Tên chuyên mục
              </th>
              <th className="px-14 py-3 w-4/6 font-bold text-left border-b border-yellow-200">
                Mô tả
              </th>
              <th className="px-4 py-3  font-bold text-left border-b border-yellow-200">
                Trạng thái
              </th>
              <th className="px-4 py-3 rounded-tr-2xl font-bold text-left border-b border-yellow-200">
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
              paginatedCategories.map((cat) => (
                <tr
                  key={cat._id}
                  className="hover:bg-yellow-50 transition-colors duration-200 border border-yellow-200 last:border-b-0"
                >
                  <td className="px-3 line-clamp-1  py-3 w-full flex text-start items-center">
                    <span className="font-semibold text-lg text-pink-500">
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-10 py-3  text-start">
                    <span className="text-base line-clamp-4 overflow-hidden">
                      {cat.description}
                    </span>
                  </td>
                  <td className="px-1 w-5/12 py-3 text-center">
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        cat.is_active
                          ? "text-green-500 bg-green-100 w-fit px-2 py-1 rounded-xl"
                          : "text-gray-400 bg-gray-100 w-fit px-2 py-1 rounded-xl"
                      }`}
                    >
                      {cat.is_active ? (
                        <>
                          <FaCheckCircle className="inline text-green-400" />{" "}
                          <p className="text-green-500">Đang hiện</p>
                        </>
                      ) : (
                        <>
                          <FaBan className="inline text-gray-400" /> Đã ẩn
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-5/12">
                    <button
                      onClick={() => handleToggleActive(cat._id)}
                      aria-label={
                        cat.is_active ? "Ẩn chuyên mục" : "Hiện chuyên mục"
                      }
                      title={
                        cat.is_active
                          ? "Ẩn chuyên mục này"
                          : "Hiện chuyên mục này"
                      }
                      disabled={toggleLoadingId === cat._id}
                      className={`px-4 py-2 rounded-2xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 text-white ${
                        cat.is_active
                          ? "bg-yellow-400 hover:bg-yellow-500"
                          : "bg-green-400 hover:bg-green-500 text-white"
                      } ${
                        toggleLoadingId === cat._id
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {toggleLoadingId === cat._id ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : cat.is_active ? (
                        <>
                          <FaEyeSlash /> Ẩn
                        </>
                      ) : (
                        <>
                          <FaEye /> Hiện
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center gap-2 shadow transition-all duration-200"
          >
            <FaChevronLeft /> Trước
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 rounded-lg font-bold transition-all duration-200 ${
                  currentPage === index + 1
                    ? "bg-yellow-400 text-white shadow-lg"
                    : "bg-white text-yellow-600 hover:bg-yellow-100 shadow"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center gap-2 shadow transition-all duration-200"
          >
            Sau <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
