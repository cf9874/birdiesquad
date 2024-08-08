import { ScaledSize, StyleSheet } from "react-native"
import { Colors, Dimension } from "const"
import { RatioUtil } from "utils"

export const settingStyle = {
    myInfo: StyleSheet.create({
        text: {
            fontSize: RatioUtil.font(16),
            fontWeight: "400",
            lineHeight: RatioUtil.font(16) * 1.4,
            color: Colors.BLACK,
        },
        textCon: {
            width: RatioUtil.width(320),
            flexDirection: "row",
            justifyContent: "space-between",
        },
    }),
    alarm: StyleSheet.create({
        menuCon: {
            // flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: RatioUtil.width(20),
            marginTop: RatioUtil.height(10),
            marginBottom: RatioUtil.height(10),
        },
        text: {
            fontSize: RatioUtil.font(14),
            fontWeight: "700",
            letterSpacing: RatioUtil.font(14) * -0.043,
            color: Colors.BLACK2,
        },
        toggleTrack: {
            width: RatioUtil.width(42),
            height: RatioUtil.height(22),
            borderRadius: RatioUtil.width(16),
        },
        thumb: {
            width: RatioUtil.width(18),
            height: RatioUtil.width(18),
            borderRadius: RatioUtil.width(12),
        },
    }),
    FAQ: StyleSheet.create({
        con: {
            width: RatioUtil.width(320),
            height: RatioUtil.heightFixedRatio(170),
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: RatioUtil.heightFixedRatio(20),
            flexWrap: "wrap",
        },
        menuCon: {
            width: RatioUtil.width(100),
            height: RatioUtil.heightFixedRatio(50),
            borderRadius: RatioUtil.width(6),
            alignItems: "center",
            justifyContent: "center",
        },
        menuText: {
            fontSize: RatioUtil.font(14),
            fontWeight: RatioUtil.fontWeightBold(),
            lineHeight: RatioUtil.font(14) * 1.4,
        },
        contentCon: {
            width: RatioUtil.width(360),
            height: RatioUtil.heightFixedRatio(440),
            marginTop: RatioUtil.heightFixedRatio(2),
        },
        listCon: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: RatioUtil.width(360),
            height: RatioUtil.heightFixedRatio(60),
            paddingHorizontal: RatioUtil.width(20),
        },
        listTitleText: {
            fontSize: RatioUtil.font(14),
            fontWeight: RatioUtil.fontWeightBold(),
            lineHeight: RatioUtil.font(14) * 1.4,
            color: Colors.BLACK2,
        },
        listSubText: {
            fontSize: RatioUtil.font(14),
            fontWeight: "400",
            lineHeight: RatioUtil.font(14) * 1.4,
            letterSpacing: RatioUtil.font(14) * -0.02,
            color: Colors.GRAY8,
        },
    }),
    withdraw: StyleSheet.create({
        titleCon: {
            marginTop: RatioUtil.height(43),
            marginLeft: RatioUtil.width(20),
            marginBottom: RatioUtil.height(20),
        },
        titleText: {
            fontSize: RatioUtil.font(22),
            fontWeight: "700",
            lineHeight: RatioUtil.font(22) * 1.4,
            color: Colors.BLACK,
        },
        listCon: {
            width: RatioUtil.width(360),
            minHeight: RatioUtil.height(60),
            paddingLeft: RatioUtil.width(20),
            paddingVertical: RatioUtil.height(20),
            justifyContent: "center",
        },
        checkCon: {
            width: RatioUtil.width(24),
            height: RatioUtil.width(24),
            padding: RatioUtil.width(2),
            marginRight: RatioUtil.width(8),
        },
        checkIcon: {
            width: RatioUtil.width(20),
            height: RatioUtil.width(20),
            borderRadius: RatioUtil.width(10),
            justifyContent: "center",
            alignItems: "center",
        },
        listText: {
            fontSize: RatioUtil.font(14),
            fontWeight: "400",
            lineHeight: RatioUtil.font(14) * 1.4,
            color: Colors.BLACK,
        },
        inputCon: {
            width: RatioUtil.width(288),
            height: RatioUtil.height(94),
            borderRadius: RatioUtil.width(8),
            borderColor: Colors.GRAY7,
            borderWidth: 1,
            marginLeft: RatioUtil.width(32),
            marginTop: RatioUtil.height(20),
            marginBottom: RatioUtil.height(4),
            paddingTop: RatioUtil.height(14),
            paddingLeft: RatioUtil.width(20),
            fontSize: RatioUtil.font(14),
            fontWeight: "400",
            color: Colors.BLACK,
            lineHeight: RatioUtil.font(14) * 1.4,
            textAlignVertical: "top",
        },
        subText: {
            fontSize: RatioUtil.font(14),
            fontWeight: "400",
            color: Colors.GRAY8,
        },
        blackDot: {
            width: RatioUtil.width(3),
            height: RatioUtil.width(3),
            borderRadius: RatioUtil.width(1.5),
            backgroundColor: Colors.BLACK,
            marginRight: RatioUtil.width(10.6),
        },
    }),
}

export const settingCompoStyle = {
    moveSpandingModal: StyleSheet.create({
        con: {
            width: RatioUtil.width(272),
            height: RatioUtil.height(193),
            borderRadius: RatioUtil.width(16),
            backgroundColor: Colors.WHITE,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
        },
        titleText: {
            fontSize: RatioUtil.font(18),
            fontWeight: "600",
            lineHeight: RatioUtil.font(18) * 1.5,
            color: Colors.BLACK3,
        },
        text: {
            width: RatioUtil.width(250),
            fontSize: RatioUtil.font(14),
            fontWeight: "400",
            lineHeight: RatioUtil.font(14) * 1.4,
            color: Colors.BLACK3,
            textAlign: "center",
        },
        buttonCon: {
            width: RatioUtil.width(113),
            height: RatioUtil.height(48),
            alignItems: "center",
            justifyContent: "center",
            borderRadius: RatioUtil.width(24),
        },
        buttonText: {
            fontSize: RatioUtil.font(14),
            fontWeight: "600",
            lineHeight: RatioUtil.font(14) * 1.4,
        },
    }),
}

export const settingGStyle = {
    grayButton: StyleSheet.create({
        con: {
            position: "absolute",
            bottom: RatioUtil.height(20),
            width: RatioUtil.width(58),
            height: RatioUtil.height(24),
            borderRadius: RatioUtil.width(12.5),
            backgroundColor: Colors.GRAY9,
            alignItems: "center",
            justifyContent: "center",
        },
        text: {
            fontSize: RatioUtil.font(12),
            fontWeight: "600",
            lineHeight: RatioUtil.font(12) * 1.4,
            color: Colors.GRAY3,
        },
    }),
    blackButton: StyleSheet.create({
        con: {
            width: RatioUtil.width(320),
            height: RatioUtil.height(60),
            borderRadius: RatioUtil.width(100),
            backgroundColor: Colors.BLACK4,
            marginBottom: RatioUtil.height(40),
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
        },
        text: {
            fontSize: RatioUtil.font(16),
            fontWeight: "600",
            lineHeight: RatioUtil.font(16) * 1.19,
            color: Colors.WHITE,
        },
    }),
}
