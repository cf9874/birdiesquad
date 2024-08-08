import React from "react"
import { StyleSheet, View } from "react-native"
import GestureRecognizer from "react-native-swipe-gestures"

export default function Example() {
    return (
        <View style={styles.container}>
            <GestureRecognizer
                onSwipeDown={state => {
                    console.log("swipe down")
                }}
                onSwipeUp={state => {
                    console.log("swipe up")
                }}
                style={{ flex: 1, backgroundColor: "#ff0" }}
            ></GestureRecognizer>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ball: {
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: "blue",
        alignSelf: "center",
    },
})
