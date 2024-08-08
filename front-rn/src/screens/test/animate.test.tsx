import React, { useRef, useState } from "react"
import { Animated, Button, Easing, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { TOKEN_ID } from "utils/env"
const Animate = () => {
    const [up, setUp] = useState(false)
    const value = useRef(new Animated.Value(0)).current
    const width = value.interpolate({ inputRange: [-200, 0, 200], outputRange: [-200, 0, 200] })

    const toggle = () => {
        Animated.timing(value, {
            toValue: up ? -200 : 200,
            duration: 1000,
            useNativeDriver: false,
            easing: Easing.bounce,
        }).start(() => {
            setUp(prev => !prev)
        })
    }

    return (
        <View
            style={{
                marginTop: 120,
                flex: 1,
                flexDirection: "column",
            }}
        >
            <Animated.View style={[{ height: 80, backgroundColor: "black", margin: 30 }, { width }]} />
            <Button title="toggle" onPress={toggle} />
        </View>
    )
}

export default Animate
