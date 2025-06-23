import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-pink-50 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
            <h2 className="text-2xl text-red-600 font-semibold mb-4">
              Không tìm thấy trang
            </h2>
            <p className="text-red-600 mb-8">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di
              chuyển.
            </p>
            <Button
              asChild
              className="!rounded-full !px-8 !bg-red-600 !text-white"
            >
              <Link to="/">Quay lại trang chủ</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
