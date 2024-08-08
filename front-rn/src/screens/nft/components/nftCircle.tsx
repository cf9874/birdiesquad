import { RatioUtil } from "utils"
import { Colors } from "const"
import CircularProgress from "react-native-circular-progress-indicator"

interface INftCircleProps {
    value?: number
    max?: number
    suffix?: string
    title?: number | string
}
export const NftCircle = ({ value, max, suffix = "", title }: INftCircleProps) => {
    const titleText = suffix === "%" ? `${title}%` : `${title}`
    const activeStrokeColor = suffix === "%" ? "#5567FF" : "#FDD95C"
    const activeStrokeSecondaryColor = suffix === "%" ? "#A1EF7A" : "#FFAD69"
    return (
        <CircularProgress
            title={titleText}
            showProgressValue={false}
            value={value}
            clockwise={false}
            radius={RatioUtil.width(37)}
            activeStrokeWidth={RatioUtil.width(15)}
            inActiveStrokeWidth={RatioUtil.width(15)}
            titleFontSize={RatioUtil.font(16)}
            titleStyle={{
                color: Colors.BLACK,
                fontWeight: "700",
            }}
            duration={10}
            inActiveStrokeColor={Colors.GRAY7}
            progressValueFontSize={RatioUtil.width(16)}
            progressValueStyle={{ color: Colors.BLACK, fontWeight: "700" }}
            rotation={30} // 시작점 이걸로 맞추기
            activeStrokeColor={activeStrokeColor}
            activeStrokeSecondaryColor={activeStrokeSecondaryColor}
        />
    )
}
