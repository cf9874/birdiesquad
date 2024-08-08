import React from "react"
import { Text as SVGText, G, TSpan } from "react-native-svg"
import { useRadialSlider } from "../hooks"
import { Colors } from "../theme"

const TailText = (props: TextTailProps) => {
    const { unit, min, max } = props
    const { startPoint, endPoint } = useRadialSlider(props)
    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            G,
            { transform: `translate(${-20}, ${40})` },
            React.createElement(
                SVGText,
                { fill: Colors.darkCharcoal, fontSize: 12 },
                React.createElement(TSpan, { x: startPoint.x, y: startPoint.y }, `${min} ${unit}`)
            )
        ),
        React.createElement(
            G,
            { transform: `translate(${-10}, ${40})` },
            React.createElement(
                SVGText,
                { fill: Colors.darkCharcoal, fontSize: 12 },
                React.createElement(TSpan, { x: endPoint.x, y: endPoint.y }, `${max} ${unit}`)
            )
        )
    )
}
export default TailText

interface TextTailProps {
    min?: number
    max?: number
    unit?: string
}
