import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { message } from "antd";
import axios from "axios";

const categories = [
  { key: "all", label: "Tất Cả" },
  { key: "milk-food", label: "Sữa & Thực phẩm" },
  { key: "diaper", label: "Tã bỉm" },
  { key: "feeding", label: "Đồ dùng ăn uống" },
  { key: "maternity-clothes", label: "Quần áo bầu" },
  { key: "toy", label: "Đồ chơi" },
  { key: "other", label: "Khác" },
];

const products = [
  {
    id: 1,
    name: "Sữa bột Dielac Mama",
    price: 299000,
    originalPrice: 350000,
    category: "milk-food",
    brand: "Vinamilk",
    image: "./assets/banner1.jpg",
    description: "Sữa bột cho mẹ bầu bổ sung DHA, vitamin, khoáng chất.",
    section: "featured",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Tã dán Huggies size NB",
    price: 145000,
    category: "diaper",
    brand: "Huggies",
    image: "./assets/banner1.jpg",
    description: "Tã dán siêu mềm mại, thấm hút tốt cho bé sơ sinh.",
    section: "featured",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Bình sữa Comotomo 250ml",
    price: 320000,
    category: "feeding",
    brand: "Comotomo",
    image: "./assets/banner1.jpg",
    description: "Bình sữa silicon mềm, chống đầy hơi cho bé.",
    section: "best-seller",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Đồ chơi xúc xắc cho bé",
    price: 99000,
    category: "toy",
    brand: "Fisher Price",
    image: "./assets/banner1.jpg",
    description: "Đồ chơi phát triển giác quan cho trẻ sơ sinh.",
    section: "best-seller",
    rating: 4.2,
  },
  {
    id: 5,
    name: "Đầm bầu cotton thoáng mát",
    price: 250000,
    category: "maternity-clothes",
    brand: "MumCare",
    image: "./assets/banner1.jpg",
    description: "Đầm bầu chất liệu cotton, co giãn, thoáng mát.",
    section: "new",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Bột ăn dặm Heinz vị gạo sữa",
    price: 85000,
    category: "milk-food",
    brand: "Heinz",
    image: "./assets/banner1.jpg",
    description: "Bột ăn dặm bổ sung dinh dưỡng cho bé từ 6 tháng.",
    section: "new",
    rating: 4.4,
  },
];

const Product = () => {
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    brand: "all",
    search: "",
    minRating: "",
  });
  const [productsDb, setProductsDb] = useState([]);

  const brands = [
    "all",
    "Vinamilk",
    "Huggies",
    "Comotomo",
    "Fisher Price",
    "MumCare",
    "Heinz",
  ];

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      filters.category === "all" || product.category === filters.category;
    const brandMatch =
      filters.brand === "all" || product.brand === filters.brand;
    const searchMatch =
      filters.search === "" ||
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase());
    const price = product.price;
    const min = parseFloat(filters.minPrice);
    const max = parseFloat(filters.maxPrice);
    const priceMatch =
      (filters.minPrice === "" || isNaN(min) || price >= min) &&
      (filters.maxPrice === "" || isNaN(max) || price <= max);
    const ratingMatch =
      filters.minRating === "" ||
      product.rating >= parseFloat(filters.minRating);
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
      const res = await axios.get("http://localhost:9999/api/products");
      setProductsDb(res?.data);
    } catch (error) {
      message.error(error.toString());
    }
  };

  useEffect(() => {
    getListProduct();
  }, []);

  return (
    <div className="min-h-screen text-black pt-16 bg-cover bg-center bg-[url('https://images.pexels.com/photos/3270224/pexels-photo-3270224.jpeg?auto=compress&cs=tinysrgb&w=600')] flex flex-col font-space-grotesk">
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
                    <label key={cat.key} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={cat.key}
                        checked={filters.category === cat.key}
                        onChange={() =>
                          setFilters({ ...filters, category: cat.key })
                        }
                        className="mr-2"
                      />
                      <span className="capitalize text-gray-700">
                        {cat.label}
                      </span>
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
                      {brand === "all" ? "Tất Cả" : brand}
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
                <h2 className="text-2xl font-bold bg-white/70 w-fit mx-auto px-4 shadow-lg rounded-lg text-pink-600 mb-3">
                  🌟 Sản Phẩm Nổi Bật
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-white/70 rounded-xl p-4 lg:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {productsDb.map((product) => (
                      <Link to={`/products/${product._id}`}>
                        <motion.div
                          key={product._id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="relative bg-white/80 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <div className="absolute top-0 left-0 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                            Nổi Bật
                          </div>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-2xl"
                          />
                          <div className="p-5">
                            <h3 className="text-lg font-medium text-gray-800">
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
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${product.originalPrice.toFixed(2)}
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
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${product.originalPrice.toFixed(2)}
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
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${product.originalPrice.toFixed(2)}
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
