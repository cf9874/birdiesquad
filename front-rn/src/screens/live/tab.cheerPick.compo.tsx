// useEffect(() => {
//     const fetchCount = async () => {
//         if (selectedPersonId === null) return
//         const response = await rankSvc.userCount({
//             gamecode: gameData.gameId,
//             playercode: selectedPersonId,
//         })
//         setUserCountNum(response?.data.RANK_COUNT)
//     }

//     fetchCount()
// }, [selectedPersonId])

// useEffect(() => {
//     const fetchUserCount = async () => {
//         if (selectedPersonId) {
//             const response = await rankSvc.userCount({
//                 gamecode: gameData.gameId,
//                 playercode: selectedPersonId,
//             })

//             if (response.code === "SUCCESS") {
//                 const userCount = response.data.RANK_COUNT
//                 setUserCountNum(userCount)
//             }
//         }
//     }
//     fetchUserCount()
// }, [selectedPersonId])

import { ILeaderboard, ISeasonDetail } from "apis/data/season.data"
import { chatSvc, jsonSvc, liveSvc, profileSvc, rankSvc } from "apis/services"
import { coninImg, liveImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { useAppSelector, useWrapDispatch } from "hooks"
import { memo, useEffect, useMemo, useState } from "react"
import { Image, Platform, View, ScrollView } from "react-native"
import { setPopUp } from "store/reducers/config.reducer"
import { ConfigUtil, NumberUtil, RatioUtil, TextUtil } from "utils"
import nftPlayer from "json/nft_player.json"
import { Colors, GameStatus } from "const"
import { IMyRankList } from "apis/data/rank.data"
import { IMyProfile } from "apis/data"
import { SafeAreaView } from "react-native-safe-area-context"
import FastImage from "react-native-fast-image"

interface ITop3Player {
    player: ILeaderboard
    selectedPersonId: number
    onPress: () => void
    triggerEffect: boolean
    gameData?: ISeasonDetail
    isEnd?: boolean
}

export const Top3Player = ({ player, selectedPersonId, onPress, gameData, triggerEffect, isEnd }: ITop3Player) => {
    const [count, setCount] = useState(0)
    const [winnerStroke, setWinnerStroke] = useState<number>()

    const getCheerUserCount = async (gamecode?: number, playercode?: number) => {
        if (!(gamecode && playercode)) return
        //  nftJson을 참고하여 우리 선수일때만 업데이트해줘야함
        const isContract = nftPlayer.find(e => e.nPersonID === playercode)
        if (isContract) {
            const data = await rankSvc.userCount({ gamecode, playercode })
            if (!data) return
            setCount(data.RANK_COUNT)
        } else {
            setCount(-1)
        }
    }
    const getWinnerData = async () => {
        if (!gameData) return
        const data = await liveSvc.getLeaderboardByPlayer(gameData, player.GAME_CODE, player.PLAYER_CODE)
        if (!data) return
        const winnerStroke = data.reduce((acc, cur) => {
            acc = acc + cur.roundStroke
            return acc
        }, 0)
        setWinnerStroke(winnerStroke)
    }

    const popUpDispatch = useWrapDispatch(setPopUp)
    useEffect(() => {
        getCheerUserCount(gameData?.GAME_CODE, player?.personId)
        getWinnerData()
    }, [gameData, player?.personId, triggerEffect])
    return (
        <CustomButton
            style={{
                ...RatioUtil.sizeFixedRatio(100, 114),
                borderRadius: RatioUtil.lengthFixedRatio(10),
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: player.personId === selectedPersonId ? "#5465FF" : "#E6E6E6",
            }}
            onPress={onPress}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <View
                    style={{
                        ...RatioUtil.sizeFixedRatio(23, 18),
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#EAE8FF",
                        borderRadius: RatioUtil.lengthFixedRatio(5),
                        marginTop: RatioUtil.lengthFixedRatio(8),
                        marginBottom: RatioUtil.lengthFixedRatio(7),
                    }}
                >
                    <PretendText style={{ fontSize: RatioUtil.font(10), color: "#5465FF" }}>
                        {/* {isEnd ? 우승 : {player.rank}위 }*/}
                        {isEnd
                            ? jsonSvc.findLocalById("7029")
                            : jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [player.rank])}
                    </PretendText>
                </View>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        marginBottom: RatioUtil.lengthFixedRatio(4),
                    }}
                >
                    {player.nameMain}
                </PretendText>
                <View style={{ height: RatioUtil.lengthFixedRatio(14), marginBottom: RatioUtil.lengthFixedRatio(12) }}>
                    {/* 현재 테스트 조건 : 0명인 경우 */}
                    {count > -1 ? (
                        <PretendText style={{ fontSize: RatioUtil.font(12), color: Colors.PURPLE7 }}>
                            {/* {gameData?.gameStatus === GameStatus.END ? `${count}명 응원` : `${count}명 응원 중`} */}
                            {gameData?.gameStatus === GameStatus.END
                                ? `${count}명 응원`
                                : jsonSvc.formatLocal(jsonSvc.findLocalById("140011"), [count.toString()])}
                        </PretendText>
                    ) : null}
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    width: RatioUtil.lengthFixedRatio(98),
                    height: RatioUtil.lengthFixedRatio(33),
                    backgroundColor: "#F9F9F9",
                    borderColor: "#E6E6E6",
                    borderTopWidth: 1,
                    borderBottomLeftRadius: RatioUtil.lengthFixedRatio(10),
                    borderBottomRightRadius: RatioUtil.lengthFixedRatio(10),
                }}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: "#E6E6E6",
                        borderRightWidth: 1,
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(12),
                            color: "#000000",
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}
                    >
                        {player.totalScore}
                    </PretendText>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <PretendText style={{ fontSize: RatioUtil.font(12), color: "#9B9BA3" }}>
                        {/* {player.startHole}홀 */}
                        {isEnd
                            ? winnerStroke
                            : isNaN(Number(player.hole))
                            ? player.hole
                            : jsonSvc.formatLocal(jsonSvc.findLocalById("7034"), [player.hole.toString()])}
                    </PretendText>
                </View>
            </View>
        </CustomButton>
    )
}
// 응원픽 도움말 팝업
export const CheerPickHelpPopup = () => {
    const popUpDispatch = useWrapDispatch(setPopUp)
    return (
        <SafeAreaView
            style={{
                position: "absolute",
                bottom: 0,
                ...RatioUtil.size(360, 611),
                backgroundColor: "white",
                paddingTop: RatioUtil.lengthFixedRatio(40),
                paddingLeft: RatioUtil.width(20),
                paddingRight: RatioUtil.width(15),
                borderTopLeftRadius: RatioUtil.width(10),
                borderTopRightRadius: RatioUtil.width(10),
            }}
        >
            <ScrollView
                style={{
                    width: RatioUtil.width(360),
                    paddingBottom: RatioUtil.height(150),
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: RatioUtil.lengthFixedRatio(20),
                        width: RatioUtil.width(320),
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(16),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: "#000000",
                        }}
                    >
                        {/* 응원픽 도움말 */}
                        {jsonSvc.findLocalById("910000")}
                    </PretendText>
                    <CustomButton
                        onPress={() =>
                            popUpDispatch({
                                open: false,
                            })
                        }
                    >
                        <Image source={liveImg.circleClose} />
                    </CustomButton>
                </View>
                <View
                    style={{
                        width: RatioUtil.lengthFixedRatio(325),
                        padding: RatioUtil.lengthFixedRatio(20),
                        borderWidth: 1,
                        borderColor: "#E9ECEF",
                        borderRadius: RatioUtil.width(10),
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: "#000000",
                            marginBottom: RatioUtil.lengthFixedRatio(7),
                        }}
                    >
                        {/* 응원 상금 */}
                        {jsonSvc.findLocalById("910001")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: "400",
                            lineHeight: RatioUtil.font(14) * 1.4,
                            color: "#87878D",
                            letterSpacing: RatioUtil.font(-0.28),
                            marginBottom: RatioUtil.lengthFixedRatio(5),
                        }}
                    >
                        {/* 응원 상금은 BDST를 사용하여 각종 서비스를 이용할 때 발생하는 수수료의 10%를 모은
                    금액입니다.(상금에서 소수점 2자리 밑으로는 소각 처리) */}
                        {jsonSvc.findLocalById("910002")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: "400",
                            lineHeight: RatioUtil.font(14) * 1.4,
                            color: "#87878D",
                            letterSpacing: RatioUtil.font(-0.28),
                            marginBottom: RatioUtil.lengthFixedRatio(5),
                        }}
                    >
                        {/* 이전 시즌에 모인 금액을 다음 시즌의 응원픽 상금으로 사용합니다. */}
                        {jsonSvc.findLocalById("910003")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: "400",
                            lineHeight: RatioUtil.font(14) * 1.4,
                            color: "#87878D",
                            letterSpacing: RatioUtil.font(-0.28),
                            marginBottom: RatioUtil.lengthFixedRatio(5),
                        }}
                    >
                        {/* 최종 우승한 선수를 응원한 팬들이 상금을 나눠 가지게 됩니다. */}
                        {jsonSvc.findLocalById("910004")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: "400",
                            lineHeight: RatioUtil.font(14) * 1.4,
                            color: "#87878D",
                            letterSpacing: RatioUtil.font(-0.28),
                            marginBottom: RatioUtil.lengthFixedRatio(14),
                        }}
                    >
                        {/* 버디스쿼드 NFT 선수가 아닌 선수가 우승할 경우 상금은 이월됩니다. */}
                        {jsonSvc.findLocalById("910005")}
                    </PretendText>
                    <CustomButton
                        style={{
                            height: RatioUtil.lengthFixedRatio(34),
                            paddingHorizontal: RatioUtil.lengthFixedRatio(14),
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 100,
                            backgroundColor: Colors.GRAY7,
                            marginBottom: RatioUtil.lengthFixedRatio(14),
                        }}
                        onPress={() => {
                            popUpDispatch({
                                open: true,
                                children: <NftPlayerListPopup />,
                            })
                        }}
                    >
                        <PretendText
                            style={{
                                color: Colors.BLACK,
                                fontSize: RatioUtil.font(13),
                                lineHeight: RatioUtil.font(13) * 1.3,
                                fontWeight: RatioUtil.fontWeightBold(),
                            }}
                        >
                            {/* 버디스쿼드 NFT 선수 목록 보기 */}
                            {jsonSvc.findLocalById("110209")}
                        </PretendText>
                    </CustomButton>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: "#000000",
                            marginBottom: RatioUtil.lengthFixedRatio(7),
                        }}
                    >
                        {/* 상금 지급 방식 */}
                        {jsonSvc.findLocalById("910007")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            lineHeight: RatioUtil.font(14) * 1.4,
                            fontWeight: "400",
                            color: "#87878D",
                            marginBottom: RatioUtil.lengthFixedRatio(5),
                        }}
                    >
                        {/* 상금 50%를 모두 동일하게 분배합니다. */}
                        {jsonSvc.findLocalById("910008")}
                    </PretendText>
                    {/* <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        lineHeight: RatioUtil.font(14) * 1.4,
                        fontWeight: "400",
                        color: "#87878D",
                        marginBottom: RatioUtil.height(3),
                    }}
                >
                    (1~3위 포함)
                </PretendText> */}
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            lineHeight: RatioUtil.font(14) * 1.4,
                            fontWeight: "400",
                            color: "#87878D",
                            marginBottom: RatioUtil.lengthFixedRatio(20),
                        }}
                    >
                        {/* 1 ~ 10위에게 각각 30%, 10%, 5%, 0.71%의 보상을 추가로 지급합니다. */}
                        {jsonSvc.findLocalById("910009")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: "#000000",
                            marginBottom: RatioUtil.lengthFixedRatio(7),
                        }}
                    >
                        {/* 응원 순위 산정 */}
                        {jsonSvc.findLocalById("910010")}
                    </PretendText>

                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            lineHeight: RatioUtil.font(14) * 1.4,
                            fontWeight: "400",
                            color: "#87878D",
                        }}
                    >
                        {/* 응원 순위는 응원 점수가 높은 순서대로 순위를 산정 하며, 응원 점수란 응원톡 점수와 응원볼 점수를
                    합산한 점수입니다. 응원톡 점수는 후원 당시의 BDST 가치를 판단하여 점수를 부여하며, 응원볼은 응원볼을
                    1개씩 소모할 때마다 점수를 부여합니다. */}
                        {jsonSvc.findLocalById("910011")}
                    </PretendText>
                    {/* <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: "#000000",
                    }}
                >
                    응원 순위는 1분마다 갱신됩니다.
                </PretendText> */}
                </View>
                <View
                    style={{
                        width: "100%",
                        height: RatioUtil.height(50),
                    }}
                ></View>
            </ScrollView>
        </SafeAreaView>
    )
}
//버디스쿼드 NFT 선수목록 팝업
export const NftPlayerListPopup = () => {
    const popUpDispatch = useWrapDispatch(setPopUp)
    return (
        <View
            style={{
                position: "absolute",
                bottom: 0,
                ...RatioUtil.size(360, 612),
                backgroundColor: "white",
                paddingTop: RatioUtil.lengthFixedRatio(40),
                paddingHorizontal: RatioUtil.lengthFixedRatio(20),
                borderTopLeftRadius: RatioUtil.lengthFixedRatio(10),
                borderTopRightRadius: RatioUtil.lengthFixedRatio(10),
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: RatioUtil.lengthFixedRatio(20),
                }}
            >
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(16),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: "#000000",
                    }}
                >
                    {/* 버디스쿼드 NFT 선수 목록 */}
                    {jsonSvc.findLocalById("910012")}
                </PretendText>
                <CustomButton
                    onPress={() =>
                        popUpDispatch({
                            open: false,
                        })
                    }
                >
                    <Image source={liveImg.circleClose} />
                </CustomButton>
            </View>
            <ScrollView
                contentContainerStyle={{
                    flexDirection: "row",
                    width: RatioUtil.width(320),
                    //paddingTop: RatioUtil.height(12),
                    //paddingBottom: RatioUtil.height(12),
                }}
            >
                <View
                    style={{
                        paddingHorizontal: RatioUtil.lengthFixedRatio(12),
                        paddingVertical: RatioUtil.lengthFixedRatio(18),

                        borderWidth: 1,
                        borderColor: "#E9ECEF",
                        borderRadius: RatioUtil.width(10),
                        flexDirection: "row",

                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",

                        marginBottom: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    {nftPlayer.map((e, i) => (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                // justifyContent: "center",
                                width: RatioUtil.width(147),
                                // paddingBottom: RatioUtil.height(10),
                                marginBottom: RatioUtil.lengthFixedRatio(20),
                                // marginLeft: (i % 2) * RatioUtil.width(5),
                            }}
                            key={i}
                        >
                            <View
                                style={{
                                    backgroundColor: "#E9ECEF",
                                    height: RatioUtil.lengthFixedRatio(45),
                                    width: RatioUtil.lengthFixedRatio(45),
                                    borderRadius: RatioUtil.lengthFixedRatio(55),
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <FastImage
                                    source={{ uri: ConfigUtil.getPlayerImage(e.sPlayerImagePath) }}
                                    style={{
                                        height: RatioUtil.lengthFixedRatio(45),
                                        width: RatioUtil.lengthFixedRatio(45),

                                        borderRadius: RatioUtil.lengthFixedRatio(55),
                                    }}
                                />
                            </View>
                            <View style={{ marginLeft: RatioUtil.width(5) }}>
                                <PretendText style={{ fontSize: RatioUtil.font(14), color: Colors.BLACK }}>
                                    {TextUtil.ellipsis(e.sPlayerName)}
                                </PretendText>
                                <PretendText style={{ fontSize: RatioUtil.font(12), color: Colors.GRAY2 }}>
                                    {TextUtil.ellipsis(e.sTeam)}
                                </PretendText>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}
//내 응원 순위 모달
export const MyRankModal = ({
    triggerEffect,
    playercode,
    isContract,
    gameData,
}: {
    gameData?: ISeasonDetail
    triggerEffect: boolean
    playercode: number
    isContract: boolean
}) => {
    //rankSvc.myRank
    const [myPlayer, setMyPlayer] = useState<IMyRankList>()
    const [myData, setMyData] = useState<IMyProfile>()
    const getRank = async () => {
        if (!gameData) return
        const myPlayer = await rankSvc.myRank({ gamecode: gameData?.GAME_CODE, playercode })
        setMyPlayer(myPlayer)
        const myData = await profileSvc.getMyProfile()
        setMyData(myData)
    }
    useEffect(() => {
        getRank()
    }, [gameData, playercode, triggerEffect])

    if (!isContract) return null
    return (
        <>
            {/* {myPlayer?.RANK_USERS.length && myPlayer?.USER_PROFILES ? ( */}
            {myPlayer?.RANK_USERS.length && myPlayer?.RANK_USERS ? (
                <View
                    style={{
                        ...RatioUtil.size(340, 42),
                        backgroundColor: "#00000066",
                        alignSelf: "center",
                        position: "absolute",
                        bottom: RatioUtil.height(30),
                        flexDirection: "row",
                        borderRadius: RatioUtil.width(6),
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: RatioUtil.width(10),
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View
                            style={{
                                ...RatioUtil.size(36, 18),
                                backgroundColor: "#000000",
                                borderRadius: RatioUtil.width(5),
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: RatioUtil.width(8),
                            }}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(10),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: "#FFFFFF",
                                }}
                            >
                                {jsonSvc.findLocalById("110207")}
                            </PretendText>
                        </View>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: "#FFFFFF",
                            }}
                        >
                            {myPlayer?.RANK_USERS[0]?.RANK === -1
                                ? jsonSvc.findLocalById("150101")
                                : myPlayer?.RANK_USERS[0]?.RANK}
                        </PretendText>
                        <View
                            style={{
                                width: 1,
                                height: RatioUtil.height(16),
                                backgroundColor: "#E9ECEF",
                                marginHorizontal: RatioUtil.width(8),
                            }}
                        />
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: "#FFFFFF",
                            }}
                        >
                            {/* {myPlayer?.USER_PROFILES[0]?.NICK} */}
                            {myData?.NICK ?? ""}
                        </PretendText>
                        <View
                            style={{
                                width: 2,
                                height: 2,
                                borderRadius: 1,
                                backgroundColor: "#C7C7C7",
                                marginHorizontal: RatioUtil.width(5),
                            }}
                        />
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: "normal",
                                color: "#C7C7C7",
                            }}
                        >
                            {myPlayer?.RANK_USERS[0]?.SCORE}
                        </PretendText>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={liveImg.moneyCoin} style={{ ...RatioUtil.size(12, 12) }} />
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: "#FFFFFF",
                                marginLeft: RatioUtil.width(4),
                                marginRight: RatioUtil.width(20),
                            }}
                        >
                            {NumberUtil.denoteComma(Number(myPlayer.RANK_USERS[0].EXPECT_BDST.toFixed(1)))}
                        </PretendText>
                    </View>
                </View>
            ) : null}
        </>
    )
}
