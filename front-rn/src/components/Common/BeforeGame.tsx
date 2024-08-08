import { View, Text, Pressable, Image } from "react-native"
import React, { useEffect, useState, memo } from "react"
import { DateUtil, RatioUtil, navigate } from "utils"
import { Colors, Screen } from "const"
import { WebView } from "react-native-webview"
import { KakaoLiveApi } from "apis/external/kakao.live.api"
import { useQuery } from "hooks"
import { PretendText } from "components/utils"
import { ISeasonDetail } from "apis/data/season.data"
import { jsonSvc } from "apis/services"
import { SvgIcon } from "./SvgIcon"

export const BeforeGame = memo(({ gameData }: { gameData?: ISeasonDetail }) => {
    const date = DateUtil.format(gameData?.BEGIN_AT)

    return (
        <View>
            <View
                style={{
                    backgroundColor: "white",
                    width: RatioUtil.width(360),
                }}
            >
                <Pressable
                    style={{
                        marginLeft: RatioUtil.width(16),
                        ...RatioUtil.sizeFixedRatio(30, 44),
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => {
                        navigate(Screen.BACK)
                    }}
                >
                    {/* <Image
                        resizeMode="contain"
                        style={{ width: RatioUtil.lengthFixedRatio(12), height: RatioUtil.lengthFixedRatio(18) }}
                        source={profileHeaderImg.arrow}
                    /> */}
                    <SvgIcon name="BackSvg" />
                </Pressable>
            </View>

            <View
                style={{
                    // position: "absolute",
                    // bottom: RatioUtil.height(100 - 36 - 10),
                    ...RatioUtil.sizeFixedRatio(360, 176),

                    backgroundColor: "rgba(0,0,0,0.8)",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    borderWidth: 1,
                }}
            >
                <View
                    style={{
                        ...RatioUtil.sizeFixedRatio(72, 30),
                        marginBottom: RatioUtil.lengthFixedRatio(10),
                        backgroundColor: Colors.WHITE,
                        borderRadius: RatioUtil.width(20),
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <PretendText style={{ fontSize: RatioUtil.font(14), fontWeight: "700" }}>
                        {/* 대회 예정 */}
                        {jsonSvc.findLocalById("120013")}
                    </PretendText>
                </View>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(24),
                        fontWeight: "600",
                        color: Colors.WHITE,
                        marginBottom: RatioUtil.lengthFixedRatio(10),
                        marginLeft: RatioUtil.width(15),
                        marginRight: RatioUtil.width(15),
                        textAlign: "center",
                    }}
                >
                    {gameData?.gameName ?? ""}
                </PretendText>
                <PretendText style={{ fontSize: RatioUtil.font(16), color: Colors.GRAY8 }}>
                    {/* {`${date.month}월 ${date.day}일 ${date.amPm} ${date.hour}:${date.minute}`} */}
                    {jsonSvc.formatLocal(jsonSvc.findLocalById("110000"), [
                        date.month.toString(),
                        date.day.toString(),
                        // ` ${date.hour}:${date.minute || "00"}`,
                        "",
                    ])}
                </PretendText>
            </View>
        </View>
    )
})
