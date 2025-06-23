import { useParams, Link } from "react-router-dom";
import { ChevronLeft, BookOpen } from "lucide-react";

// Mock articles (nên đồng bộ với Library.js)
const articles = [
  {
    id: "a1",
    title: "Những điều mẹ bầu cần biết trong 3 tháng đầu",
    content: `Trong 3 tháng đầu thai kỳ, mẹ bầu cần chú ý đến chế độ dinh dưỡng, nghỉ ngơi hợp lý và kiểm tra sức khỏe định kỳ.\n\n- Ăn đa dạng thực phẩm, bổ sung axit folic, sắt, canxi.\n- Tránh các thực phẩm sống, chưa tiệt trùng.\n- Tập thể dục nhẹ nhàng như đi bộ, yoga bầu.\n- Khám thai đúng lịch để theo dõi sự phát triển của thai nhi.`,
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400",
  },
  {
    id: "a2",
    title: "Thực đơn dinh dưỡng cho mẹ sau sinh",
    content: `Sau sinh, mẹ cần bổ sung nhiều protein, rau xanh, trái cây và uống đủ nước để phục hồi sức khỏe và tăng lượng sữa.\n\n- Ăn nhiều bữa nhỏ, tránh đồ cay nóng.\n- Ưu tiên thực phẩm giàu sắt, canxi, vitamin.\n- Nghỉ ngơi hợp lý, giữ tinh thần lạc quan.`,
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400",
  },
  {
    id: "a3",
    title: "Cách tắm cho trẻ sơ sinh an toàn",
    content: `Tắm cho trẻ sơ sinh cần nhẹ nhàng, giữ ấm phòng và chuẩn bị đầy đủ dụng cụ.\n\n- Dùng nước ấm, kiểm tra nhiệt độ trước khi tắm.\n- Không tắm quá lâu, lau khô và mặc ấm cho bé sau khi tắm.`,
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400",
  },
  {
    id: "a4",
    title: "Dấu hiệu trầm cảm sau sinh và cách phòng tránh",
    content: `Trầm cảm sau sinh có thể xuất hiện với các biểu hiện như buồn bã, mất ngủ, lo âu kéo dài.\n\n- Chia sẻ cảm xúc với người thân, bạn bè.\n- Tham khảo ý kiến chuyên gia tâm lý khi cần thiết.\n- Nghỉ ngơi, thư giãn, tập thể dục nhẹ nhàng.`,
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg?auto=compress&w=400",
  },
  {
    id: "a5",
    title: "Các mốc phát triển quan trọng của trẻ 1-3 tuổi",
    content: `Trẻ 1-3 tuổi phát triển nhanh về vận động, ngôn ngữ và nhận thức.\n\n- Khuyến khích trẻ vận động, khám phá môi trường xung quanh.\n- Đọc sách, trò chuyện để phát triển ngôn ngữ.\n- Theo dõi các mốc phát triển để phát hiện sớm bất thường.`,
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&w=400",
  },
  {
    id: "a6",
    title: "Bí quyết giúp bé ăn ngon miệng hơn",
    content: `Tạo không khí vui vẻ khi ăn, thay đổi món thường xuyên và không ép bé ăn.\n\n- Cho bé tham gia chuẩn bị bữa ăn.\n- Trang trí món ăn bắt mắt.\n- Tôn trọng cảm giác no của bé.`,
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400",
  },
];

const ArticleDetail = () => {
  const { articleId } = useParams();
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 p-8 rounded-xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">
            Bài viết không tồn tại
          </h2>
          <Link
            to="/forum/library"
            className="inline-flex items-center text-blue-500 hover:text-blue-700"
          >
            <ChevronLeft size={18} />
            <span>Quay lại thư viện</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600')] flex flex-col font-space-grotesk">
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <Link
              to="/forum/library"
              className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-4"
            >
              <ChevronLeft size={18} />
              <span>Quay lại thư viện</span>
            </Link>
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
              <BookOpen size={16} />
              <span>{article.category}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {article.title}
            </h1>
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-56 object-cover rounded-xl mb-6"
            />
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {article.content}
            </div>
            <Link
              to={`/forum/library/article/${article.id}`}
              className="text-pink-500 hover:text-pink-700 text-sm font-medium mt-auto"
            >
              Đọc tiếp →
            </Link>
          </div>
        </div>
      </section>
      <footer className="bg-white/80 backdrop-blur-sm py-6 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">
            © 2025 Diễn đàn Mẹ và Bé. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ArticleDetail;
