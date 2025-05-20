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
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";

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

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      // Розраховуємо кількість видимих карток на екрані
      const cardWidth = width < 768 ? width - 64 : 380;
      const gap = 16;
      const containerWidth = width - (width < 768 ? 32 : 48); // зменшуємо відступи
      setVisibleCards(Math.floor((containerWidth + gap) / (cardWidth + gap)));
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const totalItems = items.length;

  const scrollLeft = () => {
    if (currentIndex === 0) {
      // Якщо ми на початку, переходимо в кінець
      setCurrentIndex(totalItems - visibleCards);
    } else {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (currentIndex >= totalItems - visibleCards) {
      // Якщо ми бачимо останні картки, повертаємося на початок
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prev => Math.min(totalItems - visibleCards, prev + 1));
    }
  };

  const handleCardClose = (index: number) => {
    setCurrentIndex(index);
  };

  const getTranslateX = () => {
    const gap = 16;
    const cardWidth = isMobile ? window.innerWidth - 64 : 380;
    return -(cardWidth + gap) * currentIndex;
  };

  const closeAllCards = () => {
    setOpenCardIndex(null);
  };

  const handleCardOpen = (index: number) => {
    setOpenCardIndex(index);
  };

  return (
    <CarouselContext.Provider value={{ 
      onCardClose: handleCardClose, 
      currentIndex, 
      closeAllCards, 
      openCardIndex,
      onCardOpen: handleCardOpen 
    }}>
      <div className="relative w-full">
        <div className="absolute left-0 md:left-2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <button
            className="relative z-40 h-10 w-10 md:h-12 md:w-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center disabled:opacity-50 bg-background/50 backdrop-blur-sm hover:scale-110 transition-transform"
            onClick={scrollLeft}
          >
            <IconArrowNarrowLeft className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </button>
        </div>

        <div className="absolute right-0 md:right-2 top-1/2 translate-x-1/2 -translate-y-1/2 z-50">
          <button
            className="relative z-40 h-10 w-10 md:h-12 md:w-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center disabled:opacity-50 bg-background/50 backdrop-blur-sm hover:scale-110 transition-transform"
            onClick={scrollRight}
          >
            <IconArrowNarrowRight className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </button>
        </div>

        <div className="overflow-hidden mx-2 md:mx-4">
          <div
            ref={containerRef}
            className="flex gap-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${getTranslateX()}px)` }}
          >
            {items.map((item, index) => (
              <div
                key={"card" + index}
                className="flex-none w-[calc(100vw-2rem)] md:w-[380px]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalItems - visibleCards + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-foreground"
                  : "bg-foreground/20"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
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
  const { closeAllCards, openCardIndex, onCardOpen } = useContext(CarouselContext);

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
            className="absolute top-0 left-0 right-0 z-[60] bg-card rounded-3xl overflow-hidden shadow-xl h-[320px] w-full md:h-[450px] md:w-[380px]"
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
              <div className="flex-1 overflow-y-auto mt-3">{card.content}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="rounded-3xl bg-gray-100 dark:bg-neutral-900 h-[320px] w-full md:h-[450px] md:w-[380px] overflow-hidden flex flex-col items-start justify-start relative z-10"
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
        className
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
