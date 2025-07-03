import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaShoppingBag,
  FaSmile,
  FaSearch,
  FaShippingFast,
  FaMoneyCheckAlt,
  FaClipboardList,
  FaEye,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

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

  const handleShowDetail = async (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setItemsLoading(true);
    try {
      const res = await axios.get(
        `https://momsbest-be.onrender.com/api/admin/orders/${order._id}/items`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOrderItems(res.data.items);
    } catch (err) {
      setOrderItems([]);
    } finally {
      setItemsLoading(false);
    }
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
                    <FaClipboardList className="text-blue-400" />
                    <span className="font-medium text-lg text-blue-500 ">
                      {order.order_number}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-start text-lg text-blue-500">
                    {order.shipping_name}
                  </td>
                  <td className="px-4 py-3 text-lg text-start text-blue-500">
                    {order.total_amount.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3 text-start text-lg text-blue-500">
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
                  <td className="px-4 py-3 text-start text-lg">
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
                    <button
                      className="px-4 py-2 rounded-2xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-white bg-blue-400 hover:bg-blue-500"
                      onClick={() => handleShowDetail(order)}
                    >
                      <FaEye /> Xem chi tiết
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
                ? "bg-blue-400 text-white scale-110"
                : "bg-white/80 text-blue-400 hover:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {showModal && selectedOrder && (
        <Transition appear show={showModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setShowModal(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                    <button
                      className="absolute top-4 right-4 text-blue-400 hover:text-red-500"
                      onClick={() => setShowModal(false)}
                    >
                      <X />
                    </button>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-500">
                      <FaClipboardList className="text-blue-400 text-3xl" /> Chi
                      tiết đơn hàng
                    </h2>
                    <div className="space-y-3 text-black">
                      <div className="flex items-center gap-2">
                        <FaClipboardList className="text-blue-400" />
                        <span>
                          <b>Mã đơn:</b> {selectedOrder.order_number}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaSmile className="text-yellow-400" />
                        <span>
                          <b>Khách hàng:</b> {selectedOrder.shipping_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaShippingFast className="text-green-400" />
                        <span>
                          <b>Địa chỉ:</b> {selectedOrder.shipping_address}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-pink-400" />
                        <span>
                          <b>Số điện thoại:</b> {selectedOrder.shipping_phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMoneyCheckAlt className="text-purple-400" />
                        <span>
                          <b>Tổng tiền:</b>{" "}
                          <span className="text-lg font-bold text-blue-600">
                            {selectedOrder.total_amount.toLocaleString()} đ
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>
                          <b>Ngày đặt:</b>{" "}
                          {new Date(selectedOrder.created_at).toLocaleString()}
                        </span>
                      </div>
                      {selectedOrder.notes && (
                        <div className="flex items-center gap-2">
                          <FaSearch className="text-gray-400" />
                          <span>
                            <b>Ghi chú:</b> {selectedOrder.notes}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FaShippingFast className="text-blue-400" />
                        <span>
                          <b>Trạng thái:</b>{" "}
                          <span
                            className={`px-3 py-1 rounded-full font-bold text-white ml-2 ${
                              selectedOrder.order_status === "pending"
                                ? "bg-gray-400"
                                : selectedOrder.order_status === "confirmed"
                                ? "bg-blue-500"
                                : selectedOrder.order_status === "processing"
                                ? "bg-purple-500"
                                : selectedOrder.order_status === "shipped"
                                ? "bg-yellow-500"
                                : selectedOrder.order_status === "delivered"
                                ? "bg-green-500"
                                : selectedOrder.order_status === "cancelled"
                                ? "bg-red-500"
                                : "bg-gray-300"
                            }`}
                          >
                            {selectedOrder.order_status}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMoneyCheckAlt className="text-green-500" />
                        <span>
                          <b>Thanh toán:</b>{" "}
                          <span
                            className={`px-3 py-1 rounded-full font-bold ml-2 ${
                              selectedOrder.payment_status === "pending"
                                ? "bg-yellow-400 text-white"
                                : selectedOrder.payment_status === "paid"
                                ? "bg-green-500 text-white"
                                : selectedOrder.payment_status === "failed"
                                ? "bg-red-500 text-white"
                                : selectedOrder.payment_status === "refunded"
                                ? "bg-blue-400 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {selectedOrder.payment_status}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <b className="text-blue-500">Sản phẩm trong đơn:</b>
                      {itemsLoading ? (
                        <div className="mt-2 text-blue-400">Đang tải...</div>
                      ) : orderItems.length === 0 ? (
                        <div className="mt-2 text-gray-400">
                          Không có sản phẩm.
                        </div>
                      ) : (
                        <table className="min-w-full mt-2 text-sm border rounded-xl overflow-hidden">
                          <thead className="bg-blue-50">
                            <tr>
                              <th className="text-left px-2 py-1">
                                Tên sản phẩm
                              </th>
                              <th className="px-2 py-1">Số lượng</th>
                              <th className="px-2 py-1">Đơn giá</th>
                              <th className="px-2 py-1">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderItems.map((item) => (
                              <tr
                                key={item._id}
                                className="border-b last:border-b-0"
                              >
                                <td className="px-2 py-1">
                                  {item.product_id?.name ||
                                    item.product_name ||
                                    "?"}
                                </td>
                                <td className="text-center px-2 py-1">
                                  {item.quantity}
                                </td>
                                <td className="text-right px-2 py-1">
                                  {item.unit_price.toLocaleString()} đ
                                </td>
                                <td className="text-right px-2 py-1 font-semibold text-blue-500">
                                  {item.total_price.toLocaleString()} đ
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
}
