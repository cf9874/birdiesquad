import { StyleSheet } from "react-native"
import { RatioUtil } from "utils"

export const ProgressCircleStyle = {
    progressCircleCss: StyleSheet.create({
        container: {
            marginLeft: RatioUtil.width(104),
            marginTop: 8,
        },
        progressText: {
            fontSize: RatioUtil.font(20),
            fontWeight: "700",
        },
    }),
}
