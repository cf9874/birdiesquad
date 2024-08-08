import { Colors } from "const"
import { Platform, Dimensions, StyleSheet } from "react-native"
import { globalStyle } from "styles"
import { scaleSize } from "styles/minixs"
const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    headerView: {
        height: scaleSize(30),
        justifyContent: "center",
        flexDirection: "row",
        alignSelf: "flex-end",
    },
    headerButtonView: {
        height: scaleSize(30),
        width: scaleSize(100),
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        fontSize: scaleSize(15),
        lineHeight: scaleSize(17),
        color: Colors.BLACK,
    },
    tabsMainView: {
        height: scaleSize(40),
        flexDirection: "row",
    },
    tabOuterView: {
        flex: 0.5,
        alignItems: "center",
        justifyContent: "center",
    },
    tabText: {
        fontSize: scaleSize(14),
        lineHeight: scaleSize(16),
        color: Colors.BLACK,
        // fontFamily: globalStyle.defaultFontText.fontFamily
    },
})
