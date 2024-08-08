import { PixelRatio, Platform, StyleSheet } from "react-native"
import { Colors } from "const"
import { RatioUtil } from "utils"

export const errorModalStyle = {
  
  cancelConfirm: StyleSheet.create({
    base:{
      backgroundColor: Colors.WHITE,
      alignSelf: "center",
      alignItems: "center",
      ...RatioUtil.borderRadius(16),
    },
    titleText:{
      ...RatioUtil.margin(0, 20, 10, 20),
      fontSize: RatioUtil.font(16),
      fontWeight: RatioUtil.fontWeightBold(),
      lineHeight: RatioUtil.font(16) * 1.4,
      textAlign: "center",
      color: Colors.BLACK,
    },
    titleContext:{
      ...RatioUtil.marginFixedRatio(0, 20, 20, 20),
      fontSize: RatioUtil.font(14),
      fontWeight: "400",
      lineHeight: RatioUtil.font(14) * 1.4,
      textAlign: "center",
      color: Colors.BLACK3,
    },
    buttonArea:{
      flexDirection: "row",
      ...RatioUtil.marginFixedRatio(0, 20, 20, 20),
      width: RatioUtil.width(232),
      height: RatioUtil.height(48),
      justifyContent: "space-between",
    },
    button: {
      width: RatioUtil.width(113),
      height: RatioUtil.height(48),
      ...RatioUtil.borderRadius(24),
      alignItems: "center",
      justifyContent: "center",
      
    },
    buttonTextFont: {
      fontFamily: "Pretendard",
      fontSize: RatioUtil.font(14),
      fontStyle: "normal",
      fontWeight: RatioUtil.fontWeightBold(),
      lineHeight: RatioUtil.font(19.6) * 1.3,
    },
    cancelTextColor:{color:Colors.BLACK2},
    confirmTextColor:{color:Colors.WHITE},
    cancelButton:{backgroundColor: Colors.GRAY7,},
    confirmButton:{backgroundColor: Colors.BLACK,},
    
  })
}
