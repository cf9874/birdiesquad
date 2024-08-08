import CarouselDot from "./CarouselDot"
import CarouselDotContainer from "./CarouselDotContainer"
import CarouselItem from "./CarouselItem"
import { default as MainCarousel } from "react-native-reanimated-carousel"

export * from "./useCarousel"
export * from "./useCarouselDot"

export const Carousel = {
    DotContainer: CarouselDotContainer,
    Dot: CarouselDot,
    Item: CarouselItem,
    Slide: MainCarousel,
}
