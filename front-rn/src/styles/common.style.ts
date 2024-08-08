import { ScaledSize, StyleSheet } from "react-native"
import { RatioUtil } from "utils"

export const CommonStyle = {
    modal: StyleSheet.create({
        con: {
            // width: RatioUtil.width(300),
            // height: RatioUtil.height(100),
            ...RatioUtil.size(300, 100),
            backgroundColor: "white",
            // borderRadius: 10,
            ...RatioUtil.borderRadius(10),
            justifyContent: "center",
            alignSelf: "center",
        },
        text: {
            fontSize: RatioUtil.font(24),
            textAlign: "center",
        },
        btn: {
            // width: RatioUtil.width(100),
            // height: RatioUtil.height(30),
            ...RatioUtil.size(100, 30),
            justifyContent: "center",
            alignSelf: "center",
            backgroundColor: "red",
            // borderRadius: 10,
            ...RatioUtil.borderRadius(10),
            textAlign: "center",
        },
        btnText: {
            fontSize: RatioUtil.font(16),
            fontWeight: "700",
            textAlign: "center",
            color: "white",
        },
    }),
    genLoading: (dimension: ScaledSize) =>
        StyleSheet.create({
            loading: {
                position: "absolute",
                elevation: 3,
                zIndex: 3,
                backgroundColor: "rgba(0, 0, 0, 0.5)",

                width: dimension.width,
                height: RatioUtil.height(740),
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            },
        }),
}
