import { Colors } from "const"
import { Platform, Dimensions, StyleSheet } from "react-native"
import { globalStyle } from "styles"
import { scaleSize } from "styles/minixs"
import { RatioUtil } from "utils"
const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
    card1InnerView: {
        // marginTop: scaleSize(35),
        // backgroundColor: 'pink',
        paddingHorizontal: RatioUtil.width(17),
        alignItems: "center",
    },
    priceButton: {
        height: RatioUtil.lengthFixedRatio(30),
        width: RatioUtil.width(110),
        flexDirection: "row",
        backgroundColor: Colors.WHITE,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: RatioUtil.width(100),
    },
    priceTagImage: {
        height: RatioUtil.width(14),
        width: RatioUtil.width(14),
        marginRight: RatioUtil.width(4),
    },
})
