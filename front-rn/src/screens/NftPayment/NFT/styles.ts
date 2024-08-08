import { Colors } from "const"
import { Dimensions, StyleSheet } from "react-native"
import { scaleSize } from "styles/minixs"
import { RatioUtil } from "utils"
const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        // paddingTop: scaleSize(10),
        alignItems: "center",
        marginBottom: RatioUtil.lengthFixedRatio(60),
    },
    cardImage: {
        height: scaleSize(250),
        width: width - scaleSize(40),
    },
    card1MainView: {
        flexDirection: "row",
        height: scaleSize(100),
        fontWeight: "400",
    },
    card1InnerView: {
        marginTop: scaleSize(35),
        paddingHorizontal: scaleSize(17),
        alignItems: "flex-start",
    },
    cardTitle: {
        fontSize: scaleSize(17),
        lineHeight: scaleSize(19),
        color: Colors.WHITE,
        fontWeight: "700",
    },
    cardDesc: {
        fontSize: scaleSize(12),
        lineHeight: scaleSize(15),
        color: Colors.WHITE,
        marginTop: scaleSize(10),
    },
    priceButton: {
        height: scaleSize(28),
        width: scaleSize(100),
        flexDirection: "row",
        backgroundColor: Colors.WHITE,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scaleSize(50),
    },
    priceTagImage: {
        height: scaleSize(13),
        width: scaleSize(13),
        marginRight: scaleSize(5),
    },
    girlImage: {
        height: scaleSize(40),
        width: scaleSize(40),
        marginHorizontal: scaleSize(12),
    },
    bottomCardView: {
        width: RatioUtil.width(320),
        paddingHorizontal: RatioUtil.width(20),
        paddingVertical: RatioUtil.lengthFixedRatio(15),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: RatioUtil.lengthFixedRatio(14),
        borderRadius: RatioUtil.lengthFixedRatio(10),
    },
    bottomCardMainView: {
        height: RatioUtil.lengthFixedRatio(80),
        width: RatioUtil.lengthFixedRatio(56),
        justifyContent: "flex-end",
    },
    bottomCardTitle: {
        fontSize: scaleSize(13),
        lineHeight: scaleSize(15),
        color: Colors.WHITE,
        fontWeight: "600",
        marginBottom: scaleSize(10),
    },
    cardBottomMainView: {
        height: RatioUtil.lengthFixedRatio(80),
        width: RatioUtil.width(56),
        // marginTop: scaleSize(15),
    },
    limitedImage: {
        height: scaleSize(75),
        width: scaleSize(75),
        position: "absolute",
        top: scaleSize(-5),
        right: 0,
        zIndex: 1,
    },
    modalMainView: {
        flex: 1,
        backgroundColor: `${Colors.BLACK}70`,
        alignItems: "center",
        justifyContent: "center",
    },
    modalInnerView: {
        backgroundColor: Colors.WHITE,
        width: width - scaleSize(80),
        alignItems: "center",
        paddingVertical: scaleSize(30),
        paddingHorizontal: scaleSize(15),
        borderRadius: scaleSize(15),
    },
    modalTitle: {
        fontSize: scaleSize(16),
        lineHeight: scaleSize(18),
        fontWeight: "900",
        color: Colors.BLACK,
    },
    modalDesc: {
        fontSize: scaleSize(13),
        lineHeight: scaleSize(18),
        fontWeight: "500",
        color: Colors.GRAY3,
        width: scaleSize(175),
        textAlign: "center",
        marginTop: scaleSize(10),
    },
    soldoutView: {
        height: scaleSize(230),
        width: width / 2 - scaleSize(35),
        backgroundColor: `${Colors.BLACK}70`,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scaleSize(10),
        marginTop: scaleSize(10),
    },
    soldoutImage: {
        height: scaleSize(65),
        width: scaleSize(65),
    },
})
