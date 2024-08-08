import { useFocusEffect } from "@react-navigation/native"
import { ISeasonDetail } from "apis/data/season.data"
import { jsonSvc, liveSvc, rewardSvc } from "apis/services"
import { homeImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { Colors } from "const"
import React, { useState } from "react"
import { Image } from "react-native"
import { ActivityIndicator, View } from "react-native"
import { Shadow } from "react-native-shadow-2"
import { liveStyle } from "styles"
import { GameUtil, RatioUtil } from "utils"

export const ExpectReward = ({ gameData }: IExpectRewardProps) => {
    const [loading, setLoading] = useState(false)
    const [expectReward, setExpectReward] = useState<number>()
    const [round, setRound] = useState(0)

    const getExpectReward = async () => {
        console.log("getExpectReward")
        if (!gameData) return
        const { data: roundData } = GameUtil.checkRound(gameData)
        const { current, prev, isEnd } = roundData.round
        const roundSeq = isEnd ? prev : current

        setLoading(true)
        const expectRewardValue = await rewardSvc.getTotalBdstForPlayerList(gameData)
        setExpectReward(Number(expectRewardValue))
        if (roundSeq === undefined || roundSeq === null) return
        setRound(roundSeq)
        setLoading(false)
    }
    useFocusEffect(
        React.useCallback(() => {
            getExpectReward()
        }, [round])
    )

    return (
        <View
            style={{
                // flexDirection: "row",
                justifyContent: "center",
                // alignContent: "center",
                alignItems: "center",
                marginTop: RatioUtil.height(30),
            }}
        >
            <Shadow distance={6} startColor="#0000000a" style={{ width: RatioUtil.width(320) }}>
                <CustomButton onPress={() => console.log(123)} style={{ borderRadius: RatioUtil.width(15) }}>
                    <View
                        style={{
                            width: RatioUtil.width(285),
                            marginTop: RatioUtil.lengthFixedRatio(20),
                            marginLeft: RatioUtil.width(20),
                            marginRight: RatioUtil.width(15),
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View
                            style={{
                                alignItems: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(16),
                                    color: Colors.BLACK,
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                }}
                            >
                                {/* 0707 hazel 조건 관련 텍스트 이슈로 수정 */}
                                {/* 획득 가능한\n예상 대회 보상량 */}
                                {jsonSvc.findLocalById("120008")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator size={"large"} color={Colors.GRAY10} />
                            ) : (
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(32),
                                        color: Colors.BLACK,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                    }}
                                >
                                    {/* {!mySquadData ? 0 : rewardBdst} */}
                                    {expectReward}
                                </PretendText>
                            )}

                            <Image
                                source={homeImg.coin}
                                style={{
                                    height: RatioUtil.width(40),
                                    width: RatioUtil.width(40),
                                    marginLeft: RatioUtil.width(6),
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            justifyContent: "space-around",
                            flexDirection: "row",
                            marginTop: RatioUtil.height(16),
                        }}
                    ></View>
                </CustomButton>
            </Shadow>
            <View>
                <View
                    style={[
                        liveStyle.nftTab.guideBox,
                        {
                            alignSelf: "center",
                        },
                    ]}
                >
                    <View style={[liveStyle.nftTab.guideTextBox]}>
                        {/* <PretendText style={liveStyle.nftTab.guideText}>{jsonSvc.findLocalById("110050")}</PretendText> */}
                        <PretendText style={liveStyle.nftTab.guideText}>
                            {" NFT의 에너지 및 발행연도 페널티와\n수수료가 적용된 예상 보상량입니다."}
                        </PretendText>
                    </View>
                </View>
            </View>
            <View
                style={{
                    backgroundColor: Colors.GRAY9,
                    width: "100%",
                    height: RatioUtil.lengthFixedRatio(10),
                }}
            />
        </View>
    )
}
interface IExpectRewardProps {
    gameData: ISeasonDetail | undefined
}
