import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaBox,
  FaListUl,
  FaShoppingBag,
  FaRegNewspaper,
  FaComments,
  FaRegCommentDots,
} from "react-icons/fa";

const menu = [
  {
    path: "/admin",
    label: "Dashboard",
    icon: <FaHome className="text-pink-400" />,
  },
  {
    path: "/admin/users",
    label: "Quản lý tài khoản",
    icon: <FaUserFriends className="text-blue-400" />,
  },
  {
    path: "/admin/products",
    label: "Quản lý sản phẩm",
    icon: <FaBox className="text-green-400" />,
  },
  {
    path: "/admin/categories",
    label: "Quản lý danh mục",
    icon: <FaListUl className="text-yellow-400" />,
  },
  {
    path: "/admin/orders",
    label: "Quản lý đơn hàng",
    icon: <FaShoppingBag className="text-purple-400" />,
  },
  {
    path: "/admin/articles",
    label: "Quản lý bài viết",
    icon: <FaRegNewspaper className="text-pink-300" />,
  },
  {
    path: "/admin/forumthreads",
    label: "Quản lý chủ đề forum",
    icon: <FaComments className="text-blue-300" />,
  },
  {
    path: "/admin/forumcomments",
    label: "Quản lý bình luận forum",
    icon: <FaRegCommentDots className="text-yellow-300" />,
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="w-64 min-h-screen  bg-[url('https://images.pexels.com/photos/3845407/pexels-photo-3845407.jpeg?auto=compress&cs=tinysrgb&w=600')] text-gray-700 p-4 shadow-xl font-space-grotesk">
      <h2 className="text-2xl font-extrabold mb-8 text-pink-400 tracking-tight text-center drop-shadow-sm">
        Mẹ & Bé Admin
      </h2>
      <nav>
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all text-lg shadow-sm hover:scale-105 hover:bg-pink-100/60 hover:text-pink-500 hover:shadow-lg duration-200 cursor-pointer ${
                  location.pathname === item.path
                    ? "bg-pink-200/80 text-pink-600 shadow-lg"
                    : "bg-white/80 text-gray-700"
                }`}
              >
                {item.icon}
                <span className="text-base">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
