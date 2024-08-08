import { ActivityIndicator, FlatList, Image, View } from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { GameUtil, navigate, RatioUtil } from "utils"
import { Colors, GameStatus, Screen } from "const"
import { CustomButton, PretendText } from "components/utils"
import { liveStyle } from "styles"
import BDSTPlayer from "components/BDSTPlayer"
import { homeImg, liveImg } from "assets/images"
import { jsonSvc, rewardSvc } from "apis/services"
import { IBdstPlayer, ISeasonDetail } from "apis/data/season.data"
import { useToggle } from "hooks"
import { ExpectReward } from "./tab.nft.compo"
import { Shadow } from "react-native-shadow-2"

const NftTab: React.FC<{ gameData?: ISeasonDetail }> = ({ gameData }) => {
    const [playerData, setPlayerData] = useState<IBdstPlayer[]>([])
    const [excludingCompensation, setExcludingCompensation] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [nftLength, setNftLength] = useState(0)
    const [playerFlag, playerToggle] = useToggle()
    const [excludePlayerFlag, excludePlayerToggle] = useToggle()
    const [selectPlayerIdx, setSelectPlayerIdx] = useState(-1)
    const [selectExcludeIdx, setSelectExcludeIdx] = useState(-1)
    const playerListRef = useRef<any>()
    const excludePlayertRef = useRef<any>()

    useEffect(() => {
        if (playerListRef.current) {
            playerListRef.current.scrollToIndex({
                animated: true,
                index: selectPlayerIdx,
                viewOffset: RatioUtil.height(-70),
            })
        }
    }, [playerFlag, selectPlayerIdx])

    useEffect(() => {
        if (excludePlayertRef.current) {
            excludePlayertRef.current.scrollToIndex({
                animated: true,
                index: selectExcludeIdx,
                viewOffset: RatioUtil.height(-70),
            })
        }
    }, [selectExcludeIdx, excludePlayerFlag])

    const [isEnd, setIsEnd] = useState(false)

    const setFlag = async (gameData?: ISeasonDetail) => {
        if (!gameData) return

        const isEnd = await rewardSvc.checkEndFlag(gameData)
        setIsEnd(isEnd)
    }

    useEffect(() => {
        initData(gameData)
        setFlag(gameData)
    }, [gameData])

    const initData = async (gameData?: ISeasonDetail) => {
        if (!gameData) return

        if (!playerData.length) {
            setLoading(true)
        }

        try {
            const { bdstPlayers, expectPlayer, myNftLength } = await rewardSvc.getTotalBdstForPlayerNow(gameData)

            setPlayerData(bdstPlayers)
            setExcludingCompensation(expectPlayer)
            setNftLength(myNftLength)

            // const { nftCountReward, nftGradeReward } = NftUtil.calcRewardByNftLength(expectRewardValue)
            // const numberNFT = nftCountReward + nftGradeReward
            // setPlayerData([...expectRewardValue.slice(0, numberNFT)])
            // setExcludingCompensation([...expectRewardValue.slice(numberNFT + 1, expectRewardValue.length)])
        } catch (error) {
            setPlayerData([])
            setExcludingCompensation([])
            setNftLength(0)
        }

        setLoading(false)
        // // const condition = (element: any) => {
        // //     return element.leaderboard?.find((lb: any) => lb.roundSeq == element?.round)?.playerStatus === "NORMAL"
        // // }

        // // const result = expectRewardValue.reduce<any>(
        // //     (acc, element) => {
        // //         if (condition(element)) {
        // //             acc.filteredArray.push(element)
        // //         } else {
        // //             acc.rejectedArray.push(element)
        // //         }
        // //         return acc
        // //     },
        // //     { filteredArray: [], rejectedArray: [] }
        // // )
        // setPlayerData([...result.filteredArray])
        // setExcludingCompensation([...result.rejectedArray])
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <View
                    style={{
                        backgroundColor: Colors.GRAY7,
                        ...RatioUtil.sizeFixedRatio(360, 1),
                    }}
                />
                <ActivityIndicator size={"large"} color={Colors.GRAY10} />
            </View>
        )
    }

    if (playerData.length <= 0 && excludingCompensation.length <= 0) {
        // return getEmptyView("보유한 NFT중에 참가한 선수가 없습니다.", false)
        return getEmptyView(jsonSvc.findLocalById("110326"), false)
    }
    if (!nftLength) {
        // return getEmptyView("보유한 NFT가 없습니다.", true)
        return getEmptyView(jsonSvc.findLocalById("110322"), true)
    }
    return (
        <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            <View
                style={{
                    backgroundColor: Colors.GRAY7,
                    ...RatioUtil.sizeFixedRatio(360, 1),
                }}
            />
            <>
                {/* <ExpectReward gameData={gameData} /> */}

                <FlatList
                    keyExtractor={data => data.nftSeq.toString()}
                    data={playerData}
                    extraData={playerData}
                    ref={playerListRef}
                    initialScrollIndex={0}
                    // numColumns={}
                    renderItem={({ item, index }) => (
                        <BDSTPlayer
                            onPress={() => {
                                setSelectPlayerIdx(index)
                                playerToggle()
                            }}
                            data={item}
                            index={index}
                            isEnd={gameData?.gameStatus === GameStatus.END}
                            gameData={gameData}
                        />
                    )}
                    ListHeaderComponent={
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: RatioUtil.height(30),
                            }}
                        >
                            <Shadow distance={6} startColor="#0000000a" style={{ width: RatioUtil.width(320) }}>
                                <CustomButton
                                    onPress={() => console.log(123)}
                                    style={{ borderRadius: RatioUtil.width(15) }}
                                >
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
                                                {jsonSvc.findLocalById(isEnd ? "120006" : "120008")}
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
                                                    {rewardSvc.getSumBdst(playerData)}
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
                    }
                />
            </>
        </View>
    )
}

export default NftTab

const getEmptyView = (msg: string, visibleButton: boolean) => {
    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                paddingBottom: RatioUtil.lengthFixedRatio(30),
                backgroundColor: Colors.WHITE,
            }}
        >
            <Image
                source={liveImg.noData}
                style={{
                    width: RatioUtil.width(100),
                    height: RatioUtil.width(100),
                    marginBottom: RatioUtil.lengthFixedRatio(10),
                }}
            />
            <PretendText
                style={[
                    liveStyle.nftTab.textTbd,
                    { color: Colors.GRAY2, marginBottom: RatioUtil.width(20), textAlign: "center" },
                ]}
            >
                {/* {isEndGame ? "출전기록이 없습니다." : "보유한 NFT가 없습니다."} */}
                {`${msg}`}
            </PretendText>
            {visibleButton == true && (
                <CustomButton style={liveStyle.nftTab.buttonNavigationCon} onPress={() => navigate(Screen.NFTTABSCENE)}>
                    <PretendText style={[liveStyle.nftTab.textTbd, { color: Colors.BLACK }]}>
                        {/* NFT 구매하기 */}
                        {jsonSvc.findLocalById("110323")}
                    </PretendText>
                </CustomButton>
            )}
        </View>
    )
}
