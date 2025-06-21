import React, { useState } from "react";
import { Link } from "react-router-dom";

const PAGE_SIZE = 4;

const HotTopics = ({ topics = [] }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(topics.length / PAGE_SIZE);
  const pagedTopics = topics.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section className="bg-white bg-opacity-80 rounded-xl shadow p-6 my-8">
      <h2 className="text-xl font-bold text-pink-600 mb-4 text-center">
        Chủ đề đang hot trong Diễn đàn
      </h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {pagedTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-pink-50 border border-pink-200 rounded-lg p-4 flex flex-col justify-between shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              <Link
                to={`/forum/${topic.id}`}
                className="text-base font-semibold text-pink-700 hover:text-pink-500 block mb-2 line-clamp-2"
              >
                {topic.title}
              </Link>
              <div className="text-sm text-gray-500 mb-2">
                {topic.replies} trả lời • {topic.views} lượt xem
              </div>
              <div className="text-xs text-gray-400">
                Gần nhất: {topic.lastUser}
              </div>
            </div>
            <Link
              to={`/forum/${topic.id}`}
              className="mt-4 px-3 py-1 bg-pink-100 text-pink-600 rounded hover:bg-pink-200 text-sm font-medium text-center"
            >
              Xem chi tiết
            </Link>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1 rounded bg-gray-200 text-gray-600 disabled:opacity-50"
        >
          Trước
        </button>
        <span className="mx-2 text-sm">
          Trang {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className="px-3 py-1 rounded bg-gray-200 text-gray-600 disabled:opacity-50"
        >
          Sau
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <Link
          to="/forum"
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 font-medium text-sm"
        >
          Tham gia Diễn đàn
        </Link>
      </div>
    </section>
  );
};

export default HotTopics;
