import { Colors } from "const"
import { Dimensions, Platform, StyleSheet } from "react-native"
import { scaleSize } from "styles/minixs"
const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        // paddingTop: scaleSize(10),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00000095",
    },
    modalMainView: {
        backgroundColor: Colors.WHITE,
        padding: scaleSize(20),
        borderRadius: scaleSize(15),
        alignItems: "center",
    },
    title: {
        fontSize: scaleSize(17),
        lineHeight: scaleSize(19),
        fontWeight: "700",
        color: Colors.BLACK,
        marginVertical: scaleSize(10),
    },
    desc: {
        fontSize: scaleSize(13),
        lineHeight: scaleSize(19),
        fontWeight: "300",
        color: Colors.BLACK,
        width: scaleSize(150),
        textAlign: "center",
        marginBottom: scaleSize(20),
    },
    buttonMainView: {
        // backgroundColor: 'pink',
        height: scaleSize(45),
        width: scaleSize(240),
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonView: {
        flex: 0.48,
        borderRadius: scaleSize(50),
        alignItems: "center",
        justifyContent: "center",
    },
    btnText: {
        fontSize: scaleSize(14),
        lineHeight: scaleSize(16),
        fontWeight: "500",
    },
    blurModalView: {
        height: scaleSize(240),
        width: scaleSize(240),
        // backgroundColor: 'white'
    },
    blurView: {
        height: scaleSize(180),
        width: scaleSize(150),
        borderRadius: scaleSize(10),
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: Platform.OS === "ios" ? `${Colors.BLACK}40` : `${Colors.BLACK}90`,
    },
    authText: {
        fontSize: scaleSize(14),
        lineHeight: scaleSize(16),
        color: Colors.WHITE,
    },
    doneImage: {
        height: scaleSize(50),
        width: scaleSize(50),
    },
})
