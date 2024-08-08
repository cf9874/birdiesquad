import React, { useEffect, useState } from "react"
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Linecap, Image } from "react-native-svg"
import { View, Platform, StyleSheet, StyleProp, ViewStyle, TextStyle, ImageProps } from "react-native"
import { styles } from "./styles"
import { Colors } from "./theme"
import { useSilderAnimation, useRadialSlider } from "./hooks"
import ButtonContent from "./components/ButtonContent"
import CenterContent from "./components/CenterContent"
import TailText from "./components/TailText"
import LineContent from "./components/LineContent"
import { ISilderAnimationHookProps } from "./hooks/useSilderAnimation"
import { IRadialSliderHookProps } from "./hooks/useRadialSlider"
import { RatioUtil } from "utils"

export const RadialSlider = (props: IRadialSlider & ISilderAnimationHookProps & IRadialSliderHookProps) => {
    const [isStart, setIsStart] = useState(false)
    const [iconPosition, setIconPosition] = useState("")
    const {
        step = 1,
        radius = 100,
        sliderWidth = 18,
        sliderTrackColor = "#E5E5E5",
        linearGradient = [
            { offset: "0%", color: "#ffaca6" },
            { offset: "100%", color: "#EA4800" },
        ],

        thumbRadius = 18,
        thumbBorderColor = "#FFFFFF",
        thumbColor = Colors.white,
        thumbBorderWidth = 5,
        style = {},
        markerLineSize = 50,
        disabled = false,
        contentStyle = {},
        buttonContainerStyle = {},
        min = 0,
        max = 100,
        isHideSlider = false,
        isHideCenterContent = false,
        isHideTailText = false,
        isHideButtons = false,
        isHideLines = false,
        leftIconStyle = {},
        rightIconStyle = {},
        stroke = "#008ABC",
        onChange = () => {},
        iconSource,
    } = props
    const { panResponder, value, setValue, curPoint, currentRadian, prevValue } = useSilderAnimation(props)
    const {
        svgSize,
        containerRef,
        startPoint,
        endPoint,
        startRadian,
        radianValue,
        isRadialCircleVariant,
        centerValue,
    } = useRadialSlider(props)
    useEffect(() => {
        var _a
        //check max value length
        const maxLength =
            (_a = max === null || max === void 0 ? void 0 : max.toString()) === null || _a === void 0
                ? void 0
                : _a.length
        const timerId = setTimeout(handleValue, maxLength > 2 ? 10 : 100)
        return () => clearTimeout(timerId)
    })
    const handleValue = () => {
        if (iconPosition === "up" && max > value) {
            isStart && onPressButtons("up")
        } else if (iconPosition === "down" && min < value) {
            isStart && onPressButtons("down")
        }
    }
    const leftButtonStyle = StyleSheet.flatten([
        leftIconStyle,
        (disabled || min === value) && {
            opacity: 0.5,
        },
    ])
    const rightButtonStyle = StyleSheet.flatten([
        rightIconStyle,
        (disabled || max === value) && {
            opacity: 0.5,
        },
    ])
    const onLayout = () => {
        const ref = containerRef.current
        if (ref) {
            ref.measure((_x, _y, _width, _height) => {})
        }
    }
    const onPressButtons = type => {
        if (type === "up" && max > value) {
            setValue(prevState => {
                prevValue.current = prevState + step
                return prevState + step
            })
            onChange(value)
        } else if (type === "down" && min < value) {
            setValue(prevState => {
                prevValue.current = prevState - step
                return prevState - step
            })
            onChange(value)
        }
    }
    const circleXPosition = isRadialCircleVariant ? (centerValue < value ? -7 : 4) : 0
    const strokeLinecap = isRadialCircleVariant ? "square" : "round"

    return React.createElement(
        View,
        {
            onLayout: onLayout,
            ref: containerRef,
            style: [styles.container, style, { width: svgSize, height: svgSize }],
            testID: "slider-view",
        },
        React.createElement(
            Svg,
            {
                width: svgSize + markerLineSize / 2 - (Platform.OS === "web" ? 20 : 0),
                height: svgSize + markerLineSize / 2,
                viewBox: `-${markerLineSize / 2} -${markerLineSize / 2} ${svgSize + markerLineSize} ${
                    svgSize + markerLineSize
                }`,
                preserveAspectRatio: "none",
            },
            React.createElement(
                Defs,
                null,
                React.createElement(
                    LinearGradient,
                    { x1: "0%", y1: "100%", x2: "100%", y2: "0%", id: "gradient" },
                    linearGradient.map((item, index) =>
                        React.createElement(Stop, { key: index, offset: item.offset, stopColor: item.color })
                    )
                )
            ),
            !isRadialCircleVariant && !isHideTailText && React.createElement(TailText, { ...props }),
            !isHideLines && React.createElement(LineContent, { ...props, value: value }),
            !isHideSlider &&
                React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(Path, {
                        strokeWidth: sliderWidth,
                        stroke: sliderTrackColor,
                        fill: "none",
                        strokeLinecap: strokeLinecap,
                        d: `M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${
                            startRadian - radianValue >= Math.PI ? "1" : "0"
                        },1,${endPoint.x},${endPoint.y}`,
                    }),
                    React.createElement(Path, {
                        strokeWidth: sliderWidth,
                        stroke: "url(#gradient)",
                        fill: "none",
                        strokeLinecap: strokeLinecap,
                        d: `M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${
                            startRadian - currentRadian >= Math.PI ? "1" : "0"
                        },1,${curPoint.x},${curPoint.y}`,
                    }),
                    iconSource
                        ? React.createElement(Image, {
                              x: curPoint.x + circleXPosition - RatioUtil.height(25),
                              y: curPoint.y - RatioUtil.height(20),
                              href: iconSource,
                              width: RatioUtil.height(50),
                              height: RatioUtil.height(50),
                              ...panResponder.panHandlers,
                          })
                        : React.createElement(Circle, {
                              cx: curPoint.x + circleXPosition,
                              cy: curPoint.y,
                              r: thumbRadius,
                              fill: thumbColor || thumbBorderColor,
                              stroke: thumbBorderColor,
                              strokeWidth: thumbBorderWidth,
                              ...panResponder.panHandlers,
                          })
                )
        ),
        React.createElement(
            View,
            { style: [styles.content, contentStyle], pointerEvents: "box-none" },
            !isHideCenterContent && React.createElement(CenterContent, { ...props, value: value }),
            !isRadialCircleVariant &&
                !isHideButtons &&
                React.createElement(
                    View,
                    { style: [styles.buttonsWrapper, buttonContainerStyle] },
                    React.createElement(
                        View,
                        { style: styles.center },
                        React.createElement(ButtonContent, {
                            onPress: () => onPressButtons("down"),
                            onLongPress: () => {
                                setIsStart(true)
                                setIconPosition("down")
                            },
                            onPressOut: () => setIsStart(false),
                            buttonType: "left-btn",
                            style: leftButtonStyle,
                            disabled: disabled || min === value,
                            stroke: stroke !== null && stroke !== void 0 ? stroke : Colors.blue,
                        }),
                        React.createElement(ButtonContent, {
                            disabled: disabled || max === value,
                            onPress: () => onPressButtons("up"),
                            onLongPress: () => {
                                setIsStart(true)
                                setIconPosition("up")
                            },
                            onPressOut: () => setIsStart(false),
                            style: rightButtonStyle,
                            buttonType: "right-btn",
                            stroke: stroke !== null && stroke !== void 0 ? stroke : Colors.blue,
                        })
                    )
                )
        )
    )
}

interface IRadialSlider {
    radius?: number
    min?: number
    max: number
    step?: number
    value: number
    title?: string
    subTitle: string
    unit?: string
    thumbRadius: number
    thumbColor: string
    thumbBorderWidth: number
    thumbBorderColor: string
    markerLineSize?: number
    sliderWidth?: number
    sliderTrackColor?: string
    lineColor?: string
    lineSpace?: number
    linearGradient: {
        offset: string
        color: string
    }[]
    onChange: (_v: number) => void
    onComplete?: (_v: number) => void
    openingRadian?: number
    disabled?: boolean
    isHideSlider?: boolean
    isHideTitle?: boolean
    isHideSubtitle?: boolean
    isHideValue?: boolean
    isHideTailText?: boolean
    isHideButtons?: boolean
    isHideLines?: boolean
    isHideMarkerLine?: boolean
    isHideCenterContent?: boolean
    fixedMarker?: boolean
    variant?: string
    markerValueInterval?: number
    unitValueContentStyle?: StyleProp<ViewStyle>
    markerCircleSize?: number
    markerCircleColor?: string
    markerPositionY?: number
    markerPositionX?: number
    needleBackgroundColor?: string
    needleColor?: string
    needleBorderWidth?: number
    needleHeight?: number
    markerValueColor?: string
    strokeLinecap?: Linecap | string
    markerValue?: number
    centerContentStyle?: StyleProp<ViewStyle>
    titleStyle?: StyleProp<TextStyle>
    subTitleStyle?: StyleProp<TextStyle>
    valueStyle?: StyleProp<TextStyle>
    buttonContainerStyle?: StyleProp<ViewStyle>
    leftIconStyle?: StyleProp<ViewStyle>
    rightIconStyle?: StyleProp<ViewStyle>
    contentStyle?: StyleProp<ViewStyle>
    unitStyle?: StyleProp<TextStyle>
    style?: StyleProp<ViewStyle>
    stroke?: string
    minimumvalue?: number
    iconSource?: ImageProps["source"] | string
}
