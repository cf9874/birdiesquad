import { Pressable, View, ViewStyle } from "react-native"
import React from "react"
import { PretendText } from "components/utils"

export const CheckBox = ({
    children,
    style,
    ischeck = false,
    onCheck,
    checkedView = <PretendText>체크성공</PretendText>,
    unCheckedView = <PretendText>체크실패</PretendText>,
}: React.PropsWithChildren<IProps>) => {
    return (
        <View
            style={{
                flexDirection: "row",
                ...style,
            }}
        >
            <Pressable onPress={onCheck}>{ischeck ? checkedView : unCheckedView}</Pressable>
            {children}
        </View>
    )
}

export interface IProps {
    style?: ViewStyle
    onCheck: () => void
    ischeck?: boolean
    checkedView?: JSX.Element
    unCheckedView?: JSX.Element
}
