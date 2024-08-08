import { ScaledSize, useWindowDimensions } from "react-native"

export const useStyle = <T>(genStyle: (dimensions: ScaledSize) => T) => {
    const dimensions = useWindowDimensions()

    return { style: genStyle(dimensions) }
}
