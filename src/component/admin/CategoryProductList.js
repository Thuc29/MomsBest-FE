import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCloudUploadAlt,
  FaBoxOpen,
} from "react-icons/fa";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dak6p5n8s/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "momsbest_unsigned";

export default function CategoryProductList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://momsbest-fe.onrender.com/api/admin/categoryproducts",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCategories(res.data);
    } catch (err) {
      setError("Không thể tải danh sách danh mục sản phẩm");
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditCategory(null);
    setForm({ name: "", description: "", image: "" });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditCategory(cat);
    setForm({ name: cat.name, description: cat.description, image: cat.image });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      setForm((prev) => ({ ...prev, image: res.data.secure_url }));
    } catch (err) {
      setUploadError("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    await axios.delete(
      `https://momsbest-fe.onrender.com/api/admin/categoryproducts/${id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    fetchCategories();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return setError("Tên danh mục không được để trống");
    setError("");
    try {
      if (editCategory) {
        await axios.put(
          `https://momsbest-fe.onrender.com/api/admin/categoryproducts/${editCategory._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          "https://momsbest-fe.onrender.com/api/admin/categoryproducts",
          form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError("Lưu thất bại");
    }
  };

  return (
    <div className="p-6 min-h-screen text-blue-700 font-space-grotesk">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold flex items-center gap-2 text-green-400">
          <FaBoxOpen className="text-green-300 text-3xl" /> Quản lý danh mục sản
          phẩm
        </h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-400 hover:bg-green-500 text-white font-bold rounded-2xl shadow"
        >
          <FaPlus /> Thêm mới
        </button>
      </div>
      {loading ? (
        <div className="text-center text-green-400">Đang tải...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/80 rounded-2xl shadow-xl border border-gray-200 border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-600">
                <th className="px-4 py-3 font-bold text-center border border-gray-200">
                  Ảnh
                </th>
                <th className="px-4 py-3 font-bold text-left border border-gray-200">
                  Tên
                </th>
                <th className="px-4 py-3 font-bold text-left border border-gray-200">
                  Mô tả
                </th>
                <th className="px-4 py-3 font-bold text-center border border-gray-200">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 font-bold text-center border border-gray-200">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-green-300 border border-gray-200"
                  >
                    Không có danh mục nào!
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-green-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 text-center border border-gray-200">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-16 h-16 object-cover rounded-xl border mx-auto"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 mx-auto">
                          <FaBoxOpen className="text-2xl" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium border border-gray-200">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      {cat.description}
                    </td>
                    <td className="px-4 py-3 text-center border border-gray-200">
                      {new Date(cat.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center border border-gray-200">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="px-3 py-1 rounded-xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white mb-2"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="px-3 py-1 rounded-xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 bg-red-400 hover:bg-red-500 text-white"
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
      )}
      {/* Modal Thêm/Sửa */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl"
              onClick={() => setModalOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
              {editCategory ? (
                <>
                  <FaEdit /> Sửa danh mục
                </>
              ) : (
                <>
                  <FaPlus /> Thêm danh mục
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-semibold">Tên danh mục</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Mô tả</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  rows={2}
                />
              </div>
              <div>
                <label className="font-semibold">Ảnh danh mục</label>
                <div className="flex gap-2 items-center mt-2">
                  {form.image && (
                    <img
                      src={form.image}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  )}
                  <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-100">
                    {uploading ? (
                      <FaCloudUploadAlt className="text-2xl animate-bounce text-blue-400" />
                    ) : (
                      <FaCloudUploadAlt className="text-2xl text-gray-400" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {uploadError && (
                  <div className="text-red-500 text-sm mt-1">{uploadError}</div>
                )}
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold"
                  onClick={() => setModalOpen(false)}
                  disabled={uploading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600"
                  disabled={uploading}
                >
                  {editCategory ? "Lưu thay đổi" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
