import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-pink-200 pt-12 pb-8">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-baby-blue-500 bg-clip-text text-transparent">
              Mẹ & Bé
            </h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Tận tâm chăm sóc sức khỏe cho mẹ và bé với các dịch vụ y tế chất
              lượng cao và đội ngũ bác sĩ chuyên nghiệp.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-pink-600 mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  to="/doctors"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Bác sĩ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-pink-600 mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/services/pregnancy"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Khám thai
                </Link>
              </li>
              <li>
                <Link
                  to="/services/newborn"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Chăm sóc trẻ sơ sinh
                </Link>
              </li>
              <li>
                <Link
                  to="/services/gynecology"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Khám phụ khoa
                </Link>
              </li>
              <li>
                <Link
                  to="/services/pediatrics"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Khám nhi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-pink-600 mb-4">Liên hệ</h4>
            <address className="not-italic space-y-2 text-sm text-gray-600">
              <p>123 Đường Sức Khỏe, Quận 1</p>
              <p>Thành phố Hồ Chí Minh, Việt Nam</p>
              <p className="pt-2">
                <a href="tel:+84123456789" className="hover:text-pink-500">
                  (+84) 123 456 789
                </a>
              </p>
              <p>
                <a href="mailto:info@mevabe.vn" className="hover:text-pink-500">
                  info@mevabe.vn
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-pink-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            © 2025 Mẹ & Bé. Tất cả các quyền được bảo lưu.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-pink-500">
              Facebook
            </a>
            <a href="#" className="text-gray-500 hover:text-pink-500">
              Instagram
            </a>
            <a href="#" className="text-gray-500 hover:text-pink-500">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
