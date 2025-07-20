import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyBillWave,
  FaRegNewspaper,
  FaComments,
  FaRegCommentDots,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaClock,
  FaBell,
  FaCalendarAlt,
  FaTrophy,
  FaStar,
  FaShippingFast,
  FaMoneyCheckAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

const ICONS = {
  "Tài khoản": (
    <FaUsers className="text-blue-500 text-3xl mb-2 drop-shadow-lg" />
  ),
  "Sản phẩm": (
    <FaBoxOpen className="text-green-500 text-3xl mb-2 drop-shadow-lg" />
  ),
  "Đơn hàng": (
    <FaShoppingCart className="text-yellow-500 text-3xl mb-2 drop-shadow-lg" />
  ),
  "Doanh thu": (
    <FaMoneyBillWave className="text-indigo-500 text-3xl mb-2 drop-shadow-lg" />
  ),
  "Chuyên mục": (
    <FaRegNewspaper className="text-pink-500 text-3xl mb-2 drop-shadow-lg" />
  ),
  "Chủ đề forum": (
    <FaComments className="text-purple-500 text-3xl mb-2 drop-shadow-lg" />
  ),
  "Bình luận forum": (
    <FaRegCommentDots className="text-orange-500 text-3xl mb-2 drop-shadow-lg" />
  ),
};

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e42",
  "#6366f1",
  "#ec4899",
  "#a21caf",
  "#f59e42",
];

// Giả lập số liệu phụ (subtitle) cho StatCard
const SUBTITLES = {
  "Tài khoản": "+40% so với tháng trước",
  "Sản phẩm": "+5% so với tháng trước",
  "Đơn hàng": "-3% so với tháng trước",
  "Doanh thu": "+0% so với tháng trước",
  "Chuyên mục": "+2% so với tháng trước",
  "Chủ đề forum": "+19% so với tháng trước",
  "Bình luận forum": "+30% so với tháng trước",
};

// Dữ liệu giả lập cho biểu đồ
const generateChartData = () => {
  const data = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      }),
      orders: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 5000000) + 1000000,
      users: Math.floor(Math.random() * 20) + 5,
    });
  }
  return data;
};

// Dữ liệu giả lập cho hoạt động gần đây
const generateRecentActivity = () => [
  {
    id: 1,
    type: "order",
    message: "Đơn hàng mới #12345",
    time: "2 phút trước",
    icon: FaShoppingCart,
    color: "text-green-500",
  },
  {
    id: 2,
    type: "user",
    message: "Người dùng mới đăng ký",
    time: "5 phút trước",
    icon: FaUsers,
    color: "text-blue-500",
  },
  {
    id: 3,
    type: "product",
    message: "Sản phẩm mới được thêm",
    time: "10 phút trước",
    icon: FaBoxOpen,
    color: "text-purple-500",
  },
  {
    id: 4,
    type: "comment",
    message: "Bình luận mới trên forum",
    time: "15 phút trước",
    icon: FaComments,
    color: "text-orange-500",
  },
  {
    id: 5,
    type: "revenue",
    message: "Doanh thu tăng 1%",
    time: "1 giờ trước",
    icon: FaMoneyBillWave,
    color: "text-indigo-500",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryCount, setCategoryCount] = useState(0);
  const [chartData] = useState(generateChartData());
  const [recentActivity] = useState(generateRecentActivity());
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [recentOrders, setRecentOrders] = useState([]);

  // Hàm lấy số lượng categories trực tiếp
  const fetchCategoryCount = async () => {
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/categories",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const activeCategories = res.data.filter((cat) => cat.is_active);
      setCategoryCount(activeCategories.length);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Hàm lấy đơn hàng gần đây
  const fetchRecentOrders = async () => {
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/admin/orders/recent/list?limit=5",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Validate that res.data is an array and contains valid order objects
      if (Array.isArray(res.data)) {
        const validatedOrders = res.data.filter(
          (order) =>
            order && typeof order === "object" && order.id && order.order_number
        );
        setRecentOrders(validatedOrders);
      } else {
        console.warn("Recent orders API returned non-array data:", res.data);
        setRecentOrders([]);
      }
    } catch (err) {
      console.error("Error fetching recent orders:", err);
      setRecentOrders([]);
    }
  };

  // Hàm kiểm tra kết nối API
  const testAPIConnection = async () => {
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 10000, // 10 seconds timeout
        }
      );
      console.log("API Connection Test - Success:", res.status);
      return true;
    } catch (err) {
      console.error("API Connection Test - Failed:", err.message);
      return false;
    }
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        // Kiểm tra kết nối trước
        const isConnected = await testAPIConnection();
        if (!isConnected) {
          throw new Error("Không thể kết nối đến máy chủ");
        }

        // Lấy thống kê tổng quan
        const dashboardRes = await axios.get(
          "https://momsbest-be.onrender.com/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Dashboard API Response:", dashboardRes.data);

        // Lấy thống kê đơn hàng chi tiết (chỉ khi dashboard thành công)
        let orderStatsRes = null;
        try {
          orderStatsRes = await axios.get(
            "https://momsbest-be.onrender.com/api/admin/orders/stats/overview",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Order Stats Response:", orderStatsRes.data);
        } catch (orderStatsError) {
          console.warn(
            "Order stats API failed, using dashboard data only:",
            orderStatsError.message
          );
        }

        // Kết hợp dữ liệu
        const combinedStats = {
          ...dashboardRes.data,
          orderStats: orderStatsRes?.data || {
            totalOrders: dashboardRes.data.orderCount || 0,
            totalRevenue: dashboardRes.data.totalRevenue || 0,
            pendingOrders: dashboardRes.data.orderStatusStats?.pending || 0,
            confirmedOrders: dashboardRes.data.orderStatusStats?.confirmed || 0,
            processingOrders:
              dashboardRes.data.orderStatusStats?.processing || 0,
            shippedOrders: dashboardRes.data.orderStatusStats?.shipped || 0,
            deliveredOrders: dashboardRes.data.orderStatusStats?.delivered || 0,
            cancelledOrders: dashboardRes.data.orderStatusStats?.cancelled || 0,
            paidOrders: dashboardRes.data.paymentStatusStats?.paid || 0,
            pendingPayments: dashboardRes.data.paymentStatusStats?.pending || 0,
          },
        };

        setStats(combinedStats);

        if (!dashboardRes.data.categoryCount) {
          await fetchCategoryCount();
        }
        await fetchRecentOrders(); // Fetch recent orders after dashboard data
      } catch (err) {
        console.error("Dashboard API Error:", err);
        setError("Không thể tải dữ liệu thống kê");
        await fetchCategoryCount();
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const pieData = [
    { name: "Tài khoản", value: stats.userCount || 0 },
    { name: "Sản phẩm", value: stats.productCount || 0 },
    { name: "Đơn hàng", value: stats.orderCount || 0 },
    { name: "Chuyên mục", value: stats.categoryCount || categoryCount || 0 },
    { name: "Chủ đề forum", value: stats.threadCount || 0 },
    { name: "Bình luận forum", value: stats.commentCount || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Tổng quan hệ thống MomsBest</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <FaBell className="text-gray-400 text-xl" />
              </div>
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Tài khoản"
            value={stats.userCount || 0}
            subtitle={SUBTITLES["Tài khoản"]}
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            label="Sản phẩm"
            value={stats.productCount || 0}
            subtitle={SUBTITLES["Sản phẩm"]}
            trend="up"
            trendValue="+5%"
          />
          <StatCard
            label="Đơn hàng"
            value={stats.orderCount || 0}
            subtitle={SUBTITLES["Đơn hàng"]}
            trend="down"
            trendValue="-3%"
          />
          <StatCard
            label="Doanh thu"
            value={`${(0).toLocaleString()}đ`}
            subtitle={SUBTITLES["Doanh thu"]}
            trend="up"
            trendValue="+0%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Biểu đồ doanh thu
                </h2>
                <div className="flex space-x-2">
                  {["week", "month", "year"].map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedTimeframe === timeframe
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {timeframe === "week"
                        ? "Tuần"
                        : timeframe === "month"
                        ? "Tháng"
                        : "Năm"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      formatter={(value) => [
                        `${value.toLocaleString()}đ`,
                        "Doanh thu",
                      ]}
                      labelStyle={{ color: "#374151" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FaClock className="mr-2 text-blue-500" />
              Hoạt động gần đây
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full bg-gray-100 ${activity.color}`}
                  >
                    <activity.icon className="text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FaChartLine className="mr-2 text-purple-500" />
              Phân bố dữ liệu
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    isAnimationActive
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="transition-all duration-300"
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FaTrophy className="mr-2 text-yellow-500" />
              Thống kê theo ngày
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value) => [value.toLocaleString(), "Đơn hàng"]}
                    labelStyle={{ color: "#374151" }}
                  />
                  <Bar dataKey="orders" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            label="Chuyên mục"
            value={stats.categoryCount || categoryCount || 0}
            subtitle={SUBTITLES["Chuyên mục"]}
            trend="up"
            trendValue="+2%"
          />
          <StatCard
            label="Chủ đề forum"
            value={stats.threadCount || 0}
            subtitle={SUBTITLES["Chủ đề forum"]}
            trend="up"
            trendValue="+19%"
          />
          <StatCard
            label="Bình luận forum"
            value={stats.commentCount || 0}
            subtitle={SUBTITLES["Bình luận forum"]}
            trend="up"
            trendValue="+30%"
          />
        </div>

        {/* Success Rate Section */}
        {stats.orderStats && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaTrophy className="mr-2 text-yellow-500" />
              Tỷ lệ thành công & Hiệu suất
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Success Rate */}
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FaCheck className="text-3xl" />
                  <span className="text-4xl font-bold">
                    {stats.orderStats.totalOrders > 0
                      ? Math.round(
                          ((stats.orderStats.deliveredOrders || 0) /
                            stats.orderStats.totalOrders) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Tỷ lệ giao hàng thành công
                </h3>
                <p className="text-green-100">
                  {stats.orderStats.deliveredOrders || 0} /{" "}
                  {stats.orderStats.totalOrders || 0} đơn hàng
                </p>
              </div>

              {/* Payment Success Rate */}
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FaMoneyCheckAlt className="text-3xl" />
                  <span className="text-4xl font-bold">
                    {stats.orderStats.totalOrders > 0
                      ? Math.round(
                          ((stats.orderStats.paidOrders || 0) /
                            stats.orderStats.totalOrders) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Tỷ lệ thanh toán thành công
                </h3>
                <p className="text-blue-100">
                  {stats.orderStats.paidOrders || 0} /{" "}
                  {stats.orderStats.totalOrders || 0} đơn hàng
                </p>
              </div>

              {/* Cancellation Rate */}
              <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FaTimes className="text-3xl" />
                  <span className="text-4xl font-bold">
                    {stats.orderStats.totalOrders > 0
                      ? Math.round(
                          ((stats.orderStats.cancelledOrders || 0) /
                            stats.orderStats.totalOrders) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Tỷ lệ hủy đơn hàng
                </h3>
                <p className="text-red-100">
                  {stats.orderStats.cancelledOrders || 0} /{" "}
                  {stats.orderStats.totalOrders || 0} đơn hàng
                </p>
              </div>

              {/* Average Order Value */}
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FaMoneyBillWave className="text-3xl" />
                  <span className="text-4xl font-bold">
                    {stats.orderStats.totalOrders > 0
                      ? Math.round(
                          (stats.orderStats.totalRevenue || 0) /
                            stats.orderStats.totalOrders /
                            1000
                        )
                      : 0}
                    K
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Giá trị đơn hàng trung bình
                </h3>
                <p className="text-purple-100">
                  {(stats.orderStats.totalRevenue || 0).toLocaleString()}đ /{" "}
                  {stats.orderStats.totalOrders || 0} đơn
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders Section */}
        {recentOrders.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaShoppingCart className="mr-2 text-blue-500" />
              Đơn hàng gần đây
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đặt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.order_number || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.total_amount
                            ? order.total_amount.toLocaleString() + "đ"
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                ? "bg-purple-100 text-purple-800"
                                : order.status === "shipped"
                                ? "bg-orange-100 text-orange-800"
                                : order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status
                              ? order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)
                              : "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Xem chi tiết
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, subtitle, trend, trendValue }) {
  const getTrendIcon = () => {
    if (trend === "up") {
      return <FaArrowUp className="text-green-500" />;
    } else if (trend === "down") {
      return <FaArrowDown className="text-red-500" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        {ICONS[label]}
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trendValue}
          </span>
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
        {value}
      </div>
      <div className="text-gray-600 font-medium mb-1 group-hover:text-gray-800 transition-colors duration-300">
        {label}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
          {subtitle}
        </div>
      )}
    </div>
  );
}
