"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function RotatingText({
  texts,
  mainClassName = "",
  staggerFrom = "first",
  initial = { y: "100%" },
  animate = { y: 0 },
  exit = { y: "-100%" },
  staggerDuration = 0.025,
  splitLevelClassName = "",
  transition = { type: "spring", damping: 30, stiffness: 400 },
  rotationInterval = 3000,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  const currentText = texts[index];
  const letters = currentText.split("");

  return (
    <div className={`flex items-center justify-center ${mainClassName}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {letters.map((letter, letterIndex) => {
            const staggerIndex =
              staggerFrom === "first"
                ? letterIndex
                : letters.length - letterIndex;

            return (
              <div key={letterIndex} className={splitLevelClassName}>
                <motion.span
                  initial={initial}
                  animate={animate}
                  exit={exit}
                  transition={{
                    ...transition,
                    delay: staggerIndex * staggerDuration,
                  }}
                  className="inline-block"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
