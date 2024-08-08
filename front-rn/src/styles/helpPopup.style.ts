import { StyleSheet } from "react-native";
import { RatioUtil } from "utils"
import { Colors } from "const"

export const helpPopupStyle = {
    helpPopup: StyleSheet.create({
        toggleTextArea: {
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: RatioUtil.height(10),
            width: RatioUtil.width(280),
        },
        circleToggle: {
            width: RatioUtil.lengthFixedRatio(6),
            height: RatioUtil.lengthFixedRatio(6),
            marginTop: RatioUtil.lengthFixedRatio(6),
            marginRight: RatioUtil.lengthFixedRatio(10),
            backgroundColor: Colors.GRAY12,
            borderRadius: RatioUtil.lengthFixedRatio(10),
        },
        tableCell: {
            width: RatioUtil.width(160),
            height: RatioUtil.height(40),
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 1,
            borderColor: "#DADEE4",
        }
    })
}