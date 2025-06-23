import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { message } from "antd";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { UserCheck2 } from "lucide-react";

const mockUser = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  avatar: "https://i.pravatar.cc/100?img=3",
};

const tabs = [
  { key: "posts", label: "Chuyên mục của tôi" },
  { key: "questions", label: "Câu hỏi của tôi" },
  { key: "orders", label: "Đơn hàng của tôi" },
  { key: "reviews", label: "Đánh giá của tôi" },
];

const mockOrders = [
  { id: 1, product: "Nồi cơm điện", status: "Đã giao", date: "2024-04-15" },
  { id: 2, product: "Bột mì hữu cơ", status: "Đang xử lý", date: "2024-05-03" },
];

const mockNotificationSettings = {
  email: true,
  sms: false,
  push: true,
};

// Helper: format date
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
}

// Icon components
const PostIcon = () => (
  <svg
    className="w-5 h-5 text-blue-400 mr-2"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6a2 2 0 012 2v12a2 2 0 01-2 2z"
    />
  </svg>
);
const QuestionIcon = () => (
  <svg
    className="w-5 h-5 text-purple-400 mr-2"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h.01M12 14v.01M12 10a4 4 0 10-4 4h.01M12 18h.01"
    />
  </svg>
);
const OrderIcon = () => (
  <svg
    className="w-5 h-5 text-green-400 mr-2"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7h18M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 11V9a4 4 0 00-8 0v2"
    />
  </svg>
);
const ReviewIcon = () => (
  <svg
    className="w-5 h-5 text-yellow-400 mr-2"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.37 3.905a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.54 1.118l-5.37-3.905a1 1 0 00-1.176 0l-5.37 3.905c-.784.57-1.838-.197-1.54-1.118l2.036-6.29a1 1 0 00-.364-1.118L2.342 11.717c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.036-6.29z"
    />
  </svg>
);
const NotiIcon = () => (
  <svg
    className="w-5 h-5 text-pink-400 mr-2"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

// Component con cho từng tab
function MyPostsTab() {
  const [posts, setPosts] = useState([]);
  const { token } = useAuth();

  const getListPost = async () => {
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/categories/getCategoryByAuthor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(res?.data);
    } catch (error) {
      message.error(error.toString());
    }
  };

  useEffect(() => {
    getListPost();
  }, []);

  return (
    <div className="">
      <h4 className="font-semibold mb-4 flex items-center text-lg">
        <PostIcon />
        Bài viết của tôi
      </h4>
      {posts?.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-gray-400">
          <PostIcon />
          <span>Chưa có bài viết nào.</span>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {posts.map((post) => (
            <li
              key={post?.id}
              className="bg-blue-50 border border-blue-100 rounded-xl shadow-sm p-4 flex flex-col gap-2 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2">
                <PostIcon />
                <span className="font-semibold text-blue-700">
                  {post?.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {formatDate(post?.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
function MyQuestionsTab() {
  const [threads, setThreads] = useState([]);

  const { token } = useAuth();

  const getListThread = async () => {
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/forumthreads/getForumThreadByAuthor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setThreads(res?.data);
    } catch (error) {
      message.error(error.toString());
    }
  };

  useEffect(() => {
    getListThread();
  }, []);

  return (
    <div>
      <h4 className="font-semibold mb-4 flex items-center text-lg">
        <QuestionIcon />
        Câu hỏi của tôi
      </h4>
      {threads?.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-gray-400">
          <QuestionIcon />
          <span>Bạn chưa đặt câu hỏi nào.</span>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {threads.map((q) => (
            <li
              key={q._id}
              className="bg-purple-50 border border-purple-100 rounded-xl shadow-sm p-4 flex flex-col gap-2 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2">
                <QuestionIcon />
                <span className="font-semibold text-purple-700">{q.title}</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {formatDate(q.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
function MyOrdersTab() {
  const [orders, setOrders] = useState([]);

  const { token } = useAuth();

  const getListOrder = async () => {
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/orders/getOrderByUser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res?.data);
    } catch (error) {
      message.error(error.toString());
    }
  };

  useEffect(() => {
    getListOrder();
  }, []);

  return (
    <div>
      <h4 className="font-semibold mb-4 flex items-center text-lg">
        <OrderIcon />
        Đơn hàng của tôi
      </h4>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-gray-400">
          <OrderIcon />
          <span>Bạn chưa có đơn hàng nào.</span>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {orders.map((order) => (
            <li
              key={order._id}
              className="bg-green-50 border border-green-100 rounded-xl shadow-sm p-4 flex items-center justify-between hover:shadow-lg transition"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <OrderIcon />
                  <span className="font-semibold text-green-700">
                    Mã đơn hàng: {order.order_number}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(order.created_at)}
                </span>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm border
                  ${
                    order.status === "Đã giao"
                      ? "bg-green-200 text-green-800 border-green-300"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                  }
                `}
              >
                {order.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
function MyReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const { token } = useAuth();

  const getListReview = async () => {
    try {
      const res = await axios.get(
        `https://momsbest-be.onrender.com/api/productReviews/getListReviewByUser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews(res?.data);
    } catch (error) {
      message.error(error.toString());
    }
  };

  useEffect(() => {
    getListReview();
  }, []);

  return (
    <div>
      <h4 className="font-semibold mb-4 flex items-center text-lg">
        <ReviewIcon />
        Đánh giá của tôi
      </h4>
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-gray-400">
          <ReviewIcon />
          <span>Bạn chưa có đánh giá nào.</span>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <li
              key={review._id}
              className="bg-yellow-50 border border-yellow-100 rounded-xl shadow-sm p-4 flex flex-col gap-2 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2">
                <ReviewIcon />
                <span className="text-sm text-yellow-800">
                  {review.comment}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-white border border-yellow-200 rounded px-2 py-0.5 text-yellow-700 font-medium">
                  {review.rating}
                </span>
                <span>| {formatDate(review.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
function NotificationSettingsTab() {
  const [settings, setSettings] = useState(mockNotificationSettings);
  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.checked });
  };
  return (
    <div>
      <h4 className="font-semibold mb-4 flex items-center text-lg">
        <NotiIcon />
        Cài đặt thông báo
      </h4>
      <p className="text-gray-500 mb-4 text-sm flex items-center">
        <NotiIcon />
        Quản lý các kênh nhận thông báo từ hệ thống.
      </p>
      <form className="space-y-3">
        <label className="flex items-center gap-3 bg-pink-50 border border-pink-100 rounded-lg px-4 py-2">
          <input
            type="checkbox"
            name="email"
            checked={settings.email}
            onChange={handleChange}
            className="accent-pink-500"
          />
          <span className="font-medium text-pink-700">Email</span>
          <span className="text-xs text-gray-400">
            (Nhận thông báo qua email)
          </span>
        </label>
        <label className="flex items-center gap-3 bg-pink-50 border border-pink-100 rounded-lg px-4 py-2">
          <input
            type="checkbox"
            name="sms"
            checked={settings.sms}
            onChange={handleChange}
            className="accent-pink-500"
          />
          <span className="font-medium text-pink-700">SMS</span>
          <span className="text-xs text-gray-400">
            (Nhận thông báo qua tin nhắn)
          </span>
        </label>
        <label className="flex items-center gap-3 bg-pink-50 border border-pink-100 rounded-lg px-4 py-2">
          <input
            type="checkbox"
            name="push"
            checked={settings.push}
            onChange={handleChange}
            className="accent-pink-500"
          />
          <span className="font-medium text-pink-700">Thông báo đẩy</span>
          <span className="text-xs text-gray-400">
            (Nhận thông báo trên trình duyệt/app)
          </span>
        </label>
      </form>
    </div>
  );
}

function getLevelColor(level) {
  switch (level) {
    case "Thành viên mới":
      return {
        bg: "bg-blue-200 text-blue-700 border border-blue-400 shadow-blue-200",
        icon: "🆕",
      };
    case "Thành viên đồng":
      return {
        bg: "bg-yellow-200 text-yellow-800 border border-yellow-400 shadow-yellow-200",
        icon: "🥉",
      };
    case "Thành viên bạc":
      return {
        bg: "bg-gray-200 text-gray-800 border border-gray-400 shadow-gray-200",
        icon: "🥈",
      };
    case "Thành viên vàng":
      return {
        bg: "bg-orange-200 text-orange-800 border border-orange-400 shadow-orange-200",
        icon: "🥇",
      };
    default:
      return {
        bg: "bg-gray-100 text-gray-600 border border-gray-200",
        icon: "",
      };
  }
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser && fetchUser();
    // eslint-disable-next-line
  }, []);

  const handleEditChange = (e) => {
    // setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // setUser(editData);
    setShowEditModal(false);
  };

  return (
    <div className=" text-black pt-16 mx-auto bg-cover font-space-grotesk bg-[url('https://images.pexels.com/photos/1157389/pexels-photo-1157389.jpeg?auto=compress&cs=tinysrgb&w=600')] p-4">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Thông tin cá nhân */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 relative">
          <div className="relative group">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-blue-200 shadow-lg transition-transform group-hover:scale-105"
            />
            <button
              className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition"
              onClick={() => setShowEditModal(true)}
              title="Chỉnh sửa thông tin"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.788l-4 1 1-4 12.362-12.3z"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-1 text-blue-700">
              {user.name}
            </h2>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow ${
                getLevelColor(user.current_level).bg
              }`}
            >
              <span>{getLevelColor(user.current_level).icon}</span>
              {user.current_level}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b-2 border-blue-100 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 font-semibold border-b-4 transition-all duration-200 rounded-t-lg focus:outline-none text-base
              ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-700 bg-white shadow"
                  : "border-transparent text-gray-500 hover:text-blue-500 hover:bg-blue-50"
              }
            `}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Nội dung từng tab */}
        <div className="bg-white rounded-xl shadow p-6 min-h-[220px]">
          {activeTab === "posts" && <MyPostsTab />}
          {activeTab === "questions" && <MyQuestionsTab />}
          {activeTab === "orders" && <MyOrdersTab />}
          {activeTab === "reviews" && <MyReviewsTab />}
          {activeTab === "notifications" && <NotificationSettingsTab />}
        </div>

        {/* Modal chỉnh sửa thông tin */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-6 text-blue-700">
                Chỉnh sửa thông tin cá nhân
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <img
                    src={user.avatar}
                    alt="avatar preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow"
                  />
                  <span className="text-xs text-gray-400">
                    Xem trước ảnh đại diện
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tên</label>
                  <Input
                    name="name"
                    value={UserCheck2.name}
                    onChange={handleEditChange}
                    placeholder="Nhập tên của bạn"
                    className="bg-blue-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    name="email"
                    value={UserCheck2.email}
                    onChange={handleEditChange}
                    placeholder="Nhập email"
                    className="bg-blue-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ảnh đại diện (URL)
                  </label>
                  <Input
                    name="avatar"
                    value={UserCheck2.avatar}
                    onChange={handleEditChange}
                    placeholder="Dán link ảnh đại diện"
                    className="bg-blue-50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Lưu thay đổi
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
