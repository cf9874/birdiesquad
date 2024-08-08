import { ScaledSize, StyleSheet } from "react-native"
import { Colors, Dimension } from "const"
import { RatioUtil } from "utils"

export const LayoutStyle = {
    genMainHeader: (dimension: ScaledSize) =>
        StyleSheet.create({
            con: {
                height: RatioUtil.height(44),
                width: RatioUtil.width(360),
                flexDirection: "row",
                backgroundColor: Colors.WHITE,
                alignItems: "center",
                justifyContent: "space-between",
                ...RatioUtil.padding(0, Dimension.NFT.DETAIL.PADDING, 0, Dimension.NFT.DETAIL.PADDING / 2),
            },
            menuCon: {
                flexDirection: "row",
                height: RatioUtil.height(30),
                ...RatioUtil.padding(7, 5, 7, 12),
                alignItems: "center",
                backgroundColor: Colors.GRAY7,
                ...RatioUtil.borderRadius(17),
            },
            menuConIcon: {
                ...RatioUtil.size(20, 20),
            },
        }),
    menu: StyleSheet.create({
        con: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },
        text: {
            paddingRight: RatioUtil.width(11),
            fontSize: RatioUtil.font(12),
            fontWeight: "500",
            lineHeight: RatioUtil.font(16.8),
            left: RatioUtil.width(4),
            zIndex: 1,
        },
        Superscript: {
            color: Colors.BLACK,
            fontSize: RatioUtil.font(10),
            fontWeight: "500",
            height: RatioUtil.height(10),
            marginBottom: RatioUtil.height(8),
            left: RatioUtil.width(-7),
            zIndex: 2,
        },
        icon: {
            ...RatioUtil.size(16, 16),
        },
    }),
    profileHeader: StyleSheet.create({
        //hazel - 디자인 요청으로 style 값 수정
        con: {
            height: RatioUtil.heightFixedRatio(44),
            width: RatioUtil.width(360),
            flexDirection: "row",
            backgroundColor: Colors.WHITE,
            alignItems: "center",
            justifyContent: "space-between",
            ...RatioUtil.padding(0, 0, 0, Dimension.NFT.DETAIL.PADDING / 2) ,
        },
        text: {
            fontSize: RatioUtil.font(16),
            fontWeight: RatioUtil.fontWeightBold(),
            lineHeight: RatioUtil.font(18) * 1.3,
            color: Colors.BLACK,
        },
        arrowIcon: {
            position: "absolute",
            left: RatioUtil.width(10),
            ...RatioUtil.sizeFixedRatio(44, 44),
            alignItems: "center",
            justifyContent: "center",
        },
        reportIcon: {
            // position: "absolute",
            right: RatioUtil.width(20),
            // width: RatioUtil.width(32),
            // height: RatioUtil.width(32),
            ...RatioUtil.sizeFixedRatio(52.5, 32),
            // ...RatioUtil.padding(7, 7, 7, 7),
            // paddingHorizontal: RatioUtil.width(7),
            // paddingVertical: RatioUtil.height(7),
            alignItems: "center",
            justifyContent: "center",
        },
    }),
}
export const LayoutCompoStyle = {
    reportPopUp: StyleSheet.create({
        con: {
            position: "absolute",
            bottom: 0,
            backgroundColor: Colors.WHITE,
            borderTopRightRadius: RatioUtil.width(16),
            borderTopLeftRadius: RatioUtil.width(16),
            // width: RatioUtil.width(360),
            // height: RatioUtil.height(302),
            ...RatioUtil.size(360, 302),
            alignSelf: "center",
            alignItems: "center",
            ...RatioUtil.padding(30, 19, 30, 19),
            // paddingHorizontal: RatioUtil.width(19),
            // paddingVertical: RatioUtil.height(30),
        },
    }),
    reportModal: StyleSheet.create({
        con: {
            backgroundColor: Colors.WHITE,
            // borderRadius: RatioUtil.width(16),
            ...RatioUtil.borderRadius(16),
            alignSelf: "center",
            alignItems: "center",
            // width: RatioUtil.width(272),
            // height: RatioUtil.height(220),
            ...RatioUtil.size(272, 220),
            // paddingHorizontal: RatioUtil.width(20),
            // paddingVertical: RatioUtil.width(20),
            ...RatioUtil.padding(20, 20, 20, 20),
        },
    }),
}
