import { Colors } from "const"
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useDerivedValue } from "react-native-reanimated"
import { RatioUtil } from "utils"

const DOT_SIZE = RatioUtil.lengthFixedRatio(6.35) // dot의 기본 크기
const MOVE_WIDTH = DOT_SIZE * 2.04
const epsilon = 0.0001

const CarouselDot = (props: IDotProps) => {
    const backgroundColor = useAnimatedStyle(() => {
        const color = interpolateColor(
            props.carouselProgress.value,
            [props.index - 1, props.index, props.index + 1],
            [Colors.GRAY, Colors.PURPLE7, Colors.GRAY]
        )

        return {
            backgroundColor: color,
        }
    })

    const dotInitialPosition = useDerivedValue(
        () => props.carouselProgress.value * MOVE_WIDTH,
        [props.carouselProgress.value]
    )

    const animatedStyles = useAnimatedStyle(() => {
        const translateX = interpolate(
            props.carouselProgress.value,
            [props.index - 1, props.index, props.index + 1],
            [dotInitialPosition.value - DOT_SIZE, dotInitialPosition.value, dotInitialPosition.value + DOT_SIZE]
        )

        const width = interpolate(
            props.carouselProgress.value,
            [props.index - 1, props.index, props.index + 1],
            [DOT_SIZE, DOT_SIZE * 3, DOT_SIZE]
        )
        const opacity = interpolate(
            props.carouselProgress.value,
            [props.index, props.index + epsilon, props.index + 1],
            [0, 1, 0]
        )

        //console.log("progress", props.carouselProgress.value, props.index)

        return {
            opacity,
            width,
            transform: [{ translateX }],
        }
    })

    return (
        <>
            <Animated.View
                style={[
                    {
                        width: props.widthSelected,
                        height: RatioUtil.width(6),
                        borderRadius: 50,
                        //backgroundColor: Colors.GRAY,
                        // backgroundColor: props.index === props.indexSelected ? Colors.BLUE5 : Colors.GRAY,
                    },
                    backgroundColor,
                ]}
            ></Animated.View>
            <Animated.View
                style={[
                    {
                        position: "absolute",
                        //width: DOT_SIZE * 2.22,
                        height: DOT_SIZE,
                        borderRadius: 50,
                        backgroundColor: "#3144f5",
                    },
                    animatedStyles,
                ]}
            ></Animated.View>
        </>
    )
}

export default CarouselDot

interface IDotProps {
    widthSelected: number
    index: number
    // color: string
    length: number
    carouselProgress: Animated.SharedValue<number>
    indexSelected?: number
}
