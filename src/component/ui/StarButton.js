"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function StarButton({
  children,
  className = "",
  color = "cyan",
  speed = "5s",
  href,
}) {
  return (
    <Link href={href} className="relative group">
      <motion.div
        className="absolute -inset-0.5 rounded-full blur-md bg-gradient-to-r from-rose-400 via-fuchsia-500 to-violet-500 opacity-70 group-hover:opacity-100 transition duration-300"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative px-6 py-3 ${className}`}
      >
        {children}
      </motion.button>
    </Link>
  );
}
