import React from "react";

const NewsCard = ({ news }) => {
  return (
    <div className="flex flex-row items-stretch bg-white rounded-lg shadow border border-gray-100 px-0 py-0 hover:bg-gray-50 transition-all cursor-pointer min-h-[120px] overflow-hidden">
      <div className="flex-1 pr-4 py-3 pl-4 min-w-0 border-r-2 border-gray-200 flex flex-col justify-center">
        <div className="font-semibold text-base text-black line-clamp-2 mb-1">
          {news.url ? (
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {news.title}
            </a>
          ) : (
            news.title
          )}
        </div>
        <div className="text-sm text-gray-600 line-clamp-2 mb-1">
          {news.description}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {news.author} {news.author && news.date && <span>•</span>} {news.date}
        </div>
      </div>
      {news.thumbnail && (
        <div className="flex items-center justify-center pl-4 pr-4 py-3 bg-white border-l-2 border-gray-200">
          <img
            src={news.thumbnail}
            alt={news.title}
            className="w-36 h-24 object-cover rounded-md border border-gray-300 shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default NewsCard;
