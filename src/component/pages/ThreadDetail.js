import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  Share2,
  BookmarkPlus,
  MessageCircle,
  ChevronLeft,
  Send,
  Flag,
  MoreHorizontal,
  Image,
  Smile,
  Paperclip,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";
import axios from "axios";
import Modal from "../ui/Modal";
import Swal from "sweetalert2";

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    console.log("user", user);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};
const currentUser = getCurrentUser();

const ThreadDetail = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  const COMMENTS_PER_PAGE = 5;
  const REPLIES_PER_PAGE = 2;
  const [editingComment, setEditingComment] = useState(null); // {id, content}
  const [editingReply, setEditingReply] = useState(null); // {commentId, replyId, content}
  const [modalEdit, setModalEdit] = useState(null); // {id, content, type: 'comment'|'reply', ...}
  const [modalDelete, setModalDelete] = useState(null); // {id, type: 'comment'|'reply', ...}
  const [dropdownCommentId, setDropdownCommentId] = useState(null);
  const dropdownRef = useRef(null);
  const [relatedThreads, setRelatedThreads] = useState([]);

  useEffect(() => {
    const fetchThreadAndComments = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `https://momsbest-be.onrender.com/api/forumthreads/getDetail/${threadId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const threadFromBE = res.data;
        const author = threadFromBE.author_id;
        // Fetch parent comments
        const commentsRes = await axios.get(
          `https://momsbest-be.onrender.com/api/forumcomments/thread/${threadId}`
        );
        const comments = commentsRes.data;
        // Fetch replies for each parent comment
        const commentsWithReplies = await Promise.all(
          comments.map(async (comment) => {
            const repliesRes = await axios.get(
              `https://momsbest-be.onrender.com/api/forumcomments/${comment._id}/replies`
            );
            return { ...comment, replies: repliesRes.data };
          })
        );
        const thread = {
          ...threadFromBE,
          category: threadFromBE.category_id?.name || "",
          categoryDescription: threadFromBE.category_id?.description || "",
          author: author
            ? {
                name: author.name,
                avatar: author.avatar || "default.png",
                joinDate: author.join_date,
                posts: author.posts || 0,
                current_level: author.current_level,
              }
            : {
                name: "Ẩn danh",
                avatar: "default.png",
                joinDate: "",
                posts: 0,
                current_level: "",
              },
          comments: commentsWithReplies,
          relatedThreads: threadFromBE.relatedThreads || [],
          isFollowing: false, // Default to false, to be updated below
        };
        setThread(thread);

        // Check like, save, and follow status concurrently
        if (currentUser) {
          const [likeRes, saveRes, followRes] = await Promise.all([
            axios.get(
              `https://momsbest-be.onrender.com/api/forumthreads/${threadId}/isliked`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            ),
            axios.get(
              `https://momsbest-be.onrender.com/api/forumthreads/${threadId}/issaved`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            ),
            axios.get(
              `https://momsbest-be.onrender.com/api/forumthreads/${threadId}/isfollowed`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            ),
          ]);
          setIsLiked(likeRes.data.isLiked || false);
          setIsSaved(saveRes.data.isSaved || false);
          setIsFollowing(followRes.data.isFollowing || false);
        } else {
          setIsLiked(false);
          setIsSaved(false);
          setIsFollowing(false);
        }
      } catch (err) {
        console.error("Error fetching thread:", err);
        setThread(null);
      }
      setIsLoading(false);
    };
    fetchThreadAndComments();
  }, [threadId]);

  const categoryId =
    thread?.category_id?._id ||
    thread?.category_id?.$oid ||
    thread?.category_id;

  useEffect(() => {
    if (!categoryId) return;
    const fetchRelatedThreads = async () => {
      try {
        const res = await axios.get(
          `https://momsbest-be.onrender.com/api/forumthreads/category/${categoryId}`
        );
        setRelatedThreads(res.data);
      } catch (err) {
        setRelatedThreads([]);
      }
    };
    fetchRelatedThreads();
  }, [categoryId]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownCommentId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      return;
    }

    try {
      const res = await axios.post(
        `https://momsbest-be.onrender.com/api/forumcomments/thread/${threadId}`,
        {
          content: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setThread((prev) => {
        // Đảm bảo comment mới có đủ thông tin author_id
        const newComment = {
          ...res.data,
          author_id: {
            _id: currentUser?._id,
            name: currentUser?.name,
            avatar: currentUser?.avatar || "default.png",
          },
          likes: 0,
          replies: [],
        };
        const updatedComments = [newComment, ...prev.comments];
        return {
          ...prev,
          comments: updatedComments,
        };
      });
      setCommentText("");
      setRelatedThreads((prev) =>
        prev.map((t) =>
          t._id === threadId
            ? { ...t, commentsCount: (t.commentsCount || 0) + 1 }
            : t
        )
      );
    } catch (err) {
      console.error("Error posting comment:", err);
      console.error("Error details:", err.response?.data || err.message);
      alert("Có lỗi xảy ra khi gửi bình luận.");
    }
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `https://momsbest-be.onrender.com/api/forumthreads/${threadId}/like`,
        { like: !isLiked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsLiked(res.data.isLiked || !isLiked); // Use backend response if available
      setThread((prev) => ({ ...prev, likes: res.data.likes }));
      setRelatedThreads((prev) =>
        prev.map((t) =>
          t._id === threadId ? { ...t, likes: res.data.likes } : t
        )
      );
    } catch (err) {
      console.error("Error liking thread:", err);
      alert("Có lỗi xảy ra khi thích bài viết.");
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(
        `https://momsbest-be.onrender.com/api/forumthreads/${threadId}/save`,
        { save: !isSaved },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsSaved(res.data.isSaved); // Update based on backend response
    } catch (err) {
      console.error("Error saving thread:", err);
      alert("Có lỗi xảy ra khi lưu bài viết.");
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để theo dõi chủ đề.");
      return;
    }
    try {
      const res = await axios.post(
        `https://momsbest-be.onrender.com/api/forumthreads/${threadId}/follow`,
        { follow: !isFollowing },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.error("Lỗi khi theo dõi chủ đề:", err);
      alert("Có lỗi xảy ra khi theo dõi chủ đề. Vui lòng thử lại.");
    }
  };

  const handleReport = async () => {
    try {
      await axios.post(
        `https://momsbest-be.onrender.com/api/forumthreads/${threadId}/report`
      );
      alert("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét chủ đề này.");
    } catch (err) {
      console.error("Error reporting thread:", err);
      alert("Có lỗi xảy ra khi báo cáo. Vui lòng thử lại.");
    }
  };

  const handleLikeParentComment = async (commentId) => {
    try {
      const res = await axios.post(
        `https://momsbest-be.onrender.com/api/forumcomments/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setThread((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? {
                ...c,
                likes: c.likes + (res.data.liked ? 1 : -1),
                isLiked: res.data.liked,
              }
            : c
        ),
      }));
    } catch (err) {
      console.error("Error liking parent comment:", err);
    }
  };

  const handleLikeReplyComment = async (parentCommentId, replyId) => {
    try {
      const res = await axios.post(
        `https://momsbest-be.onrender.com/api/forumcomments/${replyId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setThread((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === parentCommentId
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r._id === replyId
                    ? {
                        ...r,
                        likes: r.likes + (res.data.liked ? 1 : -1),
                        isLiked: res.data.liked,
                      }
                    : r
                ),
              }
            : c
        ),
      }));
    } catch (err) {
      console.error("Error liking reply comment:", err);
    }
  };

  const handleReplyComment = async (commentId, replyText, onSuccess) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(
        `https://momsbest-be.onrender.com/api/forumcomments/thread/${threadId}`,
        {
          content: replyText,
          parent_comment_id: commentId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setThread((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? { ...c, replies: [...(c.replies || []), res.data] }
            : c
        ),
      }));
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error replying to comment:", err);
      alert("Có lỗi xảy ra khi gửi trả lời.");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xóa bình luận này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(
        `https://momsbest-be.onrender.com/api/forumcomments/${commentId}`
      );
      setThread((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
      setRelatedThreads((prev) =>
        prev.map((t) =>
          t._id === threadId
            ? { ...t, commentsCount: Math.max((t.commentsCount || 1) - 1, 0) }
            : t
        )
      );
      Swal.fire("Đã xóa!", "Bình luận đã được xóa.", "success");
    } catch (err) {
      console.error("Error deleting comment:", err);
      Swal.fire("Lỗi!", "Xóa bình luận thất bại.", "error");
    }
  };

  // Edit comment
  const handleEditComment = async (commentId, newContent, onSuccess) => {
    if (!newContent.trim()) return;
    const result = await Swal.fire({
      title: "Xác nhận sửa bình luận",
      text: "Bạn có chắc muốn lưu thay đổi?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await axios.put(
        `https://momsbest-be.onrender.com/api/forumcomments/${commentId}`,
        { content: newContent }
      );
      setThread((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId ? { ...c, content: res.data.content } : c
        ),
      }));
      if (onSuccess) onSuccess();
      Swal.fire("Thành công!", "Bình luận đã được cập nhật.", "success");
    } catch (err) {
      console.error("Error editing comment:", err);
      Swal.fire("Lỗi!", "Sửa bình luận thất bại.", "error");
    }
  };

  // Delete reply
  const handleDeleteReply = async (commentId, replyId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xóa trả lời này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(
        `https://momsbest-be.onrender.com/api/forumcomments/${replyId}`
      );
      setThread((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? { ...c, replies: c.replies.filter((r) => r._id !== replyId) }
            : c
        ),
      }));
      Swal.fire("Đã xóa!", "Trả lời đã được xóa.", "success");
    } catch (err) {
      console.error("Error deleting reply:", err);
      Swal.fire("Lỗi!", "Xóa trả lời thất bại.", "error");
    }
  };

  // Edit reply
  const handleEditReply = async (commentId, replyId, newContent, onSuccess) => {
    if (!newContent.trim()) return;
    const result = await Swal.fire({
      title: "Xác nhận sửa trả lời",
      text: "Bạn có chắc muốn lưu thay đổi?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await axios.put(
        `https://momsbest-be.onrender.com/api/forumcomments/${replyId}`,
        { content: newContent }
      );
      setThread((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r._id === replyId ? { ...r, content: res.data.content } : r
                ),
              }
            : c
        ),
      }));
      if (onSuccess) onSuccess();
      Swal.fire("Thành công!", "Trả lời đã được cập nhật.", "success");
    } catch (err) {
      console.error("Error editing reply:", err);
      Swal.fire("Lỗi!", "Sửa trả lời thất bại.", "error");
    }
  };

  // Paginate comments
  const pagedComments =
    thread && thread.comments
      ? thread.comments.slice(
          (commentPage - 1) * COMMENTS_PER_PAGE,
          commentPage * COMMENTS_PER_PAGE
        )
      : [];
  const totalCommentPages =
    thread && thread.comments
      ? Math.ceil(thread.comments.length / COMMENTS_PER_PAGE)
      : 1;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600')] flex flex-col font-space-grotesk">
      {/* Hero Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <Link
              to="/forum"
              className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-4"
            >
              <ChevronLeft size={18} />
              <span>Quay lại diễn đàn</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {thread.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                {thread.category}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} /> {thread.comments.length} bình luận
              </span>
              <span className="flex items-center gap-1">
                <Heart size={14} /> {thread.likes} thích
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Thread Content */}
            <div className="lg:w-3/4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
                {/* Thread Author Info */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                  <img
                    src={thread.author.avatar}
                    alt={thread.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="justify-start">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-800">
                            {thread.author.name}
                          </h3>
                          <p className="text-xs bg-blue-300 px-2 py-1 mb-1 rounded-full">
                            {thread.author.current_level}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          #{thread.author.posts} bài viết
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(thread.author.joinDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thread Content */}
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-line">
                    {thread.content}
                  </p>
                </div>

                {/* Thread Actions */}
                <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      disabled={!currentUser}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                        isLiked
                          ? "bg-pink-100 text-pink-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } ${!currentUser ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <Heart
                        size={16}
                        fill={isLiked ? "currentColor" : "none"}
                        stroke={isLiked ? "currentColor" : "currentColor"}
                      />
                      <span>{thread?.likes || 0}</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!currentUser} // Disable if not logged in
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                        isSaved
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } ${!currentUser ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <BookmarkPlus
                        size={16}
                        fill={isSaved ? "currentColor" : "none"}
                        stroke={isSaved ? "currentColor" : "currentColor"}
                      />
                      <span>Lưu</span>
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                      <Share2 size={16} />
                      <span>Chia sẻ</span>
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      onClick={handleReport}
                    >
                      <Flag size={16} />
                      <span>Báo cáo</span>
                    </button>
                  </div>
                  <button
                    onClick={handleFollow}
                    disabled={!currentUser} // Disable if not logged in
                    className={`px-4 py-1.5 rounded-full transition-colors ${
                      isFollowing
                        ? "bg-pink-500 text-white"
                        : "bg-pink-100 text-pink-600 hover:bg-pink-200"
                    } ${!currentUser ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {isFollowing ? "Đang theo dõi" : "Theo dõi chủ đề"}
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className=" backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl border-b border-gray-100 py-3 font-semibold text-gray-800 mb-6">
                  Bình luận ({thread.comments.length})
                </h2>

                {/* Comment Form - cải thiện giao diện */}
                <div className="flex items-start gap-3 border border-gray-100 rounded-xl p-3 mb-8">
                  <form
                    onSubmit={handleSubmitComment}
                    className="flex-1  items-center gap-4 "
                  >
                    <div className="flex items-center gap-2">
                      {" "}
                      <img
                        src={currentUser?.avatar || "default.png"}
                        alt={currentUser?.name || "Ẩn danh"}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                      <div className="flex-1 mb-1 text-start gap-2">
                        <p className="text-white font-semibold text-base">
                          {currentUser?.name || "Ẩn danh"}
                        </p>
                        <div className="border p-2 rounded-xl">
                          <div className="flex  rounded-xl p-2 items-center gap-2">
                            {" "}
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Viết bình luận của bạn..."
                              className="flex-1 bg-transparent text-white text-sm outline-none border-none placeholder-gray-600"
                              autoComplete="off"
                            />
                            <button
                              type="submit"
                              disabled={!commentText.trim()}
                              className="text-blue-400   rounded-full  disabled:opacity-50"
                            >
                              <Send size={18} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-200"
                            >
                              <Image size={18} />
                            </button>
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-200"
                            >
                              <Smile size={18} />
                            </button>
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-200"
                            >
                              <Paperclip size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Comments List - cải thiện giao diện từng bình luận */}
                <div className="space-y-6">
                  {Array.isArray(thread.comments) &&
                    thread.comments.length > 0 &&
                    pagedComments.map((comment) => (
                      <div
                        key={comment._id}
                        className=" rounded-xl border border-[#232323] shadow-sm p-4 text-white"
                      >
                        {/* Comment Header */}
                        <div className="flex items-start gap-3 mb-2">
                          <img
                            src={comment.author_id?.avatar || "default.png"}
                            alt={comment.author_id?.name || "Ẩn danh"}
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-white">
                                {comment.author_id?.name || "Ẩn danh"}
                              </span>
                              <span className="text-xs text-gray-300">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className="relative">
                            <button
                              className="p-1 text-gray-400 hover:text-gray-200"
                              onClick={() =>
                                setDropdownCommentId(
                                  dropdownCommentId === comment._id
                                    ? null
                                    : comment._id
                                )
                              }
                            >
                              <MoreHorizontal size={18} />
                            </button>
                            {dropdownCommentId === comment._id && (
                              <div
                                onClick={() => setDropdownCommentId(null)}
                                tabIndex={0}
                                onBlur={() => setDropdownCommentId(null)}
                              >
                                {currentUser &&
                                String(
                                  comment.author_id?._id || comment.author_id
                                ) === String(currentUser._id) ? (
                                  <>
                                    <div className="absolute right-0 mt-1 w-36  border border-[#333] rounded-lg shadow-lg z-10">
                                      {" "}
                                      <button
                                        className=" w-full hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-t-lg flex items-center gap-1 text-left px-4 py-2 text-sm text-blue-500 "
                                        onClick={() => {
                                          setModalEdit({
                                            id: comment._id,
                                            content: comment.content,
                                            type: "comment",
                                          });
                                        }}
                                      >
                                        <Pencil size={16} />
                                        <p>Sửa</p>
                                      </button>
                                      <button
                                        className=" w-full  hover:bg-red-500 hover:text-white transition-all duration-300 rounded-b-lg flex items-center gap-1 text-left px-4 py-2 text-sm text-red-500 "
                                        onClick={() => {
                                          setModalDelete({
                                            id: comment._id,
                                            type: "comment",
                                          });
                                        }}
                                      >
                                        <Trash2 size={16} />
                                        <p>Xóa</p>
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 "
                                    onClick={() => {
                                      Swal.fire(
                                        "Cảm ơn bạn đã báo cáo!",
                                        "Chúng tôi sẽ xem xét bình luận này.",
                                        "info"
                                      );
                                    }}
                                  >
                                    Báo cáo bình luận
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Comment Content or Edit Form */}
                        {editingComment && editingComment.id === comment._id ? (
                          <form
                            className="mb-2 flex  flex-col gap-2"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleEditComment(
                                comment._id,
                                editingComment.content,
                                () => setEditingComment(null)
                              );
                            }}
                          >
                            <input
                              className="w-full  text-white rounded-lg px-3 py-2 border-none outline-none"
                              value={editingComment.content}
                              onChange={(e) =>
                                setEditingComment({
                                  ...editingComment,
                                  content: e.target.value,
                                })
                              }
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="bg-[#6C47FF] text-white px-4 py-1 rounded hover:bg-[#8f6bff]"
                                disabled={!editingComment.content.trim()}
                              >
                                Lưu
                              </button>
                              <button
                                type="button"
                                className="text-gray-400 px-4 py-1 rounded hover:"
                                onClick={() => setEditingComment(null)}
                              >
                                Hủy
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="mb-2">
                            <p className="text-gray-100 text-start  whitespace-pre-line">
                              {comment.content}
                            </p>
                          </div>
                        )}
                        {/* Comment Actions */}
                        <div className="flex items-center gap-4 text-sm mt-1">
                          <button
                            className={`flex items-center gap-1 rounded-full px-2 py-1  
                              ${
                                !currentUser
                                  ? "cursor-not-allowed opacity-50"
                                  : ""
                              }
                              ${
                                comment.isLiked
                                  ? " text-gray-200 bg-pink-500"
                                  : " text-gray-400 "
                              }
                            `}
                            onClick={() => handleLikeParentComment(comment._id)}
                            disabled={!currentUser}
                          >
                            <Heart size={16} />
                            <span>{comment.likes}</span>
                          </button>
                          <button
                            className="text-gray-400 hover:text-blue-400"
                            onClick={() => {
                              setReplyingTo({
                                type: "comment",
                                id: comment._id,
                              });
                              setReplyText("");
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <MessageCircle size={16} />
                              <span>{comment.replies.length}</span>
                            </div>
                          </button>
                        </div>
                        {/* Reply Input for Comment */}
                        {replyingTo &&
                          replyingTo.type === "comment" &&
                          replyingTo.id === comment._id && (
                            <form
                              className="mt-2 ml-12 border-t pt-2 flex gap-2"
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleReplyComment(
                                  comment._id,
                                  replyText,
                                  () => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                  }
                                );
                              }}
                            >
                              <img
                                src={comment.author_id?.avatar || "default.png"}
                                alt={comment.author_id?.name || "Ẩn danh"}
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                              />
                              <div className="flex-1">
                                <div className="flex items-center ">
                                  <span className="font-semibold text-white">
                                    {comment.author_id?.name || "Ẩn danh"}
                                  </span>
                                </div>

                                <input
                                  className="w-full  text-white bg-transparent rounded-lg px-2 pb-1 border-none outline-none"
                                  placeholder="Nhập trả lời của bạn..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button
                                    type="submit"
                                    className=" text-gray-300 px-1 py-1 flex items-center gap-1 rounded hover:text-[#8f6bff]"
                                    disabled={!replyText.trim()}
                                  >
                                    <Send size={16} />
                                    <p>Gửi</p>
                                  </button>
                                  <button
                                    type="button"
                                    className="text-gray-300 px-1 py-1  flex items-center  rounded hover:text-red-500"
                                    onClick={() => setReplyingTo(null)}
                                  >
                                    <X size={16} />
                                    <p>Hủy </p>
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                        {/* Nested Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 pl-8 border-l-2 border-[#232323] space-y-4">
                            {comment.replies
                              .slice(
                                0,
                                comment.showAllReplies
                                  ? comment.replies.length
                                  : REPLIES_PER_PAGE
                              )
                              .map((reply) => (
                                <div
                                  key={reply._id}
                                  className="rounded-lg  p-3 text-white"
                                >
                                  <div className="flex items-start gap-3 mb-2">
                                    <img
                                      src={
                                        reply.author_id?.avatar || "default.png"
                                      }
                                      alt={reply.author_id?.name || "Ẩn danh"}
                                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-white">
                                          {reply.author_id?.name || "Ẩn danh"}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          {formatDate(reply.created_at)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      {currentUser &&
                                        String(
                                          reply.author_id?._id ||
                                            reply.author_id
                                        ) === String(currentUser._id) && (
                                          <>
                                            <button
                                              className="p-1 text-blue-400  rounded-full"
                                              title="Sửa"
                                              onClick={() =>
                                                setEditingReply({
                                                  commentId: comment._id,
                                                  replyId: reply._id,
                                                  content: reply.content,
                                                })
                                              }
                                            >
                                              <Pencil size={14} />
                                            </button>
                                            <button
                                              className="p-1 text-red-400  rounded-full"
                                              title="Xóa"
                                              onClick={() =>
                                                handleDeleteReply(
                                                  comment._id,
                                                  reply._id
                                                )
                                              }
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </>
                                        )}
                                    </div>
                                  </div>
                                  {/* Reply Content or Edit Form */}
                                  {editingReply &&
                                  editingReply.replyId === reply._id &&
                                  editingReply.commentId === comment._id ? (
                                    <form
                                      className="mb-2 flex flex-col gap-2"
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        handleEditReply(
                                          comment._id,
                                          reply._id,
                                          editingReply.content,
                                          () => setEditingReply(null)
                                        );
                                      }}
                                    >
                                      <input
                                        className="w-full  text-white rounded-lg px-3 py-2 border-none outline-none"
                                        value={editingReply.content}
                                        onChange={(e) =>
                                          setEditingReply({
                                            ...editingReply,
                                            content: e.target.value,
                                          })
                                        }
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          type="submit"
                                          className="bg-[#6C47FF] text-white px-4 py-1 rounded hover:bg-[#8f6bff]"
                                          disabled={
                                            !editingReply.content.trim()
                                          }
                                        >
                                          Lưu
                                        </button>
                                        <button
                                          type="button"
                                          className="text-gray-400 px-4 py-1 rounded "
                                          onClick={() => setEditingReply(null)}
                                        >
                                          Hủy
                                        </button>
                                      </div>
                                    </form>
                                  ) : (
                                    <div className="mb-2">
                                      <p className="text-gray-200 text-start whitespace-pre-line text-sm">
                                        {reply.content}
                                      </p>
                                    </div>
                                  )}
                                  {/* Reply Actions */}
                                  <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-4 text-sm mt-1">
                                      <button
                                        className={`flex items-center gap-1 hover:text-red-500 rounded-full px-2 py-1 ${
                                          reply.isLiked
                                            ? "text-pink-500"
                                            : "text-gray-400"
                                        }`}
                                        onClick={() =>
                                          handleLikeReplyComment(
                                            comment._id,
                                            reply._id
                                          )
                                        }
                                        disabled={!currentUser}
                                      >
                                        <Heart size={16} />
                                        <span>{reply.likes}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            {/* Show more replies */}
                            {comment.replies.length > REPLIES_PER_PAGE &&
                              !comment.showAllReplies && (
                                <button
                                  className="text-xs text-blue-400 mt-2"
                                  onClick={() => {
                                    setThread((prev) => ({
                                      ...prev,
                                      comments: prev.comments.map((c) =>
                                        c._id === comment._id
                                          ? { ...c, showAllReplies: true }
                                          : c
                                      ),
                                    }));
                                  }}
                                >
                                  Xem thêm trả lời
                                </button>
                              )}
                            {comment.replies.length > REPLIES_PER_PAGE &&
                              comment.showAllReplies && (
                                <button
                                  className="text-xs text-blue-400 mt-2"
                                  onClick={() => {
                                    setThread((prev) => ({
                                      ...prev,
                                      comments: prev.comments.map((c) =>
                                        c._id === comment._id
                                          ? { ...c, showAllReplies: false }
                                          : c
                                      ),
                                    }));
                                  }}
                                >
                                  Ẩn bớt trả lời
                                </button>
                              )}
                          </div>
                        )}
                      </div>
                    ))}
                  {/* Pagination for comments */}
                  {totalCommentPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <button
                        className="px-3 py-1 rounded  text-gray-300 "
                        disabled={commentPage === 1}
                        onClick={() =>
                          setCommentPage((p) => Math.max(1, p - 1))
                        }
                      >
                        Trước
                      </button>
                      <span className="px-2 py-1">
                        {commentPage} / {totalCommentPages}
                      </span>
                      <button
                        className="px-3 py-1 rounded  text-gray-300 "
                        disabled={commentPage === totalCommentPages}
                        onClick={() =>
                          setCommentPage((p) =>
                            Math.min(totalCommentPages, p + 1)
                          )
                        }
                      >
                        Sau
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/4">
              {/* Related Threads */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Chủ đề liên quan
                </h3>
                <div className="space-y-3">
                  {(Array.isArray(relatedThreads) ? relatedThreads : []).filter(
                    (t) => t && t._id !== threadId
                  ).length === 0 ? (
                    <div className="text-gray-500 text-sm italic px-2 py-4">
                      Không có chủ đề liên quan
                    </div>
                  ) : (
                    (Array.isArray(relatedThreads) ? relatedThreads : [])
                      .filter((t) => t && t._id !== threadId)
                      .map((relatedThread) => (
                        <Link
                          key={relatedThread._id}
                          to={`/forumthreads/${relatedThread._id}`}
                          className="block bg-pink-50 hover:bg-pink-100 p-3 rounded-lg transition"
                        >
                          <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                            {relatedThread.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MessageCircle size={12} />{" "}
                              {relatedThread.commentsCount ||
                                (relatedThread.comments
                                  ? relatedThread.comments.length
                                  : 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart size={12} /> {relatedThread.likes || 0}
                            </span>
                          </div>
                        </Link>
                      ))
                  )}
                </div>
              </div>

              {/* Category Info */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Về chuyên mục
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {thread.category} là nơi chia sẻ kinh nghiệm và thắc mắc về
                  giai đoạn đầu của thai kỳ.
                </p>
                <Link
                  to={`/forum?category=${encodeURIComponent(thread.category)}`}
                  className="text-pink-500 hover:text-pink-700 text-sm font-medium"
                >
                  Xem tất cả chủ đề →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={!!modalEdit}
        title={modalEdit?.type === "comment" ? "Sửa bình luận" : "Sửa trả lời"}
        onClose={() => setModalEdit(null)}
        color="blue"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (modalEdit.type === "comment") {
              handleEditComment(modalEdit.id, modalEdit.content, () =>
                setModalEdit(null)
              );
            } else {
              handleEditReply(
                modalEdit.commentId,
                modalEdit.id,
                modalEdit.content,
                () => setModalEdit(null)
              );
            }
          }}
        >
          <textarea
            className="w-full  bg-slate-600 p-2 border rounded-lg mb-2"
            rows="3"
            value={modalEdit?.content || ""}
            onChange={(e) =>
              setModalEdit({ ...modalEdit, content: e.target.value })
            }
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1 rounded-full hover:bg-pink-600 transition-all duration-300  bg-pink-300 text-white"
              disabled={!modalEdit?.content?.trim()}
            >
              <Save size={20} />
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!modalDelete}
        title="Xác nhận xóa"
        onClose={() => setModalDelete(null)}
      >
        <p className="text-gray-800">
          Bạn có chắc chắn muốn xóa{" "}
          {modalDelete?.type === "comment" ? "bình luận" : "trả lời"} này không?
        </p>
        <div className="flex gap-2 justify-end mt-4">
          <button
            className="p-2 px-3 rounded bg-red-300 hover:bg-red-500 transition-all duration-300 text-white"
            onClick={() => {
              if (modalDelete.type === "comment") {
                handleDeleteComment(modalDelete.id);
              } else {
                handleDeleteReply(modalDelete.commentId, modalDelete.id);
              }
              setModalDelete(null);
            }}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ThreadDetail;
