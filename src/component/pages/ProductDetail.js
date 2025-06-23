import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, ShoppingCart, Tag, BugPlay } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  FaRegThumbsUp,
  FaRegHeart,
  FaRegLaughSquint,
  FaRegSurprise,
  FaRegSadTear,
  FaRegAngry,
  FaHeart,
  FaBuyNLarge,
} from "react-icons/fa";
import { Shop } from "@mui/icons-material";
import axios from "axios";
import { message } from "antd";
import { useAuth } from "../context/AuthContext";

// Giả lập dữ liệu sản phẩm (nên tách ra file riêng hoặc import từ Products.js nếu refactor sau)
const products = [
  {
    id: 1,
    name: "Sữa bột Dielac Mama",
    price: 299000,
    originalPrice: 350000,
    category: "milk-food",
    brand: "Vinamilk",
    images: ["/assets/banner1.jpg", "/assets/banner1.jpg"],
    description: "Sữa bột cho mẹ bầu bổ sung DHA, vitamin, khoáng chất.",
    detail:
      "Sản phẩm bổ sung DHA, vitamin, khoáng chất thiết yếu cho mẹ bầu. Xuất xứ: Việt Nam. Thương hiệu: Vinamilk. Chất liệu: Sữa bột.",
    section: "featured",
    rating: 4.5,
    reviews: [
      { user: "Lan", rating: 5, comment: "Sữa thơm ngon, dễ uống!", id: 1 },
      { user: "Mai", rating: 4, comment: "Giá hợp lý, chất lượng tốt.", id: 2 },
    ],
  },
  {
    id: 2,
    name: "Tã dán Huggies size NB",
    price: 145000,
    category: "diaper",
    brand: "Huggies",
    images: ["/assets/banner1.jpg", "/assets/banner1.jpg"],
    description: "Tã dán siêu mềm mại, thấm hút tốt cho bé sơ sinh.",
    detail:
      "Tã dán mềm mại, thấm hút vượt trội. Xuất xứ: Việt Nam. Thương hiệu: Huggies. Chất liệu: Vải không dệt.",
    section: "featured",
    rating: 4.7,
    reviews: [
      { user: "Hạnh", rating: 5, comment: "Rất mềm, bé không bị hăm!", id: 1 },
    ],
  },
  // ... các sản phẩm khác tương tự ...
];

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
  const [visibleReplies, setVisibleReplies] = useState({});
  const { user, token } = useAuth();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setCartMsg("Đã thêm vào giỏ hàng!");
    setTimeout(() => setCartMsg(""), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return message.error("Hãy đăng nhập");
    if (review.rating && review.comment) {
      const data = {
        ...review,
        product_id: productId,
      };
      const res = await axios.post(
        "https://momsbest-be.onrender.com/api/productReviews/createReview",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getListReview();
      setReview({ rating: 0, comment: "" });
    }
  };

  // Thả cảm xúc cho bình luận (chỉ 1 lần, 1 cảm xúc, nếu chọn lại sẽ thay thế)
  const handleReact = (reviewId, emojiKey) => {
    setReviews((prev) =>
      prev.map((rv) => {
        if (rv.id !== reviewId) return rv;
        const prevReaction = rv.userReaction;
        let newReactions = { ...rv.reactions };
        if (prevReaction) {
          // Giảm số lượng cảm xúc cũ
          newReactions[prevReaction] = Math.max(
            0,
            (newReactions[prevReaction] || 1) - 1
          );
        }
        // Tăng số lượng cảm xúc mới
        newReactions[emojiKey] = (newReactions[emojiKey] || 0) + 1;
        return {
          ...rv,
          reactions: newReactions,
          userReaction: emojiKey,
        };
      })
    );
  };

  // Trả lời bình luận
  const handleReply = (reviewId) => {
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((rv) =>
        rv.id === reviewId
          ? {
              ...rv,
              replies: [
                ...rv.replies,
                {
                  id: Date.now(),
                  user: "Bạn",
                  comment: replyText,
                },
              ],
            }
          : rv
      )
    );
    setReplyText("");
    setReplyingId(null);
  };

  // Sản phẩm liên quan cùng danh mục
  // const related = products.filter(
  //   (p) => p.category === product?.category && p.id !== product?.id
  // );

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
      setReviews(res?.data);
    } catch (error) {
      message.error(error.toString());
    }
  };

  useEffect(() => {
    if (productId) getProduct();
  }, [productId]);

  useEffect(() => {
    if (product) getListReview();
  }, [product]);

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-pink-50 to-blue-50 text-black py-8 font-space-grotesk">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Hình ảnh sản phẩm */}
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="relative">
            <img
              src={product?.images[0]}
              alt={product?.name}
              className="w-80 h-80 object-cover rounded-2xl border-4 border-pink-200 shadow-2xl mb-4 transition-all duration-300"
            />
            {product?.originalPrice && (
              <span className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce flex items-center gap-1">
                <Tag size={14} /> Giảm{" "}
                {Math.round(
                  100 - (product?.price / product?.originalPrice) * 100
                )}
                %
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            {product?.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 shadow-sm hover:scale-105 hover:border-pink-400 ${
                  selectedImg === idx
                    ? "border-pink-500 ring-2 ring-pink-300"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedImg(idx)}
              />
            ))}
          </div>
        </div>
        {/* Thông tin sản phẩm */}
        <div className="md:w-1/2 bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col justify-between min-h-[420px]">
          <div>
            <h1 className="text-3xl font-extrabold text-pink-600 mb-2">
              {product?.name}
            </h1>
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
                {product?.rating.toFixed(1)}
              </span>
            </div>
            <div className="mb-2 flex items-center gap-3">
              <span className="text-2xl font-bold text-pink-600 mr-2">
                {product?.price.toLocaleString()}đ
              </span>
              {product?.originalPrice && (
                <span className="text-base text-gray-400 line-through">
                  {product?.originalPrice.toLocaleString()}đ
                </span>
              )}
            </div>
            <div className="mb-2 text-gray-700 font-medium">
              {product?.description}
            </div>
            <div className="mb-2 text-gray-500 text-sm">{product?.detail}</div>
            <div className="mb-2 text-gray-500 text-sm flex gap-4">
              <span>
                Thương hiệu: <b>{product?.brand}</b>
              </span>
              {/* <span>
                Danh mục:{" "}
                <b className="capitalize">
                  {product?.category.replace(/-/g, " ")}
                </b>
              </span> */}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <div className="flex items-center border-2 border-pink-200 rounded-full px-2 bg-white shadow-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 py-1 text-lg text-pink-600 font-bold"
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
                className="w-12 text-center border-none bg-transparent text-lg font-bold focus:outline-none"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 py-1 text-lg text-pink-600 font-bold"
              >
                +
              </button>
            </div>
            <button
              onClick={() => setIsFavorite((f) => !f)}
              className={`flex items-center gap-2 px-2 py-2 rounded-full font-bold text-lg shadow transition border-2 ${
                isFavorite
                  ? "bg-pink-100 border-pink-500 text-pink-600"
                  : "bg-white border-pink-200 text-pink-400 hover:bg-pink-50"
              }`}
              title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
            >
              {isFavorite ? (
                <FaHeart size={22} className="text-pink-500" />
              ) : (
                <FaRegHeart size={22} />
              )}
            </button>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-5 py-2 rounded-full hover:opacity-90 active:scale-95 font-semibold text-base shadow-lg shadow-rose-400/30 transition-all duration-300"
            >
              <ShoppingCart size={22} /> Thêm vào giỏ
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-blue-500 flex items-center gap-2 text-white px-5 py-2 rounded-full font-bold text-base hover:bg-blue-600 shadow-lg transition"
            >
              <Shop size={20} /> Mua ngay
            </button>
          </div>
          {cartMsg && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg animate-fadeIn">
              {cartMsg}
            </div>
          )}
        </div>
      </div>
      {/* Đánh giá sản phẩm */}
      <div className="container mx-auto px-4 mt-10 md:w-2/3">
        <h2 className="text-xl font-bold text-pink-600 mb-3">
          Đánh giá sản phẩm
        </h2>
        <form
          onSubmit={handleReview}
          className="mb-6 bg-white/80 p-4 rounded-xl shadow"
        >
          <div className="flex items-center gap-2 mb-2">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Bạn`}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-pink-200"
            />
            <span className="font-semibold text-pink-600 ml-0">Bạn</span>
          </div>
          <input
            className="w-full p-2 border rounded mb-2 text-[white]"
            placeholder="Viết đánh giá của bạn..."
            value={review.comment}
            onChange={(e) =>
              setReview((r) => ({ ...r, comment: e.target.value }))
            }
            required
          />
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setReview((r) => ({ ...r, rating: star }))}
              >
                <Star
                  size={22}
                  color={star <= review.rating ? "#fbbf24" : "#e5e7eb"}
                  fill={star <= review.rating ? "#fbbf24" : "none"}
                  strokeWidth={1}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {review.rating ? `${review.rating} sao` : "Chọn số sao"}
            </span>
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 font-semibold"
            >
              Gửi đánh giá
            </button>
          </div>
        </form>
        <div className="space-y-4">
          {reviews.length === 0 && <div>Chưa có đánh giá nào.</div>}
          {reviews
            .filter((rv) => rv.user !== "Bạn")
            .slice(0, visibleReviews)
            .map((rv) => (
              <div
                key={rv.id}
                className="bg-white/80 p-4 rounded-xl shadow flex items-start gap-1 mb-2"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    rv.user
                  )}`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                />
                <div className="flex flex-col justify-start min-w-0">
                  <div className="flex flex-col justify-between w-full">
                    <span className="font-semibold text-pink-600 block">
                      {rv.user}
                    </span>
                    <span className="text-gray-700 left-5 block">
                      {rv.comment}
                    </span>
                  </div>
                  {rv.time && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {rv.time}
                    </span>
                  )}

                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        color={star <= rv.rating ? "#fbbf24" : "#e5e7eb"}
                        fill={star <= rv.rating ? "#fbbf24" : "none"}
                      />
                    ))}
                  </div>
                  {/* Cảm xúc */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {EMOJIS.map((em) => (
                      <button
                        key={em.key}
                        type="button"
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-base transition ${
                          rv.userReaction === em.key
                            ? "bg-pink-200"
                            : "bg-gray-100 hover:bg-pink-100"
                        }`}
                        onClick={() => handleReact(rv.id, em.key)}
                        disabled={rv.userReaction === em.key}
                      >
                        {em.icon}
                        <span className="text-xs font-semibold">
                          {rv.reactions?.[em.key] > 0
                            ? rv.reactions[em.key]
                            : ""}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      className="ml-2 text-blue-500 text-xs font-semibold hover:underline"
                      onClick={() =>
                        setReplyingId(replyingId === rv.id ? null : rv.id)
                      }
                    >
                      Trả lời
                    </button>
                  </div>
                  {/* Form trả lời */}
                  {replyingId === rv.id && (
                    <div className="mt-2 flex gap-2 items-center">
                      <input
                        type="text"
                        className="flex-1 border rounded px-2 py-1 text-sm"
                        placeholder="Nhập trả lời..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 text-sm font-semibold"
                        onClick={() => handleReply(rv.id)}
                      >
                        Gửi
                      </button>
                    </div>
                  )}
                  {/* Danh sách reply */}
                  {rv.replies && rv.replies.length > 0 && (
                    <div className="mt-3 space-y-2 pl-4 border-l-2 border-pink-100">
                      {rv.replies
                        .slice(0, visibleReplies[rv.id] || 2)
                        .map((rep) => (
                          <div key={rep.id} className="flex items-start gap-2">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                                rep.user
                              )}`}
                              alt="avatar"
                              className="w-8 h-8 rounded-full object-cover border border-pink-200"
                            />
                            <div>
                              <span className="font-semibold text-pink-500 text-xs">
                                {rep.user}
                              </span>
                              <span className="block text-gray-700 text-sm mt-0.5">
                                {rep.comment}
                              </span>
                            </div>
                          </div>
                        ))}
                      {rv.replies.length > (visibleReplies[rv.id] || 2) && (
                        <button
                          type="button"
                          className="text-xs text-blue-500 mt-2 hover:underline"
                          onClick={() =>
                            setVisibleReplies((prev) => ({
                              ...prev,
                              [rv.id]: (prev[rv.id] || 2) + 2,
                            }))
                          }
                        >
                          Xem thêm trả lời
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          {reviews.filter((rv) => rv.user !== "Bạn").length >
            visibleReviews && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full font-semibold hover:bg-pink-200 transition"
                onClick={() => setVisibleReviews((v) => v + 5)}
              >
                Xem thêm bình luận
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Sản phẩm liên quan */}
      {/* {related.length > 0 && (
        <div className="container mx-auto px-4 mt-10 md:w-2/3">
          <h2 className="text-xl font-bold text-blue-600 mb-3">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <Link
                to={`/products/${item.id}`}
                key={item.id}
                className="bg-white/80 rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col items-center"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded mb-2"
                />
                <div className="font-semibold text-gray-800 text-center">
                  {item.name}
                </div>
                <div className="text-pink-600 font-bold">
                  {item.price.toLocaleString()}đ
                </div>
                <div className="flex items-center justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      color={
                        star <= Math.round(item.rating) ? "#fbbf24" : "#e5e7eb"
                      }
                      fill={
                        star <= Math.round(item.rating) ? "#fbbf24" : "none"
                      }
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-500">
                    {item.rating.toFixed(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )} */}
      {/* Sản phẩm mới nhất và nổi bật */}
      <div className="container mx-auto px-4 mt-12 md:w-2/3">
        <h2 className="text-xl font-bold text-pink-600 mb-3">
          Sản phẩm mới nhất
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {products
            .filter((p) => p.section === "new")
            .map((item) => (
              <Link
                to={`/products/${item.id}`}
                key={item.id}
                className="bg-white/80 rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col items-center"
              >
                <img
                  src={item.images ? item.images[0] : item.image}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded mb-2"
                />
                <div className="font-semibold text-gray-800 text-center">
                  {item.name}
                </div>
                <div className="text-pink-600 font-bold">
                  {item.price.toLocaleString()}đ
                </div>
              </Link>
            ))}
        </div>
        <h2 className="text-xl font-bold text-yellow-600 mb-3">
          Sản phẩm nổi bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products
            .filter((p) => p.section === "featured")
            .map((item) => (
              <Link
                to={`/products/${item.id}`}
                key={item.id}
                className="bg-white/80 rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col items-center"
              >
                <img
                  src={item.images ? item.images[0] : item.image}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded mb-2"
                />
                <div className="font-semibold text-gray-800 text-center">
                  {item.name}
                </div>
                <div className="text-pink-600 font-bold">
                  {item.price.toLocaleString()}đ
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
