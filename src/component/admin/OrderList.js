import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaShoppingBag,
  FaSmile,
  FaSearch,
  FaShippingFast,
  FaMoneyCheckAlt,
  FaClipboardList,
} from "react-icons/fa";

const ORDER_STATUS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUS = ["pending", "paid", "failed", "refunded"];

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, search, status, paymentStatus]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/admin/orders",
        {
          params: {
            page,
            limit,
            search,
            status,
            payment_status: paymentStatus,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id, order_status, payment_status) => {
    await axios.patch(
      `https://momsbest-be.onrender.com/api/admin/orders/${id}`,
      { order_status, payment_status },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchOrders();
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-300 mb-4"></div>
        <span className="text-blue-400 font-semibold text-lg">
          Đang tải danh sách đơn hàng...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center font-semibold mt-8">{error}</div>
    );

  return (
    <div className="p-6 min-h-screen bg-[url('https://images.pexels.com/photos/1485894/pexels-photo-1485894.jpeg')] bg-cover bg-center">
      <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-blue-400">
        <FaShoppingBag className="text-blue-300 text-3xl" /> Quản lý đơn hàng
      </h1>
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn hàng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border-2 border-blue-200 rounded-2xl px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/80 text-gray-700 shadow-sm"
          />
          <FaSearch className="absolute right-3 top-3 text-blue-300" />
        </div>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border-2 border-purple-200 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white/80 text-gray-700 shadow-sm"
          >
            <option value="">Tất cả trạng thái</option>
            {ORDER_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
              setPage(1);
            }}
            className="border-2 border-pink-200 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white/80 text-gray-700 shadow-sm"
          >
            <option value="">Tất cả thanh toán</option>
            {PAYMENT_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/80 rounded-2xl shadow-xl">
          <thead>
            <tr className="bg-blue-100 text-blue-600">
              <th className="px-4 py-3 rounded-tl-2xl font-bold text-left">
                Mã đơn
              </th>
              <th className="px-4 py-3 font-bold text-left">Khách hàng</th>
              <th className="px-4 py-3 font-bold text-left">Tổng tiền</th>
              <th className="px-4 py-3 font-bold text-left">Trạng thái</th>
              <th className="px-4 py-3 font-bold text-left">Thanh toán</th>
              <th className="px-4 py-3 rounded-tr-2xl font-bold text-left">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-blue-300">
                  <div className="flex flex-col items-center gap-2">
                    <FaSmile className="text-5xl mb-2 animate-bounce" />
                    <span className="font-semibold">
                      Không có đơn hàng nào!
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FaClipboardList className="text-blue-200" />
                    <span className="font-medium">{order.order_number}</span>
                  </td>
                  <td className="px-4 py-3">{order.shipping_name}</td>
                  <td className="px-4 py-3">
                    {order.total_amount.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.order_status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          order._id,
                          e.target.value,
                          order.payment_status
                        )
                      }
                      className="border rounded px-2 py-1 bg-blue-50 text-blue-600 font-semibold"
                    >
                      {ORDER_STATUS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.payment_status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          order._id,
                          order.order_status,
                          e.target.value
                        )
                      }
                      className="border rounded px-2 py-1 bg-pink-50 text-pink-600 font-semibold"
                    >
                      {PAYMENT_STATUS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {/* Có thể thêm nút xem chi tiết, xóa đơn hàng nếu cần */}
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
                ? "bg-blue-400 text-white scale-110"
                : "bg-white/80 text-blue-400 hover:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
