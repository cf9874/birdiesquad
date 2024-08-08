import { useState } from "react"
import { LayoutChangeEvent, LayoutRectangle } from "react-native"

export const useDimension = () => {
    const [dimension, setDimension] = useState<LayoutRectangle>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })

    const onLayout = (e: LayoutChangeEvent) => setDimension(e.nativeEvent.layout)

    return [dimension, onLayout] as const
}
