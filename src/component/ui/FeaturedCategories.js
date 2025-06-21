import React from "react";
import { Link } from "react-router-dom";
import { featuredCategories } from "../data/featuredData";
import {
  FaBaby,
  FaAppleAlt,
  FaHeartbeat,
  FaShoppingCart,
  FaBook,
  FaStethoscope,
  FaSmile,
  FaLeaf,
} from "react-icons/fa";
const iconMap = {
  FaBaby,
  FaAppleAlt,
  FaHeartbeat,
  FaShoppingCart,
  FaBook,
  FaStethoscope,
  FaSmile,
  FaLeaf,
};

const FeaturedCategories = () => {
  return (
    <section className="bg-white bg-opacity-80 rounded-xl shadow p-6 my-8">
      <h2 className="text-xl font-bold text-pink-600 mb-4 text-center">
        Chuyên mục nổi bật
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {featuredCategories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.link}
            className="flex flex-col items-center group"
          >
            <span
              className={`rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-2 shadow-md transition-all duration-200 ${cat.color} group-hover:scale-110`}
            >
              {iconMap[cat.icon] && React.createElement(iconMap[cat.icon])}
            </span>
            <span className="mt-1 text-base font-semibold text-gray-800 group-hover:text-pink-600 text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
