import { NFTCardImages } from "assets/images"
import React, { useEffect, useState } from "react"
import { Text, Dimensions } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolate, AnimatableValue, runOnJS, Easing } from "react-native-reanimated"
import { RatioUtil } from "utils"
import FastImage from "react-native-fast-image"

const heartSize = [RatioUtil.width(40), RatioUtil.width(42), RatioUtil.width(44), RatioUtil.width(46), RatioUtil.width(48)]

const window = Dimensions.get("window")

const MyHeart = (props: {index:number; size: number; start: boolean, onFinish: (startedTime: number) => void }) => {
    const { size, onFinish } = props

    const scaleRatio = useSharedValue(1)
    const positionY = useSharedValue(0)
    const maxPositionY = Math.ceil(window.height * 0.5)

    const [needRender, setNeedRender] = useState<number>(1)

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

        setNeedRender(Date.now())
    }

    const animateScale = () => {
        scaleRatio.value = 0
        scaleRatio.value = withTiming(200, {
            duration: 200,
            easing: Easing.ease
        })

        setNeedRender(Date.now())
    }

    const animatedStyle = useAnimatedStyle(() => {
        const yAnimation = interpolate(
            positionY.value,
            [maxPositionY * -1, 0],
            [maxPositionY, 0]
        )

        const xAnimation = interpolate(
            yAnimation,
            [
                0,
                maxPositionY / 8,
                maxPositionY / 5,
                maxPositionY / 3,
                maxPositionY
            ],
            [
                0, -10, 2, -25, -5
            ]
        )

        const opacityAnimation = interpolate(yAnimation, [0, maxPositionY], [1, 0])

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

    const animatedScaleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(scaleRatio.value, [0, 30, 100], [1, 1.1, 1])
                }
            ]
        }
    })

    useEffect(() => {
        if (props.start)
            animate()
        else
            animateScale()
    }, [props.size, props.start])

    return (
        <Animated.View
            style={[(props.start ? animatedStyle : animatedScaleStyle), { position: 'absolute', zIndex: 999 }]}
        >
            <FastImage
                source={NFTCardImages.blueHeart}
                style={[
                    {
                        height: props.size > 5 ? RatioUtil.width(50) : heartSize[props.size - 1],
                        width: props.size > 5 ? RatioUtil.width(50) : heartSize[props.size - 1],
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}
            >
                <Text style={{ color: "white", fontWeight: "600", fontSize: RatioUtil.font(12), marginTop: RatioUtil.lengthFixedRatio(-2) }}>
                    x{props.size}
                </Text>
            </FastImage>
        </Animated.View>
    )
}

export default React.memo(MyHeart)
