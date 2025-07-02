import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(categories.length / pageSize);
  const pagedCategories = categories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://momsbest-be.onrender.com/api/categories"
        );
        setCategories(res.data);
      } catch (error) {
        setCategories([]); // fallback nếu lỗi
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="bg-white bg-opacity-80 rounded-xl shadow p-6 my-8">
      <h2 className="text-xl font-bold text-pink-600 mb-4 text-center">
        Chuyên mục nổi bật
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {pagedCategories.map((cat) => (
          <Link
            key={cat.id || cat._id}
            to={cat.link}
            className="flex flex-col items-center group"
          >
            <span
              className={`rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-2 shadow-md transition-all duration-200 ${cat.color} group-hover:scale-110`}
            >
              {cat.icon}
            </span>
            <span className="mt-1 text-base font-semibold text-gray-800 group-hover:text-pink-600 text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded-full font-semibold text-sm ${
              page === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            Trước
          </button>
          <span className="px-2 py-1 text-gray-700 font-medium">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded-full font-semibold text-sm ${
              page === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            Sau
          </button>
        </div>
      )}
    </section>
  );
};

export default FeaturedCategories;
