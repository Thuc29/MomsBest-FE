import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
  Check,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const ShareModal = ({ isOpen, onClose, article, shareUrl }) => {
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState("");

  if (!isOpen || !article) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      setShareMethod("copy");

      Swal.fire({
        title: "Đã sao chép!",
        text: "Liên kết đã được sao chép vào clipboard",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        setCopied(false);
        setShareMethod("");
      }, 2000);
    } catch (err) {
      Swal.fire({
        title: "Lỗi",
        text: "Không thể sao chép liên kết",
        icon: "error",
      });
    }
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(shareUrl || window.location.href);
    const title = encodeURIComponent(article.title);
    const text = encodeURIComponent(article.summary);

    let shareUrl_platform = "";

    switch (platform) {
      case "facebook":
        shareUrl_platform = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl_platform = `https://twitter.com/intent/tweet?url=${url}&text=${title}&via=MomsBest`;
        break;
      case "linkedin":
        shareUrl_platform = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "email":
        shareUrl_platform = `mailto:?subject=${title}&body=${text}%0A%0A${url}`;
        break;
      default:
        return;
    }

    setShareMethod(platform);

    if (platform === "email") {
      window.location.href = shareUrl_platform;
    } else {
      window.open(shareUrl_platform, "_blank", "width=600,height=400");
    }

    Swal.fire({
      title: "Đang chia sẻ...",
      text: `Đang mở ${platform} để chia sẻ bài viết`,
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const shareOptions = [
    {
      id: "copy",
      name: "Sao chép liên kết",
      icon: copied ? Check : Copy,
      color: "bg-green-500 hover:bg-green-600",
      onClick: handleCopyLink,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => handleShare("facebook"),
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      onClick: () => handleShare("twitter"),
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      onClick: () => handleShare("linkedin"),
    },
    {
      id: "email",
      name: "Email",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700",
      onClick: () => handleShare("email"),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto relative"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Share2 size={20} className="text-pink-500" />
                <h2 className="text-xl font-bold text-gray-800">
                  Chia sẻ bài viết
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Article Preview */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                {shareOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={option.onClick}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg text-white font-medium transition ${
                        option.color
                      } ${
                        shareMethod === option.id
                          ? "ring-2 ring-offset-2 ring-white"
                          : ""
                      }`}
                    >
                      <IconComponent size={20} />
                      <span>{option.name}</span>
                      {shareMethod === option.id && (
                        <Check size={16} className="ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* URL Display */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <LinkIcon size={16} />
                  <span>Liên kết bài viết:</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareUrl || window.location.href}
                    readOnly
                    className="flex-1 p-2 text-sm bg-white border border-gray-200 rounded-md"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`p-2 rounded-md transition ${
                      copied
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <p className="text-sm text-gray-500 text-center">
                Chia sẻ kiến thức hữu ích với cộng đồng mẹ và bé
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
