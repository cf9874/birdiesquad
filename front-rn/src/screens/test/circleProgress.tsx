import { PretendText } from "components/utils"
import { CircularProgress } from "components/utils"
import * as React from "react"
import { Button, View } from "react-native"
import { Svg, Circle, Path, Text, G, LinearGradient, Stop, Defs } from "react-native-svg"
import { RatioUtil } from "utils"

const Test = () => {
    const [progress, setProgress] = React.useState<number | undefined>(undefined)

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {progress ? (
                <CircularProgress
                    size={200}
                    progress={progress}
                    strokeWidth={25}
                    text={`${progress}%`}
                    linearGradient={[
                        // { offset: "0%", color: "#5567FF" }, // 에너지
                        // { offset: "100%", color: "#A1EF7A" },
                        { offset: "0%", color: "#FDD95C" }, // 레벨
                        { offset: "100%", color: "#FFAD69" },
                    ]}
                />
            ) : null}
            <View style={{ marginTop: RatioUtil.height(100) }}>
                <Button
                    title="random"
                    onPress={() => {
                        const randomNumberInRange1To100 = Math.floor(Math.random() * 101)
                        setProgress(randomNumberInRange1To100)
                    }}
                />
            </View>
        </View>
    )
}

export default Test
