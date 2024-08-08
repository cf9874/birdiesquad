import React, { useEffect, useRef, useState } from "react"
import { Text, View, TextStyle, LayoutChangeEvent, ViewStyle } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, SharedValue, interpolate } from "react-native-reanimated"
import { PretendText } from "./PretendText"
import { RatioUtil } from "utils"

const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const usePrevious = (value: number) => {
    const ref = useRef<number>()

    useEffect(() => {
        ref.current = value
    })

    return ref.current ?? 0
}

interface IProps {
    animateToNumber: number
    fontStyle: TextStyle
    style: ViewStyle
    animationDuration?: number
    includeComma?: boolean
}

const AnimateChar = ({
    animateToNumber = 0,
    fontStyle,
    animationDuration = 500,
    includeComma = false,
    style
}: IProps) => {
    const prevNumber = usePrevious(animateToNumber)

    const [numberHeight, setNumberHeight] = React.useState(0)
    const setButtonLayout = (e: LayoutChangeEvent) => {
        setNumberHeight(e.nativeEvent.layout.height)
    }

    const animValue = useSharedValue(0)

    const animate = () => {
        animValue.value = withTiming(-1 * numberHeight * Number(animateToNumber), {
            duration: animationDuration || 500,
            easing: Easing.elastic(2)
        })
    }

    const animStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: animValue.value
                }
            ]
        }
    })

    useEffect(() => {
        if (animateToNumber != prevNumber)
            animate()
    }, [animateToNumber, numberHeight])

    animate()

    return (
        <Animated.View style={animStyle}>
            {NUMBERS.map((number, i) => (
                <View style={{ flexDirection: "row", height: numberHeight }} key={i}>
                    <PretendText style={[fontStyle, { height: numberHeight }]}>
                        {number}
                    </PretendText>
                </View>
            ))}
            <PretendText style={[fontStyle, { position: "absolute", top: -999999 }]} onLayout={setButtonLayout}>
                {0}
            </PretendText>
        </Animated.View>
    )
}

const AnimatedNum = ({
    animateToNumber = 0,
    fontStyle,
    animationDuration = 500,
    includeComma = false,
    style,
}: IProps) => {
    const prevNumber = usePrevious(animateToNumber)
    const prevNumberString = String(Math.abs(prevNumber))
    const animateToNumberString = String(Math.abs(animateToNumber))

    const animateToNumbersArr: (number | string)[] = Array.from(animateToNumberString, Number)
    const prevNumberersArr: (number | string)[] = Array.from(prevNumberString, Number)

    if (includeComma) {
        const reducedArray = new Array(Math.ceil(animateToNumberString.length / 3)).fill(0)
        const startReducedArray = new Array(Math.ceil(prevNumberString.length / 3)).fill(0)

        reducedArray.map((__, index) => {
            if (index === 0) {
                return
            }

            animateToNumbersArr.splice(animateToNumberString.length - index * 3, 0, ",")
        })

        startReducedArray.map((__, index) => {
            if (index === 0) {
                return
            }

            prevNumberersArr.splice(prevNumberString.length - index * 3, 0, ",")
        })
    }

    const [numberHeight, setNumberHeight] = React.useState(0)
    const setButtonLayout = (e: LayoutChangeEvent) => {
        setNumberHeight(e.nativeEvent.layout.height)
    }

    return (
        <>
            {numberHeight !== 0 && (
                <View style={{ flexDirection: "row", ...style }}>
                    {animateToNumber < 0 && <Text style={[fontStyle, { height: numberHeight }]}>{"-"}</Text>}
                    {animateToNumbersArr.map((n, index) => {
                        if (typeof n === "string") {
                            return (
                                <PretendText key={index} style={[fontStyle, { height: numberHeight }]}>
                                    {n}
                                </PretendText>
                            )
                        }

                        return (
                            <View key={index} style={{ height: numberHeight, overflow: "hidden" }}>
                                <AnimateChar
                                    animateToNumber={n}
                                    fontStyle={fontStyle}
                                    animationDuration={animationDuration}
                                    includeComma={includeComma}
                                    style={style} />
                            </View>
                        )
                    })}
                </View>
            )}
            <PretendText style={[fontStyle, { position: "absolute", top: -999999 }]} onLayout={setButtonLayout}>
                {0}
            </PretendText>
        </>
    )
}

export default AnimatedNum
