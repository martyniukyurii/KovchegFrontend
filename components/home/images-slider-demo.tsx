"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ImagesSlider } from "../ui/images-slider";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { TextGenerateEffect } from "../ui/text-generate-effect";

import { useTranslation } from "@/hooks/useTranslation";

type Locale = "uk" | "en" | "ru";

type GradientWords = {
  [key in Locale]: string[];
};

export function ImagesSliderDemo() {
  const [images, setImages] = useState<string[]>([]);
  const [showArrow, setShowArrow] = useState(true);
  const { t, locale } = useTranslation();

  const placeholders = [
    t("search.placeholders.apartments"),
    t("search.placeholders.house"),
    t("search.placeholders.commercial"),
    t("search.placeholders.rent"),
    t("search.placeholders.premium"),
  ];

  const heroText = t("hero.text");
  const gradientWords: GradientWords = {
    uk: ["нова", "квартира"],
    en: ["new", "apartment"],
    ru: ["новая", "квартира"],
  };

  useEffect(() => {
    // Завантажуємо список фотографій через API
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/slider-images");

        if (!res.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await res.json();

        setImages(data.images || []);
      } catch (error) {
        console.error("Error fetching slider images:", error);
        setImages([]);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      setShowArrow(scrollPosition < 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  // Якщо фотографії ще не завантажені, показуємо заглушку
  if (images.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white">{t("loading")}</p>
      </div>
    );
  }

  return (
    <ImagesSlider className="absolute inset-0" images={images} overlay={true}>
      <div className="z-50 flex flex-col justify-center items-center w-full mx-auto px-6 sm:px-4 gap-4 sm:gap-6 md:gap-8">
        <div className="text-base sm:text-xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-center w-full max-w-sm sm:max-w-none leading-tight sm:leading-normal">
          <TextGenerateEffect
            words={heroText}
            gradientWords={gradientWords[locale]}
          />
        </div>
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl scale-85 sm:scale-90 md:scale-100">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
      <AnimatePresence mode="wait">
        {showArrow && (
          <motion.div
            className="fixed left-1/2 bottom-8 -translate-x-1/2 z-[100]"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            animate={{
              y: [0, 10, 0],
              opacity: 1,
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: {
                duration: 0.3,
              },
            }}
            onClick={() => {
              const topOffersSection = document.querySelector("#top-offers");

              if (topOffersSection) {
                topOffersSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white h-8 w-8 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </ImagesSlider>
  );
}
