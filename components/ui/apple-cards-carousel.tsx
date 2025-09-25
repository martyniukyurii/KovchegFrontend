"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image, { ImageProps } from "next/image";

import { cn } from "@/lib/utils";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
  closeAllCards: () => void;
  openCardIndex: number | null;
  onCardOpen: (index: number) => void;
}>({
  onCardClose: () => {},
  currentIndex: 0,
  closeAllCards: () => {},
  openCardIndex: null,
  onCardOpen: () => {},
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0); // Замість currentIndex для плавного скролу
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;

      setIsMobile(width < 768);
      // Розраховуємо кількість видимих карток на екрані
      const cardWidth = width < 768 ? width - 120 : 380; // Ще більше зменшуємо ширину на мобільних
      const gap = 16;
      const containerWidth = width - (width < 768 ? 32 : 48); // зменшуємо відступи

      setVisibleCards(Math.floor((containerWidth + gap) / (cardWidth + gap)));
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const totalItems = items.length;

  const getCardWidth = () => {
    return isMobile ? window.innerWidth - 120 : 380; // Ще більше зменшуємо ширину на мобільних
  };

  const getGap = () => 16;

  const scrollLeftBtn = () => {
    const cardWidth = getCardWidth();
    const gap = getGap();
    const step = cardWidth + gap;
    
    setScrollPosition(prev => {
      const newPos = prev + step; // Рухаємося вправо (додатний напрямок)
      const maxScroll = -(totalItems - visibleCards) * step;
      
      if (newPos > 0) {
        return maxScroll; // Переходимо в кінець
      }
      return newPos;
    });
  };

  const scrollRightBtn = () => {
    const cardWidth = getCardWidth();
    const gap = getGap();
    const step = cardWidth + gap;
    
    setScrollPosition(prev => {
      const newPos = prev - step; // Рухаємося вліво (від'ємний напрямок)
      const maxScroll = -(totalItems - visibleCards) * step;
      
      if (newPos < maxScroll) {
        return 0; // Повертаємося на початок
      }
      return newPos;
    });
  };

  // Обробники для свайпу мишкою
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.pageX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX); // Прямий зв'язок з рухом миші
    setDragOffset(walk);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setIsDragging(false);
    
    // Застосовуємо зміщення до поточної позиції
    setScrollPosition(prev => {
      const newPos = prev + dragOffset;
      const cardWidth = getCardWidth();
      const gap = getGap();
      const maxScroll = -(totalItems - visibleCards) * (cardWidth + gap);
      
      // Обмежуємо позицію в межах допустимого діапазону
      return Math.max(maxScroll, Math.min(0, newPos));
    });
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Застосовуємо зміщення до поточної позиції
    setScrollPosition(prev => {
      const newPos = prev + dragOffset;
      const cardWidth = getCardWidth();
      const gap = getGap();
      const maxScroll = -(totalItems - visibleCards) * (cardWidth + gap);
      
      // Обмежуємо позицію в межах допустимого діапазону
      return Math.max(maxScroll, Math.min(0, newPos));
    });
    setDragOffset(0);
  };

  // Обробники для сенсорного свайпу
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX);
    setDragOffset(walk);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Застосовуємо зміщення до поточної позиції
    setScrollPosition(prev => {
      const newPos = prev + dragOffset;
      const cardWidth = getCardWidth();
      const gap = getGap();
      const maxScroll = -(totalItems - visibleCards) * (cardWidth + gap);
      
      // Обмежуємо позицію в межах допустимого діапазону
      return Math.max(maxScroll, Math.min(0, newPos));
    });
    setDragOffset(0);
  };

  const handleCardClose = (index: number) => {
    setCurrentIndex(index);
  };

  const getTranslateX = () => {
    // Використовуємо scrollPosition замість currentIndex для плавного скролу
    return scrollPosition + dragOffset;
  };

  const closeAllCards = () => {
    setOpenCardIndex(null);
  };

  const handleCardOpen = (index: number) => {
    setOpenCardIndex(index);
  };

  return (
    <CarouselContext.Provider
      value={{
        onCardClose: handleCardClose,
        currentIndex,
        closeAllCards,
        openCardIndex,
        onCardOpen: handleCardOpen,
      }}
    >
      <div className="relative w-full">
        <div className="absolute left-0 md:left-2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <button
            className="relative z-40 h-10 w-10 md:h-12 md:w-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center disabled:opacity-50 bg-background/50 backdrop-blur-sm hover:scale-110 transition-transform"
            onClick={scrollLeftBtn}
          >
            <IconArrowNarrowLeft className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </button>
        </div>

        <div className="absolute right-0 md:right-2 top-1/2 translate-x-1/2 -translate-y-1/2 z-50">
          <button
            className="relative z-40 h-10 w-10 md:h-12 md:w-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center disabled:opacity-50 bg-background/50 backdrop-blur-sm hover:scale-110 transition-transform"
            onClick={scrollRightBtn}
          >
            <IconArrowNarrowRight className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </button>
        </div>

        <div className="overflow-hidden mx-2 md:mx-4">
          <div
            ref={containerRef}
            className={`flex gap-4 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
            style={{ transform: `translateX(${getTranslateX()}px)` }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {items.map((item, index) => (
              <div
                key={"card" + index}
                className="flex-none w-[calc(100vw-7.5rem)] md:w-[380px]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalItems - visibleCards + 1 }).map(
            (_, index) => {
              const cardWidth = getCardWidth();
              const gap = getGap();
              const targetPosition = -(cardWidth + gap) * index;
              const currentPos = scrollPosition;
              const isActive = Math.abs(currentPos - targetPosition) < (cardWidth + gap) / 2;
              
              return (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isActive ? "bg-foreground" : "bg-foreground/20"
                  }`}
                  onClick={() => {
                    const cardWidth = getCardWidth();
                    const gap = getGap();
                    setScrollPosition(-(cardWidth + gap) * index);
                  }}
                />
              );
            }
          )}
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { closeAllCards, openCardIndex, onCardOpen } =
    useContext(CarouselContext);

  useEffect(() => {
    if (openCardIndex !== null && openCardIndex !== index) {
      setOpen(false);
    }
  }, [openCardIndex, index]);

  const handleOpen = () => {
    onCardOpen(index);
    setOpen(true);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute top-0 left-0 right-0 z-[60] bg-card rounded-3xl overflow-hidden shadow-xl h-[500px] w-full md:h-[600px] md:w-[380px]"
          >
            <div className="relative h-full p-3 md:p-4 flex flex-col">
              <button
                className="absolute top-2 right-2 h-6 w-6 bg-foreground dark:bg-background rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                onClick={() => {
                  setOpen(false);
                  closeAllCards();
                }}
              >
                <IconX className="h-4 w-4 text-background dark:text-foreground" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-xs md:text-sm font-medium text-foreground"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="text-sm md:text-base font-semibold text-foreground mt-1"
              >
                {card.title}
              </motion.p>
              <div className="flex-1 overflow-y-auto mt-3 min-h-[300px] md:min-h-[400px]">{card.content}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="rounded-3xl bg-gray-100 dark:bg-neutral-900 h-[400px] w-full md:h-[450px] md:w-[380px] overflow-hidden flex flex-col items-start justify-start relative z-10"
      >
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="object-cover absolute z-10 inset-0"
        />
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-white text-base md:text-lg font-medium font-sans text-left"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="text-white text-2xl md:text-4xl font-semibold max-w-xs text-left [text-wrap:balance] font-sans mt-4"
          >
            {card.title}
          </motion.p>
        </div>
      </motion.button>
    </div>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};
