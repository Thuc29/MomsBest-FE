import { useParams, Link } from "react-router-dom";
import { ChevronLeft, BookOpen } from "lucide-react";

// Mock articles (nên đồng bộ với Library.js)
const articles = [
  // Cẩm nang thai kỳ (5 articles)
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
    title: "Chuẩn bị tâm lý cho 3 tháng cuối thai kỳ",
    content: `3 tháng cuối là giai đoạn quan trọng để chuẩn bị cho việc sinh nở và chào đón em bé.\n\n- Tham gia các lớp học tiền sản.\n- Chuẩn bị đồ dùng cho mẹ và bé.\n- Tìm hiểu về các dấu hiệu chuyển dạ.\n- Thực hành các kỹ thuật thở và thư giãn.`,
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400",
  },
  {
    id: "a3",
    title: "Các bài tập thể dục an toàn cho mẹ bầu",
    content: `Tập thể dục đúng cách giúp mẹ bầu khỏe mạnh và dễ sinh nở hơn.\n\n- Đi bộ nhẹ nhàng 30 phút mỗi ngày.\n- Yoga bầu giúp tăng sự linh hoạt và thư giãn.\n- Bơi lội là môn thể thao lý tưởng cho mẹ bầu.\n- Tránh các động tác nằm ngửa sau tháng thứ 4.`,
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400",
  },
  {
    id: "a4",
    title: "Những thực phẩm cần tránh khi mang thai",
    content: `Một số thực phẩm có thể gây hại cho thai nhi và mẹ bầu cần tránh.\n\n- Thịt, cá sống hoặc chưa nấu chín.\n- Sữa và phô mai chưa tiệt trùng.\n- Trứng sống hoặc chưa nấu chín.\n- Rượu, bia và các đồ uống có cồn.`,
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/3933277/pexels-photo-3933277.jpeg?auto=compress&w=400",
  },
  {
    id: "a5",
    title: "Cách đối phó với ốm nghén hiệu quả",
    content: `Ốm nghén là triệu chứng phổ biến trong thai kỳ, đặc biệt là 3 tháng đầu.\n\n- Ăn nhiều bữa nhỏ thay vì 3 bữa lớn.\n- Uống đủ nước, tránh để bụng đói.\n- Sử dụng gừng, chanh để giảm buồn nôn.\n- Nghỉ ngơi đầy đủ và tránh stress.`,
    category: "Cẩm nang thai kỳ",
    thumbnail:
      "https://images.pexels.com/photos/3933279/pexels-photo-3933279.jpeg?auto=compress&w=400",
  },

  // Dinh dưỡng mẹ và bé (5 articles)
  {
    id: "a6",
    title: "Thực đơn dinh dưỡng cho mẹ sau sinh",
    content: `Sau sinh, mẹ cần bổ sung nhiều protein, rau xanh, trái cây và uống đủ nước để phục hồi sức khỏe và tăng lượng sữa.\n\n- Ăn nhiều bữa nhỏ, tránh đồ cay nóng.\n- Ưu tiên thực phẩm giàu sắt, canxi, vitamin.\n- Nghỉ ngơi hợp lý, giữ tinh thần lạc quan.`,
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400",
  },
  {
    id: "a7",
    title: "Bí quyết giúp bé ăn ngon miệng hơn",
    content: `Tạo không khí vui vẻ khi ăn, thay đổi món thường xuyên và không ép bé ăn.\n\n- Cho bé tham gia chuẩn bị bữa ăn.\n- Trang trí món ăn bắt mắt.\n- Tôn trọng cảm giác no của bé.\n- Tạo thói quen ăn uống đúng giờ.`,
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/3933276/pexels-photo-3933276.jpeg?auto=compress&w=400",
  },
  {
    id: "a8",
    title: "Thực phẩm tăng sữa mẹ hiệu quả",
    content: `Một số thực phẩm giúp tăng lượng sữa và chất lượng sữa mẹ.\n\n- Rau ngót, rau đay, rau mồng tơi.\n- Đu đủ xanh, chuối, cam.\n- Các loại hạt như hạt sen, hạt điều.\n- Uống đủ nước và sữa.`,
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg?auto=compress&w=400",
  },
  {
    id: "a9",
    title: "Thực đơn ăn dặm cho bé 6-12 tháng",
    content: `Giai đoạn ăn dặm rất quan trọng cho sự phát triển của bé.\n\n- Bắt đầu với bột loãng, tăng dần độ đặc.\n- Thêm từng loại thực phẩm một cách từ từ.\n- Ưu tiên rau xanh, thịt nạc, trứng.\n- Tránh muối, đường và gia vị mạnh.`,
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640780/pexels-photo-1640780.jpeg?auto=compress&w=400",
  },
  {
    id: "a10",
    title: "Cách chế biến thức ăn an toàn cho trẻ nhỏ",
    content: `Chế biến thức ăn đúng cách giúp đảm bảo an toàn và dinh dưỡng cho trẻ.\n\n- Rửa sạch tay và dụng cụ trước khi chế biến.\n- Nấu chín kỹ thịt, cá, trứng.\n- Bảo quản thức ăn đúng cách.\n- Tránh để thức ăn ở nhiệt độ phòng quá lâu.`,
    category: "Dinh dưỡng mẹ và bé",
    thumbnail:
      "https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?auto=compress&w=400",
  },

  // Chăm sóc sơ sinh (5 articles)
  {
    id: "a11",
    title: "Cách tắm cho trẻ sơ sinh an toàn",
    content: `Tắm cho trẻ sơ sinh cần nhẹ nhàng, giữ ấm phòng và chuẩn bị đầy đủ dụng cụ.\n\n- Dùng nước ấm, kiểm tra nhiệt độ trước khi tắm.\n- Không tắm quá lâu, lau khô và mặc ấm cho bé sau khi tắm.\n- Sử dụng sữa tắm dành riêng cho trẻ sơ sinh.\n- Tắm vào thời điểm bé tỉnh táo và không đói.`,
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400",
  },
  {
    id: "a12",
    title: "Hướng dẫn thay tã cho trẻ sơ sinh",
    content: `Thay tã đúng cách giúp tránh hăm tã và giữ vệ sinh cho bé.\n\n- Rửa tay trước và sau khi thay tã.\n- Lau sạch vùng kín từ trước ra sau.\n- Để da khô thoáng trước khi mặc tã mới.\n- Thay tã thường xuyên, không để quá ướt.`,
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933276/pexels-photo-3933276.jpeg?auto=compress&w=400",
  },
  {
    id: "a13",
    title: "Cách massage cho trẻ sơ sinh",
    content: `Massage giúp trẻ thư giãn, ngủ ngon và phát triển tốt hơn.\n\n- Thực hiện massage khi bé tỉnh táo và không đói.\n- Sử dụng dầu massage dành cho trẻ sơ sinh.\n- Massage nhẹ nhàng theo chiều kim đồng hồ.\n- Bắt đầu từ chân, tay rồi đến bụng và lưng.`,
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933277/pexels-photo-3933277.jpeg?auto=compress&w=400",
  },
  {
    id: "a14",
    title: "Cách ru trẻ sơ sinh ngủ ngon",
    content: `Giấc ngủ rất quan trọng cho sự phát triển của trẻ sơ sinh.\n\n- Tạo thói quen ngủ đúng giờ.\n- Giữ phòng yên tĩnh, tối và mát mẻ.\n- Ru bé bằng âm nhạc nhẹ nhàng hoặc hát ru.\n- Tránh cho bé ngủ quá nhiều vào ban ngày.`,
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933278/pexels-photo-3933278.jpeg?auto=compress&w=400",
  },
  {
    id: "a15",
    title: "Cách chăm sóc rốn cho trẻ sơ sinh",
    content: `Chăm sóc rốn đúng cách giúp tránh nhiễm trùng và rốn rụng nhanh.\n\n- Giữ rốn khô thoáng, không băng kín.\n- Vệ sinh rốn bằng nước muối sinh lý.\n- Mặc tã dưới rốn để tránh ướt.\n- Theo dõi dấu hiệu nhiễm trùng như sưng, đỏ, chảy mủ.`,
    category: "Chăm sóc sơ sinh",
    thumbnail:
      "https://images.pexels.com/photos/3933279/pexels-photo-3933279.jpeg?auto=compress&w=400",
  },

  // Sức khỏe tinh thần (5 articles)
  {
    id: "a16",
    title: "Dấu hiệu trầm cảm sau sinh và cách phòng tránh",
    content: `Trầm cảm sau sinh có thể xuất hiện với các biểu hiện như buồn bã, mất ngủ, lo âu kéo dài.\n\n- Chia sẻ cảm xúc với người thân, bạn bè.\n- Tham khảo ý kiến chuyên gia tâm lý khi cần thiết.\n- Nghỉ ngơi, thư giãn, tập thể dục nhẹ nhàng.\n- Đừng ngại nhờ sự giúp đỡ từ người khác.`,
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg?auto=compress&w=400",
  },
  {
    id: "a17",
    title: "Cách giảm stress khi chăm sóc trẻ nhỏ",
    content: `Chăm sóc trẻ nhỏ có thể gây stress, cần học cách quản lý cảm xúc.\n\n- Dành thời gian cho bản thân mỗi ngày.\n- Thực hành thiền, yoga hoặc hít thở sâu.\n- Chia sẻ gánh nặng với người thân.\n- Đặt kỳ vọng thực tế về bản thân.`,
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768914/pexels-photo-3768914.jpeg?auto=compress&w=400",
  },
  {
    id: "a18",
    title: "Xây dựng mối quan hệ tốt với con cái",
    content: `Mối quan hệ tốt giữa cha mẹ và con cái rất quan trọng cho sự phát triển của trẻ.\n\n- Dành thời gian chất lượng với con.\n- Lắng nghe và tôn trọng cảm xúc của con.\n- Khen ngợi và khuyến khích con đúng cách.\n- Đặt ra ranh giới rõ ràng và nhất quán.`,
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768915/pexels-photo-3768915.jpeg?auto=compress&w=400",
  },
  {
    id: "a19",
    title: "Cách đối phó với cảm giác tội lỗi của cha mẹ",
    content: `Nhiều cha mẹ cảm thấy tội lỗi khi không thể hoàn hảo trong việc nuôi dạy con.\n\n- Chấp nhận rằng không ai hoàn hảo.\n- Tập trung vào những điều tích cực.\n- Học hỏi từ những sai lầm.\n- Tìm kiếm sự hỗ trợ từ cộng đồng.`,
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&w=400",
  },
  {
    id: "a20",
    title: "Cách giữ gìn hạnh phúc gia đình",
    content: `Hạnh phúc gia đình cần được nuôi dưỡng hàng ngày.\n\n- Giao tiếp cởi mở và tôn trọng lẫn nhau.\n- Dành thời gian cho các hoạt động gia đình.\n- Giải quyết xung đột một cách xây dựng.\n- Tạo truyền thống và kỷ niệm đẹp.`,
    category: "Sức khỏe tinh thần",
    thumbnail:
      "https://images.pexels.com/photos/3768917/pexels-photo-3768917.jpeg?auto=compress&w=400",
  },

  // Phát triển trẻ nhỏ (5 articles)
  {
    id: "a21",
    title: "Các mốc phát triển quan trọng của trẻ 1-3 tuổi",
    content: `Trẻ 1-3 tuổi phát triển nhanh về vận động, ngôn ngữ và nhận thức.\n\n- Khuyến khích trẻ vận động, khám phá môi trường xung quanh.\n- Đọc sách, trò chuyện để phát triển ngôn ngữ.\n- Theo dõi các mốc phát triển để phát hiện sớm bất thường.\n- Tạo môi trường an toàn để trẻ tự do khám phá.`,
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&w=400",
  },
  {
    id: "a22",
    title: "Cách kích thích trí não cho trẻ 0-6 tuổi",
    content: `Giai đoạn 0-6 tuổi là thời kỳ vàng cho sự phát triển trí não.\n\n- Chơi các trò chơi kích thích giác quan.\n- Đọc sách và kể chuyện thường xuyên.\n- Cho trẻ tiếp xúc với âm nhạc và nghệ thuật.\n- Khuyến khích trẻ đặt câu hỏi và tò mò.`,
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662668/pexels-photo-3662668.jpeg?auto=compress&w=400",
  },
  {
    id: "a23",
    title: "Phát triển kỹ năng xã hội cho trẻ mầm non",
    content: `Kỹ năng xã hội rất quan trọng cho sự thành công trong tương lai của trẻ.\n\n- Cho trẻ tham gia các hoạt động nhóm.\n- Dạy trẻ cách chia sẻ và hợp tác.\n- Khuyến khích trẻ bày tỏ cảm xúc.\n- Làm gương về cách giao tiếp lịch sự.`,
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662669/pexels-photo-3662669.jpeg?auto=compress&w=400",
  },
  {
    id: "a24",
    title: "Cách dạy trẻ tính tự lập từ nhỏ",
    content: `Tính tự lập giúp trẻ tự tin và có trách nhiệm hơn.\n\n- Cho trẻ tự làm những việc vừa sức.\n- Khen ngợi khi trẻ hoàn thành nhiệm vụ.\n- Không làm thay trẻ những việc trẻ có thể tự làm.\n- Tạo cơ hội để trẻ đưa ra quyết định.`,
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662670/pexels-photo-3662670.jpeg?auto=compress&w=400",
  },
  {
    id: "a25",
    title: "Phát triển ngôn ngữ cho trẻ từ 0-5 tuổi",
    content: `Ngôn ngữ là nền tảng cho sự phát triển toàn diện của trẻ.\n\n- Trò chuyện với trẻ thường xuyên từ khi sinh ra.\n- Đọc sách và kể chuyện mỗi ngày.\n- Hát và chơi các trò chơi ngôn ngữ.\n- Khuyến khích trẻ nói và bày tỏ ý kiến.`,
    category: "Phát triển trẻ nhỏ",
    thumbnail:
      "https://images.pexels.com/photos/3662671/pexels-photo-3662671.jpeg?auto=compress&w=400",
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
              to="/forum"
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
