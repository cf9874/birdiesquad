import { StyleSheet } from "react-native"
import { Colors } from "const"
import { RatioUtil } from "utils"

export const profileStyle = {
    layout: StyleSheet.create({
        center: {
            justifyContent: "center",
            alignItems: "center",
        },
    }),
    helper: StyleSheet.create({
        con: {
            position: "absolute",
            top: RatioUtil.height(11),
            right: RatioUtil.width(21),
            width: RatioUtil.width(18),
            height: RatioUtil.width(18),
            justifyContent: "center",
            alignItems: "center",
        },
    }),
    tabMenu: StyleSheet.create({
        indicator: {
            backgroundColor: Colors.BLACK,
            borderLeftWidth: 37.5,
            borderLeftColor: Colors.WHITE,
            borderRightWidth: 37.5,
            borderRightColor: Colors.WHITE,
            height: RatioUtil.height(3),
            borderRadius: RatioUtil.width(100),
        },
        label: {
            color: Colors.GRAY3,
            fontSize: RatioUtil.font(16),
            fontWeight: "600",
            lineHeight: RatioUtil.font(16) * 1.4,
            marginTop: 0,
        },
        style: {
            backgroundColor: Colors.WHITE,
            borderBottomWidth: 1,
            borderBottomColor: Colors.GRAY7,
            elevation: 0,
            height: RatioUtil.height(40),
        },
    }),
}

export const profileCompoStyle = {
    info: StyleSheet.create({
        con: {
            minHeight: RatioUtil.height(318),
            width: RatioUtil.width(360),
            backgroundColor: Colors.WHITE,
            alignItems: "center",
            paddingHorizontal: RatioUtil.width(20),
            marginBottom: RatioUtil.height(3),
        },
    }),
    menu: StyleSheet.create({
        con: {
            backgroundColor: Colors.WHITE,
            width: RatioUtil.width(360),
            minHeight: RatioUtil.height(270),
            flex: 1,
            paddingHorizontal: RatioUtil.width(20),
            paddingTop: RatioUtil.height(40),
        },
        dataCon: {
            width: RatioUtil.width(320),
            borderWidth: 1,
            borderColor: Colors.GRAY7,
            borderRadius: RatioUtil.width(7),
            paddingHorizontal: RatioUtil.width(20),
            paddingVertical: RatioUtil.height(15),
            backgroundColor: Colors.GRAY9,
        },
        text: {
            color: Colors.GRAY8,
            fontSize: RatioUtil.font(14),
            fontWeight: "600",
            lineHeight: RatioUtil.font(14) * 1.22,
            textAlign: "right",
        },
    }),
    modal: StyleSheet.create({
        helperCon: {
            flex: 1,
            marginTop: RatioUtil.height(17.92),
            backgroundColor: Colors.WHITE,
            borderTopLeftRadius: RatioUtil.width(10),
            borderTopRightRadius: RatioUtil.width(10),
        },
    }),
}
