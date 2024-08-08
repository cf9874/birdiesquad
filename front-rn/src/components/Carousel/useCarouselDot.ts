import { Extrapolate, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated"

const useCarouselDot = ({ width, index, carouselProgress, length }: IParams) => {
    const carouselDotStyle = useAnimatedStyle(() => {
        const isFlag = index === 0 && carouselProgress?.value > length - 1

        const inputRange = isFlag ? [length - 1, length, length] : [index - 1, index, index + 1]
        const outputRange = [-width, 0, width]

        return {
            transform: [
                {
                    translateX: interpolate(carouselProgress?.value, inputRange, outputRange, Extrapolate.CLAMP),
                },
            ],
        }
    }, [carouselProgress, index, length])

    return { carouselDotStyle, width }
}

export default useCarouselDot

interface IParams {
    width: number
    carouselProgress: SharedValue<number>
    index: number
    length: number
}
