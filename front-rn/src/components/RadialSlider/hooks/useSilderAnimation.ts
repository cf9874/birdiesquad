import { useState, useRef, useEffect } from "react"
import { PanResponder } from "react-native"
import { cartesianToPolar, getCurrentRadian, getRadianByValue, polarToCartesian } from "../utils/commonHelpers"
import useRadialSlider from "./useRadialSlider"

const useSilderAnimation = (props: ISilderAnimationHookProps) => {
    const {
        step = 1,
        radius = 100,
        sliderWidth = 18,
        thumbRadius = 18,
        thumbBorderWidth = 5,
        disabled,
        min = 0,
        onChange = () => {},
        max = 100,
        onComplete = () => {},
    } = props
    let moveStartValue: any
    let startCartesian: any
    let moveStartRadian: any
    const { radianValue } = useRadialSlider(props)
    const prevValue = useRef(props.value > min ? props.value : min)
    const fisrtValue = useRef(props.value > min ? props.value : min)
    const [value, setValue] = useState(
        (props === null || props === void 0 ? void 0 : props.value) < min
            ? min
            : (props === null || props === void 0 ? void 0 : props.value) > max
            ? max
            : props === null || props === void 0
            ? void 0
            : props.value
    )
    useEffect(() => {
        if (max < (props === null || props === void 0 ? void 0 : props.value)) {
            setValue(max)
        } else if (min > (props === null || props === void 0 ? void 0 : props.value)) {
            setValue(min)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [max, min])
    useEffect(() => {
        setValue(props.value)
        onChange(props.value)
    }, [props.value])
    const handlePanResponderGrant = () => {
        moveStartValue = prevValue.current
        moveStartRadian = getRadianByValue(prevValue.current, radianValue, max, min)
        startCartesian = polarToCartesian(moveStartRadian, radius, sliderWidth, thumbRadius, thumbBorderWidth)
        return true
    }
    const handlePanResponderMove = (_e: any, gestureState: any) => {
        if (disabled) {
            return
        }
        let { x, y } = startCartesian
        x += gestureState.dx
        y += gestureState.dy
        const radian = cartesianToPolar(x, y, radius, sliderWidth, thumbRadius, thumbBorderWidth)
        const ratio = (moveStartRadian - radian) / ((Math.PI - radianValue) * 2)
        const diff = max - min
        let nValue: any
        if (step) {
            nValue = moveStartValue + Math.round((ratio * diff) / step) * step
        } else {
            nValue = moveStartValue + ratio * diff
        }
        nValue = Math.max(min, Math.min(max, nValue))
        if (nValue < fisrtValue.current) {
            return
        }
        setValue(prevState => {
            prevValue.current = Math.round(Math.abs(nValue - prevState) > diff / 4 ? prevState : nValue)
            return Math.round(Math.abs(nValue - prevState) > diff / 4 ? prevState : nValue)
        })
        onChange(prevValue.current)
    }
    const handlePanResponderEnd = () => {
        if (disabled) {
            return
        }
        onComplete(value)
    }
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => false,
            onPanResponderGrant: handlePanResponderGrant,
            onPanResponderMove: handlePanResponderMove,
            onPanResponderRelease: handlePanResponderEnd,
            onPanResponderTerminationRequest: () => false,
            onPanResponderTerminate: handlePanResponderEnd,
        })
    ).current
    const currentRadian = getCurrentRadian(value, radianValue, max, min)
    const curPoint = polarToCartesian(currentRadian, radius, sliderWidth, thumbRadius, thumbBorderWidth)
    return {
        panResponder,
        prevValue,
        value,
        setValue,
        curPoint,
        currentRadian,
    }
}
export default useSilderAnimation

export interface ISilderAnimationHookProps {
    step?: number
    radius?: number
    sliderWidth?: number
    thumbRadius?: number
    thumbBorderWidth?: number
    disabled?: boolean
    min?: number
    onChange?: (value: number | undefined) => void
    max?: number
    onComplete?: (value: number | undefined) => void
    value: number
}
