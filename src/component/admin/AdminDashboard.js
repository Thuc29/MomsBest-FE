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
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
  "Bài viết": (
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
  "Tài khoản": "+12% so với tháng trước",
  "Sản phẩm": "+5% so với tháng trước",
  "Đơn hàng": "-3% so với tháng trước",
  "Doanh thu": "+8% so với tháng trước",
  "Bài viết": "+2% so với tháng trước",
  "Chủ đề forum": "+1% so với tháng trước",
  "Bình luận forum": "+7% so với tháng trước",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://momsbest-be-r1im.onrender.com/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStats(res.data);
      } catch (err) {
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return null;

  // Chuẩn bị dữ liệu cho PieChart
  const pieData = [
    { name: "Tài khoản", value: stats.userCount },
    { name: "Sản phẩm", value: stats.productCount },
    { name: "Đơn hàng", value: stats.orderCount },
    { name: "Bài viết", value: stats.articleCount },
    { name: "Chủ đề forum", value: stats.threadCount },
    { name: "Bình luận forum", value: stats.commentCount },
  ];

  return (
    <div className="p-6 min-h-screen bg-[url('https://images.pexels.com/photos/20717169/pexels-photo-20717169.jpeg')] bg-cover bg-center">
      <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-1 mb-8 shadow-xl">
        <div className="bg-white rounded-xl p-6 flex items-center gap-4">
          <FaUsers className="text-blue-500 text-4xl drop-shadow-lg" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
            Dashboard tổng quan
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        <StatCard
          label="Tài khoản"
          value={stats.userCount}
          subtitle={SUBTITLES["Tài khoản"]}
        />
        <StatCard
          label="Sản phẩm"
          value={stats.productCount}
          subtitle={SUBTITLES["Sản phẩm"]}
        />
        <StatCard
          label="Đơn hàng"
          value={stats.orderCount}
          subtitle={SUBTITLES["Đơn hàng"]}
        />
        <StatCard
          label="Doanh thu"
          value={stats.totalRevenue.toLocaleString()}
          subtitle={SUBTITLES["Doanh thu"]}
        />
        <StatCard
          label="Bài viết"
          value={stats.articleCount}
          subtitle={SUBTITLES["Bài viết"]}
        />
        <StatCard
          label="Chủ đề forum"
          value={stats.threadCount}
          subtitle={SUBTITLES["Chủ đề forum"]}
        />
        <StatCard
          label="Bình luận forum"
          value={stats.commentCount}
          subtitle={SUBTITLES["Bình luận forum"]}
        />
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FaPieChart className="text-purple-500" /> Tỉ lệ các đối tượng
        </h2>
        <div className="w-full h-80 flex flex-col md:flex-row items-center justify-center">
          <ResponsiveContainer width={350} height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
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
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtitle }) {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-blue-100 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
      {ICONS[label]}
      <div className="text-4xl font-extrabold text-blue-600 mb-1 drop-shadow-sm group-hover:text-purple-600 transition-colors duration-300">
        {value}
      </div>
      <div className="text-gray-700 font-semibold text-lg mb-1 group-hover:text-purple-700 transition-colors duration-300">
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

// Thêm icon cho chart title
function FaPieChart(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
    >
      <path d="M12 2a10 10 0 1 0 10 10h-10z" />
      <path d="M13 2.05V12h9.95A10.001 10.001 0 0 0 13 2.05z" />
    </svg>
  );
}
