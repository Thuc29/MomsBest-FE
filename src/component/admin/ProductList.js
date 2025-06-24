import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBoxOpen,
  FaBaby,
  FaSmile,
  FaCheckCircle,
  FaBan,
  FaSearch,
  FaListUl,
} from "react-icons/fa";

export default function ProductList() {
  const [products, setProducts] = useState([]);
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
    fetchProducts();
    // eslint-disable-next-line
  }, [page, search, category]);

  async function fetchCategories() {
    try {
      const res = await axios.get(
        "http://localhost:9999/api/admin/categories",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCategories(res.data);
    } catch {}
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:9999/api/admin/products", {
        params: { page, limit, search, category },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async (id) => {
    await axios.patch(
      `http://localhost:9999/api/admin/products/${id}/toggle-active`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    fetchProducts();
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-300 mb-4"></div>
        <span className="text-green-400 font-semibold text-lg">
          Đang tải danh sách sản phẩm...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center font-semibold mt-8">{error}</div>
    );

  return (
    <div className="p-6 min-h-screen text-blue-700 font-space-grotesk bg-[url('https://images.pexels.com/photos/6849361/pexels-photo-6849361.jpeg')] bg-cover bg-center">
      <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-green-400">
        <FaBoxOpen className="text-green-300 text-3xl" /> Quản lý sản phẩm
      </h1>
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tên sản phẩm..."
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
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="border-2 border-yellow-200 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200 bg-white/80 text-gray-700 shadow-sm"
          >
            <option value="">
              <FaListUl className="inline mr-1" /> Tất cả danh mục
            </option>
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
            <tr className="bg-green-100 text-green-600">
              <th className="px-4 py-3 rounded-tl-2xl font-bold text-left">
                Tên
              </th>
              <th className="px-4 py-3 font-bold text-left">Giá</th>
              <th className="px-4 py-3 font-bold text-left">Danh mục</th>
              <th className="px-4 py-3 font-bold text-left">Trạng thái</th>
              <th className="px-4 py-3 rounded-tr-2xl font-bold text-left">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-green-300">
                  <div className="flex flex-col items-center gap-2">
                    <FaSmile className="text-5xl mb-2 animate-bounce" />
                    <span className="font-semibold">
                      Không có sản phẩm nào!
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-green-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FaBaby className="text-pink-200" />
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    {product.price.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3">
                    {categories.find((cat) => cat._id === product.category_id)
                      ?.name || ""}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        product.is_active ? "text-green-500" : "text-gray-400"
                      }`}
                    >
                      {product.is_active ? (
                        <>
                          <FaCheckCircle className="inline text-green-400" />{" "}
                          Đang bán
                        </>
                      ) : (
                        <>
                          <FaBan className="inline text-gray-400" /> Ngừng bán
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(product._id)}
                      className={`px-4 py-2 rounded-2xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 text-white ${
                        product.is_active
                          ? "bg-green-400 hover:bg-green-500"
                          : "bg-yellow-300 hover:bg-yellow-400 text-gray-700"
                      }`}
                    >
                      {product.is_active ? <FaBan /> : <FaCheckCircle />}
                      {product.is_active ? "Ngừng bán" : "Bán lại"}
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
