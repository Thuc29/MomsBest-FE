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
  FaStar,
  FaMoneyBillWave,
  FaTags,
  FaWarehouse,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCloudUploadAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [categoriesTree, setCategoriesTree] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    original_price: "",
    category_ids: [],
    brand: "",
    images: [],
    stock_quantity: 0,
    description: "",
    detail_description: "",
    is_featured: false,
    is_active: true,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addUploadError, setAddUploadError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page, search, category]);

  // Hàm chuyển mảng danh mục phẳng thành cây phân cấp
  function buildCategoryTree(categories) {
    const map = {};
    const roots = [];
    categories.forEach((cat) => {
      map[cat._id] = { ...cat, children: [] };
    });
    categories.forEach((cat) => {
      if (cat.parent && map[cat.parent]) {
        map[cat.parent].children.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });
    return roots;
  }

  async function fetchCategories() {
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/admin/categoryproducts",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      categoriesTree(res.data);
      setCategoriesTree(buildCategoryTree(res.data));
    } catch {}
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/admin/products",
        {
          params: { page, limit, search, category },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
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
      `https://momsbest-be.onrender.com/api/admin/products/${id}/toggle-active`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    await fetchProducts();
  };

  const handleToggleFeatured = async (id) => {
    await axios.patch(
      `https://momsbest-be.onrender.com/api/admin/products/${id}/toggle-featured`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    await fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      await axios.delete(
        `https://momsbest-be.onrender.com/api/admin/products/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      await fetchProducts();
    }
  };

  const handleEdit = async (id) => {
    setEditLoading(true);
    try {
      const res = await axios.get(
        `https://momsbest-be.onrender.com/api/admin/products/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEditProduct({
        ...res.data,
        category_ids: Array.isArray(res.data.category_ids)
          ? res.data.category_ids.map((cat) =>
              typeof cat === "string" ? cat : cat._id
            )
          : [],
      });
      setEditModalOpen(true);
    } catch (err) {
      alert("Không thể tải thông tin sản phẩm");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked, multiple, options } = e.target;
    if (type === "checkbox" && name === "category_ids") {
      setEditProduct((prev) => {
        const arr = Array.isArray(prev.category_ids)
          ? [...prev.category_ids]
          : [];
        if (checked) {
          if (!arr.includes(value)) arr.push(value);
        } else {
          const idx = arr.indexOf(value);
          if (idx > -1) arr.splice(idx, 1);
        }
        return { ...prev, category_ids: arr };
      });
    } else if (multiple) {
      const values = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setEditProduct((prev) => ({
        ...prev,
        [name]: values,
      }));
    } else {
      setEditProduct((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? value === ""
              ? ""
              : Number(value)
            : value,
      }));
    }
  };

  async function uploadToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/dak6p5n8s/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "momsbest_unsigned");

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload thất bại");
    return data.secure_url;
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setUploadError("");
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        urls.push(url);
      }
      setEditProduct((prev) => ({
        ...prev,
        images: Array.isArray(prev.images) ? [...prev.images, ...urls] : urls,
      }));
    } catch (err) {
      setUploadError("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (url) => {
    setEditProduct((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await axios.put(
        `https://momsbest-be.onrender.com/api/admin/products/${editProduct._id}`,
        editProduct,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEditModalOpen(false);
      setEditProduct(null);
      await fetchProducts();
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đã cập nhật sản phẩm.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Cập nhật sản phẩm thất bại.",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Thêm hàm render option phân cấp
  function renderCategoryOptions(tree, level = 0) {
    return tree.map((cat) => [
      <option key={cat._id} value={cat._id}>
        {`${"\u00A0".repeat(level * 4)}${cat.name}`}
      </option>,
      cat.children && cat.children.length > 0
        ? renderCategoryOptions(cat.children, level + 1)
        : null,
    ]);
  }

  // Hàm xử lý thay đổi input cho thêm sản phẩm
  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "category_ids") {
      setNewProduct((prev) => {
        const arr = Array.isArray(prev.category_ids)
          ? [...prev.category_ids]
          : [];
        if (checked) {
          if (!arr.includes(value)) arr.push(value);
        } else {
          const idx = arr.indexOf(value);
          if (idx > -1) arr.splice(idx, 1);
        }
        return { ...prev, category_ids: arr };
      });
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? value === ""
              ? ""
              : Number(value)
            : value,
      }));
    }
  };

  // Hàm upload ảnh cho thêm sản phẩm
  const handleAddImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setAddUploadError("");
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        urls.push(url);
      }
      setNewProduct((prev) => ({
        ...prev,
        images: Array.isArray(prev.images) ? [...prev.images, ...urls] : urls,
      }));
    } catch (err) {
      setAddUploadError("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  // Hàm submit thêm sản phẩm
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await axios.post(
        "https://momsbest-be.onrender.com/api/admin/products",
        newProduct,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAddModalOpen(false);
      setNewProduct({
        name: "",
        price: "",
        original_price: "",
        category_ids: [],
        brand: "",
        images: [],
        stock_quantity: 0,
        description: "",
        detail_description: "",
        is_featured: false,
        is_active: true,
      });
      await fetchProducts();
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đã thêm sản phẩm mới.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Thêm sản phẩm thất bại.",
      });
    } finally {
      setAddLoading(false);
    }
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
      <div className="mb-6 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
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
              {/* Render option phân cấp */}
              {categoriesTree.length > 0 &&
                renderCategoryOptions(categoriesTree)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 rounded-2xl font-bold bg-green-500 text-white hover:bg-green-600 mb-4"
            onClick={() => {
              setAddModalOpen(true);
              setNewProduct({
                name: "",
                price: "",
                original_price: "",
                category_ids: [],
                brand: "",
                images: [],
                stock_quantity: 0,
                description: "",
                detail_description: "",
                is_featured: false,
                is_active: true,
              });
              setAddUploadError("");
            }}
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/80 rounded-2xl shadow-xl">
          <thead>
            <tr className="bg-green-100 text-green-600">
              <th className="px-4 py-3 rounded-tl-2xl font-bold text-center w-20 border border-gray-200">
                <span className="flex items-center justify-center gap-1">
                  <FaBoxOpen /> Ảnh
                </span>
              </th>
              <th className="px-4 py-3 font-bold text-left w-56 border border-gray-200">
                <span className="flex items-center gap-1">
                  <FaBaby /> Tên
                </span>
              </th>
              <th className="px-4 py-3 font-bold text-right w-32 whitespace-nowrap border border-gray-200">
                <span className="flex items-center gap-1 ">
                  <FaMoneyBillWave /> Giá
                </span>
              </th>
              <th className="px-4 py-3 font-bold text-right w-32 whitespace-nowrap border border-gray-200">
                <span className="flex items-center gap-1 ">
                  <FaTags /> Giá gốc
                </span>
              </th>
              <th className="px-4 py-3 font-bold text-left w-40 border border-gray-200">
                <span className="flex items-center gap-1">
                  <FaListUl /> Danh mục
                </span>
              </th>
              <th className="px-4 py-3 font-bold text-left w-32 border border-gray-200">
                <span className="flex items-center gap-1">
                  <FaBoxOpen /> Thương hiệu
                </span>
              </th>
              <th className="px-4 py-3 font-bold text-right w-20 whitespace-nowrap border border-gray-200">
                <span className="flex items-center gap-1 ">
                  <FaWarehouse /> Kho
                </span>
              </th>
              <th className="px-4 py-3 font-bold text-center w-28 whitespace-nowrap border border-gray-200">
                <span className="flex items-center justify-center gap-1">
                  <FaStar /> Nổi bật
                </span>
              </th>
              <th className="px-4 py-3 font-bold text-center w-32 whitespace-nowrap border border-gray-200">
                <span className="flex items-center justify-center gap-1">
                  <FaCheckCircle /> Trạng thái
                </span>
              </th>
              <th className="px-4 py-3 rounded-tr-2xl font-bold text-center w-32 whitespace-nowrap border border-gray-200">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="py-12 text-center text-green-300 border border-gray-200"
                >
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
                  className="hover:bg-green-50 text transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-center align-middle border border-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-xl border mx-auto"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 mx-auto">
                        <FaBoxOpen className="text-2xl" />
                      </div>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 font-medium truncate max-w-[180px] border border-gray-200"
                    title={product.name}
                  >
                    <span className="flex items-center line-clamp-2 gap-2">
                      <FaBaby className="text-pink-200" />
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap border border-gray-200">
                    <span className="flex items-center gap-2 ">
                      <FaMoneyBillWave className="text-green-400" />
                      {product.price?.toLocaleString()} đ
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap border border-gray-200">
                    <span className="flex items-center gap-2 ">
                      <FaTags className="text-yellow-400" />
                      {product.original_price?.toLocaleString() || "-"}
                    </span>
                  </td>
                  <td
                    className="px-2 py-3 truncate max-w-[140px] border border-gray-200"
                    title={
                      Array.isArray(product.category_ids)
                        ? product.category_ids
                            .map((cat) => cat?.name)
                            .filter(Boolean)
                            .join(", ")
                        : ""
                    }
                  >
                    <span
                      className="flex items-center gap-2 h-20 overflow-y-auto overflow-x-hidden custom-scrollbar flex-wrap w-full"
                      style={{ maxHeight: "5rem" }}
                    >
                      {Array.isArray(product.category_ids)
                        ? product.category_ids.map((cat) =>
                            cat?.name ? (
                              <span
                                key={cat._id}
                                className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold mr-1 mb-1 inline-block"
                              >
                                {cat.name}
                              </span>
                            ) : null
                          )
                        : ""}
                    </span>
                    <style>{`
                      .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                        background: #e0f2fe;
                        border-radius: 8px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #38bdf8;
                        border-radius: 8px;
                      }
                      .custom-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #38bdf8 #e0f2fe;
                      }
                    `}</style>
                  </td>
                  <td
                    className="px-4 py-3 truncate max-w-[100px] border border-gray-200"
                    title={product.brand}
                  >
                    <span className="flex items-center gap-2">
                      {product.brand || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap border border-gray-200">
                    <span className="flex items-center gap-2 ">
                      <FaWarehouse className="text-green-700" />
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm border border-gray-200">
                    <span
                      onClick={() => handleToggleFeatured(product._id)}
                      className={`cursor-pointer select-none px-3 py-1 rounded-full font-bold flex items-center gap-1 transition-all duration-200 mx-auto ${
                        product.is_featured
                          ? "bg-pink-100 text-pink-500 border border-pink-300"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      } hover:shadow-md`}
                      title="Click để chuyển đổi nổi bật"
                    >
                      <FaStar
                        className={
                          product.is_featured
                            ? "text-pink-400"
                            : "text-gray-300"
                        }
                      />
                      {product.is_featured ? "Nổi bật" : "Thường"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm border border-gray-200">
                    <span
                      onClick={() => handleToggleActive(product._id)}
                      className={`cursor-pointer select-none px-3 py-1 rounded-full font-bold flex items-center gap-1 transition-all duration-200 mx-auto ${
                        product.is_active
                          ? "bg-green-100 text-green-500 border border-green-300"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      } hover:shadow-md`}
                      title="Click để chuyển đổi trạng thái bán/ngừng bán"
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
                  <td className="px-4 py-3 text-center text-sm border border-gray-200">
                    <div className="flex flex-col gap-2 items-center">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="px-4 py-2 rounded-2xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white"
                        title="Click để sửa sản phẩm"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-4 py-2 rounded-2xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 bg-red-400 hover:bg-red-500 text-white"
                        title="Click để xóa sản phẩm"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </div>
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
      {/* Modal Sửa Sản Phẩm */}
      {editModalOpen && editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-h-[90vh] overflow-y-auto custom-scrollbar h-full max-w-2xl relative">
            <style>{`
                      .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                        background: #e0f2fe;
                        border-radius: 8px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #38bdf8;
                        border-radius: 8px;
                      }
                      .custom-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #38bdf8 #e0f2fe;
                      }
                    `}</style>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl"
              onClick={() => setEditModalOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
              <FaEdit /> Sửa sản phẩm
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Tên sản phẩm</label>
                  <input
                    type="text"
                    name="name"
                    value={editProduct.name || ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold">Giá</label>
                  <input
                    type="number"
                    name="price"
                    value={editProduct.price || ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold">Giá gốc</label>
                  <input
                    type="number"
                    name="original_price"
                    value={editProduct.original_price || ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold">Danh mục</label>
                  <div
                    className="flex flex-wrap gap-2 mt-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
                    style={{ maxHeight: "7rem", minHeight: "2.5rem" }}
                  >
                    {categoriesTree.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          name="category_ids"
                          value={cat._id}
                          checked={
                            editProduct.category_ids?.includes(cat._id) || false
                          }
                          onChange={handleEditChange}
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-semibold">Thương hiệu</label>
                  <input
                    type="text"
                    name="brand"
                    value={editProduct.brand || ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold">Kho</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={editProduct.stock_quantity || ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold">Mô tả</label>
                <textarea
                  name="description"
                  value={editProduct.description || ""}
                  onChange={handleEditChange}
                  className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  rows={2}
                />
              </div>
              <div>
                <label className="font-semibold">Mô tả chi tiết</label>
                <textarea
                  name="detail_description"
                  value={editProduct.detail_description || ""}
                  onChange={handleEditChange}
                  className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  rows={3}
                />
              </div>
              <div className="flex gap-4 items-center">
                <label className="font-semibold">Nổi bật</label>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={!!editProduct.is_featured}
                  onChange={handleEditChange}
                />
                <label className="font-semibold ml-6">Đang bán</label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={!!editProduct.is_active}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="font-semibold">Ảnh sản phẩm</label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {(Array.isArray(editProduct.images)
                    ? editProduct.images
                    : editProduct.images
                    ? [editProduct.images]
                    : []
                  ).map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white/80 rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition"
                        onClick={() => handleRemoveImage(img)}
                        title="Xóa ảnh"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
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
                      multiple
                    />
                  </label>
                </div>
                {uploadError && (
                  <div className="text-red-500 text-sm mt-1">{uploadError}</div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold"
                  onClick={() => setEditModalOpen(false)}
                  disabled={editLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600"
                  disabled={editLoading}
                >
                  {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm Sản Phẩm */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-white/50 h-full max-w-2xl relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl"
              onClick={() => setAddModalOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
              <FaBoxOpen /> Thêm sản phẩm mới
            </h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Tên sản phẩm</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleAddChange}
                    className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold">Giá</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleAddChange}
                    className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold">Giá gốc</label>
                  <input
                    type="number"
                    name="original_price"
                    value={newProduct.original_price}
                    onChange={handleAddChange}
                    className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold">Danh mục</label>
                  <div
                    className="flex flex-wrap gap-2 mt-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
                    style={{ maxHeight: "7rem", minHeight: "2.5rem" }}
                  >
                    {categoriesTree.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          name="category_ids"
                          value={cat._id}
                          checked={newProduct.category_ids.includes(cat._id)}
                          onChange={handleAddChange}
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-semibold">Thương hiệu</label>
                  <input
                    type="text"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleAddChange}
                    className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold">Kho</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={newProduct.stock_quantity}
                    onChange={handleAddChange}
                    className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold">Mô tả</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleAddChange}
                  className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  rows={2}
                />
              </div>
              <div>
                <label className="font-semibold">Mô tả chi tiết</label>
                <textarea
                  name="detail_description"
                  value={newProduct.detail_description}
                  onChange={handleAddChange}
                  className="w-full bg-gray-100 border rounded-xl px-3 py-2 mt-1"
                  rows={3}
                />
              </div>
              <div className="flex gap-4 items-center">
                <label className="font-semibold">Nổi bật</label>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={!!newProduct.is_featured}
                  onChange={handleAddChange}
                />
                <label className="font-semibold ml-6">Đang bán</label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={!!newProduct.is_active}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label className="font-semibold">Ảnh sản phẩm</label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {(Array.isArray(newProduct.images)
                    ? newProduct.images
                    : []
                  ).map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white/80 rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition"
                        onClick={() =>
                          setNewProduct((prev) => ({
                            ...prev,
                            images: prev.images.filter((i) => i !== img),
                          }))
                        }
                        title="Xóa ảnh"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
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
                      onChange={handleAddImageUpload}
                      disabled={uploading}
                      multiple
                    />
                  </label>
                </div>
                {addUploadError && (
                  <div className="text-red-500 text-sm mt-1">
                    {addUploadError}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold"
                  onClick={() => setAddModalOpen(false)}
                  disabled={addLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-500 text-white font-bold hover:bg-green-600"
                  disabled={addLoading}
                >
                  {addLoading ? "Đang lưu..." : "Thêm sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
