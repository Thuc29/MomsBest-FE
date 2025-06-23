import Hero from "../layouts/Hero";
import HotTopics from "../ui/HotTopics";
import FeaturedProducts from "../ui/FeaturedProducts";
import FeaturedArticles from "../ui/FeaturedArticles";
import FeaturedCategories from "../ui/FeaturedCategories";
import QuickViewList from "../ui/QuickViewList";
import ForumCard from "../ui/ForumCard";
import NewsCard from "../ui/NewsCard";
import React, { useState } from "react";

const quickViewItems = [
  {
    id: 1,
    title: "Dinh dưỡng cho mẹ bầu 3 tháng đầu",
    description:
      "Những lưu ý về chế độ ăn uống giúp mẹ bầu khỏe mạnh trong tam cá nguyệt đầu tiên.",
    author: "Bác sĩ Lan Anh",
    date: "2024-06-01",
    thumbnail:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400",
    isNew: true,
  },
  {
    id: 2,
    title: "Video: Kỹ thuật massage mẹ bầu chuẩn spa",
    description:
      "Trong thời kỳ mang thai, mẹ bầu rất dễ bị đau lưng do một số nguyên nhân như tăng cân đột ngột, thay đổi tư thế",
    videoUrl: "https://www.youtube.com/watch?v=qbgw3CigRWM",
    author: "CG.Vũ Hằng",
    date: "2024-06-02",
    isNew: false,
  },
  {
    id: 3,
    title: "Cách phòng tránh cảm cúm cho mẹ bầu",
    description:
      "Hướng dẫn các biện pháp phòng tránh cảm cúm an toàn cho mẹ và thai nhi.",
    author: "Dược sĩ Minh Trang",
    date: "2024-06-03",
    thumbnail:
      "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&w=400",
    isNew: false,
  },
  {
    id: 4,
    title: "Video: Sự Phát Triển Của Thai Nhi Qua Các tuần ",
    description:
      "Sự phát triển của thai nhi qua các tuần giúp mẹ bầu theo dõi sự phát triển của thai nhi một cách chính xác nhất.",
    videoUrl: "https://www.youtube.com/watch?v=OdORjnmUJEo",
    author: "Mamibabi",
    date: "2024-06-04",
    isNew: true,
  },
];

const demoCard = {
  id: 5,
  title: "Hướng dẫn cách tắm cho trẻ sơ sinh tại nhà an toàn, đúng cách",
  description:
    "Tắm cho trẻ sơ sinh giúp làn da được sạch sẽ và kích thích sự lưu thông máu trong cơ thể, có lợi cho các cơ quan trong cơ thể như hệ hô hấp, hệ thống tuần hoàn và hệ tiêu hóa của trẻ. Tuy nhiên, với những ai lần đầu làm mẹ ắt hẳn sẽ bối rối, lo lắng khi tắm cho con vì bé còn rất nhỏ, dễ bị nhiễm trùng rốn hay nước rơi vào tai, vào mắt.",
  author: "Bệnh viện Đa Khoa Tâm Anh",
  date: "2024-06-05",
  videoUrl: "https://www.youtube.com/watch?v=ezmXjxwgqGA",
  isNew: true,
};

const latestNews = [
  {
    id: 101,
    title: "Mẹ bầu nên tiêm phòng những loại vắc xin nào?",
    description:
      "Danh sách các loại vắc xin quan trọng giúp bảo vệ sức khỏe mẹ và bé trong thai kỳ.",
    author: "BS. Hồng Nhung",
    date: "2024-06-06",
    thumbnail:
      "https://images.pexels.com/photos/3952234/pexels-photo-3952234.jpeg?auto=compress&w=400",
  },
  {
    id: 102,
    title: "Dấu hiệu nhận biết bé bị dị ứng sữa công thức",
    description:
      "Những biểu hiện thường gặp khi bé không hợp sữa và cách xử lý an toàn.",
    author: "Chuyên gia Dinh dưỡng Mai Hoa",
    date: "2024-06-06",
    thumbnail:
      "https://images.pexels.com/photos/3872362/pexels-photo-3872362.jpeg?auto=compress&w=400",
  },
  {
    id: 103,
    title: "Bí quyết giúp bé ngủ ngon suốt đêm",
    description: "Các mẹo nhỏ giúp bé yêu ngủ sâu giấc, phát triển toàn diện.",
    author: "Mẹ Bỉm Ngọc",
    date: "2024-06-05",
    thumbnail:
      "https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400",
  },
  {
    id: 104,
    title: "Chế độ tập luyện nhẹ nhàng cho mẹ bầu",
    description:
      "Các bài tập yoga, đi bộ phù hợp giúp mẹ bầu khỏe mạnh, dễ sinh.",
    author: "HLV Yoga Thanh Hà",
    date: "2024-06-05",
    thumbnail:
      "https://images.pexels.com/photos/3822190/pexels-photo-3822190.jpeg?auto=compress&w=400",
  },
  {
    id: 105,
    title: "Cách xử lý khi bé bị sốt cao về đêm",
    description:
      "Hướng dẫn các bước sơ cứu và chăm sóc bé khi bị sốt cao tại nhà.",
    author: "BS. Trần Văn Bình",
    date: "2024-06-04",
    thumbnail:
      "https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400",
  },
  {
    id: 106,
    title: "Thực đơn bổ sung sắt cho mẹ bầu",
    description: "Gợi ý các món ăn giàu sắt, dễ chế biến, tốt cho thai nhi.",
    author: "Chuyên gia Dinh dưỡng Lan Phương",
    date: "2024-06-04",
    thumbnail:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400",
  },
  {
    id: 107,
    title: "Bé bị hăm tã: Nguyên nhân và cách phòng tránh",
    description: "Tư vấn cách chọn tã, vệ sinh và chăm sóc da bé đúng cách.",
    author: "Điều dưỡng Kim Oanh",
    date: "2024-06-03",
    thumbnail:
      "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&w=400",
  },
  {
    id: 108,
    title: "Lợi ích của việc đọc truyện cho bé trước khi ngủ",
    description:
      "Khám phá tác động tích cực của việc đọc truyện đối với sự phát triển trí tuệ của bé.",
    author: "Giáo viên Mầm non Thu Trang",
    date: "2024-06-03",
    thumbnail:
      "https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400",
  },
  {
    id: 109,
    title: "Mẹ bầu nên uống bao nhiêu nước mỗi ngày?",
    description: "Lượng nước cần thiết và cách bổ sung nước hợp lý cho mẹ bầu.",
    author: "BS. Nguyễn Thị Hạnh",
    date: "2024-06-02",
    thumbnail:
      "https://images.pexels.com/photos/3952234/pexels-photo-3952234.jpeg?auto=compress&w=400",
  },
  {
    id: 110,
    title: "Cách nhận biết bé mọc răng đầu tiên",
    description: "Dấu hiệu và cách chăm sóc bé khi bắt đầu mọc răng.",
    author: "Nha sĩ Hoàng Anh",
    date: "2024-06-01",
    thumbnail:
      "https://images.pexels.com/photos/3872362/pexels-photo-3872362.jpeg?auto=compress&w=400",
  },
];

const PAGE_SIZE_NEWS = 10;

const HomePage = () => {
  const [newsPage, setNewsPage] = useState(0);
  const totalNewsPages = Math.ceil(latestNews.length / PAGE_SIZE_NEWS);
  const pagedNews = latestNews.slice(
    newsPage * PAGE_SIZE_NEWS,
    (newsPage + 1) * PAGE_SIZE_NEWS
  );

  return (
    <div className="min-h-screen flex flex-col text-black bg-inherit bg-center bg-[url('https://images.pexels.com/photos/3845407/pexels-photo-3845407.jpeg?auto=compress&cs=tinysrgb&w=600')]">
      <main className="flex-grow">
        <Hero />
        <div className="container mx-auto max-w-6xl px-2 sm:px-4 mt-6">
          <div className="w-full flex flex-col md:flex-row md:items-start gap-6">
            {/* Cột trái: Feed chính */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <QuickViewList items={quickViewItems} />
              <section className="bg-white/95 rounded-2xl shadow-lg p-4 border border-gray-100">
                <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-black">
                  <span className="text-blue-500 text-lg">📰</span> Tin tức mới
                  nhất
                </h3>
                <div className="flex flex-col gap-2">
                  {pagedNews.map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => setNewsPage((p) => Math.max(0, p - 1))}
                    disabled={newsPage === 0}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-600 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <span className="mx-2 text-sm">
                    Trang {newsPage + 1} / {totalNewsPages}
                  </span>
                  <button
                    onClick={() =>
                      setNewsPage((p) => Math.min(totalNewsPages - 1, p + 1))
                    }
                    disabled={newsPage === totalNewsPages - 1}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-600 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </section>
              {/* Card bài viết/video xen kẽ */}
              <ForumCard post={demoCard} />
              <section className="animate-fadeInUp bg-white/90 rounded-xl shadow p-4">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <span className="text-blue-500 text-2xl">📰</span> Bài viết
                  nổi bật
                </h2>
                <FeaturedArticles />
              </section>
              <section className=" animate-fadeInUp bg-white/90 rounded-xl shadow p-4">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <span className="text-green-500 text-2xl">🛒</span> Sản phẩm
                  nổi bật
                </h2>
                <FeaturedProducts />
              </section>
            </div>
            {/* Cột phải: Category + box khác */}
            <div className="w-full md:w-1/3 flex-shrink-0 flex flex-col gap-6">
              <section className="animate-fadeInRight bg-white/90 rounded-xl shadow p-4">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <span className="text-purple-500 text-xl">📚</span> Chuyên mục
                </h2>
                <FeaturedCategories />
              </section>
              {/* Tin tức mới nhất */}
              <section className="animate-fadeInUp bg-white/90 rounded-xl shadow p-4">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <span className="text-orange-500 text-2xl">🔥</span> Chủ đề
                  nổi bật
                </h2>
                <HotTopics topics={latestNews} />
              </section>
              {/* Có thể thêm box thống kê, user nổi bật, quảng cáo... */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
