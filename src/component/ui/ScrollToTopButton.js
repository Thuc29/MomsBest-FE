import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    setClicked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setClicked(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed z-50 right-6 bottom-24 md:bottom-28 flex items-center justify-center w-14 h-14 rounded-full shadow-xl focus:outline-none transition-all duration-300
        bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-blue-400
        text-white
        ${
          visible
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-75 pointer-events-none"
        }
        ${clicked ? "scale-90" : ""}
        hover:scale-110 hover:shadow-2xl
        active:scale-95
      `}
      aria-label="Scroll to top"
      style={{ boxShadow: "0 6px 24px 0 rgba(236, 72, 153, 0.25)" }}
    >
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
        className="drop-shadow-lg"
      >
        <path
          d="M12 19V5M5 12l7-7 7 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
