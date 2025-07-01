import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { message } from "antd";
import axios from "axios";

const Product = () => {
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({
    category: "Tất Cả",
    minPrice: "",
    maxPrice: "",
    brand: "Tất Cả",
    search: "",
    minRating: "",
  });
  const [productsDb, setProductsDb] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Lấy danh sách category và brand duy nhất từ productsDb
  const categories = useMemo(() => {
    const set = new Set();
    productsDb.forEach((p) => {
      if (p.category_id) set.add(p.category_id);
    });
    return ["Tất Cả", ...Array.from(set)];
  }, [productsDb]);

  const brands = useMemo(() => {
    const set = new Set();
    productsDb.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return ["Tất Cả", ...Array.from(set)];
  }, [productsDb]);

  const parsePrice = (value) => {
    if (!value) return NaN;
    // Loại bỏ dấu chấm, dấu phẩy, khoảng trắng
    return parseFloat(value.toString().replace(/[.,\s]/g, ""));
  };

  const filteredProducts = productsDb.filter((product) => {
    // Category (so sánh với category_id)
    const categoryMatch =
      filters.category === "Tất Cả" ||
      (product.category_id &&
        product.category_id === categories.find((c) => c === filters.category));

    // Brand
    const brandMatch =
      filters.brand === "Tất Cả" ||
      (product.brand &&
        product.brand.toLowerCase() === filters.brand.toLowerCase());

    // Search (tên, mô tả, brand)
    const searchText = filters.search.trim().toLowerCase();
    const searchMatch =
      !searchText ||
      (product.name && product.name.toLowerCase().includes(searchText)) ||
      (product.description &&
        product.description.toLowerCase().includes(searchText)) ||
      (product.brand && product.brand.toLowerCase().includes(searchText));

    // Price (ưu tiên original_price nếu có, fallback sang price)
    const price = Number(product.price) || 0;
    const min = parsePrice(filters.minPrice);
    const max = parsePrice(filters.maxPrice);
    const minOk = !filters.minPrice || isNaN(min) || price >= min;
    const maxOk = !filters.maxPrice || isNaN(max) || price <= max;
    const priceMatch = minOk && maxOk;

    // Rating
    const rating = Number(product.rating) || 0;
    const minRating = parseFloat(filters.minRating);
    const ratingMatch =
      !filters.minRating || isNaN(minRating) || rating >= minRating;

    return (
      categoryMatch && brandMatch && searchMatch && priceMatch && ratingMatch
    );
  });

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const groupedProducts = {
    featured: filteredProducts.filter((p) => p.section === "featured"),
    "best-seller": filteredProducts.filter((p) => p.section === "best-seller"),
    new: filteredProducts.filter((p) => p.section === "new"),
  };

  const getListProduct = async () => {
    try {
      const res = await axios.get("https://momsbest-be-r1im.onrender.com/api/products");
      setProductsDb(res?.data);
    } catch (error) {
      message.error(error.toString());
    }
  };

  useEffect(() => {
    getListProduct();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="min-h-screen text-black pt-20 bg-cover bg-center bg-[url('https://images.pexels.com/photos/3270224/pexels-photo-3270224.jpeg?auto=compress&cs=tinysrgb&w=600')] flex flex-col font-space-grotesk">
      <main className="container mx-auto px-4 py-8">
        {/* Promotional Banner */}
        <section className="mb-8">
          <div className="relative bg-gradient-to-r from-pink-100 to-blue-100 rounded-2xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/2721581/pexels-photo-2721581.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Promotion"
              className="w-full h-48 object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-pink-600">
                  Ưu đãi lên đến 30% cho các sản phẩm mẹ & bé!
                </h2>
                <p className="text-gray-600 mt-2">
                  Mua sắm ngay hôm nay để nhận nhiều quà tặng hấp dẫn.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col  lg:flex-row gap-8">
          {/* Left Sidebar: Filters */}
          <aside className="lg:w-1/4 rounded-2xl shadow-lg">
            <div className="bg-white/70 p-4 rounded-2xl shadow-lg">
              {" "}
              <h2 className="text-xl font-bold text-pink-600 mb-3">
                Bộ Lọc Sản Phẩm
              </h2>
              {/* Search */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full p-3 border bg-white/80 border-pink-200 rounded-full focus:ring-2 focus:ring-pink-300 outline-none"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white/70 p-4 my-3  rounded-2xl shadow-lg">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Danh Mục Sản Phẩm
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={filters.category === cat}
                        onChange={() =>
                          setFilters({ ...filters, category: cat })
                        }
                        className="mr-2"
                      />
                      <span className="capitalize text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {/* Price Filter */}
            <div className="bg-white/70 p-4 my-3 rounded-2xl shadow-lg">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Mức Giá
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Tối thiểu"
                    className="w-1/2 p-2 border bg-white/80 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Tối đa"
                    className="w-1/2 p-2 border bg-white/80 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="bg-white/70 p-6 rounded-2xl shadow-lg">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Thương Hiệu
                </h3>
                <select
                  className="w-full p-3 border bg-white/80 text-gray-700 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                  value={filters.brand}
                  onChange={(e) =>
                    setFilters({ ...filters, brand: e.target.value })
                  }
                >
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand === "Tất Cả" ? "Tất Cả" : brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white/70 p-4 my-3 rounded-2xl shadow-lg">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Đánh Giá Tối Thiểu
                </h3>
                <select
                  className="w-full p-3 border bg-white/80 text-gray-700 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters({ ...filters, minRating: e.target.value })
                  }
                >
                  <option value="">Tất cả</option>
                  <option value="5">5 sao</option>
                  <option value="4.5">4.5 sao trở lên</option>
                  <option value="4">4 sao trở lên</option>
                  <option value="3">3 sao trở lên</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Right Content: Products and Services */}
          <div className="lg:w-3/4  rounded-2xl shadow-lg p-4">
            {/* Featured Products */}
            {productsDb.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold bg-white/70 w-fit px-4 shadow-lg rounded-lg text-pink-600">
                    🌟 Sản Phẩm Nổi Bật
                  </h2>
                  <span className="text-gray-600 bg-white/70 px-4 py-2 rounded-lg text-base">
                    Đã tìm thấy{" "}
                    <span className="font-bold text-red-500 border border-red-500 rounded-full py-1 px-2">
                      {filteredProducts.length}
                    </span>{" "}
                    sản phẩm
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-white/70 rounded-xl p-4 lg:grid-cols-4 gap-6 items-stretch">
                  <AnimatePresence>
                    {currentProducts.map((product) => (
                      <Link to={`/products/${product._id}`}>
                        <motion.div
                          key={product._id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover={{
                            scale: 1.04,
                            boxShadow: "0 8px 32px 0 rgba(255, 0, 128, 0.15)",
                          }}
                          className="relative bg-white/95 rounded-3xl shadow-lg hover:shadow-pink-300 transition-all duration-300 h-full flex flex-col border border-transparent hover:border-pink-400 group overflow-hidden"
                        >
                          {/* Badge nổi bật */}
                          {product.is_featured && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg animate-bounce">
                              Nổi Bật
                            </div>
                          )}
                          {/* Badge giảm giá */}
                          {product.original_price && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
                              -
                              {Math.round(
                                100 -
                                  (product.price / product.original_price) * 100
                              )}
                              %
                            </div>
                          )}
                          {/* Ảnh sản phẩm */}
                          <div className="overflow-hidden rounded-2xl mb-1 relative">
                            <img
                              src={
                                (product.images && product.images[0]) ||
                                "/assets/default-product.png"
                              }
                              alt={product.name}
                              className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-110 group-hover:opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-pink-100/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                          </div>
                          {/* Nội dung */}
                          <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-semibold">
                                {product.brand}
                              </span>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={16}
                                    color={
                                      star <= Math.round(product.rating)
                                        ? "#fbbf24"
                                        : "#e5e7eb"
                                    }
                                    fill={
                                      star <= Math.round(product.rating)
                                        ? "#fbbf24"
                                        : "none"
                                    }
                                    strokeWidth={1}
                                    className="transition-transform group-hover:scale-110"
                                  />
                                ))}
                                <span className="ml-1 text-xs text-gray-500">
                                  {product.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:underline group-hover:text-pink-600 transition">
                              {product.name}
                            </h3>
                            <p className="text-gray-400 text-xs mb-1 line-clamp-1 flex items-center gap-1">
                              {product.description}
                            </p>
                            <div className="mt-auto flex flex-col gap-2">
                              <div>
                                <span className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent animate-pulse">
                                  {product.price?.toLocaleString()}₫
                                </span>
                                {product.original_price && (
                                  <span className="text-xs text-gray-400 line-through ml-2">
                                    {product.original_price?.toLocaleString()}₫
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => addToCart(product)}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold py-2 rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-pink-300"
                              >
                                <ShoppingCart size={20} />
                                Thêm vào giỏ
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </AnimatePresence>
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-pink-200 text-pink-700 disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === idx + 1
                            ? "bg-pink-500 text-white"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-pink-200 text-pink-700 disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Best Sellers */}
            {groupedProducts["best-seller"].length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold bg-white/70 w-fit mx-auto px-4 shadow-lg rounded-lg text-pink-600 mb-3">
                  🔥 Sản Phẩm Bán Chạy
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-white/70 rounded-xl p-4 lg:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {groupedProducts["best-seller"].map((product) => (
                      <Link to={`/products/${product.id}`}>
                        <motion.div
                          key={product.id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                            Best Seller
                          </div>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-2xl"
                          />
                          <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-xs mb-4">
                              {product.description}
                            </p>
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={16}
                                  color={
                                    star <= Math.round(product.rating)
                                      ? "#fbbf24"
                                      : "#e5e7eb"
                                  }
                                  fill={
                                    star <= Math.round(product.rating)
                                      ? "#fbbf24"
                                      : "none"
                                  }
                                  strokeWidth={1}
                                />
                              ))}
                              <span className="ml-2 text-xs text-gray-500">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                            <div className=" justify-between items-center">
                              <div>
                                <span className="text-xl font-bold text-pink-600">
                                  ${product.price.toFixed(2)}
                                </span>
                                {product.original_price && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${product.original_price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => addToCart(product)}
                                className="flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-full hover:bg-pink-200 transition"
                              >
                                <ShoppingCart size={16} />
                                Thêm vào giỏ
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}
            {/* Promotional Banner */}
            <section className="my-8">
              <div className="bg-blue-100 rounded-2xl p-6 text-center">
                <h3 className="text-xl font-bold text-blue-600">
                  Tư Vấn Chọn Sản Phẩm Phù Hợp Cho Mẹ & Bé
                </h3>
                <p className="text-gray-600 mt-2">
                  Bạn băn khoăn không biết nên chọn sản phẩm nào? Hãy để chuyên
                  gia của chúng tôi giúp bạn tìm ra sản phẩm an toàn, chất lượng
                  và phù hợp nhất với nhu cầu của mẹ & bé.
                </p>
                <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
                  Tư Vấn Sản Phẩm Ngay
                </button>
              </div>
            </section>
            {/* New Arrivals */}
            {groupedProducts.new.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold bg-white/70 w-fit mx-auto px-4 shadow-lg rounded-lg text-pink-600 mb-3">
                  🆕 Sản Phẩm Mới Ra Mắt
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-white/70 rounded-xl p-4 lg:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {groupedProducts.new.map((product) => (
                      <Link to={`/products/${product.id}`}>
                        <motion.div
                          key={product.id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                            New
                          </div>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-2xl"
                          />
                          <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                              {product.description}
                            </p>
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={16}
                                  color={
                                    star <= Math.round(product.rating)
                                      ? "#fbbf24"
                                      : "#e5e7eb"
                                  }
                                  fill={
                                    star <= Math.round(product.rating)
                                      ? "#fbbf24"
                                      : "none"
                                  }
                                  strokeWidth={1}
                                />
                              ))}
                              <span className="ml-2 text-xs text-gray-500">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                            <div className=" justify-between items-center">
                              <div>
                                <span className="text-xl font-bold text-pink-600">
                                  ${product.price.toFixed(2)}
                                </span>
                                {product.original_price && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${product.original_price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => addToCart(product)}
                                className="flex items-center mx-auto gap-2 bg-pink-100 text-pink-600  p-1 px-4 rounded-full hover:bg-pink-200 transition"
                              >
                                <ShoppingCart size={16} />
                                Thêm vào giỏ
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;
