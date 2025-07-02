import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { generateSignature, randomNumber } from "../lib/utils";
import { message } from "antd";

const ClientID = "12bc5071-aa3c-43ae-b506-04e720ea7b03";
const APIKey = "6bb72d3e-a9be-433d-a91a-069f52c23053";

export default function Checkout() {
  const [info, setInfo] = useState({
    shipping_name: "",
    shipping_address: "",
    shipping_phone: "",
    payment: "cod",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { cart } = useCart();
  const { token, user } = useAuth();
  const intervalRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const totalAmount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  }, [cart]);

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
  const discountAmount = Math.round(totalAmount * discountPercent);
  const totalAfterDiscount = totalAmount - discountAmount;

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bodyOrder = {
      total_amount: totalAmount,
      discount_percent: discountPercent,
      discount_amount: discountAmount,
      total_after_discount: totalAfterDiscount,
      user_level: user?.current_level,
      ...info,
      orderItems: cart?.map((i) => ({
        product_id: i?._id,
        quantity: i?.quantity,
        unit_price: i?.price,
        total_price: i?.price * i?.quantity,
      })),
    };
    localStorage.setItem("bodyOrder", JSON.stringify(bodyOrder));
    const body = {
      orderCode: randomNumber(),
      amount: totalAfterDiscount,
      description: "Thanh toán",
      cancelUrl: `http://localhost:3000/checkout`,
      returnUrl: `http://localhost:3000/checkout`,
    };
    const data = `amount=${body.amount}&cancelUrl=${body.cancelUrl}&description=${body.description}&orderCode=${body.orderCode}&returnUrl=${body.returnUrl}`;
    const resPaymemtLink = await axios.post(
      "https://api-merchant.payos.vn/v2/payment-requests",
      {
        ...body,
        signature: generateSignature(data),
      },
      {
        headers: {
          "x-client-id": ClientID,
          "x-api-key": APIKey,
        },
      }
    );
    if (resPaymemtLink?.data?.code !== "00")
      return message.error("Có lỗi xảy ra trong quá trình tạo thanh toán");
    window.location.href = resPaymemtLink?.data?.data?.checkoutUrl;
  };

  const handleCompleteOrder = async () => {
    const body = JSON.parse(localStorage.getItem("bodyOrder"));
    const res = await axios.post(
      "https://momsbest-be.onrender.com/api/orders/createOrder",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!!res?.isError) return;
    localStorage.removeItem("bodyOrder");
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    }, 1500);
  };

  const checkPaymentLinkStatus = async (paymentLinkID) => {
    const res = await axios.get(
      `https://api-merchant.payos.vn/v2/payment-requests/${paymentLinkID}`,
      {
        headers: {
          "x-client-id": ClientID,
          "x-api-key": APIKey,
        },
      }
    );
    if (res?.data?.code !== "00") {
      clearInterval(intervalRef.current);
    }
    if (res?.data?.data?.status === "CANCELLED") {
      clearInterval(intervalRef.current);
    } else if (res?.data?.data?.status === "PENDING") {
      window.location.href = `https://pay.payos.vn/web/${paymentLinkID}`;
    } else if (res?.data?.data?.status === "PAID") {
      clearInterval(intervalRef.current);
      handleCompleteOrder();
    }
  };

  useEffect(() => {
    if (!!queryParams.get("id")) {
      const paymentLinkID = queryParams.get("id");
      if (!intervalRef.current) {
        intervalRef.current = setInterval(
          () => checkPaymentLinkStatus(paymentLinkID),
          3000
        );
      }
    }
  }, [location.search]);

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-pink-50 to-blue-50 text-black py-8 font-space-grotesk">
      <div className="container mx-auto px-4 md:w-2/3 lg:w-1/2">
        <h1 className="text-2xl font-bold text-pink-600 mb-6 flex items-center gap-2 animate-fadeIn">
          <span className="text-3xl">🧾</span>
          Thanh toán
        </h1>
        {success ? (
          <div className="bg-white/80 p-8 rounded-xl shadow text-center text-green-600 text-xl font-bold animate-fadeIn">
            <span className="text-4xl block mb-2 animate-bounce">🎉</span>
            Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Mẹ & Bé.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 p-6 rounded-xl shadow space-y-6 animate-fadeIn"
          >
            <div>
              <h2 className="text-lg font-bold mb-2 text-pink-500 flex items-center gap-2">
                <span className="text-xl">🚚</span> Thông tin giao hàng
              </h2>
              <input
                type="text"
                name="shipping_name"
                placeholder="Họ và tên"
                className="w-full p-3 rounded-xl bg-pink-50 border mb-2"
                value={info.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="shipping_address"
                placeholder="Địa chỉ giao hàng"
                className="w-full p-3 rounded-xl bg-pink-50 border mb-2"
                value={info.address}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="shipping_phone"
                placeholder="Số điện thoại"
                className="w-full p-3 rounded-xl bg-pink-50 border mb-2"
                value={info.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-white rounded-xl shadow p-6 mb-6 animate-scaleIn">
              <h2 className="text-lg font-bold mb-2 text-pink-500 flex items-center gap-2">
                <span className="text-xl">📦</span> Đơn hàng của bạn
              </h2>
              <ul className="mb-4">
                {cart.map((item) => (
                  <li key={item._id} className="flex justify-between py-1">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      {(item.price * item.quantity).toLocaleString()}đ
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-semibold text-base mb-1">
                <span className="flex items-center gap-1">🧾 Tạm tính:</span>
                <span>{totalAmount.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-base mb-1 text-blue-600 font-semibold">
                <span className="flex items-center gap-1">
                  {user?.current_level === "Thành viên vàng" && (
                    <span className="text-xl">🥇</span>
                  )}
                  {user?.current_level === "Thành viên bạc" && (
                    <span className="text-xl">🥈</span>
                  )}
                  {user?.current_level === "Thành viên đồng" && (
                    <span className="text-xl">🥉</span>
                  )}
                  {user?.current_level === "Thành viên mới" && (
                    <span className="text-xl">🆕</span>
                  )}
                  Khuyến mại ({user?.current_level || "Không có"}):
                </span>
                <span>-{discountAmount.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-pink-600 border-t pt-2 mt-2 animate-fadeIn">
                <span className="flex items-center gap-1">
                  💰 Tổng thanh toán:
                </span>
                <span>{totalAfterDiscount.toLocaleString()}đ</span>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm mb-2 animate-fadeIn">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white py-3 rounded-full font-bold text-lg hover:from-pink-600 hover:to-fuchsia-600 transition shadow-lg shadow-rose-400/30 animate-scaleIn flex items-center justify-center gap-2"
              disabled={submitting}
              style={{ transition: "all 0.2s" }}
            >
              <span className="text-2xl">🛒</span>
              {submitting ? "Đang xử lý..." : "Xác nhận Đặt hàng"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
