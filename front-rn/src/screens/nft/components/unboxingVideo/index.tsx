import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
import React, { useState } from "react"
import Video from "react-native-video"
import { nftDetailImg } from "assets/images"
import { Colors, Screen } from "const"
import { RatioUtil } from "utils"
import { useRoute } from "@react-navigation/native"
import { styles } from "../player/styles"
import { navigate } from "utils"
import { PretendText } from "components/utils"
interface IVideo {
    nftInfo: any
}

const UnboxingVideo = (props: IVideo) => {
    const route = useRoute()
    const [pause, setPause] = useState(false)

    const params = route.params as {
        nftseq: number
        playerCode: number
        nID: number
        isFirst: boolean
        toNavigate?: string
        isReward: boolean
        rewardCount: number
    }
    const getURL = () => {
        switch (params.nID) {
            case 202303 || 202305:
                return nftDetailImg.luxuryDraw
            case 202304 || 202306:
                return nftDetailImg.choiceCard
            case 202301 || 202302:
                return nftDetailImg.normalDraw
            default:
                return nftDetailImg.normalDraw
        }
    }
    return (
        <TouchableOpacity
            style={{ flex: 1, backgroundColor: Colors.BLACK, justifyContent: "center", flexDirection: "row" }}
            onPress={() => {
                setPause(true)
                navigate(Screen.OPENNFTSCREEN, params)
            }}
        >
            <Video
                source={getURL()}
                style={{ flex: 1 }}
                paused={pause}
                resizeMode="cover"
                onEnd={() => navigate(Screen.OPENNFTSCREEN, params)}
            />
            <View
                style={{
                    position: "absolute",
                    bottom: RatioUtil.height(10),
                    marginHorizontal: RatioUtil.width(10),
                    width: "100%",
                    height: RatioUtil.height(50),
                }}
            >
                <PretendText style={[styles.purchaseButtonTitle, { color: Colors.WHITE }]}>
                    아무 곳이나 터치해서 스킵하기
                </PretendText>
            </View>
        </TouchableOpacity>
    )
}
export default UnboxingVideo
