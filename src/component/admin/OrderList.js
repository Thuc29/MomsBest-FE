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
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaUser,
  FaMapMarkerAlt,
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

const STATUS_LABELS = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đã gửi hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
};

const PAYMENT_LABELS = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán thất bại",
  refunded: "Đã hoàn tiền",
};

const PAYMENT_METHOD_LABELS = {
  cod: "Tiền mặt khi nhận hàng",
  bank_transfer: "Chuyển khoản ngân hàng",
  "Bank Transfer": "Chuyển khoản ngân hàng",
  "Cash on Delivery": "Tiền mặt khi nhận hàng",
};

const STATUS_COLORS = {
  pending: "bg-gray-400",
  confirmed: "bg-blue-500",
  processing: "bg-purple-500",
  shipped: "bg-yellow-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const PAYMENT_COLORS = {
  pending: "bg-yellow-400",
  paid: "bg-green-500",
  failed: "bg-red-500",
  refunded: "bg-blue-400",
};

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Hiển thị thông báo thành công
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

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

      // Debug: Log order data to check user_id population
      console.log("Orders data:", res.data.orders);
      res.data.orders.forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
          order_number: order.order_number,
          shipping_name: order.shipping_name,
          user_id: order.user_id,
          has_user: !!order.user_id,
        });
      });

      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateOrderStatus = async (id, order_status) => {
    setUpdatingStatus(true);
    try {
      const res = await axios.patch(
        `https://momsbest-be.onrender.com/api/admin/orders/${id}`,
        { order_status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.message) {
        showSuccessMessage(res.data.message);
      }

      await fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      const errorMessage =
        err.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng";
      alert(errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdatePaymentStatus = async (id, payment_status) => {
    setUpdatingStatus(true);
    try {
      const res = await axios.patch(
        `https://momsbest-be.onrender.com/api/admin/orders/${id}/payment`,
        { payment_status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.message) {
        showSuccessMessage(res.data.message);
      }

      await fetchOrders();
    } catch (err) {
      console.error("Error updating payment status:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Không thể cập nhật trạng thái thanh toán";
      alert(errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleShowDetail = async (order) => {
    setSelectedOrder(order);
    setShowModal(true);

    // Lấy chi tiết đơn hàng với sản phẩm
    try {
      const res = await axios.get(
        `https://momsbest-be.onrender.com/api/admin/orders/${order._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSelectedOrder(res.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      // Vẫn hiển thị modal với thông tin cơ bản
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    setDeletingOrder(true);
    try {
      await axios.delete(
        `https://momsbest-be.onrender.com/api/admin/orders/${orderToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setShowDeleteModal(false);
      setOrderToDelete(null);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa đơn hàng");
    } finally {
      setDeletingOrder(false);
    }
  };

  const confirmDelete = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
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
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaCheck className="mr-2" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-500 hover:text-green-700"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-800">
          <FaShoppingBag className="text-blue-500 text-3xl" />
          Quản lý đơn hàng
          <button
            onClick={async () => {
              try {
                const res = await axios.get(
                  "https://momsbest-be.onrender.com/api/admin/orders/analyze/data",
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                console.log("Order Analysis:", res.data);
                alert(
                  `Phân tích đơn hàng:\nTổng: ${res.data.totalOrders}\nCó user: ${res.data.ordersWithUser}\nKhông có user: ${res.data.ordersWithoutUser}\nTỷ lệ: ${res.data.percentageWithUser}%`
                );
              } catch (err) {
                console.error("Error analyzing orders:", err);
                alert("Không thể phân tích dữ liệu đơn hàng");
              }
            }}
            className="ml-4 px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors"
            title="Phân tích dữ liệu đơn hàng"
          >
            🔍 Debug
          </button>
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <input
                type="text"
                placeholder="Tìm kiếm mã đơn hàng..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              {ORDER_STATUS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>

            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            >
              <option value="">Tất cả thanh toán</option>
              {PAYMENT_STATUS.map((s) => (
                <option key={s} value={s}>
                  {PAYMENT_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Mã đơn</th>
                  {/* <th className="px-6 py-4 text-left font-semibold">
                    Khách hàng
                  </th> */}
                  <th className="px-6 py-4 text-left font-semibold">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Thanh toán
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <FaSmile className="text-6xl text-gray-300" />
                        <span className="text-xl font-semibold">
                          Không có đơn hàng nào!
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaClipboardList className="text-blue-500" />
                          <span className="font-semibold text-gray-900">
                            {order.order_number}
                          </span>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.shipping_name || "Khách hàng không xác định"}
                          </div>
                          {order.user_id ? (
                            <div className="text-sm text-gray-500">
                              {order.user_id.email}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">
                              Khách hàng không đăng nhập
                            </div>
                          )}
                        </div>
                      </td> */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-lg text-green-600">
                          {order.total_amount.toLocaleString()}đ
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.order_status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order._id, e.target.value)
                          }
                          disabled={updatingStatus}
                          className={`px-3 py-1 rounded-full font-semibold text-white border-0 focus:ring-2 focus:ring-blue-300 ${
                            STATUS_COLORS[order.order_status]
                          } ${
                            updatingStatus
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {ORDER_STATUS.map((s) => (
                            <option
                              key={s}
                              value={s}
                              className="bg-white text-gray-900"
                            >
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        {updatingStatus && (
                          <div className="mt-1 text-xs text-gray-500">
                            Đang cập nhật...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.payment_status}
                          onChange={(e) =>
                            handleUpdatePaymentStatus(order._id, e.target.value)
                          }
                          disabled={updatingStatus}
                          className={`px-3 py-1 rounded-full font-semibold text-white border-0 focus:ring-2 focus:ring-green-300 ${
                            PAYMENT_COLORS[order.payment_status]
                          } ${
                            updatingStatus
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {PAYMENT_STATUS.map((s) => (
                            <option
                              key={s}
                              value={s}
                              className="bg-white text-gray-900"
                            >
                              {PAYMENT_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        {updatingStatus && (
                          <div className="mt-1 text-xs text-gray-500">
                            Đang cập nhật...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* <button
                            onClick={() => handleShowDetail(order)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button> */}
                          {(order.order_status === "cancelled" ||
                            order.order_status === "delivered") && (
                            <button
                              onClick={() => confirmDelete(order)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa đơn hàng"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    page === i + 1
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
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
                <div className="fixed inset-0 bg-black bg-opacity-50" />
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
                    <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                      <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <FaClipboardList className="text-blue-500" />
                          Chi tiết đơn hàng
                        </h2>
                        <button
                          onClick={() => setShowModal(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Order Information */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Thông tin đơn hàng
                            </h3>

                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <FaClipboardList className="text-blue-500 w-5" />
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Mã đơn hàng
                                  </div>
                                  <div className="font-semibold">
                                    {selectedOrder.order_number}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <FaCalendarAlt className="text-green-500 w-5" />
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Ngày đặt
                                  </div>
                                  <div className="font-semibold">
                                    {new Date(
                                      selectedOrder.created_at
                                    ).toLocaleString("vi-VN")}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <FaMoneyCheckAlt className="text-purple-500 w-5" />
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Tổng tiền
                                  </div>
                                  <div className="font-semibold text-lg text-green-600">
                                    {selectedOrder.total_amount.toLocaleString()}
                                    đ
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <FaShippingFast className="text-orange-500 w-5" />
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Phí vận chuyển
                                  </div>
                                  <div className="font-semibold">
                                    {selectedOrder.shipping_fee.toLocaleString()}
                                    đ
                                  </div>
                                </div>
                              </div>

                              {selectedOrder.discount_amount > 0 && (
                                <div className="flex items-center gap-3">
                                  <FaCheck className="text-green-500 w-5" />
                                  <div>
                                    <div className="text-sm text-gray-500">
                                      Giảm giá
                                    </div>
                                    <div className="font-semibold text-red-600">
                                      -
                                      {selectedOrder.discount_amount.toLocaleString()}
                                      đ
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-3">
                                <FaMoneyCheckAlt className="text-blue-500 w-5" />
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Phương thức thanh toán
                                  </div>
                                  <div className="font-semibold">
                                    {PAYMENT_METHOD_LABELS[
                                      selectedOrder.payment_method
                                    ] || selectedOrder.payment_method}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Customer Information */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Thông tin khách hàng
                            </h3>

                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <FaUser className="text-blue-500 w-5" />
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Tên khách hàng
                                  </div>
                                  <div className="font-semibold">
                                    {selectedOrder.shipping_name ||
                                      "Khách hàng không xác định"}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <FaPhone className="text-green-500 w-5" />
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Số điện thoại
                                  </div>
                                  <div className="font-semibold">
                                    {selectedOrder.shipping_phone || "Không có"}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-red-500 w-5" />
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Địa chỉ giao hàng
                                  </div>
                                  <div className="font-semibold">
                                    {selectedOrder.shipping_address ||
                                      "Không có"}
                                  </div>
                                </div>
                              </div>

                              {selectedOrder.user_id ? (
                                <div className="flex items-center gap-3">
                                  <FaUser className="text-purple-500 w-5" />
                                  <div>
                                    <div className="text-sm text-gray-500">
                                      Email đăng ký
                                    </div>
                                    <div className="font-semibold">
                                      {selectedOrder.user_id.email}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <FaUser className="text-gray-400 w-5" />
                                  <div>
                                    <div className="text-sm text-gray-500">
                                      Trạng thái
                                    </div>
                                    <div className="font-semibold text-gray-400">
                                      Khách hàng không đăng nhập
                                    </div>
                                  </div>
                                </div>
                              )}

                              {selectedOrder.notes && (
                                <div className="flex items-start gap-3">
                                  <FaEdit className="text-gray-500 w-5 mt-1" />
                                  <div>
                                    <div className="text-sm text-gray-500">
                                      Ghi chú
                                    </div>
                                    <div className="font-semibold">
                                      {selectedOrder.notes}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Sản phẩm trong đơn
                          </h3>

                          {selectedOrder.items &&
                          selectedOrder.items.length > 0 ? (
                            <div className="bg-gray-50 rounded-xl p-4">
                              <div className="space-y-4">
                                {selectedOrder.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                                  >
                                    {item.product_id?.images?.[0] && (
                                      <img
                                        src={item.product_id.images[0]}
                                        alt={item.product_id.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900">
                                        {item.product_id?.name ||
                                          "Sản phẩm không xác định"}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Đơn giá:{" "}
                                        {item.unit_price.toLocaleString()}đ
                                      </div>
                                      {item.product_id?.brand && (
                                        <div className="text-xs text-gray-400">
                                          Thương hiệu: {item.product_id.brand}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold text-gray-900">
                                        Số lượng: {item.quantity}
                                      </div>
                                      <div className="text-lg font-bold text-green-600">
                                        {item.total_price.toLocaleString()}đ
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <FaExclamationTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                              <p>Không có thông tin sản phẩm</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}

        {/* Delete Confirmation Modal */}
        <Transition appear show={showDeleteModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setShowDeleteModal(false)}
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
              <div className="fixed inset-0 bg-black bg-opacity-50" />
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                          <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Xác nhận xóa đơn hàng
                        </h3>
                      </div>

                      <p className="text-gray-600 mb-6">
                        Bạn có chắc chắn muốn xóa đơn hàng{" "}
                        <strong>{orderToDelete?.order_number}</strong>? Hành
                        động này không thể hoàn tác.
                      </p>

                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setShowDeleteModal(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          disabled={deletingOrder}
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleDeleteOrder}
                          className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                          disabled={deletingOrder}
                        >
                          {deletingOrder ? "Đang xóa..." : "Xóa"}
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}
