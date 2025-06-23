import React from "react";

function About() {
  return (
    <div className="bg-[url('https://images.pexels.com/photos/1888614/pexels-photo-1888614.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-center font-space-grotesk min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-pink-100/80 to-blue-100/80 rounded-2xl shadow-xl p-10 md:p-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-6">
            Giới thiệu về Mom's Best
          </h1>
          <p className="text-lg text-gray-700 mb-6 text-center max-w-2xl mx-auto">
            <span className="font-semibold text-pink-500">Mom's Best</span> là
            website chia sẻ kiến thức, kinh nghiệm và cảm hứng về chăm sóc gia
            đình, sức khỏe mẹ và bé, dinh dưỡng, nấu ăn, làm đẹp và phát triển
            bản thân dành cho các bà mẹ hiện đại Việt Nam.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-pink-500 mb-2">
                Sứ mệnh
              </h2>
              <p className="text-gray-700">
                Kết nối, lan tỏa giá trị tích cực và hỗ trợ các mẹ trong hành
                trình chăm sóc gia đình, nuôi dạy con cái và phát triển bản thân
                toàn diện.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-pink-500 mb-2">
                Giá trị cốt lõi
              </h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>Chia sẻ chân thành, thực tế</li>
                <li>Kiến thức khoa học, cập nhật</li>
                <li>Lan tỏa cảm hứng sống tích cực</li>
                <li>Kết nối cộng đồng mẹ Việt</li>
              </ul>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-pink-500 mb-2">
              Đối tượng phục vụ
            </h2>
            <p className="text-gray-700">
              Các bà mẹ, phụ nữ chuẩn bị làm mẹ, gia đình trẻ và bất kỳ ai quan
              tâm đến sức khỏe, dinh dưỡng, nuôi dạy con, phát triển bản thân và
              hạnh phúc gia đình.
            </p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-pink-500 mb-2">
              Đội ngũ sáng lập & biên tập
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Chuyên gia dinh dưỡng, bác sĩ sản nhi</li>
              <li>Các mẹ bỉm sữa giàu kinh nghiệm</li>
              <li>Nhà báo, biên tập viên nội dung</li>
              <li>Nhà phát triển công nghệ</li>
            </ul>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-pink-500 mb-2">
              Liên hệ
            </h2>
            <p className="text-gray-700 mb-2">
              Bạn có góp ý, câu hỏi hoặc muốn hợp tác? Hãy liên hệ với chúng
              tôi:
            </p>
            <ul className="text-gray-700">
              <li>
                Email:{" "}
                <a
                  href="mailto:contact@momsbest.vn"
                  className="text-blue-600 underline"
                >
                  contact@momsbest.vn
                </a>
              </li>
              <li>
                Facebook:{" "}
                <a
                  href="https://facebook.com/momsbest.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  facebook.com/momsbest.vn
                </a>
              </li>
              <li>
                Zalo: <span className="text-blue-600">0123 456 789</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center mt-10">
            <img
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
              alt="Mom's Best"
              className="rounded-xl shadow-lg w-64 h-48 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
