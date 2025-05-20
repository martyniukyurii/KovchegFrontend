"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  className,
}: {
  images: string[];
  children?: React.ReactNode;
  overlay?: boolean;
  className?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const slideInterval = 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(-1);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }, slideInterval);

    return () => clearInterval(interval);
  }, [images.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  return (
    <div
      className={cn(
        "w-full h-full overflow-hidden relative flex items-center justify-center",
        className
      )}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt="Чернівці"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center center' }}
          />
        </motion.div>
      </AnimatePresence>
      {overlay && (
        <div className="absolute inset-0 bg-black/60 z-10" />
      )}
      <div className="relative z-20">{children}</div>
    </div>
  );
};
