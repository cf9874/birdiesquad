import { PixelRatio, StyleSheet } from "react-native"
import { Colors } from "const"
import { RatioUtil } from "utils"

export const homeStyle = {
    home: StyleSheet.create({
        headerText: {
            fontWeight: "700",
            fontSize: RatioUtil.font(18),
            color: Colors.BLACK,
        },
        desc: {
            width: RatioUtil.width(320),
            fontSize: RatioUtil.font(16),
            color: Colors.GRAY2,
            paddingRight: RatioUtil.width(18),
        },
        text16Gray: {
            fontSize: RatioUtil.font(16),
            color: Colors.GRAY2,
        },
        tableLayout: {
            marginTop: RatioUtil.height(15),
            width: RatioUtil.width(320),
            height: RatioUtil.height(400),
            borderColor: "#DADEE4",
            borderBottomWidth: 1,
            borderTopWidth: 1,
        },
        grayLayout: {
            backgroundColor: Colors.WHITE3,
            fontSize: RatioUtil.font(16),
            lineHeight: RatioUtil.font(16) * 1.3,
        },
        wholeLayout: {
            justifyContent: "center",
            alignItems: "center",
            height: RatioUtil.height(40),
            borderBottomWidth: 1,
            borderColor: "#DADEE4",
        },
        halfLayoutBox: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        halfLayout: {
            width: RatioUtil.width(160),
            height: RatioUtil.height(40),
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 1,
            borderColor: "#DADEE4",
        },
        tableText: {
            fontSize: RatioUtil.font(16),
        },
    }),

    popUpRaffle: StyleSheet.create({
        mainView: {
            position: "absolute",
            zIndex: 1,
            backgroundColor: `${Colors.BLACK}90`,
        },
        btnClose: {
            marginRight: RatioUtil.width(20),
            marginBottom: RatioUtil.lengthFixedRatio(20)
        },
        mainView1: {
            ...RatioUtil.sizeFixedRatio(360, 370),
            overflow: "hidden",
            borderTopLeftRadius: RatioUtil.width(15),
            borderTopRightRadius: RatioUtil.width(15),
            alignItems: "center",
            backgroundColor: Colors.WHITE
        },
        mainView2: {
            backgroundColor: `${Colors.BLACK}80`,
            justifyContent: "center",
            position: "absolute",
            overflow: "hidden",
            zIndex: 1,
            top: RatioUtil.lengthFixedRatio(20),
            right: RatioUtil.lengthFixedRatio(20),
            ...RatioUtil.sizeFixedRatio(36, 20),
            borderRadius: RatioUtil.width(22),
        },
        txtPage: {
            color: Colors.WHITE,
            textAlign: "center",
            fontSize: RatioUtil.font(12),
            fontWeight: "500",
        },
        btnLink: {
            bottom: RatioUtil.height(30),
            ...RatioUtil.size(165, 40),
            borderRadius: RatioUtil.height(30),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.PURPLE,
        },
        txtLink: {
            color: Colors.WHITE,
            fontSize: RatioUtil.font(16),
            fontWeight: "700",
        },
    }),
}
