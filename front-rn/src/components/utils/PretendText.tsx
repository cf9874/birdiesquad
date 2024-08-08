import React from "react"
import { Text, TextProps } from "react-native"
export const PretendText = (props: TextProps) => {
    return (
        <Text {...props} allowFontScaling={false} style={[{ fontFamily: "Pretendard Variable" }, props.style]}>
            {props.children}
        </Text>
    )
}
