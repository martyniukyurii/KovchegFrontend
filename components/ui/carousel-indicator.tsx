import { Carousel } from "./application/carousel/carousel-base";

interface CarouselIndicatorProps {
  framed?: boolean;
}

export const CarouselIndicator = ({ framed = false }: CarouselIndicatorProps) => {
  return (
    <Carousel.IndicatorGroup className={`flex gap-2 ${framed ? "bg-black/20 backdrop-blur-sm rounded-full px-3 py-2" : ""}`}>
      {({ index }) => (
        <Carousel.Indicator
          key={index}
          index={index}
          className={({ isSelected }) =>
            `w-2 h-2 rounded-full transition-all duration-300 ${
              isSelected
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            }`
          }
        />
      )}
    </Carousel.IndicatorGroup>
  );
};

