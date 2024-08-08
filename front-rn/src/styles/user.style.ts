import { Colors } from "const"
import { StyleSheet, ScaledSize } from "react-native"
import { RatioUtil } from "utils"

export const userStyle = {
    signin: StyleSheet.create({
        con: {
            flex: 1,
            alignItems: "center",
            backgroundColor: Colors.WHITE, // 안드로이드 기본배경색은 회색임
        },
        logo: {
            // width: RatioUtil.width(176),
            // height: RatioUtil.height(127),
            ...RatioUtil.size(176, 127),
            ...RatioUtil.margin(244),
            // marginTop: RatioUtil.height(244),
        },
        loginText: {
            fontWeight: "400",
            color: Colors.GRAY3,
            fontSize: RatioUtil.font(14),
            // textDecorationLine: "underline",
            // textDecorationColor: Colors.GRAY3,
        },
        loginTextUnderLine: {
            height: 0,
            borderTopColor: Colors.GRAY3,
            borderTopWidth: 1, // 'Thickness' of the underline
            marginTop: 2, // 'Gap' between the content & the underline
        },

        kakaoIcon: {
            width: RatioUtil.width(20),
            height: RatioUtil.width(20),
            marginRight: RatioUtil.width(8),
        },
    }),
    genTerm: (dimension: ScaledSize) =>
        StyleSheet.create({
            con: {
                backgroundColor: Colors.WHITE,
                flex: 1,
            },
            header: {
                width: dimension.width,
                height: RatioUtil.height(56),
                paddingLeft: RatioUtil.width(20),
                paddingTop: RatioUtil.height(12),
                paddingBottom: RatioUtil.height(12),
            },
            headerBackbtn: {
                width: RatioUtil.width(32),
                height: RatioUtil.height(32),
            },
            titleCon: {
                width: "100%",
                // height: RatioUtil.height(62),
                marginTop: RatioUtil.height(30),
                marginBottom: RatioUtil.height(35),
                marginLeft: RatioUtil.width(20),
            },
            titleText: {
                fontSize: RatioUtil.font(22),
                fontWeight: RatioUtil.fontWeightBold(),
                color: Colors.BLACK,
            },
            main: {
                width: RatioUtil.width(320),
                height: RatioUtil.height(216 + 75 + 100),
            },

            checkboxCon: {
                width: RatioUtil.width(320),
                marginLeft: RatioUtil.width(20),
                paddingLeft: RatioUtil.width(18),
            },
            checkboxShowMore: {
                width: RatioUtil.width(20),
                height: RatioUtil.height(20),
            },

            checkboxText: {
                marginLeft: RatioUtil.width(18),
                fontWeight: "bold",
                fontSize: RatioUtil.font(16),
            },

            checkboxTailText: {
                fontWeight: "400",
                fontSize: RatioUtil.font(14),
                color: Colors.GRAY10,
                marginLeft: RatioUtil.width(20),
            },
        }),
}

export const userGStyle = {
    userbtn: StyleSheet.create({
        con: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        conIntro: {
            flex: 0.2,
            justifyContent: "center",
            alignItems: "center",
        },
        box: {
            borderRadius: 100,
            backgroundColor: Colors.YELLOW,
            width: RatioUtil.width(318),
            height: RatioUtil.height(60),
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginBottom: RatioUtil.height(21),
        },
        text: {
            fontWeight: "700",
            color: Colors.BLACK,
            fontSize: RatioUtil.font(22),
        },
    }),
}
