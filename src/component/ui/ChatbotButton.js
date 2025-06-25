import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatbotButton = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [suggestionPage, setSuggestionPage] = useState(0);
  const emojiList = [
    "😀",
    "😂",
    "😍",
    "🥰",
    "😎",
    "😭",
    "👍",
    "🙏",
    "🎉",
    "❤️",
    "😇",
    "🤖",
    "👩‍👧",
    "💡",
    "🛒",
  ];

  const SUGGESTIONS_PER_PAGE = 4;

  const suggestions = [
    { text: "Hỏi đáp nhanh về mẹ & bé", icon: "👩‍👧" },
    { text: "Hướng dẫn sử dụng website", icon: "💡" },
    { text: "Tư vấn sản phẩm", icon: "🛒" },
    { text: "Chính sách đổi trả hàng", icon: "🔄" },
    { text: "Theo dõi đơn hàng của tôi", icon: "🚚" },
    { text: "Các phương thức thanh toán", icon: "💳" },
    { text: "Thông tin về khuyến mãi", icon: "🎁" },
    { text: "Tư vấn chọn size cho bé", icon: "👕" },
    { text: "Kiểm tra tình trạng còn hàng", icon: "✅" },
    { text: "Gợi ý quà tặng cho bé", icon: "👶" },
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Load lịch sử chat từ localStorage khi khởi tạo
  useEffect(() => {
    const saved = localStorage.getItem("chatbot_messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Lưu lịch sử chat vào localStorage mỗi khi messages thay đổi
  useEffect(() => {
    localStorage.setItem("chatbot_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("https://momsbest-be-r1im.onrender.com/api/chatbot/ask", {
        message: userMsg.text,
      });
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: res.data.reply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (e) {
      let errorMsg = "Xin lỗi, có lỗi xảy ra.";
      if (e.response && e.response.data) {
        if (
          e.response.data.details &&
          typeof e.response.data.details === "object"
        ) {
          errorMsg =
            e.response.data.details.error ||
            JSON.stringify(e.response.data.details);
        } else if (e.response.data.error) {
          errorMsg = e.response.data.error;
        }
      }
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: errorMsg,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  };

  // Nút nổi khi thu nhỏ
  if (minimized) {
    return (
      <button
        className="fixed z-50 bottom-6 right-6 bg-gradient-to-tr from-pink-100 via-pink-300 to-pink-500 hover:scale-110 active:scale-95 transition-transform duration-200 shadow-2xl hover:shadow-pink-300/60 text-white rounded-full w-16 h-16 flex items-center justify-center text-4xl focus:outline-none border-4 border-pink-600/70 group"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        aria-label="Mở Chatbot"
      >
        <span className="inline-block animate-bounce group-hover:animate-spin">
          🤖
        </span>
      </button>
    );
  }

  return (
    <>
      {/* Nút Chatbot nổi */}
      {!open && !minimized && (
        <button
          className="fixed z-50 bottom-6 right-6 bg-gradient-to-tr from-pink-100 via-pink-300 to-pink-500 hover:scale-110 active:scale-95 transition-transform duration-200 shadow-2xl hover:shadow-pink-300/60 text-white rounded-full w-16 h-16 flex items-center justify-center text-4xl focus:outline-none border-4 border-pink-600/70 group"
          onClick={() => setOpen(true)}
          aria-label="Mở Chatbot"
        >
          <span className="inline-block animate-bounce group-hover:animate-spin">
            🤖
          </span>
        </button>
      )}
      {/* Khung chat */}
      {open && (
        <div
          className={`fixed z-50 bottom-20 right-24 w-[450px] max-w-[100vw] bg-white rounded-3xl shadow-2xl border border-pink-200 flex flex-col overflow-hidden transition-all duration-200 ${
            open
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "translate-y-10 opacity-0 pointer-events-none"
          } animate-fade-in`}
          style={{
            minHeight: open ? 600 : 0,
            background: open
              ? "linear-gradient(135deg, #ffe0f0 0%, #fff5f8 50%, #ffe4ec 100%) url('https://www.transparenttextures.com/patterns/diamond-upholstery.png') repeat"
              : undefined,
          }}
        >
          <div className="bg-gradient-to-r from-pink-500/80 via-pink-400/80 to-pink-300/80 text-white px-5 py-3 flex justify-between items-center rounded-t-3xl shadow-md">
            <span className="font-semibold tracking-wide">Chatbot hỗ trợ</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimized(true)}
                className="text-white text-xl hover:bg-pink-400/30 font-bold  rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                aria-label="Thu nhỏ Chatbot"
                title="Thu nhỏ"
              >
                <span>_</span>
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setMessages([]);
                  localStorage.removeItem("chatbot_messages");
                }}
                className="text-white text-2xl font-bold hover:bg-pink-400/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                aria-label="Đóng Chatbot"
                title="Đóng"
              >
                <X />
              </button>
            </div>
          </div>
          <div className="flex-1 p-2 text-base text-gray-700 bg-gradient-to-b from-white via-pink-50 to-white overflow-y-auto max-h-[520px]">
            {messages.length === 0 && (
              <div className="flex flex-col items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                  alt="Mẹ & Bé"
                  className="w-20 h-20 mb-2 animate-bounce"
                />
                <p className="mb-2 text-center">
                  Xin chào! Mình có thể giúp gì cho bạn?
                </p>
                <div className="flex flex-col gap-2 mt-2 w-full">
                  {suggestions
                    .slice(
                      suggestionPage * SUGGESTIONS_PER_PAGE,
                      (suggestionPage + 1) * SUGGESTIONS_PER_PAGE
                    )
                    .map((q, idx) => (
                      <button
                        key={idx}
                        className="flex items-center gap-2 text-pink-600 bg-pink-100 hover:bg-pink-200 rounded-xl px-4 py-2 text-left transition-colors border border-pink-200 shadow-sm"
                        onClick={() => {
                          setInput(q.text);
                          setTimeout(() => sendMessage(), 0);
                        }}
                        disabled={loading}
                      >
                        <span className="text-2xl">{q.icon}</span>
                        <span>{q.text}</span>
                      </button>
                    ))}
                </div>
                {suggestions.length > SUGGESTIONS_PER_PAGE && (
                  <div className="flex justify-center items-center gap-2 mt-2 text-sm text-pink-700">
                    <button
                      onClick={() =>
                        setSuggestionPage((p) => Math.max(0, p - 1))
                      }
                      disabled={suggestionPage === 0}
                      className="px-2 py-1 rounded-md bg-pink-200 hover:bg-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Trang trước"
                    >
                      &lt;
                    </button>
                    <span>
                      Trang {suggestionPage + 1} /{" "}
                      {Math.ceil(suggestions.length / SUGGESTIONS_PER_PAGE)}
                    </span>
                    <button
                      onClick={() =>
                        setSuggestionPage((p) =>
                          Math.min(
                            p + 1,
                            Math.ceil(
                              suggestions.length / SUGGESTIONS_PER_PAGE
                            ) - 1
                          )
                        )
                      }
                      disabled={
                        (suggestionPage + 1) * SUGGESTIONS_PER_PAGE >=
                        suggestions.length
                      }
                      className="px-2 py-1 rounded-md bg-pink-200 hover:bg-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Trang sau"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in-up`}
              >
                {msg.sender === "ai" && (
                  <span className="mr-1 flex items-end">
                    <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow">
                      🤖
                    </span>
                  </span>
                )}
                <span
                  className={`inline-block px-3 py-2 rounded-2xl max-w-[70%] break-words ${
                    msg.sender === "user"
                      ? "bg-pink-200 text-gray-800"
                      : "bg-pink-500 text-white"
                  }`}
                >
                  {/* Nếu là link ảnh thì hiển thị ảnh */}
                  {/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(
                    msg.text.trim()
                  ) ? (
                    <img
                      src={msg.text.trim()}
                      alt="img"
                      className="max-w-[200px] max-h-[200px] rounded-xl border border-pink-200"
                    />
                  ) : (
                    <div className="prose prose-pink max-w-full">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                  <span className="block text-xs text-pink-900/60 mt-1 text-right">
                    {msg.time}
                  </span>
                </span>
                {msg.sender === "user" && (
                  <span className="ml-2 flex items-end">
                    <span className="bg-pink-200 text-pink-600 rounded-full w-8 h-8 flex items-center justify-center text-xl shadow">
                      🧑
                    </span>
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-2">
                <span className="mr-2 flex items-end">
                  <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow">
                    🤖
                  </span>
                </span>
                <span className="inline-block px-3 py-2 rounded-2xl bg-pink-100 text-pink-500 max-w-[70%] animate-pulse">
                  <span className="inline-block align-middle">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </span>
                  <span className="ml-2">Bot đang trả lời...</span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t flex bg-white relative">
            <button
              className="mr-2 text-2xl hover:scale-125 transition-transform"
              onClick={() => setShowEmoji((v) => !v)}
              title="Chèn emoji"
              type="button"
              tabIndex={-1}
            >
              😊
            </button>
            {showEmoji && (
              <div className="absolute bottom-14 left-0 bg-white border border-pink-200 rounded-xl shadow-lg p-2 flex flex-wrap gap-1 z-50 w-64">
                {emojiList.map((e, i) => (
                  <button
                    key={i}
                    className="text-2xl hover:bg-pink-100 rounded p-1"
                    onClick={() => {
                      setInput(input + e);
                      setShowEmoji(false);
                    }}
                    type="button"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
            <textarea
              rows={1}
              className="flex-1 border border-pink-200 rounded-l-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-gray-700 bg-pink-50 placeholder:text-pink-300 resize-none"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              style={{ minHeight: 40, maxHeight: 120 }}
            />
            <button
              className="bg-gradient-to-tr from-pink-400 to-pink-500 text-white px-5 py-2 rounded-r-2xl font-semibold shadow hover:from-pink-500 hover:to-pink-600 transition-all disabled:opacity-60"
              onClick={sendMessage}
              disabled={loading}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
