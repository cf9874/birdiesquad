import React from "react"
import { GestureResponderEvent, Pressable, PressableProps, View, ViewStyle } from "react-native"
export const CustomButton = (props: PressableProps & React.RefAttributes<View>) => {
    return <Pressable {...props}>{props.children}</Pressable>
}

export interface IProps {
    style?: ViewStyle // StyleProp<any>
    onPress: (event: GestureResponderEvent) => void
}
// export const CustomButton = ({ children, onPress, style }: React .PropsWithChildren<IProps>) => {
//     return (
//         <Pressable style={style} onPress={onPress}>
//             {children}
//         </Pressable>
//     )
// }

// export interface IProps {
//     style?: ViewStyle // StyleProp<any>
//     onPress: (event: GestureResponderEvent) => void
// }
