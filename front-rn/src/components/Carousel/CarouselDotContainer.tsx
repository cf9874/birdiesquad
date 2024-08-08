import { Colors } from "const"
import { RatioUtil } from "utils"
import { View, ViewStyle } from "react-native"
import Animated, {
    Easing,
    Extrapolate,
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
} from "react-native-reanimated"
import CarouselDot from "./CarouselDot"
import useCarouselDot from "./useCarouselDot"

const CarouselDotContainer = (props: IContainerProps) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: RatioUtil.width(100),
                alignSelf: "center",
                marginTop: RatioUtil.height(20),
                ...props.style,
                overflow: "hidden",
            }}
        >
            {props.data.map((_, index) => {
                return (
                    <CarouselDot
                        widthSelected={RatioUtil.width(6)}
                        carouselProgress={props.carouselProgress}
                        index={index}
                        key={index}
                        length={props.data.length}
                        indexSelected={props.indexSelected}
                    />
                )
            })}
            {/* <MovingDot
                length={props.data.length}
                carouselProgress={props.carouselProgress}
                indexSelected={props.indexSelected}
            /> */}
        </View>
    )
}

export default CarouselDotContainer

interface IContainerProps {
    data: any[]
    carouselProgress: Animated.SharedValue<number>
    style?: ViewStyle
    dotColor?: string
    indexSelected?: number
}
const DOT_SIZE = RatioUtil.lengthFixedRatio(6.35) // dot의 기본 크기

const SELECTED_DOT_SIZE = DOT_SIZE * 3
const MOVE_WIDTH = DOT_SIZE * 2.22

const MovingDot = ({ carouselProgress, length, indexSelected = 0 }: IMovingDotProps) => {
    const dotInitialPosition = useDerivedValue(() => indexSelected * MOVE_WIDTH, [indexSelected])
    const epsilon = 0.0001

    const animatedStyles = useAnimatedStyle(() => {
        const isFlag = indexSelected === 0 && carouselProgress?.value > length - 1

        const inputRange = isFlag ? [length - 1, length, length] : [indexSelected - 1, indexSelected, indexSelected + 1]
        const outputRange = [dotInitialPosition.value, dotInitialPosition.value]

        const widthOutputRange = [DOT_SIZE, SELECTED_DOT_SIZE, DOT_SIZE]

        if (carouselProgress.value > indexSelected) {
            outputRange.push(dotInitialPosition.value + MOVE_WIDTH)
        } else {
            outputRange.unshift(dotInitialPosition.value - MOVE_WIDTH)
        }

        if (carouselProgress.value >= length - 1 || carouselProgress.value <= 0) {
            return {
                width: DOT_SIZE,
                transform: [{ translateX: dotInitialPosition.value }],
            }
        } else {
            const width =
                Math.abs(carouselProgress.value - indexSelected) < epsilon
                    ? DOT_SIZE
                    : interpolate(carouselProgress.value, inputRange, widthOutputRange, Extrapolate.CLAMP)

            let translateX = interpolate(carouselProgress.value, inputRange, outputRange, Extrapolate.CLAMP)
            if (carouselProgress.value < indexSelected) translateX -= width - DOT_SIZE

            return {
                width: width,
                transform: [{ translateX }],
            }
        }
    }, [carouselProgress.value, indexSelected, length, dotInitialPosition.value])

    return (
        <Animated.View
            style={[
                {
                    position: "absolute",
                    height: DOT_SIZE,
                    borderRadius: 50,
                    backgroundColor: Colors.PURPLE7,
                },
                animatedStyles,
            ]}
        />
    )
}
interface IMovingDotProps {
    length: number
    carouselProgress: Animated.SharedValue<number>
    indexSelected?: number
}
