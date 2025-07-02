import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination } from "swiper/modules";
import axios from "axios";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <span className="flex items-center">
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        ))}
      {halfStar && (
        <svg
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="white" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"
            fill="url(#half)"
          />
        </svg>
      )}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        ))}
    </span>
  );
};

const FeaturedProducts = () => {
  const swiperRef = useRef(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://momsbest-be.onrender.com/api/products"
        );
        // Lọc sản phẩm nổi bật và đang hoạt động
        const featured = res.data.filter(
          (p) => p.is_featured === true && p.is_active === true
        );
        setFeaturedProducts(featured);
      } catch (error) {
        setFeaturedProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
    }
  }, []);

  return (
    <section className="w-full font-space-grotesk bg-white bg-opacity-95 shadow-lg rounded-2xl p-0 my-10 border border-gray-200 mx-0">
      <div className="swiper-container">
        {" "}
        {/* Container for Swiper */}
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          spaceBetween={32}
          autoplay={{
            delay: 2200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletClass: "bg-pink-500",
            bulletActiveClass: "bg-pink-600",
          }}
          navigation={false}
          loop={true}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 28,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 36,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product._id || product.id}>
              <div className="min-w-[220px] h-[340px] bg-white rounded-2xl shadow hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-4 flex flex-col items-center group">
                <div className="w-full flex justify-center">
                  <img
                    src={product.images ? product.images[0] : product.image}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-xl border border-gray-200 group-hover:scale-105 transition"
                  />
                </div>
                <h3 className="text-base font-bold text-gray-800 line-clamp-1 leading-5 text-center mt-3 mb-2 px-2">
                  {product.name}
                </h3>
                <div className="text-pink-600 font-bold text-lg mb-2 bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent text-center">
                  {product.price?.toLocaleString()}₫
                </div>
                {product.original_price && (
                  <div className="text-gray-400 text-sm line-through mb-1">
                    {product.original_price?.toLocaleString()}₫
                  </div>
                )}
                <div className="flex justify-center">
                  <StarRating rating={product.rating} />
                </div>
                <Link
                  to={`/products/${product._id || product.id}`}
                  className="mt-auto px-3 py-1 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-full shadow font-semibold text-normal hover:from-pink-500 hover:to-pink-700 transition"
                >
                  Xem chi tiết
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex justify-center my-4">
        <Link
          to="/products"
          className="px-3 py-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-semibold text-base shadow"
        >
          Xem Gian hàng
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
