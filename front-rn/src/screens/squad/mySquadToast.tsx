import { MySquadImg } from "assets/images"
import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Animated, Image, Platform } from "react-native"
import { RatioUtil } from "utils"

const MySquadToast = ({ message, subMessage, onClose }: any) => {
    const [fadeAnim] = useState(new Animated.Value(0))

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                hideToast()
            }, 2000)
        })

        return () => {
            fadeAnim.setValue(0)
        }
    }, [])

    const hideToast = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onClose()
        })
    }

    const containerStyle = {
        ...styles.container,
    }

    return (
        <Animated.View style={[containerStyle, { opacity: fadeAnim }]}>
            <Image
                source={MySquadImg.error}
                style={{
                    marginLeft: RatioUtil.lengthFixedRatio(10),
                    justifyContent: "center",
                    alignItems: "center",
                }}
            />
            <View style={styles.textContainer}>
                <Text style={[styles.message, !subMessage && styles.messageWithMargin]}>{message}</Text>
                {subMessage && <Text style={[styles.subMessage]}>{subMessage}</Text>}
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        flexDirection: "row",
        width: RatioUtil.lengthFixedRatio(340),
        height: RatioUtil.lengthFixedRatio(58),
        backgroundColor: "gray",
        borderRadius: 8,
        padding: 10,
        alignItems: "center",
        zIndex: 1,
        justifyContent: "center",
        marginLeft: RatioUtil.lengthFixedRatio(10),
        marginTop: Platform.OS === "ios" ? RatioUtil.lengthFixedRatio(20) : RatioUtil.lengthFixedRatio(20),
    },

    textContainer: {
        flex: 1,
        marginLeft: RatioUtil.width(20),
        // justifyContent: "flex-start",
        // alignItems: "center",
    },
    message: {
        color: "white",
        fontSize: 13,
        flex: 1,
    },
    messageWithMargin: {
        marginTop: RatioUtil.heightFixedRatio(10),
    },
    subMessage: {
        color: "white",
        fontSize: 13,
        marginTop: 5,
        flex: 1,
    },
})

export default MySquadToast
