import { PixelRatio, StyleSheet } from "react-native"
import { Colors, Dimension } from "const"
import { RatioUtil } from "utils"

export const rankStyle = {
    header: StyleSheet.create({
        modalMainView: {
            flex: 1,
            backgroundColor: `${Colors.BLACK}70`,
            alignItems: "center",
            justifyContent: "center",
        },
        con: {
            height: RatioUtil.height(80),
            flexDirection: "row",
            backgroundColor: Colors.WHITE,
            alignItems: "center",
            justifyContent: "center",
        },
        text: {
            fontSize: RatioUtil.font(18),
            fontWeight: "700",
            lineHeight: RatioUtil.font(18) * 1.4,
            color: Colors.BLACK,
        },
        textConWhite: { fontSize: RatioUtil.font(14), fontWeight: "700", color: Colors.WHITE },
        textConBlack: { fontSize: RatioUtil.font(14), fontWeight: "700", color: Colors.BLACK },
        center: {
            alignItems: "center",
            justifyContent: "center",
        },
        timeLeft: {
            flexDirection: "row",
            alignItems: "center",
            ...RatioUtil.padding(0, 15, 0, 15),
            ...RatioUtil.margin(0, 0, 10, 10),
            backgroundColor: Colors.BLACK,
            justifyContent: "space-between",
            borderRadius: RatioUtil.width(10),
            ...RatioUtil.size(320, 50),
        },
        row: {
            flexDirection: "row",
        },
        rowCenter: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },
    }),
    popUp: StyleSheet.create({
        buttonCon: {
            ...RatioUtil.padding(15, 15, 15, 15),
            ...RatioUtil.margin(0, 0, 10, 0),
            ...RatioUtil.size(340, 70),
            flexDirection: "row",
            justifyContent: "space-between",
        },
        textUnder: {
            bottom: 4,
            fontSize: RatioUtil.font(12),
            fontWeight: "500",
            color: Colors.GRAY3,
        },
        buttonHelp: {
            ...RatioUtil.borderRadius(20, 20, 20, 20),
            ...RatioUtil.size(90, 28),
            backgroundColor: Colors.GRAY,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },
        textHeader: {
            ...RatioUtil.size(280, 500),
            backgroundColor: Colors.WHITE,
            alignItems: "center",
            justifyContent: "center",
            ...RatioUtil.borderRadius(20, 20, 20, 20),
        },
        con: {
            ...RatioUtil.size(240, 160),
            backgroundColor: Colors.WHITE3,
            justifyContent: "center",
            borderRadius: 10,
            ...RatioUtil.margin(10, 0, 10, 0),
            ...RatioUtil.padding(10, 10, 10, 10),
        },
        rowBetween: {
            flexDirection: "row",
            justifyContent: "space-between",
            ...RatioUtil.margin(5, 0, 5, 0),
        },
        totalValue: {
            ...RatioUtil.size(240, 50),
            backgroundColor: Colors.WHITE3,
            justifyContent: "center",
            borderRadius: 10,
            ...RatioUtil.padding(0, 10, 0, 10),
        },
        buttonSubmit: {
            alignItems: "center",
            justifyContent: "center",
            ...RatioUtil.padding(0, 15, 0, 15),
            ...RatioUtil.margin(25, 0, 0, 0),
            backgroundColor: Colors.BLACK,
            borderRadius: 50,
            ...RatioUtil.size(240, 50),
        },
    }),
    detailMain: StyleSheet.create({
        tab: {
            ...RatioUtil.borderRadius(20, 20, 20, 20),
            ...RatioUtil.size(62, 35),
            borderWidth: 1.5,
            borderColor: Colors.GRAY13,
            alignItems: "center",
            justifyContent: "center",
        },
        header1: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            ...RatioUtil.size(320, 50),
        },
        header2: {
            ...RatioUtil.size(90, 50),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
    }),
    passionate: StyleSheet.create({
        textOpacity: {
            fontSize: RatioUtil.font(14),
            opacity: 0.5,
        },
        header1: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            ...RatioUtil.size(320, 50),
        },
        header2: {
            ...RatioUtil.size(90, 50),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        textName: {
            fontWeight: "700",
            color: Colors.WHITE,
            fontSize: RatioUtil.font(20),
            ...RatioUtil.margin(5, 0, 5, 0),
        },
        textCount: {
            fontWeight: "700",
            color: Colors.WHITE,
            fontSize: RatioUtil.font(14),
            opacity: 0.5,
        },
        positionView: {
            position: "absolute",
            bottom: RatioUtil.height(10),
            marginHorizontal: RatioUtil.width(10),
        },
    }),

    listItem: StyleSheet.create({
        container: {
            ...RatioUtil.borderRadius(10, 10, 10, 10),
            ...RatioUtil.padding(10, 10, 10, 10),
            ...RatioUtil.margin(0, 0, 20, 0),
            borderWidth: 1,
            borderColor: Colors.GRAY13,
        },
        rankListItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
            marginBottom: RatioUtil.height(10),
            ...RatioUtil.padding(9, 20, 9, 20),
            ...RatioUtil.size(320, 45),
        },
        textBold: { fontWeight: RatioUtil.fontWeightBold(), color: Colors.BLACK },
        textScore: {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.WHITE3,
            borderRadius: 20,
            ...RatioUtil.size(60, 30),
        },
        buttonDetail: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomColor: Colors.WHITE3,
            borderBottomWidth: 1,
            ...RatioUtil.padding(10, 0, 10, 0),
            ...RatioUtil.margin(0, 15, 20, 15),
        },
        userAvatar: {
            backgroundColor: Colors.WHITE,
            ...RatioUtil.size(39, 39),
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 50,
        },
        myRankCon: {
            flexDirection: "row",
            alignItems: "center",
            ...RatioUtil.padding(0, 15, 0, 15),
            backgroundColor: Colors.WHITE3,
            justifyContent: "space-between",
            borderRadius: RatioUtil.width(10),
            ...RatioUtil.size(300, 50),
        },
        myRankTextCon: {
            alignItems: "center",
            justifyContent: "center",
            borderRightColor: Colors.GRAY,
            paddingRight: 10,
            borderRightWidth: 1.5,
        },
        textRank: {
            fontWeight: "700",
            color: Colors.BLACK,
            fontSize: RatioUtil.font(14),
            marginHorizontal: RatioUtil.width(10),
            paddingRight: RatioUtil.width(20),
        },
        imageMyRank: {
            ...RatioUtil.size(15, 15),
            marginRight: RatioUtil.width(4),
            borderRadius: 50,
        },
        opacityMyRank: {
            fontWeight: "700",
            color: Colors.WHITE,
            fontSize: RatioUtil.font(13),
        },
    }),
}

export const rankProStyle = {
    header: StyleSheet.create({
        mainView: {
            flex: 1,
            // paddingTop: scaleSize(10),
            alignItems: "center",
        },
    }),
    popup: StyleSheet.create({
        title: {
            fontWeight: "700",
            fontSize: RatioUtil.font(18),
            color: Colors.BLACK,
        },
        center: {
            alignItems: "center",
            justifyContent: "center",
        },
        viewRow: {
            ...RatioUtil.size(360, 170),
            padding: RatioUtil.width(20),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        container: {
            height: RatioUtil.height(110),
            borderRadius: RatioUtil.width(10),
            backgroundColor: Colors.GRAY9,
            overflow: "hidden",
        },
        txtUserName: {
            ...RatioUtil.padding(0, 0, 10, 0),
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",
        },
        icon: {
            position: "absolute",
            top: -RatioUtil.width(10),
            left: RatioUtil.width(32),
            ...RatioUtil.size(33, 33),
        },
        rankListItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
            marginBottom: RatioUtil.height(10),
            ...RatioUtil.padding(9, 20, 9, 20),
            ...RatioUtil.size(320, 48),
            backgroundColor: Colors.GRAY9,
        },
    }),
}
export const rankHelpStyle = {
    popup: StyleSheet.create({
        header: {
            backgroundColor: Colors.WHITE3,
            borderTopColor: Colors.GRAY11,
            borderTopWidth: 0.75,
            ...RatioUtil.size(165, 40),
            ...rankStyle.header.center,
        },
        itemLeft: {
            backgroundColor: Colors.WHITE3,
            ...RatioUtil.size(165, 40),
            ...rankStyle.header.center,
        },
        itemLeft1st: {
            backgroundColor: Colors.WHITE3,
            ...RatioUtil.size(165, 60),
            padding: RatioUtil.height(10),
            alignItems: "center",
        },
        itemEnd: {
            ...rankStyle.header.row,
            borderColor: Colors.GRAY11,
            borderTopWidth: 1,
            borderBottomWidth: 1,
        },
        rowCenter: {
            ...RatioUtil.size(165, 40),
            flexDirection: "row",
            alignItems: "center",
        },
        rowCenter1st: {
            ...RatioUtil.size(165, 21),
            flexDirection: "row",
            alignItems: "center",
        },

        viewImage: {
            width: RatioUtil.width(82),
            alignItems: "flex-end",
            justifyContent: "center",
            marginRight: 6,
        },
        itemLeftPro: {
            backgroundColor: Colors.WHITE3,
            ...RatioUtil.size(165, 60),
            padding: RatioUtil.height(10),
            ...rankStyle.header.center,
        },
        rowCenterPro: {
            ...RatioUtil.size(165, 60),
            marginLeft: RatioUtil.width(10),
            flexDirection: "row",
            alignItems: "center",
        },
        itemEndPro: {
            ...rankStyle.header.row,
            borderColor: Colors.GRAY11,
            borderTopWidth: 1,
            borderBottomWidth: 1,
        },
    }),
}
