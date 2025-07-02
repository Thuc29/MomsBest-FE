import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, X, ArrowLeft } from "lucide-react";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Tooltip } from "antd";

export default function CartModal({ open, onClose, cart }) {
  const navigate = useNavigate();
  const { removeFromCart, updateQuantity } = useCart();
  const modalRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  function getDiscountPercentByLevel(level) {
    switch (level) {
      case "Thành viên đồng":
        return 0.02;
      case "Thành viên bạc":
        return 0.05;
      case "Thành viên vàng":
        return 0.1;
      default:
        return 0;
    }
  }
  const discountPercent = getDiscountPercentByLevel(user?.current_level);
  const discountAmount = Math.round(subtotal * discountPercent);
  const totalAfterDiscount = subtotal - discountAmount;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 flex text-black items-center justify-center animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Giỏ hàng"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-6 animate-scaleIn overflow-y-auto max-h-[90vh] transition-all duration-300 border border-pink-100"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-pink-500 p-2 rounded-full bg-gray-100 shadow-md"
          aria-label="Đóng giỏ hàng"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-extrabold text-pink-600 mb-6 flex items-center gap-2 tracking-tight">
          <ShoppingCart /> Giỏ hàng của bạn
          <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 font-bold flex items-center gap-1">
            🛒 {totalItems}
          </span>
        </h2>
        {cart.length === 0 ? (
          <div className="bg-pink-50 p-10 rounded-2xl shadow flex flex-col items-center gap-6">
            <img
              src="/assets/empty-cart.svg"
              alt="Giỏ hàng trống"
              className="w-32 h-32 opacity-80"
            />
            <div className="text-gray-500 font-semibold text-lg">
              Giỏ hàng trống.
            </div>
            <Link
              to="/products"
              className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition"
              onClick={onClose}
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full mb-6 text-sm md:text-base rounded-2xl overflow-hidden shadow border border-pink-100">
                <thead>
                  <tr className="text-left text-blue-600 bg-pink-50 border-b">
                    <th className="py-3"></th>
                    <th className="py-3">
                      <span className="flex items-center gap-1">
                        📦 Sản phẩm
                      </span>
                    </th>
                    <th className="py-3">
                      <span className="flex items-center gap-1">
                        💵 Đơn giá
                      </span>
                    </th>
                    <th className="py-3">
                      <span className="flex items-center gap-1">
                        🛒 Số lượng
                      </span>
                    </th>
                    <th className="py-3">
                      <span className="flex items-center gap-1">
                        🧮 Thành tiền
                      </span>
                    </th>
                    <th className="py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-b-0 hover:bg-pink-50/60 transition group"
                    >
                      <td className="py-2">
                        <Link to={`/products/${item.id}`} onClick={onClose}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-xl shadow border border-pink-100 group-hover:scale-105 transition"
                          />
                        </Link>
                      </td>
                      <td className="py-2">
                        <Link
                          to={`/products/${item.id}`}
                          className="text-pink-600 font-semibold hover:underline"
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-2 font-semibold">
                        {item.price.toLocaleString()}đ
                      </td>
                      <td className="py-2 font-bold">
                        <div className="flex items-center gap-x-2">
                          <button
                            className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                              item.quantity === 1
                                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                : "bg-pink-50 hover:bg-pink-100 text-pink-500 hover:scale-110"
                            } transition shadow`}
                            onClick={() =>
                              item.quantity > 1 && updateQuantity(item?._id, -1)
                            }
                            aria-label="Giảm số lượng"
                            disabled={item.quantity === 1}
                          >
                            <MinusOutlined />
                          </button>
                          <div className="w-8 text-center">{item.quantity}</div>
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-full border bg-pink-50 hover:bg-pink-100 text-pink-500 hover:scale-110 transition shadow"
                            onClick={() => updateQuantity(item?._id, 1)}
                            aria-label="Tăng số lượng"
                          >
                            <PlusOutlined />
                          </button>
                        </div>
                      </td>
                      <td className="py-2 font-bold text-pink-600">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </td>
                      <td className="py-2">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-200 text-red-400 hover:text-red-600 transition shadow"
                          onClick={() => removeFromCart(item?._id)}
                          aria-label="Xoá sản phẩm"
                        >
                          <DeleteOutlined />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-end gap-2 mb-6">
              <div className="bg-pink-50 rounded-xl px-6 py-3 flex items-center gap-2 shadow">
                <span className="text-sm flex items-center gap-1">
                  🧾 Tạm tính:
                </span>
                <span className="font-bold text-pink-600 text-sm">
                  {subtotal.toLocaleString()}đ
                </span>
              </div>
              <div className="bg-blue-50 rounded-xl px-6 py-3 flex items-center gap-2 shadow">
                <Tooltip
                  title={
                    user?.current_level === "Thành viên vàng"
                      ? "Giảm 10% cho mỗi đơn hàng"
                      : user?.current_level === "Thành viên bạc"
                      ? "Giảm 5% cho mỗi đơn hàng"
                      : user?.current_level === "Thành viên đồng"
                      ? "Giảm 2% cho mỗi đơn hàng"
                      : "Không có khuyến mại cho cấp độ này"
                  }
                  placement="top"
                >
                  <span className="text-base font-semibold flex items-center gap-1 text-blue-700 cursor-pointer underline decoration-dotted">
                    {user?.current_level === "Thành viên vàng" && (
                      <span className="text-2xl">🥇</span>
                    )}
                    {user?.current_level === "Thành viên bạc" && (
                      <span className="text-2xl">🥈</span>
                    )}
                    {user?.current_level === "Thành viên đồng" && (
                      <span className="text-2xl">🥉</span>
                    )}
                    {user?.current_level === "Thành viên mới" && (
                      <span className="text-2xl">🆕</span>
                    )}
                    Khuyến mại ({user?.current_level || "Không có"}):
                  </span>
                </Tooltip>
                <span className="font-bold text-blue-700 text-base ml-2">
                  -{discountAmount.toLocaleString()}đ
                </span>
              </div>
              <div className="bg-pink-100 rounded-xl px-6 py-4 flex items-center gap-2 shadow mt-2">
                <span className="text-lg font-bold text-pink-600 flex items-center gap-1">
                  💰 Tổng thanh toán:
                </span>
                <span className="text-lg font-extrabold text-pink-700">
                  {totalAfterDiscount.toLocaleString()}đ
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full mt-2">
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition w-full md:w-auto shadow"
              >
                <ArrowLeft size={20} /> Tiếp tục mua sắm
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-pink-600 hover:to-pink-700 transition shadow-xl w-full md:w-auto scale-100 hover:scale-105"
              >
                Tiến hành Thanh toán
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
