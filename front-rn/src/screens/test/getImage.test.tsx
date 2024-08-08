import { PretendText } from "components/utils"
import React, { useState } from "react"
import { Button, Image, StyleSheet, Text, View } from "react-native"
import { launchImageLibrary } from "react-native-image-picker"
const ImagePicker = () => {
    const [response, setResponse] = useState<any>(null)

    return (
        <View>
            <Button
                title="getImage"
                onPress={async () => await launchImageLibrary({ mediaType: "photo" }, setResponse)}
            ></Button>
            <PretendText>{JSON.stringify(response, null, 2)}</PretendText>
            {response?.assets &&
                response?.assets.map(({ uri }: { uri: string }) => (
                    <View key={uri} style={styles.imageContainer}>
                        <Image resizeMode="cover" resizeMethod="scale" style={styles.image} source={{ uri: uri }} />
                    </View>
                ))}
        </View>
    )
}
export default ImagePicker
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "aliceblue",
    },
    buttonContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 8,
    },
    imageContainer: {
        marginVertical: 24,
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
})
