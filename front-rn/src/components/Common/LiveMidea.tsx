import { View, Text } from "react-native"
import React, { useEffect, useState } from "react"
import { RatioUtil } from "utils"
import { Colors } from "const"
import { WebView } from "react-native-webview"
import { KakaoLiveApi } from "apis/external/kakao.live.api"
import { useQuery } from "hooks"
import { PretendText } from "components/utils"

export const LiveMidea = ({
    gameData,
    setLink,
    link,
}: {
    gameData?: any
    setLink?: React.Dispatch<React.SetStateAction<string>>
    link?: string
}) => {
    // useEffect(() => {
    //     if (gameData) {
    //         if (gameData?.op?.onair) {
    //             setLink(
    //                 `https://tv.kakao.com/embed/player/livelink/${gameData?.op?.liveLinkId}?service=kakao_tv&type=LIVE`
    //             )
    //         }
    //     }
    //     //https://play-tv.kakao.com/embed/player/cliplink/${""}?service=kakao_tv
    // }, [gameData?.op?.onair])

    return (
        <View style={{ ...RatioUtil.size(360, 200), backgroundColor: Colors.PURPLE2 }}>
            {/* <WebView
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: Colors.BLACK,
                }}
                source={{
                    html: `<iframe height='100%' width='100%' allowfullscreen frameborder='0' scrolling='no' src='${link}'/>`,
                }}
            /> */}
        </View>
    )
}
