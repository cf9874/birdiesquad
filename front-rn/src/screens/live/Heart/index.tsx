import { NFTCardImages, liveImg } from "assets/images"
import React, { useEffect, useRef, useState } from "react"
import { Dimensions, Image } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay, interpolate, AnimatableValue, runOnJS, Easing, Extrapolation } from "react-native-reanimated"
import { RatioUtil } from "utils"
import FastImage from "react-native-fast-image"

const heartSize = [RatioUtil.width(40), RatioUtil.width(42), RatioUtil.width(44), RatioUtil.width(46), RatioUtil.width(48)]

const window = Dimensions.get("window")

const Heart = (props: {
    index:number
    size: number
    delay: number
    onFinish: (startedTime: number) => void
}) => {
    const { size, onFinish } = props

    const delayOpacity = useSharedValue(0)
    const positionY = useSharedValue(0)
    const [started, setStarted] = useState<boolean>(false)
    const maxPositionY = Math.ceil(window.height * 0.5)

    const animateStart = () => {
        setStarted(true)
        animate()
    }

    const animateDelay = () => {
        positionY.value = withTiming(1, {
            duration: props.delay
        },
        (finished?: boolean, current?: AnimatableValue) => {
            if (finished) {
                runOnJS(animateStart)()
            }
        })
    }

    const animate = () => {
        positionY.value = withTiming(-maxPositionY, {
            duration: 2000,
            //easing: Easing.ease
        },
        (finished?: boolean, current?: AnimatableValue) => {
            if (finished) {
                //runOnJS(onFinish)()
            }
        })
    }

    const delayStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(delayOpacity.value, [0, 1], [0, 0], { extrapolateRight: Extrapolation.CLAMP })
        }
    })

    const animatedStyle = useAnimatedStyle(() => {
        const yAnimation = interpolate(
            positionY.value,
            [maxPositionY * -1, 0],
            [maxPositionY, 0],
            { extrapolateRight: Extrapolation.CLAMP }
        )

        const xAnimation = interpolate(
            yAnimation,
            [
                0,
                (props.index % 2) ? maxPositionY / 6 : maxPositionY / 5,
                (props.index % 2) ? maxPositionY / 4 : maxPositionY / 2,
                (props.index % 2) ? maxPositionY / 2 : maxPositionY / 1,
                maxPositionY
            ],
            [
                0, 25, 15, 0, 10
            ],
            { extrapolateRight: Extrapolation.CLAMP }
        )

        const opacityAnimation = interpolate(yAnimation, [0, maxPositionY], [0.6, 0], { extrapolateRight: Extrapolation.CLAMP })

        return {
            transform: [
                {
                    translateY: positionY.value
                },
                {
                    translateX: xAnimation
                }
            ],
            opacity: opacityAnimation
        }
    })

    useEffect(() => {
        animateDelay()
    }, [])

    return (
        <Animated.View
            style={[(started) ? animatedStyle : delayStyle, { position: 'absolute' }]}
        >
            <FastImage
                source={NFTCardImages.blueHeart}
                style={{ height: heartSize[size - 1], width: heartSize[size - 1] }}
            />
        </Animated.View>
    )
}

export default React.memo(Heart)
