import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  MessageSquare,
  PlusCircle,
  Heart,
  MessageCircle,
  Filter,
  TrendingUp,
  Clock,
  Eye,
  BookOpen,
} from "lucide-react";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const defaultAvatar = "https://ui-avatars.com/api/?name=User&background=random";

// Thêm mock categories và articles cho thư viện
const libraryCategories = [
  { id: "1", name: "Cẩm nang thai kỳ" },
  { id: "2", name: "Dinh dưỡng mẹ và bé" },
  { id: "3", name: "Chăm sóc sơ sinh" },
  { id: "4", name: "Sức khỏe tinh thần" },
  { id: "5", name: "Phát triển trẻ nhỏ" },
];
const libraryArticles = [
  {
    id: "a1",
    title: "Những điều mẹ bầu cần biết trong 3 tháng đầu",
    summary:
      "Tìm hiểu các lưu ý quan trọng về dinh dưỡng, vận động và kiểm tra sức khỏe trong 3 tháng đầu thai kỳ.",
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400",
  },
  {
    id: "a2",
    title: "Thực đơn dinh dưỡng cho mẹ sau sinh",
    summary:
      "Gợi ý thực đơn giúp mẹ phục hồi sức khỏe và tăng lượng sữa cho bé.",
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400",
  },
  {
    id: "a3",
    title: "Cách tắm cho trẻ sơ sinh an toàn",
    summary:
      "Hướng dẫn các bước tắm cho trẻ sơ sinh đúng cách, an toàn và nhẹ nhàng.",
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400",
  },
  {
    id: "a4",
    title: "Dấu hiệu trầm cảm sau sinh và cách phòng tránh",
    summary:
      "Nhận biết sớm các dấu hiệu trầm cảm sau sinh và biện pháp hỗ trợ tâm lý cho mẹ.",
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg?auto=compress&w=400",
  },
  {
    id: "a5",
    title: "Các mốc phát triển quan trọng của trẻ 1-3 tuổi",
    summary:
      "Tổng hợp các mốc phát triển về vận động, ngôn ngữ và nhận thức của trẻ nhỏ.",
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&w=400",
  },
  {
    id: "a6",
    title: "Bí quyết giúp bé ăn ngon miệng hơn",
    summary:
      "Chia sẻ các mẹo nhỏ giúp bé yêu ăn uống tốt và phát triển khỏe mạnh.",
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400",
  },
  {
    id: "a7",
    title: "Chuẩn bị tâm lý trước khi mang thai",
    summary:
      "Những lưu ý về sức khỏe tinh thần, cảm xúc và các bước chuẩn bị tâm lý vững vàng trước khi bước vào thai kỳ.",
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=400",
  },
];

const Forum = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [librarySearchTerm, setLibrarySearchTerm] = useState("");
  const [librarySelectedCategory, setLibrarySelectedCategory] = useState("");
  const [showAllLibraryCategories, setShowAllLibraryCategories] =
    useState(false);
  const [libraryArticlesToShow, setLibraryArticlesToShow] = useState(4);
  const [selectedLibraryArticle, setSelectedLibraryArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    is_active: true,
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  // Thêm state cho form tạo thread
  const [newThread, setNewThread] = useState({
    title: "",
    content: "",
    thread_type: "discussion",
    is_pinned: false,
  });
  const [creatingThread, setCreatingThread] = useState(false);
  const [errorThread, setErrorThread] = useState("");
  const [currentThreadPage, setCurrentThreadPage] = useState(1);
  const threadsPerPage = 4;

  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [threadComments, setThreadComments] = useState([]);

  // Lấy user hiện tại từ localStorage
  const { user } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  useEffect(() => {
    if (!threadId) return;
    const fetchThread = async () => {
      try {
        const res = await api.get(`/forumthreads/${threadId}`);

        setThread(res.data);
      } catch (err) {
        setThread(null);
      }
    };
    fetchThread();
  }, [threadId]);

  // Lọc bài viết thư viện
  const filteredLibraryArticles = libraryArticles.filter(
    (a) =>
      (librarySelectedCategory === "" ||
        a.category === librarySelectedCategory) &&
      (a.title.toLowerCase().includes(librarySearchTerm.toLowerCase()) ||
        a.summary.toLowerCase().includes(librarySearchTerm.toLowerCase()))
  );

  // Xử lý scroll lock khi mở modal
  useEffect(() => {
    if (selectedLibraryArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedLibraryArticle]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, threadRes] = await Promise.all([
          api.get("/categories"),
          api.get("/forumthreads"),
        ]);
        setCategories(catRes.data);
        setThreads(threadRes.data);
      } catch (err) {
        // handle error
        setCategories([]);
        setThreads([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!threadId) return;
    const fetchComments = async () => {
      try {
        const res = await api.get(`/forumcomments/thread/${threadId}`);
        setThreadComments(res.data);
      } catch (err) {
        setThreadComments([]);
      }
    };
    fetchComments();
  }, [threadId]);

  // Đếm số thread theo category
  const getThreadCount = (categoryId) =>
    threads.filter(
      (thread) => thread.category_id && thread.category_id._id === categoryId
    ).length;

  // Lọc thread theo search và category
  const filteredThreads = threads.filter((thread) => {
    const searchMatch =
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch =
      selectedCategory === null ||
      (thread.category_id && thread.category_id._id === selectedCategory._id);
    return searchMatch && categoryMatch;
  });

  // Sắp xếp thread
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortOption === "mostViewed") {
      return b.views - a.views;
    } else if (sortOption === "mostCommented") {
      // Nếu có comments count
      return (b.comments || 0) - (a.comments || 0);
    }
    return 0;
  });

  const categoryThreads = selectedCategory
    ? sortedThreads.filter(
        (thread) =>
          thread.category_id && thread.category_id._id === selectedCategory._id
      )
    : [];

  const totalThreadPages = Math.ceil(categoryThreads.length / threadsPerPage);
  const paginatedThreads = categoryThreads.slice(
    (currentThreadPage - 1) * threadsPerPage,
    currentThreadPage * threadsPerPage
  );

  // Hàm handle submit
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await api.post("/categories", newCategory);
      setCategories((prev) => [...prev, res.data]);
      setShowNewCategoryModal(false);
      setNewCategory({
        name: "",
        description: "",
        is_active: true,
      });
      Swal.fire({
        title: "Thành công!",
        text: "Chuyên mục đã được tạo.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Có lỗi xảy ra");
      Swal.fire({
        title: "Lỗi",
        text: err.response?.data?.error || "Có lỗi xảy ra khi tạo chuyên mục.",
        icon: "error",
      });
    }
    setCreating(false);
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setCreatingThread(true);
    setErrorThread("");
    try {
      const res = await api.post("/forumthreads", {
        ...newThread,
        author_id: user?._id,
        category_id: selectedCategory._id,
      });

      setThreads((prev) => [...prev, res.data]);
      setShowNewThreadModal(false);
      setNewThread({
        title: "",
        content: "",
        thread_type: "discussion",
        is_pinned: false,
      });
    } catch (err) {
      setErrorThread(err.response?.data?.error || "Có lỗi xảy ra");
    }
    setCreatingThread(false);
  };

  // Thêm hàm handleDeleteCategory
  const handleDeleteCategory = async (categoryId) => {
    const confirm = await Swal.fire({
      title: "Bạn có chắc muốn xóa chuyên mục này?",
      text: "Tất cả chủ đề trong chuyên mục cũng sẽ bị xóa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/categories/${categoryId}`);
        setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
        Swal.fire({
          title: "Đã xóa!",
          text: "Chuyên mục đã được xóa thành công.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          title: "Lỗi",
          text: err.response?.data?.error || "Có lỗi xảy ra khi xóa.",
          icon: "error",
        });
      }
    }
  };

  if (loading)
    return <div className="text-center py-20">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen text-black bg-cover bg-center bg-[url('https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600')] flex flex-col font-space-grotesk">
      {/* Hero Section */}
      {activeTab === "categories" && (
        <section className="pt-24 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h1 className="text-3xl font-bold text-pink-600 text-center mb-4">
                Diễn đàn Mẹ và Bé
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Nơi chia sẻ kinh nghiệm, đặt câu hỏi và kết nối cộng đồng các bà
                mẹ
              </p>
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Tìm kiếm chủ đề, bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 px-12 rounded-full bg-white text-gray-800 border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
                />
                <Search
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={18}
                />
                {user && (
                  <button
                    onClick={() => setShowNewCategoryModal(true)}
                    className="absolute right-2 top-1.5 bg-pink-500 hover:bg-pink-600 text-white px-4 py-1.5 rounded-full flex items-center gap-1.5"
                  >
                    <PlusCircle size={16} />
                    <span>Chuyên mục mới</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      {activeTab === "library" && (
        <section className="pt-24 pb-5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h1 className="text-3xl font-bold text-pink-600 text-center mb-4">
                Thư viện kiến thức
              </h1>
              <p className="text-gray-600 mb-4">
                Kho tài liệu hữu ích về sức khỏe, dinh dưỡng và phát triển mẹ &
                bé
              </p>
              <div className="relative max-w-2xl mx-auto mb-8">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={librarySearchTerm}
                  onChange={(e) => setLibrarySearchTerm(e.target.value)}
                  className="w-full py-3 px-12 rounded-full bg-white text-gray-800 border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
                />
                <Search
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-8 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <aside className="lg:w-1/4">
              {/* Navigation Tabs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden mb-6">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("categories")}
                    className={`flex-1 py-3 text-center font-medium transition ${
                      activeTab === "categories"
                        ? "bg-pink-500 text-white"
                        : "bg-white text-gray-600 hover:bg-pink-50"
                    }`}
                  >
                    Chuyên mục
                  </button>
                  <button
                    onClick={() => setActiveTab("library")}
                    className={`flex-1 py-3 text-center font-medium transition ${
                      activeTab === "library"
                        ? "bg-pink-500 text-white"
                        : "bg-white text-gray-600 hover:bg-pink-50"
                    }`}
                  >
                    Thư viện
                  </button>
                </div>
              </div>

              {/* Filters cho tab Chuyên mục */}
              {activeTab === "library" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen size={18} /> Danh mục
                  </h2>
                  <div className="space-y-2">
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
                        librarySelectedCategory === ""
                          ? "bg-pink-500 text-white"
                          : "bg-white text-gray-700 hover:bg-pink-50"
                      }`}
                      onClick={() => setLibrarySelectedCategory("")}
                    >
                      Tất cả bài viết
                    </button>
                    {(showAllLibraryCategories
                      ? libraryCategories
                      : libraryCategories.slice(0, 5)
                    ).map((cat) => (
                      <button
                        key={cat.id}
                        className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
                          librarySelectedCategory === cat.name
                            ? "bg-pink-500 text-white"
                            : "bg-white text-gray-700 hover:bg-pink-50"
                        }`}
                        onClick={() => setLibrarySelectedCategory(cat.name)}
                      >
                        {cat.name}
                      </button>
                    ))}
                    {libraryCategories.length > 5 &&
                      !showAllLibraryCategories && (
                        <button
                          className="w-full text-left px-4 py-2 rounded-lg font-medium text-pink-600 hover:text-pink-800"
                          onClick={() => setShowAllLibraryCategories(true)}
                        >
                          Xem thêm danh mục
                        </button>
                      )}
                    {libraryCategories.length > 5 &&
                      showAllLibraryCategories && (
                        <button
                          className="w-full text-left px-4 py-2 rounded-lg font-medium text-pink-600 hover:text-pink-800"
                          onClick={() => setShowAllLibraryCategories(false)}
                        >
                          Thu gọn danh mục
                        </button>
                      )}
                  </div>
                </div>
              )}

              {/* Filter cho tab Chuyên mục: Sắp xếp chủ đề */}
              {activeTab === "categories" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Filter size={18} /> Sắp xếp chủ đề
                  </h2>
                  <div className="space-y-2 text-black">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sortOption"
                        value="newest"
                        checked={sortOption === "newest"}
                        onChange={() => setSortOption("newest")}
                        className="mr-2"
                      />
                      <Clock size={16} className="mr-2 text-gray-500" />
                      <span>Mới nhất</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sortOption"
                        value="mostViewed"
                        checked={sortOption === "mostViewed"}
                        onChange={() => setSortOption("mostViewed")}
                        className="mr-2"
                      />
                      <Eye size={16} className="mr-2 text-gray-500" />
                      <span>Xem nhiều nhất</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sortOption"
                        value="mostCommented"
                        checked={sortOption === "mostCommented"}
                        onChange={() => setSortOption("mostCommented")}
                        className="mr-2"
                      />
                      <MessageCircle size={16} className="mr-2 text-gray-500" />
                      <span>Bình luận nhiều</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Quick Stats or Featured Content */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} /> Chủ đề nổi bật
                </h2>
                <div className="space-y-3">
                  {threads
                    .filter((thread) => thread.is_pinned)
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 3)
                    .map((thread) => (
                      <Link
                        key={thread.id}
                        to={`/forumthreads/${thread._id}`}
                        className="block bg-pink-50 hover:bg-pink-100 p-3 rounded-lg transition"
                      >
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                          {thread.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Heart size={12} /> {thread.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} />{" "}
                            {thread.commentsCount || 0}
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:w-3/4">
              {activeTab === "categories" && (
                <>
                  {selectedCategory ? (
                    // Selected Category View with Threads
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col gap-2 w-[80%]">
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className="text-blue-500 underline text-sm hover:text-blue-700 mb-2 flex items-center gap-1"
                          >
                            ← Quay lại
                          </button>
                          <div className="flex items-center gap-4 mb-4">
                            <div>
                              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                {selectedCategory.name}
                              </h2>
                              <p className="text-gray-600 text-base line-clamp-3">
                                {selectedCategory.description}
                              </p>
                              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                <span>
                                  {getThreadCount(selectedCategory._id)} chủ đề
                                </span>
                                {/* Có thể thêm số lượng bài viết nếu có */}
                              </div>
                            </div>
                          </div>
                        </div>
                        {user && (
                          <button
                            onClick={() => setShowNewThreadModal(true)}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
                          >
                            <PlusCircle size={18} />
                            <span>Tạo chủ đề mới</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <AnimatePresence>
                          {paginatedThreads.map((thread) => (
                            <motion.div
                              key={thread.id}
                              variants={cardVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{ duration: 0.3 }}
                              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                              <Link
                                to={`/forumthreads/${thread._id}`}
                                className="block mt-3"
                              >
                                <div className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={
                                          thread.author_id?.avatar ||
                                          defaultAvatar
                                        }
                                        alt={
                                          thread.author_id?.name || "Ẩn danh"
                                        }
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                      <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                          {thread.author_id?.name || "Ẩn danh"}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                          {formatDate(thread.created_at)}
                                        </p>
                                      </div>
                                    </div>
                                    {thread.is_pinned && (
                                      <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
                                        Ghim
                                      </span>
                                    )}
                                  </div>

                                  <h2 className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition">
                                    {thread.title}
                                  </h2>
                                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                    {thread.content}
                                  </p>

                                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Eye size={16} /> {thread.views}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Heart size={16} /> {thread.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageSquare size={16} />{" "}
                                      {threadComments.length}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {totalThreadPages > 1 && (
                          <div className="flex justify-center mt-4 gap-2">
                            <button
                              onClick={() =>
                                setCurrentThreadPage((p) => Math.max(1, p - 1))
                              }
                              disabled={currentThreadPage === 1}
                              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                            >
                              Trước
                            </button>
                            {[...Array(totalThreadPages)].map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentThreadPage(idx + 1)}
                                className={`px-3 py-1 rounded ${
                                  currentThreadPage === idx + 1
                                    ? "bg-pink-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                              >
                                {idx + 1}
                              </button>
                            ))}
                            <button
                              onClick={() =>
                                setCurrentThreadPage((p) =>
                                  Math.min(totalThreadPages, p + 1)
                                )
                              }
                              disabled={currentThreadPage === totalThreadPages}
                              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                            >
                              Sau
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Categories List View
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatePresence>
                        {categories
                          .filter((category) => category.is_active)
                          .map((category) => (
                            <motion.div
                              key={category._id}
                              variants={cardVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategory(category);
                                setCurrentThreadPage(1);
                              }}
                              transition={{ duration: 0.3 }}
                              className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden cursor-pointer border-2 border-transparent hover:border-pink-400 group`}
                            >
                              <div className="p-5 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-3">
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition flex items-center gap-2">
                                      {category.name}
                                      {category.author_id === user?._id && (
                                        <button
                                          className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCategory(category._id);
                                          }}
                                        >
                                          Xóa
                                        </button>
                                      )}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-500 text-sm">
                                        {getThreadCount(category._id)} chủ đề
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex  items-center">
                                  <p className="text-gray-600 justify-start truncate text-sm flex-1 group-hover:text-gray-800 transition">
                                    {category.description}
                                  </p>
                                  <button className="text-pink-500 justify-end hover:text-pink-700 text-sm font-medium">
                                    Xem tất cả →
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )}

              {activeTab === "library" && (
                <div className=" backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Article Grid with pagination */}
                    <div className="lg:w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredLibraryArticles.length === 0 && (
                          <div className="col-span-2 text-gray-500">
                            Không tìm thấy bài viết phù hợp.
                          </div>
                        )}
                        {filteredLibraryArticles
                          .slice(0, libraryArticlesToShow)
                          .map((article) => (
                            <div
                              key={article.id}
                              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition"
                              onClick={() => setSelectedLibraryArticle(article)}
                            >
                              <img
                                src={article.thumbnail}
                                alt={article.title}
                                className="h-40 w-full object-cover"
                              />
                              <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                  {article.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 flex-1">
                                  {article.summary}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                      {libraryArticlesToShow <
                        filteredLibraryArticles.length && (
                        <div className="flex justify-center mt-6">
                          <button
                            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-lg"
                            onClick={() =>
                              setLibraryArticlesToShow(
                                libraryArticlesToShow + 4
                              )
                            }
                          >
                            Xem thêm bài viết
                          </button>
                        </div>
                      )}
                      {libraryArticlesToShow >=
                        filteredLibraryArticles.length &&
                        filteredLibraryArticles.length > 4 && (
                          <div className="flex justify-center mt-6">
                            <button
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg"
                              onClick={() => setLibraryArticlesToShow(4)}
                            >
                              Thu gọn bài viết
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                  {/* Modal hiển thị tất cả danh mục */}
                  {showAllLibraryCategories && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto relative">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                          onClick={() => setShowAllLibraryCategories(false)}
                        >
                          Đóng
                        </button>
                        <h3 className="text-lg font-semibold mb-4">
                          Tất cả danh mục
                        </h3>
                        <div className="space-y-2">
                          {libraryCategories.map((cat) => (
                            <button
                              key={cat.id}
                              className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
                                librarySelectedCategory === cat.name
                                  ? "bg-pink-500 text-white"
                                  : "bg-white text-gray-700 hover:bg-pink-50"
                              }`}
                              onClick={() => {
                                setLibrarySelectedCategory(cat.name);
                                setShowAllLibraryCategories(false);
                              }}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Modal chi tiết bài viết */}
                  {selectedLibraryArticle && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto relative">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                          onClick={() => setSelectedLibraryArticle(null)}
                        >
                          Đóng
                        </button>
                        <img
                          src={selectedLibraryArticle.thumbnail}
                          alt={selectedLibraryArticle.title}
                          className="h-48 w-full object-cover rounded mb-4"
                        />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {selectedLibraryArticle.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {selectedLibraryArticle.summary}
                        </p>
                        {/* Nếu có nội dung chi tiết thực tế, thêm ở đây */}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* New Thread Modal */}
      <AnimatePresence>
        {showNewThreadModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tạo chủ đề mới
              </h2>
              <form onSubmit={handleCreateThread}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
                    placeholder="Nhập tiêu đề chủ đề"
                    value={newThread.title}
                    onChange={(e) =>
                      setNewThread({ ...newThread, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
                    placeholder="Nhập nội dung chủ đề"
                    value={newThread.content}
                    onChange={(e) =>
                      setNewThread({ ...newThread, content: e.target.value })
                    }
                    required
                  ></textarea>
                </div>

                {errorThread && (
                  <div className="text-red-500 mb-2 text-sm">{errorThread}</div>
                )}
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-lg"
                  disabled={creatingThread}
                >
                  {creatingThread ? "Đang tạo..." : "Tạo chủ đề"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewThreadModal(false);
                    setErrorThread("");
                  }}
                  className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg"
                  disabled={creatingThread}
                >
                  Đóng
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Category Modal */}
      <AnimatePresence>
        {showNewCategoryModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tạo chuyên mục mới
              </h2>
              <form onSubmit={handleCreateCategory}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Tên chuyên mục <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
                    placeholder="Nhập tên chuyên mục"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Mô tả
                  </label>
                  <textarea
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg h-20 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
                    placeholder="Nhập mô tả"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                {error && (
                  <div className="text-red-500 mb-2 text-sm">{error}</div>
                )}
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-lg"
                  disabled={creating}
                >
                  {creating ? "Đang tạo..." : "Tạo chuyên mục"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategoryModal(false);
                    setError("");
                  }}
                  className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg"
                  disabled={creating}
                >
                  Đóng
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Forum;
