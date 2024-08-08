import React from "react"
import { View, Image, StyleSheet, StyleProp, ViewStyle } from "react-native"
import FastImage from "react-native-fast-image"
import { ConfigUtil } from "utils"

const ProfileImage = ({ style, name, type, resizeMode = "cover" }: IProfileImageProps) => {
    const styles = StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
        },
        background: {
            ...StyleSheet.absoluteFillObject,
        },
        person: {
            width: "100%",
            height: "100%",
        },
    })

    const { profile, background } = ConfigUtil.getProfile(name, type)

    const convertResizeMode = () => {
        switch (resizeMode) {
            case "cover":
                return FastImage.resizeMode.cover
            case "stretch":
                return FastImage.resizeMode.stretch
            case "center":
                return FastImage.resizeMode.center
            case "contain":
            default:
                return FastImage.resizeMode.contain
        }
    }

    return (
        <View style={[styles.container, style]}>
            <FastImage source={background} style={styles.background} />
            <FastImage source={profile} style={styles.person} resizeMode={convertResizeMode()} />
        </View>
    )
}

export default ProfileImage

interface IProfileImageProps {
    style?: StyleProp<ViewStyle>
    name?: string
    type?: number
    resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center"
}
