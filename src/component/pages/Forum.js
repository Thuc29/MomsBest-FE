import { useState, useEffect, useCallback, useMemo } from "react";
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
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Share,
  Flag,
} from "lucide-react";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ArticleDetailModal from "../ui/ArticleDetailModal";

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
  // Cẩm nang thai kỳ (5 articles)
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
    title: "Chuẩn bị tâm lý cho 3 tháng cuối thai kỳ",
    summary:
      "Giai đoạn quan trọng để chuẩn bị cho việc sinh nở và chào đón em bé với tâm lý vững vàng.",
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400",
  },
  {
    id: "a3",
    title: "Các bài tập thể dục an toàn cho mẹ bầu",
    summary:
      "Hướng dẫn các bài tập thể dục phù hợp giúp mẹ bầu khỏe mạnh và dễ sinh nở hơn.",
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400",
  },
  {
    id: "a4",
    title: "Những thực phẩm cần tránh khi mang thai",
    summary:
      "Danh sách các thực phẩm có thể gây hại cho thai nhi mà mẹ bầu cần tránh tuyệt đối.",
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/3933277/pexels-photo-3933277.jpeg?auto=compress&w=400",
  },
  {
    id: "a5",
    title: "Cách đối phó với ốm nghén hiệu quả",
    summary:
      "Các phương pháp giúp mẹ bầu giảm thiểu triệu chứng ốm nghén trong thai kỳ.",
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/3933279/pexels-photo-3933279.jpeg?auto=compress&w=400",
  },

  // Dinh dưỡng mẹ và bé (5 articles)
  {
    id: "a6",
    title: "Thực đơn dinh dưỡng cho mẹ sau sinh",
    summary:
      "Gợi ý thực đơn giúp mẹ phục hồi sức khỏe và tăng lượng sữa cho bé.",
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400",
  },
  {
    id: "a7",
    title: "Bí quyết giúp bé ăn ngon miệng hơn",
    summary:
      "Chia sẻ các mẹo nhỏ giúp bé yêu ăn uống tốt và phát triển khỏe mạnh.",
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?auto=compress&w=400",
  },
  {
    id: "a8",
    title: "Thực phẩm tăng sữa mẹ hiệu quả",
    summary:
      "Danh sách các thực phẩm tự nhiên giúp tăng lượng sữa và chất lượng sữa mẹ.",
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg?auto=compress&w=400",
  },
  {
    id: "a9",
    title: "Thực đơn ăn dặm cho bé 6-12 tháng",
    summary:
      "Hướng dẫn chi tiết về thực đơn ăn dặm phù hợp cho từng giai đoạn phát triển của bé.",
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640780/pexels-photo-1640780.jpeg?auto=compress&w=400",
  },
  {
    id: "a10",
    title: "Cách chế biến thức ăn an toàn cho trẻ nhỏ",
    summary:
      "Các nguyên tắc và kỹ thuật chế biến thức ăn đảm bảo an toàn và dinh dưỡng cho trẻ.",
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?auto=compress&w=400",
  },

  // Chăm sóc sơ sinh (5 articles)
  {
    id: "a11",
    title: "Cách tắm cho trẻ sơ sinh an toàn",
    summary:
      "Hướng dẫn các bước tắm cho trẻ sơ sinh đúng cách, an toàn và nhẹ nhàng.",
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400",
  },
  {
    id: "a12",
    title: "Hướng dẫn thay tã cho trẻ sơ sinh",
    summary:
      "Các bước thay tã đúng cách giúp tránh hăm tã và giữ vệ sinh cho bé.",
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933276/pexels-photo-3933276.jpeg?auto=compress&w=400",
  },
  {
    id: "a13",
    title: "Cách massage cho trẻ sơ sinh",
    summary:
      "Kỹ thuật massage giúp trẻ thư giãn, ngủ ngon và phát triển tốt hơn.",
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933277/pexels-photo-3933277.jpeg?auto=compress&w=400",
  },
  {
    id: "a14",
    title: "Cách ru trẻ sơ sinh ngủ ngon",
    summary: "Các phương pháp giúp trẻ sơ sinh có giấc ngủ ngon và sâu hơn.",
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933278/pexels-photo-3933278.jpeg?auto=compress&w=400",
  },
  {
    id: "a15",
    title: "Cách chăm sóc rốn cho trẻ sơ sinh",
    summary:
      "Hướng dẫn chăm sóc rốn đúng cách để tránh nhiễm trùng và rốn rụng nhanh.",
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933279/pexels-photo-3933279.jpeg?auto=compress&w=400",
  },

  // Sức khỏe tinh thần (5 articles)
  {
    id: "a16",
    title: "Dấu hiệu trầm cảm sau sinh và cách phòng tránh",
    summary:
      "Nhận biết sớm các dấu hiệu trầm cảm sau sinh và biện pháp hỗ trợ tâm lý cho mẹ.",
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg?auto=compress&w=400",
  },
  {
    id: "a17",
    title: "Cách giảm stress khi chăm sóc trẻ nhỏ",
    summary:
      "Các phương pháp quản lý stress hiệu quả cho cha mẹ khi chăm sóc trẻ nhỏ.",
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768914/pexels-photo-3768914.jpeg?auto=compress&w=400",
  },
  {
    id: "a18",
    title: "Xây dựng mối quan hệ tốt với con cái",
    summary:
      "Cách xây dựng mối quan hệ gắn bó và lành mạnh giữa cha mẹ và con cái.",
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768915/pexels-photo-3768915.jpeg?auto=compress&w=400",
  },
  {
    id: "a19",
    title: "Cách đối phó với cảm giác tội lỗi của cha mẹ",
    summary:
      "Hướng dẫn cách vượt qua cảm giác tội lỗi và áp lực khi làm cha mẹ.",
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&w=400",
  },
  {
    id: "a20",
    title: "Cách giữ gìn hạnh phúc gia đình",
    summary: "Bí quyết xây dựng và duy trì hạnh phúc gia đình bền vững.",
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768917/pexels-photo-3768917.jpeg?auto=compress&w=400",
  },

  // Phát triển trẻ nhỏ (5 articles)
  {
    id: "a21",
    title: "Các mốc phát triển quan trọng của trẻ 1-3 tuổi",
    summary:
      "Tổng hợp các mốc phát triển về vận động, ngôn ngữ và nhận thức của trẻ nhỏ.",
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&w=400",
  },
  {
    id: "a22",
    title: "Cách kích thích trí não cho trẻ 0-6 tuổi",
    summary:
      "Các hoạt động và trò chơi giúp kích thích sự phát triển trí não của trẻ.",
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662668/pexels-photo-3662668.jpeg?auto=compress&w=400",
  },
  {
    id: "a23",
    title: "Phát triển kỹ năng xã hội cho trẻ mầm non",
    summary:
      "Hướng dẫn cách giúp trẻ phát triển kỹ năng giao tiếp và tương tác xã hội.",
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662669/pexels-photo-3662669.jpeg?auto=compress&w=400",
  },
  {
    id: "a24",
    title: "Cách dạy trẻ tính tự lập từ nhỏ",
    summary:
      "Phương pháp rèn luyện tính tự lập cho trẻ từ những việc nhỏ nhất.",
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662670/pexels-photo-3662670.jpeg?auto=compress&w=400",
  },
  {
    id: "a25",
    title: "Phát triển ngôn ngữ cho trẻ từ 0-5 tuổi",
    summary:
      "Các phương pháp hỗ trợ phát triển ngôn ngữ và khả năng giao tiếp của trẻ.",
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662671/pexels-photo-3662671.jpeg?auto=compress&w=400",
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
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const categoriesPerPage = 10;
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [articleLikes, setArticleLikes] = useState({});
  const [likedThreads, setLikedThreads] = useState(new Set());
  const [threadCommentCounts, setThreadCommentCounts] = useState({});
  const [threadViews, setThreadViews] = useState({});
  const [commentCountsLoading, setCommentCountsLoading] = useState(false);
  const [fetchTimeout, setFetchTimeout] = useState(null);
  const [userPostCounts, setUserPostCounts] = useState({});
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

  // Function để tính toán số lượng bài viết của từng user
  const calculateUserPostCounts = useCallback((threadsData) => {
    const postCounts = {};

    threadsData.forEach((thread) => {
      const userId = thread.author_id?._id || thread.author_id;
      if (userId) {
        postCounts[userId] = (postCounts[userId] || 0) + 1;
      }
    });

    setUserPostCounts(postCounts);
  }, []);

  // Function để lấy số lượng bài viết của một user cụ thể
  const getUserPostCount = useCallback(
    (userId) => {
      return userPostCounts[userId] || 0;
    },
    [userPostCounts]
  );

  // Function để lấy badge level dựa trên số lượng bài viết
  const getUserBadge = useCallback((postCount) => {
    if (postCount === 0)
      return { text: "Thành viên mới", color: "bg-blue-100 text-blue-600" };
    if (postCount < 5)
      return {
        text: "Thành viên tích cực",
        color: "bg-green-100 text-green-600",
      };
    if (postCount < 20)
      return {
        text: "Thành viên nổi bật",
        color: "bg-yellow-100 text-yellow-600",
      };
    if (postCount < 50)
      return {
        text: "Thành viên xuất sắc",
        color: "bg-purple-100 text-purple-600",
      };
    return { text: "Thành viên VIP", color: "bg-red-100 text-red-600" };
  }, []);

  // Function để fetch comment counts cho tất cả threads
  const fetchThreadCommentCounts = async (threadsData) => {
    setCommentCountsLoading(true);
    try {
      const commentCounts = {};
      const viewCounts = {};

      // Tạo array các promises để fetch song song
      const commentPromises = threadsData.map(async (thread) => {
        try {
          const commentsRes = await api.get(
            `/forumcomments/thread/${thread._id}`
          );
          return {
            threadId: thread._id,
            commentCount: commentsRes.data.length,
            viewCount: thread.views || 0,
          };
        } catch (err) {
          return {
            threadId: thread._id,
            commentCount: 0,
            viewCount: thread.views || 0,
          };
        }
      });

      // Fetch tất cả song song
      const results = await Promise.all(commentPromises);

      // Cập nhật state
      results.forEach((result) => {
        commentCounts[result.threadId] = result.commentCount;
        viewCounts[result.threadId] = result.viewCount;
      });

      setThreadCommentCounts(commentCounts);
      setThreadViews(viewCounts);
    } catch (err) {
      console.error("Error fetching comment counts:", err);
      // Fallback: khởi tạo với giá trị mặc định
      const fallbackCounts = {};
      const fallbackViews = {};
      threadsData.forEach((thread) => {
        fallbackCounts[thread._id] = 0;
        fallbackViews[thread._id] = thread.views || 0;
      });
      setThreadCommentCounts(fallbackCounts);
      setThreadViews(fallbackViews);
    } finally {
      setCommentCountsLoading(false);
    }
  };

  // Function để fetch comment counts chỉ cho threads hiển thị (tối ưu performance)
  const fetchVisibleThreadCommentCounts = useCallback(
    async (visibleThreads) => {
      try {
        const commentCounts = {};

        // Chỉ fetch cho các threads chưa có comment count
        const threadsToFetch = visibleThreads.filter((thread) => {
          const currentCount = threadCommentCounts[thread._id];
          return currentCount === undefined || currentCount === null;
        });

        if (threadsToFetch.length === 0) return;

        const commentPromises = threadsToFetch.map(async (thread) => {
          try {
            const commentsRes = await api.get(
              `/forumcomments/thread/${thread._id}`
            );
            return {
              threadId: thread._id,
              commentCount: commentsRes.data.length,
            };
          } catch (err) {
            return {
              threadId: thread._id,
              commentCount: 0,
            };
          }
        });

        const results = await Promise.all(commentPromises);

        results.forEach((result) => {
          commentCounts[result.threadId] = result.commentCount;
        });

        setThreadCommentCounts((prev) => ({
          ...prev,
          ...commentCounts,
        }));
      } catch (err) {
        console.error("Error fetching visible thread comment counts:", err);
      }
    },
    []
  );

  // Function để fetch comment count cho một thread cụ thể
  const fetchSingleThreadCommentCount = async (threadId) => {
    try {
      const commentsRes = await api.get(`/forumcomments/thread/${threadId}`);
      const commentCount = commentsRes.data.length;

      setThreadCommentCounts((prev) => ({
        ...prev,
        [threadId]: commentCount,
      }));

      return commentCount;
    } catch (err) {
      console.error(
        `Error fetching comment count for thread ${threadId}:`,
        err
      );
      setThreadCommentCounts((prev) => ({
        ...prev,
        [threadId]: 0,
      }));
      return 0;
    }
  };

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

        // Khởi tạo view counts từ dữ liệu threads
        const initialViews = {};
        threadRes.data.forEach((thread) => {
          initialViews[thread._id] = thread.views || 0;
        });
        setThreadViews(initialViews);

        // Tính toán số lượng bài viết của từng user
        calculateUserPostCounts(threadRes.data);

        // Fetch comment counts trong background (không block UI)
        fetchThreadCommentCounts(threadRes.data);
      } catch (err) {
        // handle error
        setCategories([]);
        setThreads([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

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
      return (threadViews[b._id] || 0) - (threadViews[a._id] || 0);
    } else if (sortOption === "mostCommented") {
      // Sử dụng comment counts từ state
      return (
        (threadCommentCounts[b._id] || 0) - (threadCommentCounts[a._id] || 0)
      );
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
  const paginatedThreads = useMemo(() => {
    return categoryThreads.slice(
      (currentThreadPage - 1) * threadsPerPage,
      currentThreadPage * threadsPerPage
    );
  }, [categoryThreads, currentThreadPage, threadsPerPage]);

  // Fetch comment counts cho threads hiển thị khi thay đổi trang hoặc category
  useEffect(() => {
    if (paginatedThreads.length > 0 && !commentCountsLoading) {
      // Clear timeout cũ nếu có
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }

      // Set timeout mới để debounce
      const timeout = setTimeout(() => {
        fetchVisibleThreadCommentCounts(paginatedThreads);
      }, 300); // 300ms delay

      setFetchTimeout(timeout);
    }

    // Cleanup timeout khi component unmount
    return () => {
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }
    };
  }, [
    currentThreadPage,
    selectedCategory,
    paginatedThreads,
    commentCountsLoading,
    fetchTimeout,
  ]);

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

  // Phân trang cho categories
  const activeCategories = categories.filter((category) => category.is_active);
  const totalCategoryPages = Math.ceil(
    activeCategories.length / categoriesPerPage
  );
  const paginatedCategories = activeCategories.slice(
    (currentCategoryPage - 1) * categoriesPerPage,
    currentCategoryPage * categoriesPerPage
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

      const newThreadData = res.data;
      setThreads((prev) => [...prev, newThreadData]);

      // Khởi tạo comment count và view count cho thread mới
      setThreadCommentCounts((prev) => ({
        ...prev,
        [newThreadData._id]: 0,
      }));
      setThreadViews((prev) => ({
        ...prev,
        [newThreadData._id]: 0,
      }));

      // Cập nhật số lượng bài viết của user
      const userId = user._id;
      setUserPostCounts((prev) => ({
        ...prev,
        [userId]: (prev[userId] || 0) + 1,
      }));

      setShowNewThreadModal(false);
      setNewThread({
        title: "",
        content: "",
        thread_type: "discussion",
        is_pinned: false,
      });

      Swal.fire({
        title: "Thành công!",
        text: "Chủ đề đã được tạo.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setErrorThread(err.response?.data?.error || "Có lỗi xảy ra");
      Swal.fire({
        title: "Lỗi",
        text: err.response?.data?.error || "Có lỗi xảy ra khi tạo chủ đề.",
        icon: "error",
      });
    }
    setCreatingThread(false);
  };

  // Function để cập nhật comment count cho một thread cụ thể
  const updateThreadCommentCount = (threadId, newCount) => {
    setThreadCommentCounts((prev) => ({
      ...prev,
      [threadId]: newCount,
    }));
  };

  // Function để cập nhật view count cho một thread cụ thể
  const updateThreadViewCount = (threadId) => {
    setThreadViews((prev) => ({
      ...prev,
      [threadId]: (prev[threadId] || 0) + 1,
    }));
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

  // Thêm hàm xử lý like/unlike bài viết
  const handleLikeArticle = (articleId) => {
    setLikedArticles((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(articleId)) {
        newLiked.delete(articleId);
        // Giảm số like
        setArticleLikes((prevLikes) => ({
          ...prevLikes,
          [articleId]: Math.max(0, (prevLikes[articleId] || 1) - 1),
        }));
      } else {
        newLiked.add(articleId);
        // Tăng số like
        setArticleLikes((prevLikes) => ({
          ...prevLikes,
          [articleId]: (prevLikes[articleId] || 1) + 1,
        }));
      }
      return newLiked;
    });
  };

  // Function để cập nhật view count cho article
  const handleArticleView = (articleId) => {
    setArticleViews((prev) => ({
      ...prev,
      [articleId]: (prev[articleId] || 0) + 1,
    }));
  };

  // Function để cập nhật comment count cho article
  const handleArticleComment = (articleId) => {
    setArticleComments((prev) => ({
      ...prev,
      [articleId]: (prev[articleId] || 0) + 1,
    }));
  };

  // Thêm hàm xử lý like/unlike thread
  const handleLikeThread = (threadId) => {
    setLikedThreads((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(threadId)) {
        newLiked.delete(threadId);
        // Giảm số like
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread._id === threadId
              ? { ...thread, likes: Math.max(0, (thread.likes || 0) - 1) }
              : thread
          )
        );
      } else {
        newLiked.add(threadId);
        // Tăng số like
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread._id === threadId
              ? { ...thread, likes: (thread.likes || 0) + 1 }
              : thread
          )
        );
      }
      return newLiked;
    });
  };

  // Khởi tạo số like ban đầu cho các bài viết
  useEffect(() => {
    const initialLikes = {};
    libraryArticles.forEach((article) => {
      initialLikes[article.id] = Math.floor(Math.random() * 50) + 1; // Random số like từ 1-50
    });
    setArticleLikes(initialLikes);
  }, []);

  // Thêm state cho article interactions
  const [articleViews, setArticleViews] = useState({});
  const [articleComments, setArticleComments] = useState({});

  // Khởi tạo view count và comment count cho articles
  useEffect(() => {
    const initialViews = {};
    const initialComments = {};
    libraryArticles.forEach((article) => {
      initialViews[article.id] = Math.floor(Math.random() * 200) + 50; // Random số view từ 50-250
      initialComments[article.id] = Math.floor(Math.random() * 20) + 1; // Random số comment từ 1-20
    });
    setArticleViews(initialViews);
    setArticleComments(initialComments);
  }, []);

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

              {/* Thống kê tổng quan */}
              <div className="flex justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
                    {activeCategories.length}
                  </span>
                  <span>Chuyên mục</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                    {threads.length}
                  </span>
                  <span>Chủ đề</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                    {Object.values(threadCommentCounts).reduce(
                      (sum, count) => sum + count,
                      0
                    )}
                  </span>
                  <span>Bình luận</span>
                </div>
              </div>

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

              {/* Thống kê thư viện */}
              <div className="flex justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
                    {libraryCategories.length}
                  </span>
                  <span>Danh mục</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                    {libraryArticles.length}
                  </span>
                  <span>Bài viết</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                    {Object.values(articleViews).reduce(
                      (sum, views) => sum + views,
                      0
                    )}
                  </span>
                  <span>Lượt xem</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                    {Object.values(articleComments).reduce(
                      (sum, comments) => sum + comments,
                      0
                    )}
                  </span>
                  <span>Bình luận</span>
                </div>
              </div>

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
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{thread.author_id?.name || "Ẩn danh"}</span>
                          <span>•</span>
                          <span>
                            #
                            {getUserPostCount(
                              thread.author_id?._id || thread.author_id
                            )}{" "}
                            bài viết
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikeThread(thread._id);
                            }}
                            className={`flex items-center gap-1 transition ${
                              likedThreads.has(thread._id)
                                ? "text-pink-600"
                                : "text-gray-500 hover:text-pink-600"
                            }`}
                          >
                            <Heart
                              size={12}
                              className={
                                likedThreads.has(thread._id)
                                  ? "fill-current"
                                  : ""
                              }
                            />
                            {thread.likes || 0}
                          </button>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} />{" "}
                            {threadCommentCounts[thread._id] || 0}
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Top Users */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} /> Thành viên tích cực
                </h2>
                <div className="space-y-3">
                  {Object.entries(userPostCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([userId, postCount]) => {
                      const userThread = threads.find(
                        (thread) =>
                          (thread.author_id?._id || thread.author_id) === userId
                      );
                      const userName = userThread?.author_id?.name || "Ẩn danh";
                      const badge = getUserBadge(postCount);

                      return (
                        <div
                          key={userId}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                userThread?.author_id?.avatar || defaultAvatar
                              }
                              alt={userName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-800">
                                  {userName}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${badge.color}`}
                                >
                                  {badge.text}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                #{postCount} bài viết
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                            onClick={() => {
                              setSelectedCategory(null);
                              setCurrentCategoryPage(1);
                            }}
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
                                        <div className="flex items-center gap-2">
                                          <h3 className="text-sm font-medium text-gray-500">
                                            {thread.author_id?.name ||
                                              "Ẩn danh"}
                                          </h3>
                                          {(() => {
                                            const userId =
                                              thread.author_id?._id ||
                                              thread.author_id;
                                            const postCount =
                                              getUserPostCount(userId);
                                            const badge =
                                              getUserBadge(postCount);
                                            return (
                                              <span
                                                className={`text-xs px-2 py-1 rounded-full ${badge.color}`}
                                              >
                                                {badge.text}
                                              </span>
                                            );
                                          })()}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                          <p>{formatDate(thread.created_at)}</p>
                                          <span>•</span>
                                          <p>
                                            #
                                            {getUserPostCount(
                                              thread.author_id?._id ||
                                                thread.author_id
                                            )}{" "}
                                            bài viết
                                          </p>
                                        </div>
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
                                      <Eye size={16} />{" "}
                                      {threadViews[thread._id] ||
                                        thread.views ||
                                        0}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleLikeThread(thread._id);
                                      }}
                                      className={`flex items-center gap-1 transition ${
                                        likedThreads.has(thread._id)
                                          ? "text-pink-600"
                                          : "text-gray-500 hover:text-pink-600"
                                      }`}
                                    >
                                      <Heart
                                        size={16}
                                        className={
                                          likedThreads.has(thread._id)
                                            ? "fill-current"
                                            : ""
                                        }
                                      />
                                      {thread.likes || 0}
                                    </button>
                                    <span className="flex items-center gap-1">
                                      <MessageSquare size={16} />{" "}
                                      {commentCountsLoading &&
                                      !threadCommentCounts[thread._id] ? (
                                        <span className="text-xs text-gray-400">
                                          ...
                                        </span>
                                      ) : (
                                        threadCommentCounts[thread._id] || 0
                                      )}
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
                        {paginatedCategories.map((category) => (
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
                      {totalCategoryPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                          <button
                            onClick={() =>
                              setCurrentCategoryPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentCategoryPage === 1}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                          >
                            <ArrowLeft size={16} />
                          </button>
                          {[...Array(totalCategoryPages)].map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentCategoryPage(idx + 1)}
                              className={`px-3 py-1 rounded ${
                                currentCategoryPage === idx + 1
                                  ? "bg-pink-500 text-white"
                                  : "bg-gray-200 hover:bg-gray-300"
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              setCurrentCategoryPage((p) =>
                                Math.min(totalCategoryPages, p + 1)
                              )
                            }
                            disabled={
                              currentCategoryPage === totalCategoryPages
                            }
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                          >
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      )}
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
                            >
                              <div
                                className="cursor-pointer"
                                onClick={() => {
                                  handleArticleView(article.id);
                                  setSelectedLibraryArticle(article);
                                }}
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

                              {/* Action buttons */}
                              <div className="px-5 pb-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                                    <Eye size={16} />
                                    <span className="text-sm font-medium">
                                      {articleViews[article.id] || 0}
                                    </span>
                                  </span>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLikeArticle(article.id);
                                    }}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition ${
                                      likedArticles.has(article.id)
                                        ? "bg-pink-100 text-pink-600"
                                        : "bg-gray-100 text-gray-600 hover:bg-pink-50"
                                    }`}
                                  >
                                    <Heart
                                      size={16}
                                      className={
                                        likedArticles.has(article.id)
                                          ? "fill-current"
                                          : ""
                                      }
                                    />
                                    <span className="text-sm font-medium">
                                      {articleLikes[article.id] || 1}
                                    </span>
                                  </button>

                                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                                    <MessageSquare size={16} />
                                    <span className="text-sm font-medium">
                                      {articleComments[article.id] || 0}
                                    </span>
                                  </span>

                                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 transition">
                                    <Bookmark size={16} />
                                    <span className="text-sm font-medium">
                                      Lưu
                                    </span>
                                  </button>

                                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-green-50 transition">
                                    <Share size={16} />
                                    <span className="text-sm font-medium">
                                      Chia sẻ
                                    </span>
                                  </button>

                                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 transition">
                                    <Flag size={16} />
                                    <span className="text-sm font-medium">
                                      Báo cáo
                                    </span>
                                  </button>
                                </div>

                                <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition">
                                  Theo dõi chủ đề
                                </button>
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
        {selectedLibraryArticle && (
          <ArticleDetailModal
            article={selectedLibraryArticle}
            onClose={() => setSelectedLibraryArticle(null)}
            relatedArticles={libraryArticles.filter(
              (article) =>
                article.category === selectedLibraryArticle.category &&
                article.id !== selectedLibraryArticle.id
            )}
            onArticleSelect={(article) => setSelectedLibraryArticle(article)}
            onLike={handleLikeArticle}
            isLiked={likedArticles.has(selectedLibraryArticle.id)}
            likeCount={articleLikes[selectedLibraryArticle.id] || 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
export default Forum;
