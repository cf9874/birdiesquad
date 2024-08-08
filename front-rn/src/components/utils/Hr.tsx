import { View, Text, ViewStyle } from "react-native"
import React from "react"
import { Colors } from "const"
import { RatioUtil } from "utils"

export const Hr = ({ vertical = false, style }: IPorps) => {
    return (
        <View
            style={{
                height: "100%",
                width: RatioUtil.width(1),
                backgroundColor: Colors.BLACK,
                ...style,
            }}
        />
    )
}

interface IPorps {
    vertical?: boolean
    style?: ViewStyle
}
