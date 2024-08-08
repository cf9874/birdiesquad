import { useState } from "react"
import { useWindowDimensions } from "react-native"
import { useSharedValue } from "react-native-reanimated"
export const useCarousel = <T>({ data }: IParams<T>) => {
    const { width } = useWindowDimensions()
    const [dataState, setData] = useState(data)
    const [isVertical, setIsVertical] = useState(false)
    const [autoPlay, setAutoPlay] = useState(false)
    const [pagingEnabled, setPagingEnabled] = useState(true)
    const [snapEnabled, setSnapEnabled] = useState(true)
    const [loop, setLoop] = useState(false)
    const [autoPlayInterval, setAutoPlayInterval] = useState(1500)
    const [modeConfig, setModeConfig] = useState({
        parallaxScrollingScale: 1,
        parallaxScrollingOffset: 1,
        parallaxAdjacentItemScale: 1,
    })
    const carouselProgress = useSharedValue(0)

    const carouselSlideProps = {
        width,
        height: width / 2,
        loop,
        autoPlayInterval,
        onProgressChange: (_: number, absoluteProgress: number) => (carouselProgress.value = absoluteProgress),
        modeConfig,
        data: dataState,
        snapEnabled,
        pagingEnabled,
        isVertical,
        autoPlay,
        mode: "parallax" as const,
    }

    return {
        carouselSlideProps,
        carouselProgress,
        setData,
        setIsVertical,
        setAutoPlay,
        setPagingEnabled,
        setSnapEnabled,
        setLoop,
        setModeConfig,
        setAutoPlayInterval,
    }
}

interface IParams<T> {
    data: T
}
