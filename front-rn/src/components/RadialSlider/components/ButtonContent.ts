import { TouchableOpacity } from "react-native"
import React from "react"
import Svg, { Path, Circle, G } from "react-native-svg"
const ButtonContent = (props: IButtonProps) => {
    const { disabled, onPress, style, buttonType, stroke } = props
    return React.createElement(
        TouchableOpacity,
        {
            activeOpacity: 0.7,
            disabled: disabled,
            onPress: onPress,
            onLongPress: props === null || props === void 0 ? void 0 : props.onLongPress,
            onPressOut: props === null || props === void 0 ? void 0 : props.onPressOut,
            style: style,
        },
        React.createElement(
            Svg,
            { height: "30", width: "45" },
            React.createElement(
                G,
                null,
                React.createElement(Circle, { cx: "20", cy: "20", r: "20" }),
                React.createElement(Path, {
                    d:
                        buttonType === "left-btn"
                            ? "M12.5168 17.2727L20.067 24.8485L27.6172 17.2727"
                            : "M12.5168 23.7373L20.067 16.1616L27.6172 23.7373",
                    stroke: stroke,
                    strokeWidth: "2.4",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                })
            )
        )
    )
}
export default ButtonContent

interface IButtonProps {
    disabled?: boolean
    onPress?: () => void
    style: any
    buttonType?: string
    stroke?: string
    onLongPress?: () => void
    onPressOut?: () => void
}
