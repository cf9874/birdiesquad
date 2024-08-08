import { Colors } from "const"
import { Dimensions, Platform, StyleSheet } from "react-native"
import { scaleSize } from "styles/minixs"
import { RatioUtil } from "utils"
const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
    mainView: {
        // flex: 1,
        alignItems: "center",
        backgroundColor: Colors.WHITE,
    },
    mainView1: {
        flex: 1,
        // paddingTop: scaleSize(10),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00000095",
    },
    toggleView: {
        height: RatioUtil.lengthFixedRatio(40),
        width: RatioUtil.width(248),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: RatioUtil.width(100),
        borderWidth: RatioUtil.width(1),
        borderColor: Colors.GRAY13,
        marginTop: RatioUtil.lengthFixedRatio(20),
    },
    toggleText: {
        fontSize: RatioUtil.font(14),
        fontWeight: RatioUtil.fontWeightBold(),
        alignSelf: "center",
    },
    toggleInnerView: {
        flex: 1,
        alignSelf: "center",
    },
    toggleActiveView: {
        height: RatioUtil.lengthFixedRatio(32),
        width: RatioUtil.width(120),
        backgroundColor: Colors.BLACK,
        position: "absolute",
        borderRadius: RatioUtil.width(100),
        zIndex: -1,
        elevation: -1,
        marginHorizontal: RatioUtil.width(4),
    },
    innerMainView: {
        width: RatioUtil.width(320),
        borderRadius: RatioUtil.width(10),
        marginTop: RatioUtil.lengthFixedRatio(20),
        borderWidth: RatioUtil.lengthFixedRatio(1),
        borderColor: Colors.GRAY13,
        alignItems: "center",
    },
    productImage: {
        ...RatioUtil.sizeFixedRatio(175, 157),
        marginTop: RatioUtil.lengthFixedRatio(38),
        marginBottom: RatioUtil.lengthFixedRatio(22),
    },
    productNameView: {
        backgroundColor: Colors.BLACK,
        borderRadius: RatioUtil.width(6),
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: RatioUtil.width(10),
        left: RatioUtil.width(10),
        height: RatioUtil.lengthFixedRatio(25),
        paddingHorizontal: RatioUtil.width(10)
    },
    productName: {
        fontSize: RatioUtil.font(12),
        fontWeight: RatioUtil.fontWeightBold(),
        color: Colors.WHITE,
    },
    title: {
        fontSize: RatioUtil.font(20),
        // lineHeight: scaleSize(30),
        fontWeight: RatioUtil.fontWeightBold(),
        marginBottom: RatioUtil.lengthFixedRatio(5),
        color: Colors.BLACK,
    },
    desc: {
        fontSize: RatioUtil.font(14),
        textAlign: "center",
        lineHeight: RatioUtil.font(14) * 1.3,
    },
    buttonView: {
        width: RatioUtil.width(280),
    },
    innerBottomView: {
        height: RatioUtil.lengthFixedRatio(50),
        width: RatioUtil.width(318),
        backgroundColor: Colors.WHITE2,
        borderBottomLeftRadius: RatioUtil.width(10),
        borderBottomRightRadius: RatioUtil.width(10),
        flexDirection: "row",
    },
    bottomInfoView1: {
        borderRightWidth: RatioUtil.width(1),
        borderRightColor: Colors.GRAY13,
        flex: 0.36,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    bottomInfoView2: {
        // backgroundColor: "pink",
        flex: 0.64,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    priceTag: {
        ...RatioUtil.sizeFixedRatio(16, 16),
        marginRight: RatioUtil.width(5),
    },
    priceText: {
        fontSize: RatioUtil.font(16),
        fontWeight: RatioUtil.fontWeightBold(),
        color: Colors.BLACK,
    },
    drawsText: {
        fontSize: RatioUtil.font(14),
        fontWeight: RatioUtil.fontWeightBold(),
        color: Colors.BLACK,
    },
    dotView: {
        height: RatioUtil.heightFixedRatio(3),
        width: RatioUtil.width(3),
        borderRadius: RatioUtil.width(10),
        backgroundColor: "#8C8C8C",
        marginHorizontal: scaleSize(8),
    },
    participantText: {
        fontSize: RatioUtil.font(14),

        color: "#8C8C8C",
    },
    modalMainView: {
        ...RatioUtil.size(270, 170),
        backgroundColor: Colors.WHITE,
        padding: scaleSize(20),
        borderRadius: scaleSize(15),
        alignItems: "center",
        justifyContent: "space-between",
    },
    title1: {
        fontSize: RatioUtil.font(18),
        fontWeight: "700",
        color: Colors.BLACK,
        marginVertical: scaleSize(10),
    },
    desc1: {
        fontSize: RatioUtil.font(14),
        fontWeight: "400",
        color: Colors.BLACK,
        width: RatioUtil.width(172),
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
    buttonView1: {
        flex: 0.48,
        borderRadius: scaleSize(50),
        alignItems: "center",
        justifyContent: "center",
    },
    btnText: {
        fontSize: scaleSize(14),
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
        textAlign: "center",
        color: Colors.WHITE,
        ...RatioUtil.padding(0, 10, 0, 10),
    },
    doneImage: {
        height: scaleSize(50),
        width: scaleSize(50),
    },
    card1InnerView: {
        height: scaleSize(45),
        width: "100%",
        marginTop: scaleSize(35),
        paddingHorizontal: scaleSize(17),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scaleSize(50),
    },
    cardLimit: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...RatioUtil.paddingFixedRatio(0, 8, 0, 10),
        height: RatioUtil.heightFixedRatio(30),
        backgroundColor: Colors.WHITE,
        ...RatioUtil.borderRadius(5),
        elevation: 10,
    },
    textEndItem: {
        backgroundColor: Colors.GRAY12,
        borderRadius: RatioUtil.width(6),
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: RatioUtil.width(10),
        left: RatioUtil.width(10),
        paddingHorizontal: RatioUtil.width(10),
        height: RatioUtil.lengthFixedRatio(23),
    },
    descTitle: {
        color: Colors.GRAY3,
        fontSize: RatioUtil.font(12),
        marginBottom: RatioUtil.height(10),
        lineHeight: RatioUtil.font(12) * 1.4,
    },

    descDot: {
        color: Colors.GRAY3,
        fontSize: RatioUtil.font(12),
    },
    descWrapper: {
        flexDirection: "row",
        marginBottom: RatioUtil.height(5),
    },
    descText: {
        color: Colors.GRAY3,
        fontSize: RatioUtil.font(12),
        lineHeight: RatioUtil.font(12) * 1.5,
    },
})
