import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Heart, Bookmark, Share, Flag } from "lucide-react";

const ArticleDetailModal = ({
  article,
  onClose,
  relatedArticles = [],
  onArticleSelect,
  onLike,
  isLiked,
  likeCount,
}) => {
  if (!article) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] mx-auto relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-pink-500" />
            <span className="text-sm font-medium text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
          <button
            className="text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-full transition"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Image and Basic Info */}
            <div className="lg:w-2/5 p-6">
              {/* Article Image */}
              <div className="mb-6">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
              </div>

              {/* Action Buttons */}
              <div className="mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => onLike && onLike(article.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                      isLiked
                        ? "bg-pink-100 text-pink-600"
                        : "bg-gray-100 text-gray-600 hover:bg-pink-50"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={isLiked ? "fill-current" : ""}
                    />
                    <span className="text-sm font-medium">
                      {likeCount || 1}
                    </span>
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 transition">
                    <Bookmark size={16} />
                    <span className="text-sm font-medium">Lưu</span>
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-green-50 transition">
                    <Share size={16} />
                    <span className="text-sm font-medium">Chia sẻ</span>
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 transition">
                    <Flag size={16} />
                    <span className="text-sm font-medium">Báo cáo</span>
                  </button>
                </div>

                <button className="w-full mt-3 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full text-sm font-medium transition">
                  Theo dõi chủ đề
                </button>
              </div>

              {/* Quick Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Thông tin bài viết
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-mono text-gray-800">
                        {article.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="text-gray-800">{article.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại:</span>
                      <span className="text-gray-800">Bài viết chuyên môn</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/forum/library/article/${article.id}`}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  onClick={onClose}
                >
                  <BookOpen size={18} />
                  Đọc toàn bộ bài viết
                </Link>

                {/* Quick Stats */}
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    💡 Kiến thức hữu ích
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Bài viết này chứa thông tin chi tiết và hướng dẫn cụ thể về{" "}
                    {article.category.toLowerCase()}, được biên soạn bởi các
                    chuyên gia.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:w-3/5 p-6 border-l border-gray-200">
              {/* Article Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                {article.title}
              </h2>

              {/* Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  Tóm tắt nội dung
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {article.summary}
                </p>
              </div>

              {/* Key Points */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Điểm chính
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>Thông tin chuyên môn từ các chuyên gia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>Hướng dẫn thực tế và dễ áp dụng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>Dựa trên kinh nghiệm và nghiên cứu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>Phù hợp cho các bậc cha mẹ</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Bài viết liên quan
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {relatedArticles.slice(0, 2).map((relatedArticle) => (
                      <div
                        key={relatedArticle.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition group"
                        onClick={() => onArticleSelect(relatedArticle)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen size={20} className="text-pink-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 mb-1 group-hover:text-pink-600 transition line-clamp-2">
                              {relatedArticle.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {relatedArticle.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                Thư viện kiến thức
              </span>
              <span>•</span>
              <span>Diễn đàn Mẹ và Bé</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArticleDetailModal;
