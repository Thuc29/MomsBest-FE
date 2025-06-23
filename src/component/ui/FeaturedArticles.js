import React from "react";
import { Link } from "react-router-dom";
import { featuredArticles } from "../data/featuredData";

const FeaturedArticles = () => {
  return (
    <section className="bg-white bg-opacity-80 rounded-xl shadow p-6 my-8 font-space-grotesk">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {featuredArticles.slice(0, 4).map((article) => (
          <div key={article.id} className="flip-card">
            <div className="flip-card-inner">
              {/* Mặt trước */}
              <div className="flip-card-front bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center justify-center">
                <img
                  src={article.image}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-40 px-4 py-2 rounded">
                    <h3 className="text-xl font-bold text-white text-center drop-shadow-md">
                      {article.title}
                    </h3>
                  </div>
                </div>
              </div>
              {/* Mặt sau */}
              <div className="flip-card-back bg-pink-50 rounded-lg shadow flex flex-col items-center justify-center p-4">
                <p className="text-base text-gray-600 mb-2 line-clamp-4 text-center">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span className="mr-3">👁️ {article.views} lượt xem</span>
                  <span>💬 {article.comments} bình luận</span>
                </div>
                <Link
                  to={`/forum/library/article/${article.id}`}
                  className="mt-2 px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm font-medium text-center"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Link
          to="/forum/library"
          className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-medium text-sm"
        >
          Xem tất cả
        </Link>
      </div>
    </section>
  );
};

export default FeaturedArticles;
