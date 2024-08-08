import React from "react"
import { LongPressGestureHandler } from "react-native-gesture-handler"
import Animated, { AnimateProps } from "react-native-reanimated"
import { ViewStyle } from "react-native"
import type { ViewProps } from "react-native"

const CarouselItem = (props: React.PropsWithChildren<IProps>) => {
    const { style, index, ...animatedViewProps } = props

    return (
        <LongPressGestureHandler>
            <Animated.View style={{ flex: 1, ...style }} {...animatedViewProps}>
                {props.children}
            </Animated.View>
        </LongPressGestureHandler>
    )
}

interface IProps extends AnimateProps<ViewProps> {
    style?: ViewStyle
    index: number
}

export default CarouselItem
