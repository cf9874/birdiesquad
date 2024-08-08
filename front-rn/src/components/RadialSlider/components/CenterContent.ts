import { View, Text, StyleProp, TextStyle, ViewStyle } from "react-native"
import React from "react"
import { styles } from "./styles"
const CenterContent = (props: ICenterContentProps) => {
    const {
        title,
        subTitle,
        unit,
        titleStyle,
        subTitleStyle,
        valueStyle,
        unitStyle,
        isHideTitle,
        isHideSubtitle,
        isHideValue,
        value,
        centerContentStyle,
        unitValueContentStyle,
    } = props
    return React.createElement(
        View,
        { style: [styles.hideCenterContent, centerContentStyle] },
        !isHideTitle &&
            React.createElement(Text, { style: [styles.helperText, styles.subTitleWidth, titleStyle] }, title),
        !isHideValue &&
            React.createElement(
                View,
                { style: [styles.hideValue, unitValueContentStyle] },
                React.createElement(Text, { style: [styles.valueText, styles.large_header, valueStyle] }, value),
                React.createElement(Text, { style: [styles.valueUnit, styles.helperText, unitStyle] }, unit)
            ),
        !isHideSubtitle &&
            React.createElement(Text, { style: [styles.helperText, styles.subTitleWidth, subTitleStyle] }, subTitle)
    )
}
export default CenterContent

interface ICenterContentProps {
    title?: string
    subTitle?: string
    unit?: string
    titleStyle?: StyleProp<TextStyle>
    subTitleStyle?: StyleProp<TextStyle>
    valueStyle?: StyleProp<TextStyle>
    unitStyle?: StyleProp<TextStyle>
    isHideTitle?: boolean
    isHideSubtitle?: boolean
    isHideValue?: boolean
    value?: number
    centerContentStyle?: StyleProp<ViewStyle>
    unitValueContentStyle?: StyleProp<ViewStyle>
}
