import { View, Image, ScrollView, ImageBackground } from "react-native"
import React, { useEffect, useState } from "react"
import { CustomButton, PretendText } from "components/utils"
import { ErrorUtil, GameUtil, NumberUtil, RatioUtil, navigate } from "utils"
import { liveSvc } from "apis/services/live.svc"
import { ILeaderboard, ILikes, ISeasonDetail } from "apis/data/season.data"
import { CheerPickHelpPopup, MyRankModal, NftPlayerListPopup, Top3Player } from "./tab.cheerPick.compo"
import { useQuery, useWrapDispatch } from "hooks"
import { setPopUp } from "store/reducers/config.reducer"
import { jsonSvc, rankSvc } from "apis/services"
import { coninImg, homeImg, liveImg, nftDetailImg } from "assets/images"
import { AnalyticsEventName, Colors, Screen } from "const"
import nftPlayer from "json/nft_player.json"
import { TouchableOpacity } from "react-native-gesture-handler"
import ProfileImage from "components/utils/ProfileImage"
import { Shadow } from "react-native-shadow-2"
import { Analytics } from "utils/analytics.util"

const CheerPickTab = ({ gameData, triggerEffect, isEnd: gameEnd }: CheerPickTabProps) => {
    const [top3List, setTop3List] = useState<ILeaderboard[]>([])
    const [selectedPersonId, setSelectedPersonId] = useState<number>(0)
    const [selectIndex, setSelectIndex] = useState(0)
    const [prize, setPrize] = useState(0)

    const initailizedData = async (gameData?: ISeasonDetail) => {
        if (!gameData) return

        const {
            data: {
                round: { current, prev, isEnd },
            },
        } = GameUtil.checkRound(gameData)
        //setGameEnd(isEnd && current == 99)

        const roundSeq = isEnd ? prev : current //99면 끝
        if (roundSeq === undefined || roundSeq === null) return

        const leaderboards = await liveSvc.getLeaderboardEachRound(gameData, roundSeq)

        const totalPrize = await rankSvc.getAmount(gameData.gameId)
        const top3 = leaderboards
            ?.filter(({ rank }) => Number(rank) <= 3)
            ?.sort((p, c) => Number(p.rank) - Number(c.rank))
        if (top3?.length > 0 && selectedPersonId === 0) {
            setSelectedPersonId(top3[0].personId)
        }

        setTop3List(top3)
        setPrize(totalPrize.POOL_AMOUNT)
    }

    const isContract = nftPlayer.find(e => e.nPersonID === selectedPersonId)

    useEffect(() => {
        initailizedData(gameData)
    }, [gameData, triggerEffect])

    let prizeFloat = "0"
    try {
        prizeFloat = prize ? (prize.toString().split(".").length>=2?(prize.toString().split(".")[0] + "." + prize.toString().split(".")[1].slice(0, 1)):prize.toString()) : "0"
    } catch (e) {
        console.log(e)
        prizeFloat = "0"
    }
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: Colors.GRAY7,
                    ...RatioUtil.sizeFixedRatio(360, 1),
                }}
            />
            {top3List.length >= 3 ? (
                <>
                    <ScrollView style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    width: RatioUtil.lengthFixedRatio(360),
                                    height: RatioUtil.lengthFixedRatio(154),
                                }}
                            >
                                <Shadow
                                    startColor="#EDEDED"
                                    distance={20}
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(360),
                                        backgroundColor: "#FFFFFF",
                                        flexDirection: "row",
                                        paddingHorizontal: RatioUtil.width(20),
                                        paddingVertical: RatioUtil.height(20),
                                        justifyContent: gameEnd ? "center" : "space-between",
                                        alignItems: "center",
                                        borderBottomLeftRadius: RatioUtil.width(16),
                                        borderBottomRightRadius: RatioUtil.width(16),
                                    }}
                                >
                                    <>
                                        {gameEnd
                                            ? [0].map(playerIdx => {
                                                  const player = top3List[playerIdx]
                                                  return (
                                                      <Top3Player
                                                          key={player.personId}
                                                          player={player}
                                                          selectedPersonId={selectedPersonId}
                                                          onPress={() => {
                                                              setSelectedPersonId(player.personId)
                                                              setSelectIndex(playerIdx)
                                                          }}
                                                          gameData={gameData}
                                                          triggerEffect={triggerEffect}
                                                          isEnd={gameEnd}
                                                      />
                                                  )
                                              })
                                            : [1, 0, 2].map(playerIdx => {
                                                  const player = top3List[playerIdx]
                                                  return (
                                                      <Top3Player
                                                          key={player.personId}
                                                          player={player}
                                                          selectedPersonId={selectedPersonId}
                                                          onPress={() => {
                                                              setSelectedPersonId(player.personId)
                                                              setSelectIndex(playerIdx)
                                                          }}
                                                          gameData={gameData}
                                                          triggerEffect={triggerEffect}
                                                      />
                                                  )
                                              })}
                                    </>
                                </Shadow>
                            </View>

                            <CheerPeopleList
                                gamecode={gameData?.gameId}
                                playercode={selectedPersonId}
                                isContract={!!isContract}
                                prize={NumberUtil.denoteComma(Number(prizeFloat)).toString()}
                                selectIndex={selectIndex}
                                triggerEffect={triggerEffect}
                            />
                        </View>

                        {/* rankSvc.getAmount  , coninImg.birde2*/}
                        {/* rankSvc.userRankList mapping */}
                    </ScrollView>
                    {selectIndex === 0 ? (
                        <MyRankModal
                            playercode={selectedPersonId}
                            isContract={!!isContract}
                            gameData={gameData}
                            triggerEffect={triggerEffect}
                        />
                    ) : null}
                </>
            ) : (
                <DataException prize={NumberUtil.denoteComma(Number(prizeFloat)).toString()} />
            )}
        </View>
    )
}

export default CheerPickTab

interface CheerPickTabProps {
    gameData?: ISeasonDetail
    triggerEffect: boolean
    isEnd: boolean
}

export const CheerPeopleList = ({
    gamecode,
    playercode,
    isContract,
    prize,
    selectIndex,
    triggerEffect,
}: {
    gamecode?: number
    playercode: number
    isContract: boolean
    selectIndex: number
    prize: string
    triggerEffect: boolean
}) => {
    interface IUser {
        ICON_TYPE: number
        ICON_NAME: string
        NICK: string
        USER_SEQ: number
    }
    interface IUserRank {
        USER_SEQ: number
        SCORE: number
        RANK: number
        EXPECT_BDST: number
    }
    interface IRankProps {
        user: IUser[]
        rank: IUserRank[]
    }

    const [rankData, setRankData] = useState<IRankProps>({ user: [], rank: [] })
    const [data, setData] = useState(false)
    const popupDispatch = useWrapDispatch(setPopUp)

    const getData = async () => {
        if (!(gamecode && playercode)) return
        const response = await rankSvc.userRankList({
            gamecode,
            playercode,
            min: 1,
            max: 100,
        })
        const totalPrize = await rankSvc.getAmount(gamecode)

        if (!(response && totalPrize)) return

        setRankData({ user: response.USER_PROFILES, rank: response.RANK_USERS })
    }

    useEffect(() => {
        getData()
    }, [playercode, triggerEffect])

    const findUser = (userSeq: number) => rankData.user.find(e => e.USER_SEQ === userSeq)
    const transferScore = (num: number) => {
        let str = num.toString()
        let chunks = []
        while (str.length > 0) {
            chunks.unshift(str.slice(-3))
            str = str.slice(0, -3)
        }
        return chunks.join(",")
    }
    return (
        <View
            style={{
                marginTop: RatioUtil.lengthFixedRatio(25),
            }}
        >
            {isContract ? (
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            height: RatioUtil.lengthFixedRatio(25),
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: RatioUtil.lengthFixedRatio(20),
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                color: Colors.BLACK,
                                fontWeight: RatioUtil.fontWeightBold(),
                            }}
                        >
                            {/* 총 응원 상금 */}
                            {jsonSvc.findLocalById("140008")}
                        </PretendText>
                        <Image
                            source={liveImg.moneyCoin}
                            style={{
                                width: RatioUtil.height(17),
                                height: RatioUtil.height(17),

                                marginLeft: RatioUtil.width(5),

                                marginRight: RatioUtil.width(5),
                            }}
                            resizeMode="contain"
                        />

                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                color: Colors.BLACK,
                                fontWeight: RatioUtil.fontWeightBold(),
                            }}
                        >
                            {prize}
                        </PretendText>
                    </View>
                    {rankData.rank.length ? (
                        <ScrollView
                            style={{
                                width: RatioUtil.width(360),
                                borderTopLeftRadius: RatioUtil.width(20),
                                borderTopRightRadius: RatioUtil.width(20),
                                backgroundColor: Colors.WHITE,
                                paddingBottom: RatioUtil.lengthFixedRatio(100),
                            }}
                        >
                            <View
                                style={{
                                    marginTop: RatioUtil.lengthFixedRatio(20),
                                }}
                            >
                                <View
                                    style={{
                                        height: RatioUtil.lengthFixedRatio(18),
                                        width: RatioUtil.lengthFixedRatio(318),
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginLeft: RatioUtil.lengthFixedRatio(24),
                                        marginRight: RatioUtil.lengthFixedRatio(20),
                                        marginBottom: RatioUtil.lengthFixedRatio(10),
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(12),
                                            color: Colors.GRAY8,
                                            lineHeight: RatioUtil.font(18),
                                        }}
                                    >
                                        {/* 순위 */}
                                        {jsonSvc.findLocalById("7030")}
                                    </PretendText>

                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(12),
                                            color: Colors.GRAY8,
                                            marginLeft: RatioUtil.lengthFixedRatio(15),
                                            lineHeight: RatioUtil.font(18),
                                        }}
                                    >
                                        {/* 프로필 */}
                                        {jsonSvc.findLocalById("7031")}
                                    </PretendText>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(12),
                                                    marginRight: RatioUtil.width(5),
                                                    color: Colors.GRAY8,
                                                    // lineHeight: RatioUtil.font(18),
                                                }}
                                            >
                                                {/* 선수를 응원하고 보상을 받으세요! */}
                                                {jsonSvc.findLocalById("140009")}
                                            </PretendText>
                                            <TouchableOpacity
                                                style={{
                                                    // width: RatioUtil.lengthFixedRatio(12),
                                                    // height: RatioUtil.lengthFixedRatio(12),
                                                    padding: 3,
                                                }}
                                                activeOpacity={1}
                                                // hitSlop={{
                                                //     top: RatioUtil.height(0),
                                                //     bottom: RatioUtil.height(0),
                                                //     left: RatioUtil.height(0),
                                                //     right: RatioUtil.height(0),
                                                // }}
                                                onPress={() =>
                                                    popupDispatch({
                                                        open: true,
                                                        children: <CheerPickHelpPopup />,
                                                    })
                                                }
                                            >
                                                <Image
                                                    source={liveImg.help}
                                                    style={{
                                                        width: RatioUtil.lengthFixedRatio(12),
                                                        height: RatioUtil.lengthFixedRatio(12),
                                                    }}
                                                    resizeMode="contain"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ minHeight: RatioUtil.height(150) }}>
                                    {rankData.rank.map(e => {
                                        return (
                                            <View
                                                style={{
                                                    borderWidth: 1,
                                                    borderRadius: 8,
                                                    borderColor: "#EFEFEF",
                                                    width: RatioUtil.lengthFixedRatio(320),
                                                    height: RatioUtil.lengthFixedRatio(56),
                                                    marginLeft: RatioUtil.lengthFixedRatio(20),
                                                    marginRight: RatioUtil.lengthFixedRatio(20),
                                                    marginBottom: RatioUtil.lengthFixedRatio(7),
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <PretendText
                                                        style={{
                                                            fontSize: RatioUtil.font(14),
                                                            fontWeight: RatioUtil.fontWeightBold(),
                                                            marginLeft: RatioUtil.width(10),
                                                        }}
                                                    >
                                                        {e.RANK}
                                                    </PretendText>
                                                    <View
                                                        style={{
                                                            backgroundColor: "#EFEFEF",
                                                            width: 1,
                                                            height: RatioUtil.lengthFixedRatio(37),
                                                            marginLeft: RatioUtil.width(11),
                                                        }}
                                                    />

                                                    <CustomButton
                                                        style={{
                                                            marginLeft: RatioUtil.width(5),
                                                            padding: RatioUtil.width(5),
                                                        }}
                                                        onPress={async () => {
                                                            await Analytics.logEvent(
                                                                AnalyticsEventName.view_profile_160,
                                                                {
                                                                    hasNewUserData: true,
                                                                }
                                                            )
                                                            navigate(Screen.USERPROFILE, {
                                                                userSeq: e.USER_SEQ,
                                                            })
                                                        }}
                                                    >
                                                        <ProfileImage
                                                            name={findUser(e.USER_SEQ)?.ICON_NAME}
                                                            type={findUser(e.USER_SEQ)?.ICON_TYPE}
                                                            style={{
                                                                ...RatioUtil.sizeFixedRatio(34, 34),
                                                                borderRadius: 15,
                                                            }}
                                                        />
                                                    </CustomButton>

                                                    <View style={{ marginLeft: RatioUtil.width(12) }}>
                                                        <PretendText
                                                            style={{
                                                                fontSize: RatioUtil.font(14),
                                                                fontWeight: RatioUtil.fontWeightBold(),
                                                                color: Colors.BLACK,
                                                            }}
                                                        >
                                                            {findUser(e.USER_SEQ)?.NICK}
                                                        </PretendText>
                                                        <PretendText
                                                            style={{
                                                                fontSize: RatioUtil.font(12),
                                                                color: "#979797",
                                                            }}
                                                        >
                                                            {/* {transferScore(e.SCORE)}점 */}
                                                            {jsonSvc.formatLocal(jsonSvc.findLocalById("7033"), [
                                                                transferScore(e.SCORE),
                                                            ])}
                                                        </PretendText>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        width: "23%",
                                                    }}
                                                >
                                                    {selectIndex === 0 ? (
                                                        <Image
                                                            source={liveImg.moneyCoin}
                                                            style={{
                                                                width: RatioUtil.height(12),
                                                                height: RatioUtil.height(12),
                                                            }}
                                                        />
                                                    ) : (
                                                        <View
                                                            style={{
                                                                width: RatioUtil.height(12),
                                                                height: RatioUtil.height(12),
                                                            }}
                                                        />
                                                    )}

                                                    <PretendText
                                                        style={{
                                                            marginLeft: RatioUtil.width(6),

                                                            fontSize: RatioUtil.font(14),
                                                            fontWeight: RatioUtil.fontWeightBold(),
                                                        }}
                                                    >
                                                        {selectIndex === 0
                                                            ? // ? NumberUtil.denoteComma(Math.floor(e.EXPECT_BDST))
                                                              NumberUtil.denoteComma(Number(e.EXPECT_BDST.toFixed(1)))
                                                            : "-"}
                                                    </PretendText>
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        </ScrollView>
                    ) : null}
                </View>
            ) : (
                <ContractException prize={prize} />
            )}
        </View>
    )
}
export const ContractException = ({ prize }: { prize: string }) => {
    const popUpDispatch = useWrapDispatch(setPopUp)
    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
                style={{
                    height: RatioUtil.lengthFixedRatio(25),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: RatioUtil.lengthFixedRatio(21),
                    //marginTop: RatioUtil.lengthFixedRatio(14),
                }}
            >
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(16),
                        color: Colors.BLACK,
                        fontWeight: RatioUtil.fontWeightBold(),
                    }}
                >
                    {/* 총 응원 상금 */}
                    {jsonSvc.findLocalById("140008")}
                </PretendText>
                <Image
                    source={liveImg.moneyCoin}
                    style={{
                        width: RatioUtil.height(17),
                        height: RatioUtil.height(17),
                        marginLeft: RatioUtil.width(5),
                        marginRight: RatioUtil.width(5),
                    }}
                />

                <PretendText
                    style={{
                        fontSize: RatioUtil.font(16),
                        color: Colors.BLACK,
                        fontWeight: RatioUtil.fontWeightBold(),
                    }}
                >
                    {prize}
                </PretendText>
            </View>
            {/* <Image
                source={liveImg.notice}
                style={{
                    width: RatioUtil.height(50),
                    height: RatioUtil.height(50),
                    // marginTop: RatioUtil.height(20),
                    marginTop: RatioUtil.height(10),
                    marginBottom: RatioUtil.height(10),
                }}
            /> */}
            <PretendText
                style={{
                    fontSize: RatioUtil.font(14),
                    lineHeight: RatioUtil.font(14) * 1.3,
                    textAlign: "center",
                    color: Colors.GRAY2,
                }}
            >
                {/* 해당선수는 버디스쿼드
            </PretendText>
            <PretendText
                style={{
                    fontSize: RatioUtil.font(14),
                }}
            >
                NFT 선수가 아닙니다
            </PretendText>
            <PretendText
                style={{
                    fontSize: RatioUtil.font(14),
                }}
            >
                버디 스쿼드 NFT 선수가 우승할 경우
            </PretendText>
            <PretendText
                style={{
                    fontSize: RatioUtil.font(14),
                }}
            >
                응원픽 상금은 이월 됩니다. */}
                {jsonSvc.findLocalById("110208")}
            </PretendText>
            <CustomButton
                style={{
                    marginTop: RatioUtil.lengthFixedRatio(20),
                    width: RatioUtil.lengthFixedRatio(214),
                    height: RatioUtil.lengthFixedRatio(40),
                    justifyContent: "center",
                    alignItems: "center",
                    // borderWidth: 1,
                    borderRadius: 100,
                    backgroundColor: Colors.GRAY7,
                }}
                onPress={() =>
                    popUpDispatch({
                        open: true,
                        children: <NftPlayerListPopup />,
                    })
                }
            >
                <PretendText
                    style={{
                        color: Colors.BLACK,
                        fontSize: RatioUtil.font(14),
                        lineHeight: RatioUtil.font(14) * 1.3,
                        fontWeight: RatioUtil.fontWeightBold(),
                    }}
                >
                    {/* 버디스쿼드 NFT 선수목록 보기 */}
                    {jsonSvc.findLocalById("110209")}
                </PretendText>
            </CustomButton>
        </View>
    )
}
export const DataException = ({ prize }: { prize: string }) => {
    const popUpDispatch = useWrapDispatch(setPopUp)
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.WHITE,
                paddingBottom: RatioUtil.lengthFixedRatio(30),
            }}
        >
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(16),
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}
                    >
                        {/* 총 응원 상금 */}
                        {jsonSvc.findLocalById("140008")}
                    </PretendText>
                    <Image
                        source={liveImg.moneyCoin}
                        style={{
                            width: RatioUtil.height(16),
                            height: RatioUtil.height(16),
                            marginLeft: RatioUtil.width(5),
                            marginRight: RatioUtil.width(5),
                        }}
                        resizeMode="contain"
                    />

                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(18),
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}
                    >
                        {prize}
                    </PretendText>
                </View>
                <Image
                    source={liveImg.noData}
                    style={{
                        ...RatioUtil.size(100, 100),
                        marginTop: RatioUtil.height(51),
                        marginBottom: RatioUtil.height(10),
                    }}
                    resizeMode="contain"
                />
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        textAlign: "center",
                    }}
                >
                    {/* 해당 경기는 리더보드 데이터가 제공되지 않아
                </PretendText>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                    }}
                >
                    응원픽을 진행할 수 없는 경기입니다.
                </PretendText>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                    }}
                >
                    응원픽 상금은 이월 됩니다. */}
                    {jsonSvc.findLocalById("110210")}
                </PretendText>
                {/* <CustomButton
                    style={{
                        marginTop: RatioUtil.height(20),
                        width: RatioUtil.width(214),
                        height: RatioUtil.height(40),
                        justifyContent: "center",
                        alignItems: "center",
                        // borderWidth: 1,
                        borderRadius: 100,
                        backgroundColor: Colors.GRAY7,
                    }}
                    onPress={() =>
                        popUpDispatch({
                            open: true,
                            children: <NftPlayerListPopup />,
                        })
                    }
                >
                    <PretendText
                        style={{
                            color: Colors.BLACK,
                            fontSize: RatioUtil.font(14),
                            lineHeight: RatioUtil.font(14) * 1.3,
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}
                    >
                        버디스쿼드 NFT 선수목록 보기
                        {jsonSvc.findLocalById("110209")}
                    </PretendText>
                </CustomButton> */}
            </View>
        </View>
    )
}
