import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, ShoppingCart, Tag, Send } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  FaRegThumbsUp,
  FaRegHeart,
  FaRegLaughSquint,
  FaRegSurprise,
  FaRegSadTear,
  FaRegAngry,
  FaHeart,
} from "react-icons/fa";
import { Shop } from "@mui/icons-material";
import axios from "axios";
import { message, Spin, Tooltip } from "antd";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { UploadOutlined, CheckCircleFilled } from "@ant-design/icons";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

// Thêm các icon cảm xúc
const EMOJIS = [
  {
    key: "like",
    icon: <FaRegThumbsUp className="text-blue-500" />,
    label: "Thích",
  },
  {
    key: "love",
    icon: <FaRegHeart className="text-red-500" />,
    label: "Yêu thích",
  },
  {
    key: "haha",
    icon: <FaRegLaughSquint className="text-yellow-400" />,
    label: "Haha",
  },
  {
    key: "wow",
    icon: <FaRegSurprise className="text-purple-400" />,
    label: "Wow",
  },
  {
    key: "sad",
    icon: <FaRegSadTear className="text-blue-300" />,
    label: "Buồn",
  },
  {
    key: "angry",
    icon: <FaRegAngry className="text-orange-500" />,
    label: "Phẫn nộ",
  },
];

const BACKEND_URL = "https://momsbest-be.onrender.com";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImg, setSelectedImg] = useState(0);
  const [cartMsg, setCartMsg] = useState("");
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [product, setProduct] = useState();
  const [reviews, setReviews] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const { user, token } = useAuth();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedPage, setRelatedPage] = useState(1);
  const RELATED_PER_PAGE = 4;
  const [featuredPage, setFeaturedPage] = useState(1);
  const FEATURED_PER_PAGE = 4;
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  const [filter, setFilter] = useState("Tất cả");
  const [reviewImage, setReviewImage] = useState(null);
  const [reviewImageUrl, setReviewImageUrl] = useState(null);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReview, setEditReview] = useState({
    comment: "",
    rating: 0,
    image: null,
    imageUrl: "",
    oldImage: "",
  });

  const [openMenuId, setOpenMenuId] = useState(null);

  // State cho edit reply
  const [editingReply, setEditingReply] = useState({
    reviewId: null,
    replyId: null,
    comment: "",
  });
  const [openReplyMenu, setOpenReplyMenu] = useState(null);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setCartMsg("Đã thêm vào giỏ hàng!");
    setTimeout(() => setCartMsg(""), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewImage(file);
      setReviewImageUrl(URL.createObjectURL(file));
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return message.error("Hãy đăng nhập");
    if (review.rating && review.comment) {
      const data = new FormData();
      data.append("rating", review.rating);
      data.append("comment", review.comment);
      data.append("product_id", productId);
      if (reviewImage) data.append("image", reviewImage);
      try {
        await axios.post(
          "https://momsbest-be.onrender.com/api/productReviews/createReview",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success("Cảm ơn bạn đã đánh giá!");
        getListReview();
        setReview({ rating: 0, comment: "" });
        setReviewImage(null);
        setReviewImageUrl(null);
      } catch (err) {
        message.error("Gửi đánh giá thất bại!");
      }
    }
  };

  // Thả cảm xúc cho bình luận (chỉ 1 lần, 1 cảm xúc, nếu chọn lại sẽ thay thế)
  const handleReact = async (reviewId, emojiKey) => {
    try {
      await axios.post(
        `https://momsbest-be.onrender.com/api/productReviews/${reviewId}/like`,
        { reaction_type: emojiKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getListReview();
    } catch (err) {
      message.error("Bày tỏ cảm xúc thất bại!");
    }
  };

  // Trả lời bình luận
  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;
    try {
      await axios.post(
        `https://momsbest-be.onrender.com/api/productReviews/${reviewId}/replies`,
        { comment: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText("");
      setReplyingId(null);
      getListReview();
    } catch (err) {
      message.error("Gửi trả lời thất bại!");
    }
  };

  // Lấy sản phẩm nổi bật (mới nhất)
  const getFeaturedProducts = async () => {
    setLoadingFeatured(true);
    try {
      const res = await axios.get(
        `https://momsbest-be.onrender.com/api/products?is_featured=true&sort=-createdAt`
      );
      setFeaturedProducts(res?.data || []);
    } catch (error) {
      message.error(error.toString());
    }
    setLoadingFeatured(false);
  };

  // Lấy sản phẩm liên quan nâng cao
  const getRelatedProducts = async (categoryId, currentProductId, brand) => {
    setLoadingRelated(true);
    try {
      let res = await axios.get(
        `https://momsbest-be.onrender.com/api/products?category_id=${encodeURIComponent(
          categoryId
        )}`
      );
      let related = (res?.data || []).filter((p) => p._id !== currentProductId);

      // Nếu ít hơn 4, lấy thêm cùng brand
      if (related.length < 4 && brand) {
        const resBrand = await axios.get(
          `https://momsbest-be.onrender.com/api/products?brand=${encodeURIComponent(
            brand
          )}`
        );
        const more = (resBrand?.data || []).filter(
          (p) =>
            p._id !== currentProductId && !related.some((r) => r._id === p._id)
        );
        related = [...related, ...more];
      }

      // Nếu vẫn chưa đủ, lấy thêm sản phẩm bất kỳ
      if (related.length < 4) {
        const resAll = await axios.get(
          `https://momsbest-be.onrender.com/api/products`
        );
        const more = (resAll?.data || []).filter(
          (p) =>
            p._id !== currentProductId && !related.some((r) => r._id === p._id)
        );
        related = [...related, ...more];
      }

      setRelatedProducts(related.slice(0, 20)); // Giới hạn tối đa 20 sản phẩm liên quan
    } catch (error) {
      message.error(error.toString());
    }
    setLoadingRelated(false);
  };

  const getProduct = async () => {
    try {
      const res = await axios.get(
        `https://momsbest-be.onrender.com/api/products/${productId}`
      );
      setProduct(res?.data);
    } catch (error) {
      message.error(error.toString());
    }
  };

  const getListReview = async () => {
    try {
      const res = await axios.get(
        `https://momsbest-be.onrender.com/api/productReviews/getListReviewByProduct/${productId}`
      );
      setReviews(res?.data.reviews || []);
    } catch (error) {
      message.error(error.toString());
    }
  };

  // Phân trang sản phẩm liên quan
  const totalRelatedPages = Math.ceil(
    relatedProducts.length / RELATED_PER_PAGE
  );
  const paginatedRelated = relatedProducts.slice(
    (relatedPage - 1) * RELATED_PER_PAGE,
    relatedPage * RELATED_PER_PAGE
  );

  // Phân trang sản phẩm nổi bật
  const totalFeaturedPages = Math.ceil(
    featuredProducts.length / FEATURED_PER_PAGE
  );
  const paginatedFeatured = featuredProducts.slice(
    (featuredPage - 1) * FEATURED_PER_PAGE,
    featuredPage * FEATURED_PER_PAGE
  );

  // Tổng hợp filter
  const filteredReviews = reviews.filter((rv) => {
    if (filter === "Tất cả") return true;
    if (filter === "Có ảnh") return rv.image;
    if (/^\d sao$/.test(filter)) return rv.rating === Number(filter[0]);
    return true;
  });

  const handleEditClick = (rv) => {
    setEditingReviewId(rv._id);
    setEditReview({
      comment: rv.comment,
      rating: rv.rating,
      image: null,
      imageUrl: rv.image
        ? rv.image.startsWith("/uploads")
          ? `${BACKEND_URL}${rv.image}`
          : rv.image
        : "",
      oldImage: rv.image,
    });
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditReview((prev) => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleEditSubmit = async (reviewId) => {
    if (!editReview.comment || !editReview.rating) {
      message.error("Vui lòng nhập nội dung và chọn số sao!");
      return;
    }
    try {
      const data = new FormData();
      data.append("comment", editReview.comment);
      data.append("rating", editReview.rating);
      if (editReview.image) data.append("image", editReview.image);
      await axios.put(
        `https://momsbest-be.onrender.com/api/productReviews/${reviewId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Đã cập nhật đánh giá!");
      setEditingReviewId(null);
      getListReview();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        message.error("Lỗi: " + err.response.data.error);
      } else {
        message.error("Cập nhật đánh giá thất bại!");
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `https://momsbest-be.onrender.com/api/productReviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Đã xóa đánh giá!");
      getListReview();
    } catch (err) {
      message.error("Xóa đánh giá thất bại!");
    }
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".review-menu-dropdown")) setOpenMenuId(null);
    };
    if (openMenuId) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuId]);

  useEffect(() => {
    getFeaturedProducts();
  }, []);

  useEffect(() => {
    if (productId) getProduct();
  }, [productId]);

  useEffect(() => {
    if (product) {
      getListReview();
      if (product.category_id) {
        getRelatedProducts(product.category_id, product._id, product.brand);
      }
    }
  }, [product]);

  useEffect(() => {
    setRelatedPage(1);
  }, [relatedProducts]);

  useEffect(() => {
    setFeaturedPage(1);
  }, [featuredProducts]);

  const handleEditReply = (reviewId, reply) => {
    setEditingReply({ reviewId, replyId: reply._id, comment: reply.comment });
  };

  const handleEditReplySubmit = async () => {
    try {
      await axios.put(
        `https://momsbest-be.onrender.com/api/productReviews/${editingReply.reviewId}/replies/${editingReply.replyId}`,
        { comment: editingReply.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingReply({ reviewId: null, replyId: null, comment: "" });
      getListReview();
    } catch (err) {
      message.error("Sửa trả lời thất bại!");
    }
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa trả lời này?")) return;
    try {
      await axios.delete(
        `https://momsbest-be.onrender.com/api/productReviews/${reviewId}/replies/${replyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getListReview();
    } catch (err) {
      message.error("Xóa trả lời thất bại!");
    }
  };

  // Kiểm tra trạng thái yêu thích khi vào trang
  useEffect(() => {
    if (user && productId) {
      axios
        .get(`${BACKEND_URL}/api/favorite/isFavorite/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setIsFavorite(res.data.isFavorite))
        .catch(() => setIsFavorite(false));
    }
  }, [user, productId]);

  // Xử lý lưu/bỏ yêu thích
  const handleToggleFavorite = async () => {
    if (!user)
      return message.error("Bạn cần đăng nhập để lưu sản phẩm yêu thích!");
    try {
      if (isFavorite) {
        await axios.post(
          `${BACKEND_URL}/api/favorite/remove`,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(false);
        message.success("Đã bỏ khỏi danh sách yêu thích!");
      } else {
        await axios.post(
          `${BACKEND_URL}/api/favorite/add`,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
        message.success("Đã thêm vào danh sách yêu thích!");
      }
    } catch (err) {
      message.error("Có lỗi khi cập nhật yêu thích!");
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-pink-50 to-blue-50 text-black py-8 font-space-grotesk">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Hình ảnh sản phẩm */}
        <div className="md:w-1/2 flex flex-col items-center">
          <motion.div className="relative" whileHover={{ scale: 1.04 }}>
            <motion.img
              src={product?.images[selectedImg]}
              alt={product?.name}
              className="w-80 h-80 object-cover rounded-3xl border-4 border-pink-200 shadow-2xl mb-4 transition-all duration-300 hover:scale-105 hover:shadow-pink-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />
            {product?.originalPrice && (
              <motion.span
                className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce flex items-center gap-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Tag size={14} /> Giảm{" "}
                {Math.round(
                  100 - (product?.price / product?.originalPrice) * 100
                )}
                %
              </motion.span>
            )}
          </motion.div>
          <div className="flex gap-2 mt-2">
            {product?.images.map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                alt="thumb"
                className={`w-16 h-16 object-cover rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-sm hover:scale-110 hover:border-pink-400 ${
                  selectedImg === idx
                    ? "border-pink-500 ring-2 ring-pink-300"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedImg(idx)}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
        </div>
        {/* Thông tin sản phẩm */}
        <motion.div
          className="md:w-1/2 bg-white/80 md:mr-32 rounded-3xl shadow-2xl p-8 flex flex-col justify-between min-h-[420px] backdrop-blur-md"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-3xl  font-extrabold text-pink-600 mb-2 flex items-center gap-2">
              {product?.name}
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {product?.is_featured && (
                  <Tag size={22} className="text-yellow-400" />
                )}
              </motion.span>
            </p>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-pink-600">
                {product?.price?.toLocaleString()}đ
              </span>
              {product?.original_price && (
                <span className="text-base text-gray-400 line-through">
                  {product?.original_price?.toLocaleString()}đ
                </span>
              )}
              {product?.original_price && (
                <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-1 rounded-full ml-2">
                  -
                  {Math.round(
                    100 - (product?.price / product?.original_price) * 100
                  )}
                  %
                </span>
              )}
            </div>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={22}
                  color={
                    star <= Math.round(product?.rating) ? "#fbbf24" : "#e5e7eb"
                  }
                  fill={
                    star <= Math.round(product?.rating) ? "#fbbf24" : "none"
                  }
                  strokeWidth={1}
                />
              ))}
              <span className="ml-2 text-base text-gray-500 font-semibold">
                {product?.rating?.toFixed(1)} ({product?.review_count} đánh giá)
              </span>
            </div>

            <div className="mb-2 text-gray-700 font-medium">
              {product?.description}
            </div>
            <div className="mb-2 text-gray-500 text-sm">{product?.detail}</div>
            <div className="mb-2 text-gray-500 text-sm flex justify-between">
              <span>
                Thương hiệu: <b>{product?.brand}</b>
              </span>
              <span>
                Danh mục: <b>{product?.category_id}</b>
              </span>
              <span>
                Kho:{" "}
                <b
                  className={product?.stock_quantity < 10 ? "text-red-500" : ""}
                >
                  {product?.stock_quantity > 0
                    ? `${product?.stock_quantity} sản phẩm`
                    : "Hết hàng"}
                </b>
              </span>
            </div>
            <div className="my-3 border-t border-dashed border-gray-400 pt-3 text-black text-base">
              <span>{product?.detail_description}</span>
            </div>
          </div>
          <div className="flex border-t border-dashed border-gray-400 pt-3 items-center gap-4 mt-6 flex-wrap">
            <div className="flex items-center border-2 border-pink-200 rounded-full px-2 bg-white shadow-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2  text-lg text-pink-600 font-bold hover:bg-pink-50 rounded-full transition-all duration-200 active:scale-90"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-12 text-center border-none bg-transparent text-lg font-bold focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 py-1 text-lg text-pink-600 font-bold hover:bg-pink-50 rounded-full transition-all duration-200 active:scale-90"
              >
                +
              </button>
            </div>
            <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleFavorite}
                className={`flex items-center gap-2 px-2 py-2 rounded-full font-bold text-lg shadow transition border-2 ${
                  isFavorite
                    ? "bg-pink-100 border-pink-500 text-pink-600"
                    : "bg-white border-pink-200 text-pink-400 hover:bg-pink-50"
                }`}
                aria-label="Yêu thích"
              >
                {isFavorite ? (
                  <FaHeart size={22} className="text-pink-500 animate-pulse" />
                ) : (
                  <FaRegHeart size={22} />
                )}
              </motion.button>
            </Tooltip>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-5 py-2 rounded-full hover:opacity-90 active:scale-95 font-semibold text-base shadow-lg shadow-rose-400/30 transition-all duration-300"
            >
              <ShoppingCart size={22} /> Thêm vào giỏ
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
              className="bg-blue-500 flex items-center gap-2 text-white px-5 py-2 rounded-full font-bold text-base hover:bg-blue-600 shadow-lg transition active:scale-95"
            >
              <Shop size={20} /> Mua ngay
            </motion.button>
          </div>
          {cartMsg && (
            <motion.div
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg animate-fadeIn flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ShoppingCart size={20} className="animate-bounce" /> {cartMsg}
            </motion.div>
          )}
        </motion.div>
      </div>
      {/* Đánh giá sản phẩm */}
      <div className="container mx-auto px-4 mt-10 md:w-2/3">
        {/* Tổng quan đánh giá */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 bg-white/70 rounded-xl p-4 shadow">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-4xl font-bold text-pink-600">
              {product?.rating?.toFixed(1) || 0}
            </span>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  color={
                    star <= Math.round(product?.rating) ? "#fbbf24" : "#e5e7eb"
                  }
                  fill={
                    star <= Math.round(product?.rating) ? "#fbbf24" : "none"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {reviews.length} đánh giá
            </span>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm">{star} sao</span>
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div
                    className="bg-pink-400 h-2 rounded"
                    style={{
                      width: `${
                        (reviews.filter((r) => r.rating === star).length /
                          reviews.length) *
                          100 || 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {reviews.filter((r) => r.rating === star).length}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Bộ lọc đánh giá */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            "Tất cả",
            "5 sao",
            "4 sao",
            "3 sao",
            "2 sao",
            "1 sao",
            "Có ảnh",
          ].map((f) => (
            <button
              key={f}
              className={`px-3 py-1 rounded-full border transition font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                filter === f
                  ? "bg-pink-500 text-white border-pink-500 shadow-md"
                  : "bg-white text-pink-600 border-pink-200 hover:bg-pink-50"
              }`}
              onClick={() => setFilter(f)}
              tabIndex={0}
            >
              {f}
            </button>
          ))}
        </div>
        {/* Form gửi đánh giá */}
        <form
          onSubmit={handleReview}
          className="mb-6 bg-white/90 p-6 rounded-2xl shadow-xl flex flex-col gap-3 border border-pink-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Bạn`}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-pink-200 shadow-lg"
            />
            <span className="font-semibold text-pink-600 text-lg">Bạn</span>
          </div>

          {/* Textarea đánh giá */}
          <div className="mb-2">
            <textarea
              className="w-full p-3 rounded-xl bg-gray-200 text-gray-700 focus:ring-2 focus:ring-pink-300 transition-all duration-200 shadow-sm focus:border-pink-400 resize-none min-h-[60px] text-base"
              placeholder="Viết đánh giá của bạn... (ít nhất 5 ký tự)"
              value={review.comment}
              minLength={5}
              onChange={(e) =>
                setReview((r) => ({ ...r, comment: e.target.value }))
              }
              required
            />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Tooltip key={star} title={`${star} sao`}>
                  <motion.button
                    type="button"
                    onClick={() => setReview((r) => ({ ...r, rating: star }))}
                    whileTap={{ scale: 0.85 }}
                    className="focus:outline-none"
                    aria-label={`Chọn ${star} sao`}
                  >
                    <Star
                      size={22}
                      color={star <= review.rating ? "#fbbf24" : "#e5e7eb"}
                      fill={star <= review.rating ? "#fbbf24" : "none"}
                      strokeWidth={1}
                      className={star <= review.rating ? "animate-pulse" : ""}
                    />
                  </motion.button>
                </Tooltip>
              ))}
              <span className="ml-2 text-base text-gray-500">
                {review.rating ? `${review.rating} sao` : ""}
              </span>
            </div>
          </div>

          {/* Khu vực upload ảnh và preview */}
          <div className="flex items-center gap-3 mb-2 bg-white/80 border border-pink-100 rounded-xl px-3 py-2 shadow-sm">
            <label
              className="p-2  flex items-center justify-center bg-white border border-pink-200 rounded-xl shadow-sm cursor-pointer text-pink-600 hover:bg-pink-50 transition text-lg"
              title="Thêm ảnh"
              tabIndex={0}
            >
              <UploadOutlined size={22} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {reviewImageUrl && (
              <div className="relative">
                <a
                  href={reviewImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={reviewImageUrl}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded-xl border-2 border-pink-400 shadow bg-white hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/64x64?text=No+Image";
                    }}
                  />
                </a>
                <button
                  type="button"
                  className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-pink-300 rounded-full flex items-center justify-center text-pink-500 hover:bg-pink-100 hover:text-pink-700 transition p-0 z-20 shadow"
                  onClick={() => {
                    setReviewImage(null);
                    setReviewImageUrl(null);
                  }}
                  aria-label="Xóa ảnh"
                >
                  <AiOutlineClose size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-4 py-1 rounded-xl hover:bg-pink-600 font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg text-base disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!review.rating || review.comment.length < 10}
            >
              <Send size={20} /> Gửi đánh giá
            </motion.button>
          </div>
        </form>
        {/* Danh sách đánh giá */}
        <div className="space-y-6">
          {filteredReviews.length === 0 && <div>Chưa có đánh giá nào.</div>}
          {filteredReviews
            .filter((rv) => rv.user !== "Bạn")
            .slice(0, visibleReviews)
            .map((rv) => (
              <motion.div
                key={rv._id}
                className="bg-white/95 p-6 rounded-2xl shadow-xl flex items-start gap-4 mb-2 hover:shadow-pink-200 border border-pink-100 transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    rv.user
                  )}`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 shadow-lg"
                />
                <div className="flex flex-col justify-start min-w-0 w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-pink-600 text-lg  items-center gap-1">
                        {rv.user}
                        {rv.purchased && (
                          <Tooltip title="Đã mua hàng">
                            <CheckCircleFilled className="text-green-500 ml-1" />
                          </Tooltip>
                        )}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap mt-1 md:mt-0">
                        {rv.time}
                      </span>
                      {/* Dropdown menu cho Sửa/Xóa */}
                    </div>
                  </div>
                  <div className="mb-1">
                    {editingReviewId === rv._id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleEditSubmit(rv._id);
                        }}
                        className="mb-2 flex flex-col gap-2"
                      >
                        <textarea
                          className="w-full p-2 border rounded text-black"
                          value={editReview.comment}
                          onChange={(e) =>
                            setEditReview((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }))
                          }
                          required
                          minLength={5}
                        />

                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 cursor-pointer text-pink-600 hover:text-pink-800">
                            <UploadOutlined />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageChange}
                              className="hidden"
                            />
                          </label>
                          {editReview.imageUrl && (
                            <div className="relative">
                              <img
                                src={editReview.imageUrl}
                                alt="preview"
                                className="w-16 h-16 object-cover rounded-lg border-2 border-pink-200 shadow"
                              />
                              <button
                                type="button"
                                className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-pink-300 rounded-full flex items-center justify-center text-pink-500 hover:bg-pink-100 hover:text-pink-700 transition p-0 z-20 shadow"
                                onClick={() =>
                                  setEditReview((prev) => ({
                                    ...prev,
                                    image: null,
                                    imageUrl: "",
                                  }))
                                }
                                aria-label="Xóa ảnh"
                              >
                                <AiOutlineClose size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() =>
                                setEditReview((prev) => ({
                                  ...prev,
                                  rating: star,
                                }))
                              }
                              className={`focus:outline-none transition ${
                                star <= editReview.rating
                                  ? "text-yellow-400 scale-110"
                                  : "text-gray-300"
                              }`}
                              style={{ fontSize: 26 }}
                            >
                              <Star
                                size={26}
                                color={
                                  star <= editReview.rating
                                    ? "#fbbf24"
                                    : "#e5e7eb"
                                }
                                fill={
                                  star <= editReview.rating ? "#fbbf24" : "none"
                                }
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-base text-gray-500">
                            {editReview.rating
                              ? `${editReview.rating} sao`
                              : "Chọn số sao"}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            type="submit"
                            className="bg-pink-500 text-white px-3 py-1 rounded font-semibold"
                          >
                            Lưu
                          </button>
                          <button
                            type="button"
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded font-semibold"
                            onClick={() => setEditingReviewId(null)}
                          >
                            Hủy
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <span className="text-gray-700 flex items-center justify-between mb-1 text-base">
                          <p className="text-base border w-full text-start p-3 rounded-xl">
                            {rv.comment}
                          </p>
                          <p>
                            {user &&
                              rv.user_id === user._id &&
                              editingReviewId !== rv._id && (
                                <div className="relative review-menu-dropdown">
                                  <button
                                    className="ml-2 text-gray-500 hover:text-pink-500 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(
                                        openMenuId === rv._id ? null : rv._id
                                      );
                                    }}
                                    aria-label="Mở menu"
                                    type="button"
                                  >
                                    <FiMoreHorizontal size={22} />
                                  </button>
                                  {openMenuId === rv._id && (
                                    <div className="absolute right-0 z-20 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg py-1 animate-fadeIn review-menu-dropdown">
                                      <button
                                        className="w-full text-left px-4 py-2 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-800 font-semibold rounded-t-xl transition"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenMenuId(null);
                                          handleEditClick(rv);
                                        }}
                                        type="button"
                                      >
                                        Sửa
                                      </button>
                                      <button
                                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-700 font-semibold rounded-b-xl transition"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenMenuId(null);
                                          if (
                                            window.confirm(
                                              "Bạn chắc chắn muốn xóa đánh giá này?"
                                            )
                                          ) {
                                            handleDeleteReview(rv._id);
                                          }
                                        }}
                                        type="button"
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                          </p>
                        </span>
                        {rv.image && (
                          <a
                            href={
                              rv.image.startsWith("/uploads")
                                ? `https://momsbest-be.onrender.com${rv.image}`
                                : rv.image
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={
                                rv.image.startsWith("/uploads")
                                  ? `https://momsbest-be.onrender.com${rv.image}`
                                  : rv.image
                              }
                              alt="review-img"
                              className="w-32 h-32 object-cover rounded-xl border-2 border-pink-200 mb-2 shadow-lg hover:scale-105 transition-transform bg-white"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/120x120?text=No+Image";
                              }}
                            />
                          </a>
                        )}
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              color={star <= rv.rating ? "#fbbf24" : "#e5e7eb"}
                              fill={star <= rv.rating ? "#fbbf24" : "none"}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Cảm xúc tổng hợp */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {EMOJIS.map((em) => (
                      <Tooltip title={em.label} key={em.key} placement="top">
                        <motion.button
                          type="button"
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-base transition-all duration-200 border shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            rv.userReaction === em.key
                              ? "bg-pink-200 scale-105 shadow-pink-200 border-pink-400"
                              : "bg-gray-100 hover:bg-pink-100 hover:scale-105 border-gray-200"
                          }`}
                          onClick={() => handleReact(rv._id, em.key)}
                          disabled={rv.userReaction === em.key}
                          whileTap={{ scale: 0.9 }}
                          aria-label={em.label}
                        >
                          {em.icon}
                          <span className="text-xs font-semibold">
                            {rv.reactions?.[em.key] > 0
                              ? rv.reactions[em.key]
                              : ""}
                          </span>
                        </motion.button>
                      </Tooltip>
                    ))}
                    <Tooltip title="Trả lời">
                      <motion.button
                        type="button"
                        className="ml-2 text-blue-500 text-xs font-semibold hover:underline focus:outline-none"
                        onClick={() =>
                          setReplyingId(replyingId === rv._id ? null : rv._id)
                        }
                        whileTap={{ scale: 0.9 }}
                      >
                        Trả lời
                      </motion.button>
                    </Tooltip>
                  </div>
                  {/* Form trả lời và danh sách reply giữ nguyên */}
                  {replyingId === rv._id && (
                    <motion.div
                      className="mt-2 flex gap-2 items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <input
                        type="text"
                        className="flex-1 bg-gray-100 border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-pink-300 transition-all duration-200 shadow-sm"
                        placeholder="Nhập trả lời..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                        minLength={2}
                      />
                      <motion.button
                        type="button"
                        className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 text-sm font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => handleReply(rv._id)}
                        whileTap={{ scale: 0.9 }}
                        disabled={replyText.trim().length < 2}
                      >
                        Gửi
                      </motion.button>
                    </motion.div>
                  )}
                  {/* Danh sách reply giữ nguyên */}
                  {rv.replies && rv.replies.length > 0 && (
                    <div className="mt-3 space-y-2 pl-4 border-l-2 border-pink-100">
                      {rv.replies.map((rep) => (
                        <motion.div
                          key={rep._id}
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          {/* Avatar bên trái */}
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                              rep.user || "user"
                            )}`}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover border border-pink-200 shadow"
                          />
                          {/* Nội dung bên phải avatar */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-pink-500 text-xs">
                                {rep.user || "Bạn"}
                              </span>
                              {user && rep.user_id === user._id && (
                                <div className="relative inline-block">
                                  <button
                                    className="text-gray-500 hover:text-pink-500 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenReplyMenu(
                                        openReplyMenu === rep._id
                                          ? null
                                          : rep._id
                                      );
                                    }}
                                  >
                                    <FiMoreHorizontal />
                                  </button>
                                  {openReplyMenu === rep._id && (
                                    <div className="absolute right-0 z-20 mt-2 w-28 bg-white border border-gray-200 rounded-xl shadow-lg py-1 animate-fadeIn">
                                      <button
                                        className="w-full text-left px-4 py-2 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-800 font-semibold rounded-t-xl transition"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenReplyMenu(null);
                                          handleEditReply(rv._id, rep);
                                        }}
                                      >
                                        Sửa
                                      </button>
                                      <button
                                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-700 font-semibold rounded-b-xl transition"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenReplyMenu(null);
                                          handleDeleteReply(rv._id, rep._id);
                                        }}
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            {editingReply.replyId === rep._id ? (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleEditReplySubmit();
                                }}
                                className="flex flex-col gap-2 mt-1"
                              >
                                <textarea
                                  className="w-full p-2 border rounded-xl text-black bg-gray-100"
                                  value={editingReply.comment}
                                  onChange={(e) =>
                                    setEditingReply((prev) => ({
                                      ...prev,
                                      comment: e.target.value,
                                    }))
                                  }
                                  required
                                  minLength={2}
                                  rows={2}
                                />
                                <div className="flex gap-2 mt-1">
                                  <button
                                    type="submit"
                                    className="bg-pink-500 text-white px-3 py-1 rounded font-semibold text-sm"
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    type="button"
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded font-semibold text-sm"
                                    onClick={() =>
                                      setEditingReply({
                                        reviewId: null,
                                        replyId: null,
                                        comment: "",
                                      })
                                    }
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-800 mt-1 whitespace-pre-line">
                                {rep.comment}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          {filteredReviews.length > visibleReviews && (
            <div className="flex justify-center mt-4">
              <motion.button
                type="button"
                className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full font-semibold hover:bg-pink-200 transition shadow focus:outline-none focus:ring-2 focus:ring-pink-300"
                onClick={() => setVisibleReviews((v) => v + 5)}
                whileTap={{ scale: 0.95 }}
              >
                Xem thêm bình luận
              </motion.button>
            </div>
          )}
        </div>
      </div>
      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 mt-10 md:w-2/3">
          <h2 className="text-xl font-bold text-blue-600 mb-3 flex items-center gap-2">
            <Tag size={20} className="text-blue-400" /> Sản phẩm liên quan
          </h2>
          {loadingRelated ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : relatedProducts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Không có sản phẩm liên quan.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {paginatedRelated.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0 8px 32px 0 rgba(255,0,128,0.15)",
                    }}
                  >
                    <Link
                      to={`/products/${item._id}`}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col items-center p-5 group border border-pink-100"
                    >
                      <div className="w-28 h-28 flex items-center justify-center mb-3 bg-pink-50 rounded-xl overflow-hidden">
                        {item.images && item.images[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-gray-300 text-4xl">
                            <i className="fa fa-image" />
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-center text-gray-800 text-base mb-1 line-clamp-2">
                        {item.name}
                      </div>
                      {item.original_price && (
                        <div className="text-xs text-gray-400 line-through mb-0.5">
                          {item.original_price.toLocaleString()}đ
                        </div>
                      )}
                      <div className="text-pink-600 font-bold text-lg mb-1">
                        {item.price?.toLocaleString()}đ
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            color={
                              star <= Math.round(item.rating)
                                ? "#fbbf24"
                                : "#e5e7eb"
                            }
                            fill={
                              star <= Math.round(item.rating)
                                ? "#fbbf24"
                                : "none"
                            }
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-600 font-medium">
                          {item.rating?.toFixed(1)}
                          {typeof item.review_count === "number" && (
                            <span className="text-gray-400">
                              {" "}
                              ({item.review_count})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 text-center line-clamp-1">
                        {item.description}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {/* Pagination controls */}
              {totalRelatedPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <motion.button
                    className="px-4 py-2 rounded-full bg-pink-100 text-pink-600 font-semibold disabled:opacity-50 hover:bg-pink-200 transition"
                    onClick={() => setRelatedPage((p) => Math.max(1, p - 1))}
                    disabled={relatedPage === 1}
                    whileTap={{ scale: 0.95 }}
                  >
                    Trước
                  </motion.button>
                  {Array.from({ length: totalRelatedPages }, (_, i) => (
                    <motion.button
                      key={i + 1}
                      className={`px-4 py-2 rounded-full font-semibold transition ${
                        relatedPage === i + 1
                          ? "bg-pink-500 text-white"
                          : "bg-pink-50 text-pink-600 hover:bg-pink-200"
                      }`}
                      onClick={() => setRelatedPage(i + 1)}
                      whileTap={{ scale: 0.95 }}
                    >
                      {i + 1}
                    </motion.button>
                  ))}
                  <motion.button
                    className="px-4 py-2 rounded-full bg-pink-100 text-pink-600 font-semibold disabled:opacity-50 hover:bg-pink-200 transition"
                    onClick={() =>
                      setRelatedPage((p) => Math.min(totalRelatedPages, p + 1))
                    }
                    disabled={relatedPage === totalRelatedPages}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sau
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {/* Sản phẩm mới nhất và nổi bật */}
      <div className="container mx-auto px-4 mt-12 md:w-2/3">
        <h2 className="text-xl font-bold text-yellow-600 mb-3 flex items-center gap-2">
          <Star size={20} className="text-yellow-400" /> Sản phẩm nổi bật
        </h2>
        {loadingFeatured ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Không có sản phẩm nổi bật.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {paginatedFeatured.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 8px 32px 0 rgba(255,200,0,0.12)",
                  }}
                >
                  <Link
                    to={`/products/${item._id}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col items-center p-5 group border border-yellow-100"
                  >
                    <div className="w-28 h-28 flex items-center justify-center mb-3 bg-yellow-50 rounded-xl overflow-hidden">
                      {item.images && item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className="text-gray-300 text-4xl">
                          <i className="fa fa-image" />
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-center text-gray-800 text-base mb-1 line-clamp-2">
                      {item.name}
                    </div>
                    {item.original_price && (
                      <div className="text-xs text-gray-400 line-through mb-0.5">
                        {item.original_price.toLocaleString()}đ
                      </div>
                    )}
                    <div className="text-pink-600 font-bold text-lg mb-1">
                      {item.price?.toLocaleString()}đ
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          color={
                            star <= Math.round(item.rating)
                              ? "#fbbf24"
                              : "#e5e7eb"
                          }
                          fill={
                            star <= Math.round(item.rating) ? "#fbbf24" : "none"
                          }
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-600 font-medium">
                        {item.rating?.toFixed(1)}
                        {typeof item.review_count === "number" && (
                          <span className="text-gray-400">
                            {" "}
                            ({item.review_count})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 text-center line-clamp-1">
                      {item.description}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            {/* Pagination controls for featured products */}
            {totalFeaturedPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                <motion.button
                  className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold disabled:opacity-50 hover:bg-yellow-200 transition"
                  onClick={() => setFeaturedPage((p) => Math.max(1, p - 1))}
                  disabled={featuredPage === 1}
                  whileTap={{ scale: 0.95 }}
                >
                  Trước
                </motion.button>
                {Array.from({ length: totalFeaturedPages }, (_, i) => (
                  <motion.button
                    key={i + 1}
                    className={`px-4 py-2 rounded-full font-semibold transition ${
                      featuredPage === i + 1
                        ? "bg-yellow-500 text-white"
                        : "bg-yellow-50 text-yellow-700 hover:bg-yellow-200"
                    }`}
                    onClick={() => setFeaturedPage(i + 1)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i + 1}
                  </motion.button>
                ))}
                <motion.button
                  className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold disabled:opacity-50 hover:bg-yellow-200 transition"
                  onClick={() =>
                    setFeaturedPage((p) => Math.min(totalFeaturedPages, p + 1))
                  }
                  disabled={featuredPage === totalFeaturedPages}
                  whileTap={{ scale: 0.95 }}
                >
                  Sau
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
