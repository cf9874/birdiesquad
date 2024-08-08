import { Colors } from "const"
import { Platform, Dimensions, StyleSheet } from "react-native"
import { globalStyle } from "styles"
import { scaleSize } from "styles/minixs"
const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
    card1InnerView: {
        height: scaleSize(45),
        width: "100%",
        marginTop: scaleSize(35),
        paddingHorizontal: scaleSize(17),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scaleSize(50),
    },
    btnText: {
        fontSize: scaleSize(15),
        fontWeight: "500",
    },
})
