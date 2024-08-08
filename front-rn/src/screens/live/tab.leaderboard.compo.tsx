import React, { useCallback, useEffect, useState, useRef } from "react"
import { View, Image, StyleSheet, ViewStyle, Touchable, ActivityIndicator } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { NumberUtil, RatioUtil, TextUtil } from "utils"
import { CustomButton, PretendText } from "components/utils"
import { liveSvc } from "apis/services/live.svc"
import { liveImg } from "assets/images"
import { ICourse, IHole, ILeaderboard, ISeasonDetail } from "apis/data/season.data"
import { IBoardHeader, ILeaderboardByRender, IplayerScore, Order, RankItemProps, Status } from "./tab.leaderboard.type"
import LinearGradient from "react-native-linear-gradient"
import { Colors, GameStatus } from "const"
import { TouchableOpacity } from "react-native-gesture-handler"
import { jsonSvc } from "apis/services"
// import AnimatedLottieView from "lottie-react-native"
import { styles } from "components/BDSTPlayer/styles"
import FastImage from "react-native-fast-image"
// import lotties from "assets/lotties"

export const BoardHeader = ({ status, leaderboardData, setLeaderboardData, endStatus }: IBoardHeader) => {
    const [currentOrder, setCurrentOrder] = useState<string>("rank")
    const [order, setOrder] = useState<Order>("asc")
    const [orderByName, setOrderByName] = useState<Order>("asc")

    const updateLeaderboardData = (status: Status, order: Order) => {
        setLeaderboardData(prev => ({ ...prev, [status]: sortByRank(status, order) }))
    }
    const updateLeaderboardDataByName = (status: Status, order: Order) => {
        setLeaderboardData(prev => ({ ...prev, [status]: sortByName(status, order) }))
    }

    useEffect(() => {
        if (status === "like") {
            if (currentOrder === "rank") {
                updateLeaderboardData(status, order)
            } else if (currentOrder === "name") {
                updateLeaderboardDataByName(status, orderByName)
            }
        }
    }, [leaderboardData?.like?.length, currentOrder, order, orderByName, status])

    const toggleSortOrder = (status: Status) => {
        let newOrder = order
        if (currentOrder === "rank") newOrder = order === "asc" ? "desc" : "asc"

        setCurrentOrder("rank")
        setOrder(newOrder)
        updateLeaderboardData(status, newOrder)
    }

    const toggleSortOrderByName = (status: Status) => {
        let newOrder = orderByName
        if (currentOrder === "name") newOrder = orderByName === "asc" ? "desc" : "asc"

        setCurrentOrder("name")
        setOrderByName(newOrder)
        updateLeaderboardDataByName(status, newOrder)
    }

    const sortByRank = (status: Status, order: Order) => {
        const matchedData = leaderboardData[status]

        if (!matchedData) {
            return []
        }

        const cutoffIndex = matchedData.findIndex(item => item.nameMain === "cutoff")

        const filteredData = matchedData.filter((item, index) => index !== cutoffIndex && item.playerStatus !== "CUT")

        const sortedData = filteredData.sort((a, b) => {
            if (order === "asc") {
                return Number(a.rank) - Number(b.rank)
            } else {
                return Number(b.rank) - Number(a.rank)
            }
        })

        if (cutoffIndex !== -1) {
            sortedData.splice(cutoffIndex, 0, matchedData[cutoffIndex])
        }

        return sortedData
    }

    const sortByName = (status: Status, order: Order) => {
        const matchedData = leaderboardData[status]

        if (!matchedData) {
            return []
        }

        const cutoffIndex = matchedData.findIndex(item => item.nameMain === "cutoff")

        const filteredData = matchedData.filter((item, index) => index !== cutoffIndex && item.playerStatus !== "CUT")

        const sortedData = filteredData.sort((a, b) => {
            if (order === "asc") {
                return a.nameMain.localeCompare(b.nameMain)
            } else {
                return b.nameMain.localeCompare(a.nameMain)
            }
        })

        if (cutoffIndex !== -1) {
            sortedData.splice(cutoffIndex, 0, matchedData[cutoffIndex])
        }

        return sortedData
    }

    const rotation = order === "asc" ? 0 : 180
    const rotationByName = orderByName === "asc" ? 0 : 180
    return (
        <View
            style={{
                ...RatioUtil.sizeFixedRatio(360, 40),
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderBottomColor: "#DFDFDF",
                borderBottomWidth: 1,
            }}
        >
            <View
                style={{
                    flex: 1.2,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => toggleSortOrder(status)}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            lineHeight: RatioUtil.font(14) * 1.3,
                            color: "#000000",
                        }}
                    >
                        {/* 순위 */}
                        {jsonSvc.findLocalById("7030")}
                    </PretendText>
                    {currentOrder === "rank" && (
                        <Image
                            source={liveImg.rankToggle}
                            style={[
                                { transform: [{ rotate: `${rotation}deg` }] },
                                { position: "absolute", bottom: RatioUtil.lengthFixedRatio(3) },
                            ]}
                        />
                    )}
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 1.8,
                    alignItems: "flex-start",
                    justifyContent: "center",
                }}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => toggleSortOrderByName(status)}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            lineHeight: RatioUtil.font(14) * 1.3,
                            color: "#87878D",
                        }}
                    >
                        {/* 선수명 */}
                        {jsonSvc.findLocalById("7045")}
                    </PretendText>
                    {currentOrder === "name" && (
                        <Image
                            source={liveImg.rankToggle}
                            style={[
                                { transform: [{ rotate: `${rotationByName}deg` }] },
                                {
                                    position: "absolute",
                                    bottom: RatioUtil.lengthFixedRatio(3),
                                },
                            ]}
                        />
                    )}
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: "#87878D",
                    }}
                >
                    {/* Total */}
                    {jsonSvc.findLocalById("7046")}
                </PretendText>
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: "#87878D",
                    }}
                >
                    {endStatus ? jsonSvc.findLocalById("7049") : jsonSvc.findLocalById("7047")}
                </PretendText>
            </View>
            <View style={{ flex: endStatus ? 1.6 : 1, alignItems: "center", justifyContent: "center" }}>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: "#87878D",
                    }}
                >
                    {endStatus ? jsonSvc.findLocalById("7050") : jsonSvc.findLocalById("7048")}
                </PretendText>
            </View>
        </View>
    )
}

export const Cutoff = () => {
    return (
        <View
            style={{
                ...RatioUtil.size(360, 44),
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                backgroundColor: "#FFFFFF",
            }}
        >
            <View style={{ height: 1, backgroundColor: "#C7C7C7", width: RatioUtil.width(140) }} />
            <PretendText
                style={{
                    fontSize: RatioUtil.font(14),
                    fontWeight: RatioUtil.fontWeightBold(),
                    color: "#66666B",
                    marginHorizontal: RatioUtil.width(7),
                }}
            >
                {/* 컷오프/탈락 */}
                {jsonSvc.findLocalById("110514")}
            </PretendText>
            <View style={{ height: 1, backgroundColor: "#C7C7C7", width: RatioUtil.width(140) }} />
        </View>
    )
}

const RankItem = ({
    rankTiedCheck,
    rank,
    nameMain,
    totalScore,
    hole,
    isPro,
    personId,
    like,
    prize,
    playerStatus,
    playerImage,
    roundSeq,
    roundScore,
    roundStroke,
    gameData,
    endStatus,
    courseInfo,
    myPlayerData,
    setLeaderboardData,
}: RankItemProps) => {
    const [toggleItem, setToggleItem] = useState(false)
    const [selectRound, setSelectRound] = useState(roundSeq)
    const [selectedRoundScore, setSelectedRoundScore] = useState(roundScore)
    const [courseData, setCourseData] = useState<IplayerScore>()
    const [graphLoader, setgraphLoader] = useState(false)

    const scoreArray = [
        { name: jsonSvc.findLocalById("110523"), condition: (diff: number) => diff <= -2, color: "#FF686B" },
        { name: jsonSvc.findLocalById("110524"), condition: (diff: number) => diff === -1, color: "#FF686B50" },
        { name: jsonSvc.findLocalById("110313"), condition: (diff: number) => diff === 0, color: "#FFFFFF" },
        { name: jsonSvc.findLocalById("110526"), condition: (diff: number) => diff === 1, color: "#A1EF7A" },
        { name: jsonSvc.findLocalById("110527"), condition: (diff: number) => diff >= 2, color: "#FFA65B" },
    ]

    const getScoreColor = (scoreDiff: number): string => {
        const scoreDiffToColorMap: Record<string, { condition: (diff: number) => boolean; color: string }> =
            scoreArray.reduce((map, { name, condition, color }) => {
                return {
                    ...map,
                    [name]: {
                        condition,
                        color,
                    },
                }
            }, {})

        const colorKey = Object.keys(scoreDiffToColorMap).find(key => scoreDiffToColorMap[key].condition(scoreDiff))

        return colorKey ? scoreDiffToColorMap[colorKey].color : "#000000"
    }

    const handlePressRound = (round: number) => async () => {
        if (!gameData) return // React.Dispatch<React.SetStateAction<number>>
        setSelectRound(round)

        // const data = await liveSvc.getLeaderboardEachRound(gameData, round)

        // const data = await getLeaderBoardData(gameData, roundSeq)
        // const selectedPerson = data.find(e => e.personId === personId)

        // if (selectedPerson) setSelectedRoundScore(selectedPerson.roundScore)
    }
    const fetchData = async () => {
        if (!gameData || !courseInfo) return

        // 플레이어 점수
        // const data = await getPlayerHoleData(gameData, personId)
        const data = await liveSvc.getHoleByPlayer(gameData.GAME_CODE, personId)
        const selectedHole = data.find(e => e.roundSeq === selectRound)

        const onlyHole = []

        for (const key in selectedHole) {
            if (key.includes("hole")) onlyHole.push(selectedHole[key as keyof IHole])
        }

        const outCourses = liveSvc.filterByHoleRange(courseInfo, 1, 9)
        const inCourses = liveSvc.filterByHoleRange(courseInfo, 10, 18)
        const outScore = onlyHole.filter((_, i) => i >= 0 && i < 9).map(score => score)
        const inScore = onlyHole.filter((_, i) => i >= 9 && i < 18).map(score => score)

        const cousre = {
            coursesInfo: courseInfo.filter(e => e.hole),
            outCourses,
            inCourses,
            outTotal: NumberUtil.sum(outCourses),
            inTotal: NumberUtil.sum(inCourses),
        }

        const hole = {
            outTotal: NumberUtil.sum(outScore),
            inTotal: NumberUtil.sum(inScore),
            outDiff: outScore.map((score, i) => score!='0'?Number(score) - Number(outCourses[i]):0),
            inDiff: inScore.map((score, i) => score!='0'?Number(score) - Number(inCourses[i]):0),
        }

        const playerScore = {
            inCourses,
            outCourses,
            outScore,
            inScore,
            cousre,
            hole,
        }

        setCourseData(playerScore)
        setSelectedRoundScore(NumberUtil.sum(hole.outDiff) + NumberUtil.sum(hole.inDiff))
    }
    useEffect(() => {
        if (toggleItem) {
            fetchData()
        }
    }, [gameData, personId, selectRound, toggleItem])

    useEffect(() => {
        setgraphLoader(!courseData)
    }, [courseData])

    if (nameMain === "cutoff") {
        return <Cutoff />
    }

    // const [isScrolling, setIsScrolling] = useState(false)

    // const handleScrollBegin = () => {
    //     setIsScrolling(true)
    // }

    // const handleScrollEnd = () => {
    //     setIsScrolling(false)
    // }

    const totalRoundStroke = myPlayerData.reduce((total, player) => total + player.roundStroke, 0)

    return (
        <View>
            {!toggleItem ? (
                <TouchableOpacity onPress={() => setToggleItem(prevState => !prevState)} key={personId}>
                    <View
                        style={{
                            ...RatioUtil.sizeFixedRatio(360, 40),
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FFFFFF",
                        }}
                    >
                        <View style={{ flex: 1.2, alignItems: "center", justifyContent: "center" }}>
                            <PretendText style={{ fontSize: RatioUtil.font(14), fontWeight: "400", color: "#000000" }}>
                                {playerStatus === "NORMAL"
                                    ? rankTiedCheck
                                        ? "T" + rank
                                        : rank
                                    : hole.includes(":")
                                    ? "-"
                                    : playerStatus}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flex: 1.8,
                                alignItems: "center",
                                justifyContent: "flex-start",
                                flexDirection: "row",
                            }}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "400",
                                    color: "#000000",
                                    alignSelf: "center",
                                }}
                            >
                                {TextUtil.ellipsis(nameMain, 6)}
                            </PretendText>
                            {!isPro && (
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(12),
                                        fontWeight: "400",
                                        color: "#9B9BA3",
                                        alignSelf: "center",
                                        marginLeft: RatioUtil.width(4),
                                    }}
                                >
                                    {/* 아마추어 */}
                                    {jsonSvc.findLocalById("7052")}
                                </PretendText>
                            )}
                        </View>
                        {/* Total */}
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: totalScore === 0 ? "#9B9BA3" : totalScore > 0 ? "#5465FF" : "#FF686B",
                                }}
                            >
                                {totalScore === 0
                                    ? jsonSvc.findLocalById("7035")
                                    : totalScore > 0
                                    ? `+${totalScore}`
                                    : totalScore}
                            </PretendText>
                        </View>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <PretendText
                                style={{ fontSize: RatioUtil.font(14), fontWeight: "normal", color: "#000000" }}
                            >
                                {endStatus ? totalRoundStroke : hole}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flex: endStatus ? 1.6 : 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {endStatus ? (
                                <PretendText
                                    style={{ fontSize: RatioUtil.font(14), fontWeight: "normal", color: "#000000" }}
                                >
                                    {NumberUtil.prize(Number(prize))}
                                </PretendText>
                            ) : (
                                <LikeBtn setLeaderboardData={setLeaderboardData} personId={personId} like={like} />
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            ) : (
                <View style={{ ...RatioUtil.sizeFixedRatio(360, 297), backgroundColor: "#F9F9F9" }}>
                    <TouchableOpacity onPress={() => setToggleItem(prevState => !prevState)}>
                        <View style={{ ...RatioUtil.sizeFixedRatio(360, 60), flexDirection: "row" }}>
                            <View style={{ flex: 1.2, alignItems: "center", justifyContent: "center" }}>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "normal",
                                        color: "#000000",
                                    }}
                                >
                                    {playerStatus === "NORMAL"
                                        ? rankTiedCheck
                                            ? "T" + rank
                                            : rank
                                        : hole.includes(":")
                                        ? "-"
                                        : playerStatus}
                                </PretendText>
                            </View>
                            <View
                                style={{
                                    flex: 4,
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    flexDirection: "row",
                                }}
                            >
                                <FastImage
                                    source={{ uri: playerImage }}
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(40, 40),
                                        borderRadius: RatioUtil.width(20),
                                        borderColor: "#DFDFDF",
                                        borderWidth: RatioUtil.lengthFixedRatio(1),
                                    }}
                                />
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(16),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: "#000000",
                                        marginLeft: RatioUtil.width(10),
                                        marginRight: RatioUtil.width(4),
                                    }}
                                >
                                    {TextUtil.ellipsis(nameMain, 15)}
                                </PretendText>

                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: totalScore === 0 ? "#9B9BA3" : totalScore > 0 ? "#5465FF" : "#FF686B",
                                    }}
                                >
                                    {totalScore === 0 ? "E" : totalScore > 0 ? `+${totalScore}` : totalScore}
                                </PretendText>
                            </View>

                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <LikeBtn setLeaderboardData={setLeaderboardData} personId={personId} like={like} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            ...RatioUtil.sizeFixedRatio(360, 38),
                            flexDirection: "row",
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderColor: "#DFDFDF",
                        }}
                    >
                        {[...Array(roundSeq + 1).keys()]
                            .filter(num => num <= roundSeq && num > 0)
                            .map(round => (
                                <CustomButton
                                    style={{
                                        height: "100%",
                                        justifyContent: "center",
                                    }}
                                    onPress={handlePressRound(round)}
                                >
                                    <View
                                        style={{
                                            height: "100%",
                                            width: RatioUtil.width(48),
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <PretendText
                                            style={{
                                                fontSize: RatioUtil.font(14),
                                                fontWeight: RatioUtil.fontWeightBold(),
                                                color: round === selectRound ? "#000000" : "#87878D",
                                            }}
                                        >
                                            {round}R
                                        </PretendText>
                                        <View
                                            style={{
                                                backgroundColor: "black",
                                                ...RatioUtil.sizeFixedRatio(18, 2),
                                                borderRadius: 15,
                                                display: round === selectRound ? "flex" : "none",
                                                position: "absolute",
                                                bottom: RatioUtil.lengthFixedRatio(-1),
                                            }}
                                        ></View>
                                    </View>
                                </CustomButton>
                            ))}
                    </View>

                    {graphLoader ? (
                        <View
                            style={[
                                {
                                    flex: 1,
                                    ...RatioUtil.sizeFixedRatio(300, 150),
                                    alignItems: "center",
                                },
                                { alignSelf: "center" },
                            ]}
                        >
                            {/* <AnimatedLottieView
                                source={lotties.loadingToast}
                                style={{
                                    ...RatioUtil.size(30, 30),
                                }}
                                autoPlay
                                loop
                            /> */}
                            <ActivityIndicator size={"large"} color={Colors.GRAY12} />
                        </View>
                    ) : (
                        <>
                            <View style={{ flexDirection: "row" }}>
                                <ScrollView
                                    horizontal
                                    nestedScrollEnabled={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        backgroundColor: "#F9F9F9",
                                        height: RatioUtil.lengthFixedRatio(144),
                                    }}
                                    // onScrollBeginDrag={handleScrollBegin}
                                    // onScrollEndDrag={handleScrollEnd}
                                >
                                    <View
                                        style={{
                                            ...RatioUtil.sizeFixedRatio(1, 184),
                                            left: RatioUtil.width(445),
                                            backgroundColor: "#DFDFDF",
                                            position: "absolute",
                                            zIndex: 1,
                                        }}
                                    ></View>
                                    <View
                                        style={{
                                            // backgroundColor: item === "Score" ? "#FFFFFF" : "#F9F9F9",
                                            borderBottomWidth: 1,
                                            borderColor: "#DFDFDF",
                                            paddingLeft: RatioUtil.width(60),
                                        }}
                                    >
                                        <View style={{ borderBottomWidth: 1, borderColor: "#DFDFDF" }}>
                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(36),
                                                    height: RatioUtil.lengthFixedRatio(35),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText
                                                    // key={item}
                                                    style={{
                                                        fontSize: RatioUtil.font(12),
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        color:
                                                            selectedRoundScore === 0
                                                                ? "#9B9BA3"
                                                                : selectedRoundScore > 0
                                                                ? "#5465FF"
                                                                : "#FF686B",
                                                    }}
                                                >
                                                    {selectedRoundScore === 0
                                                        ? "E"
                                                        : selectedRoundScore > 0
                                                        ? `+${selectedRoundScore}`
                                                        : selectedRoundScore}
                                                </PretendText>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                borderBottomWidth: 1,
                                                borderColor: "#DFDFDF",
                                            }}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
                                                <View
                                                    key={item}
                                                    style={{
                                                        width: RatioUtil.lengthFixedRatio(36),
                                                        height: RatioUtil.lengthFixedRatio(35),
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <PretendText
                                                        style={{
                                                            fontSize: RatioUtil.font(12),
                                                            fontWeight: "normal",
                                                            color: "#000000",
                                                        }}
                                                    >
                                                        {item}
                                                    </PretendText>
                                                </View>
                                            ))}
                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(60),
                                                    height: RatioUtil.lengthFixedRatio(35),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText
                                                    style={{
                                                        fontSize: RatioUtil.font(12),
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        color: "#000000",
                                                    }}
                                                >
                                                    {/* OUT */}
                                                    {jsonSvc.findLocalById("7057")}
                                                </PretendText>
                                            </View>

                                            {[10, 11, 12, 13, 14, 15, 16, 17, 18].map(item => (
                                                <View
                                                    key={item}
                                                    style={{
                                                        width: RatioUtil.lengthFixedRatio(36),
                                                        height: RatioUtil.lengthFixedRatio(35),
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <PretendText
                                                        style={{
                                                            fontSize: RatioUtil.font(12),
                                                            fontWeight: "normal",
                                                            color: "#000000",
                                                        }}
                                                    >
                                                        {item}
                                                    </PretendText>
                                                </View>
                                            ))}
                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(60),
                                                    height: RatioUtil.lengthFixedRatio(35),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText
                                                    style={{
                                                        fontSize: RatioUtil.font(12),
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        color: "#000000",
                                                    }}
                                                >
                                                    {/* IN */}
                                                    {jsonSvc.findLocalById("7058")}
                                                </PretendText>
                                            </View>
                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(60),
                                                    height: RatioUtil.lengthFixedRatio(35),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            ></View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                borderBottomWidth: 1,
                                                borderColor: "#DFDFDF",
                                            }}
                                        >
                                            {courseData?.outCourses.map((par, i: number) => (
                                                <View
                                                    style={{
                                                        width: RatioUtil.lengthFixedRatio(36),
                                                        height: RatioUtil.lengthFixedRatio(35),
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <PretendText
                                                        key={`out_${i}`}
                                                        style={{
                                                            fontSize: RatioUtil.font(12),
                                                            fontWeight: "normal",
                                                            color: "#000000",
                                                        }}
                                                    >
                                                        {par}
                                                    </PretendText>
                                                </View>
                                            ))}
                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(60),
                                                    height: RatioUtil.lengthFixedRatio(35),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText
                                                    style={{
                                                        fontSize: RatioUtil.font(12),
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        color: "#000000",
                                                    }}
                                                >
                                                    {courseData?.cousre?.outTotal}
                                                </PretendText>
                                            </View>
                                            {courseData?.inCourses.map((par, i: number) => (
                                                <View
                                                    style={{
                                                        width: RatioUtil.lengthFixedRatio(36),
                                                        height: RatioUtil.lengthFixedRatio(35),
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <PretendText
                                                        key={`in_${i}`}
                                                        style={{
                                                            fontSize: RatioUtil.font(12),
                                                            fontWeight: "normal",
                                                            color: "#000000",
                                                        }}
                                                    >
                                                        {par}
                                                    </PretendText>
                                                </View>
                                            ))}
                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(60),
                                                    height: RatioUtil.lengthFixedRatio(35),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText
                                                    style={{
                                                        fontSize: RatioUtil.font(12),
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        color: "#000000",
                                                    }}
                                                >
                                                    {courseData?.cousre?.inTotal}
                                                </PretendText>
                                            </View>
                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(60),
                                                    height: RatioUtil.lengthFixedRatio(35),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText
                                                    style={{
                                                        fontSize: RatioUtil.font(12),
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        color: "#000000",
                                                    }}
                                                >
                                                    {getScoreText(
                                                        courseData?.cousre?.inTotal,
                                                        courseData?.cousre?.outTotal
                                                    )}
                                                </PretendText>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                borderBottomWidth: 1,
                                                borderColor: "#DFDFDF",
                                            }}
                                        >
                                            {courseData?.outScore.map((hole: any, i: any) => (
                                                <View
                                                    style={{
                                                        width: RatioUtil.lengthFixedRatio(36),
                                                        height: RatioUtil.lengthFixedRatio(35),
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        backgroundColor:
                                                            hole > 0
                                                                ? getScoreColor(courseData.hole?.outDiff[i])
                                                                : "transparent",
                                                    }}
                                                >
                                                    <PretendText
                                                        key={`out_${i}`}
                                                        style={{
                                                            fontSize: RatioUtil.font(12),
                                                            fontWeight: "normal",
                                                            color: "#000000",
                                                        }}
                                                    >
                                                        {hole > 0 ? hole : ""}
                                                    </PretendText>
                                                </View>
                                            ))}
                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(60),
                                                    height: RatioUtil.lengthFixedRatio(35),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText
                                                    style={{
                                                        fontSize: RatioUtil.font(12),
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        color: "#000000",
                                                    }}
                                                >
                                                    {courseData?.hole?.outTotal || ""}
                                                </PretendText>
                                            </View>
                                            {courseData?.inScore.map((hole: any, i: any) => (
                                                <View
                                                    style={{
                                                        width: RatioUtil.lengthFixedRatio(36),
                                                        height: RatioUtil.lengthFixedRatio(35),
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        backgroundColor:
                                                            hole > 0
                                                                ? getScoreColor(courseData.hole?.inDiff[i])
                                                                : "transparent",
                                                    }}
                                                >
                                                    <PretendText
                                                        key={`in_${i}`}
                                                        style={{
                                                            fontSize: RatioUtil.font(12),
                                                            fontWeight: "normal",
                                                            color: "#000000",
                                                        }}
                                                    >
                                                        {hole > 0 ? hole : ""}
                                                    </PretendText>
                                                </View>
                                            ))}

                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(60),
                                                    height: RatioUtil.lengthFixedRatio(35),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText
                                                    style={{
                                                        fontSize: RatioUtil.font(12),
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        color: "#000000",
                                                    }}
                                                >
                                                    {courseData?.hole?.inTotal || ""}
                                                </PretendText>
                                            </View>
                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(60),
                                                    height: RatioUtil.lengthFixedRatio(35),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText
                                                    style={{
                                                        fontSize: RatioUtil.font(12),
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        color: "#000000",
                                                    }}
                                                >
                                                    {getScoreText(
                                                        courseData?.hole?.inTotal,
                                                        courseData?.hole?.outTotal
                                                    )}
                                                </PretendText>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                                <View style={{ position: "absolute" }}>
                                    {/* <View style={[styles.container, isScrolling && styles.containerShadow]}> */}

                                    {[
                                        jsonSvc.findLocalById("7049"),
                                        jsonSvc.findLocalById("7047"),
                                        jsonSvc.findLocalById("110313"),
                                        jsonSvc.findLocalById("110314"),
                                    ].map(item => (
                                        <View
                                            style={{
                                                width: RatioUtil.lengthFixedRatio(60),
                                                height: RatioUtil.lengthFixedRatio(36),
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: item === "Score" ? "#FFFFFF" : "#F9F9F9",
                                                borderBottomWidth: 1,
                                                borderColor: "#DFDFDF",
                                            }}
                                        >
                                            <PretendText
                                                key={item}
                                                style={{
                                                    fontSize: RatioUtil.font(12),
                                                    fontWeight: "400",
                                                    color: "#000000",
                                                }}
                                            >
                                                {item}
                                            </PretendText>
                                        </View>
                                    ))}
                                    {/* {isScrolling && ( */}
                                    <LinearGradient
                                        colors={["rgba(0, 0, 0, 0.07)", "rgba(0, 0, 0, 0)"]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            left: RatioUtil.width(60),
                                            bottom: 0,
                                            width: 15, // Adjust the width of the shadow
                                        }}
                                    />
                                    {/* )} */}
                                </View>
                            </View>
                            <View
                                style={{
                                    ...RatioUtil.sizeFixedRatio(360, 50),
                                    justifyContent: "center",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginLeft: RatioUtil.width(20),
                                    }}
                                >
                                    {scoreArray.map(({ name, color }, index) => (
                                        <View
                                            style={{
                                                marginRight: RatioUtil.width(10),
                                                alignItems: "center",
                                                flexDirection: "row",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    ...RatioUtil.sizeFixedRatio(10, 10),
                                                    borderRadius: RatioUtil.width(5),
                                                    backgroundColor: color,
                                                    marginRight: RatioUtil.width(2),
                                                    borderWidth: index === 2 ? 1 : 0,
                                                    borderColor: "#DFDFDF",
                                                }}
                                            />
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(12),
                                                    fontWeight: "400",
                                                    color: "#9B9BA3",
                                                }}
                                            >
                                                {name}
                                            </PretendText>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}
                </View>
            )}
        </View>
    )
}

const LikeBtn = ({
    setLeaderboardData,
    personId,
    like,
}: {
    setLeaderboardData: React.Dispatch<React.SetStateAction<ILeaderboardByRender>>
    personId: number
    like?: boolean
}) => {
    const handlePressLikeButton = async (personId: number) => {
        const data = await liveSvc.likePlayerToggle(personId)
        setLeaderboardData(prev => {
            const index = prev.all.findIndex(likePlayers => likePlayers.personId === personId)
            const updatedAll = [...prev.all]
            updatedAll[index].like = data.TOGGLE
            const updatedLike = updatedAll.filter(e => e.like)
            return { ...prev, like: updatedLike, all: updatedAll }
        })
    }
    return (
        <TouchableOpacity
            hitSlop={{ top: 150, bottom: 50, left: 50, right: 50 }}
            style={{
                ...RatioUtil.size(30, 30),
                zIndex: 100,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
            }}
            onPress={() => handlePressLikeButton(personId)}
        >
            <Image
                source={like ? liveImg.stars : liveImg.star}
                style={{
                    zIndex: 2,
                    width: RatioUtil.width(14),
                    height: RatioUtil.height(14),
                }}
                resizeMode="contain"
            />
        </TouchableOpacity>
    )
}

const areEqual = (prevProps: RankItemProps, nextProps: RankItemProps) => {
    const { personId, gameData, courseInfo, like, myPlayerData } = prevProps

    const isDefined = (value: any) => value !== undefined

    return (
        isDefined(personId) &&
        personId === nextProps.personId &&
        isDefined(gameData) &&
        gameData === nextProps.gameData &&
        isDefined(courseInfo) &&
        courseInfo === nextProps.courseInfo &&
        isDefined(like) &&
        like === nextProps.like &&
        isDefined(myPlayerData) &&
        myPlayerData === nextProps.myPlayerData
    )
}
export const MemoizedRankItem = React.memo(RankItem, areEqual)

// 연장전 컴포넌트
export const ExtensionComponent = ({
    // endStatus,
    leaderboard,
    setTop1Player,
    extensionStatus,
    gameData,
}: {
    // endStatus: boolean
    leaderboard: ILeaderboard[]
    setTop1Player: React.Dispatch<React.SetStateAction<ILeaderboard | undefined>>
    extensionStatus: IHole[]
    gameData: ISeasonDetail | undefined
}) => {
    /////////////연장전////////////////
    const [players, setPlayers] = useState<
        { name: string; scores: number[]; total: number; playerCode: number; isWinner: boolean }[]
    >([])

    /////////////연장전////////////////
    const roundHole = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] as const

    const getExtensionLeaderBoardData = async (gameData?: ISeasonDetail) => {
        // if (!gameData || !roundSeq || !extensionStatus) return []
        if (!gameData) return []

        const transformedData = extensionStatus.reduce(
            (
                acc: { name: string; scores: number[]; total: number; isWinner: boolean; playerCode: number }[],
                item: IHole
            ) => {
                const scores: number[] = roundHole.map(holeNumber => {
                    const holeKey = `hole${holeNumber}` as keyof IHole
                    const holeScore = item[holeKey]
                    return Number(holeScore)
                })

                const total = NumberUtil.sum(scores)

                let minTotal = Math.min(...acc.map(a => a.total), total)

                if (total === minTotal) {
                    acc = acc.map(a => ({ ...a, isWinner: false }))
                }

                acc.push({
                    name: item.nameKo,
                    playerCode: item.PLAYER_CODE,
                    scores,
                    total,
                    isWinner: total === minTotal,
                })

                return acc
            },
            []
        )

        const winnerPlayerCode = transformedData.find(v => v.isWinner)?.playerCode

        if (winnerPlayerCode !== undefined) {
            const top1Player = leaderboard.find(v => v.PLAYER_CODE === winnerPlayerCode)
            setTop1Player(top1Player)
        }

        setPlayers(transformedData)
    }

    useEffect(() => {
        getExtensionLeaderBoardData(gameData)
    }, [])

    const refScrollView = useRef<ScrollView>(null)

    return (
        <View
            style={{
                backgroundColor: Colors.WHITE,
                justifyContent: "center",
                alignItems: "center",
                marginTop: RatioUtil.lengthFixedRatio(20),
            }}
        >
            <View
                style={{
                    width: RatioUtil.lengthFixedRatio(320),
                    height: RatioUtil.lengthFixedRatio(36) * (players.length + 1),
                    borderWidth: RatioUtil.width(1),
                    borderColor: "#DFDFDF",
                    position: "absolute",
                    left: RatioUtil.lengthFixedRatio(20),
                    top: RatioUtil.lengthFixedRatio(0),
                    zIndex: 1,
                }}
                pointerEvents="none"
            >
                <View
                    style={{
                        width: RatioUtil.lengthFixedRatio(1),
                        height: RatioUtil.lengthFixedRatio(36) * (players.length + 1),
                        backgroundColor: "#DFDFDF",
                        position: "absolute",
                        left: RatioUtil.lengthFixedRatio(59),
                        top: RatioUtil.lengthFixedRatio(0),
                    }}
                />
                <View
                    style={{
                        width: RatioUtil.lengthFixedRatio(1),
                        height: RatioUtil.lengthFixedRatio(36) * (players.length + 1),
                        backgroundColor: "#DFDFDF",
                        position: "absolute",
                        right: RatioUtil.lengthFixedRatio(59),
                        top: RatioUtil.lengthFixedRatio(0),
                    }}
                />
                {players.map((player, playerIndex) => (
                    <View
                        style={{
                            width: RatioUtil.lengthFixedRatio(320),
                            height: RatioUtil.lengthFixedRatio(1),
                            borderWidth: RatioUtil.width(1),
                            borderColor: "#DFDFDF",
                            position: "absolute",
                            left: 0,
                            top: RatioUtil.lengthFixedRatio(36) * (playerIndex + 1),
                        }}
                    />
                ))}
            </View>

            <View
                style={{
                    width: RatioUtil.lengthFixedRatio(320),
                    flexDirection: "row",
                    marginBottom: RatioUtil.lengthFixedRatio(20),
                }}
            >
                <View
                    style={{
                        width: RatioUtil.lengthFixedRatio(60),
                    }}
                >
                    <View
                        style={{
                            ...RatioUtil.sizeFixedRatio(60, 36),
                            backgroundColor: "#F9F9F9",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <PretendText
                            style={{
                                textAlign: "center",
                                fontSize: RatioUtil.font(12),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK,
                            }}
                        >
                            연장전
                        </PretendText>
                    </View>
                    {players.map((player, playerIndex) => (
                        <View
                            key={`playerName-${playerIndex}`}
                            style={{
                                ...RatioUtil.sizeFixedRatio(60, 36),
                                backgroundColor: "white",
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(12),
                                    fontWeight: "normal",
                                    color: Colors.BLACK,
                                }}
                            >
                                {TextUtil.ellipsis(player.name)}
                            </PretendText>
                        </View>
                    ))}
                </View>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    ref={refScrollView}
                    style={{
                        width: RatioUtil.lengthFixedRatio(200),
                        backgroundColor: "#F9F9F9",
                    }}
                    contentContainerStyle={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}
                    onContentSizeChange={() => refScrollView.current?.scrollToEnd({ animated: false })}
                >
                    <View>
                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    width: roundHole.length * RatioUtil.lengthFixedRatio(36),
                                    height: RatioUtil.lengthFixedRatio(35),
                                    backgroundColor: "#F9F9F9",
                                    alignItems: "center",
                                }}
                            >
                                {roundHole.map((number, index) => (
                                    <View style={{ width: RatioUtil.width(36) }} key={`roundHole-${index}`}>
                                        <PretendText
                                            style={{
                                                textAlign: "center",
                                                fontSize: RatioUtil.font(12),
                                                fontWeight: "400",
                                                color: Colors.BLACK,
                                            }}
                                        >
                                            {number}
                                        </PretendText>
                                    </View>
                                ))}
                            </View>
                        </View>
                        {players.map((player, playerIndex) => (
                            <View
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <View
                                    key={`player-${playerIndex}`}
                                    style={{
                                        flexDirection: "row",
                                        height: RatioUtil.lengthFixedRatio(36),
                                        backgroundColor: "white",
                                        alignItems: "center",
                                    }}
                                >
                                    {player.scores.map((score, scoreIndex) => (
                                        <View style={{ width: RatioUtil.width(36) }} key={`score-${scoreIndex}`}>
                                            <PretendText
                                                style={{
                                                    textAlign: "center",
                                                    fontSize: RatioUtil.font(12),
                                                    fontWeight: "400",
                                                    color: Colors.BLACK,
                                                }}
                                            >
                                                {score}
                                            </PretendText>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <View
                    style={{
                        width: RatioUtil.lengthFixedRatio(60),
                    }}
                >
                    <View style={{}}>
                        <View
                            style={{
                                ...RatioUtil.sizeFixedRatio(60, 36),
                                backgroundColor: "#F9F9F9",
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(12),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* 승패 */}
                                {jsonSvc.findLocalById("7068")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                backgroundColor: "white", // Add a backgroundColor
                            }}
                        >
                            {players.map((player, playerIndex) => {
                                return (
                                    <PretendText
                                        key={`winLoss-${playerIndex}`}
                                        style={{
                                            textAlign: "center",
                                            fontSize: RatioUtil.font(12),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            height: RatioUtil.lengthFixedRatio(16),
                                            color: player.isWinner ? "#5465FF" : "#FF686B",
                                            borderEndWidth: 1,
                                            marginTop: (playerIndex + 1) * RatioUtil.height(9),
                                        }}
                                    >
                                        {player.isWinner
                                            ? jsonSvc.findLocalById("7069")
                                            : jsonSvc.findLocalById("7070")}
                                    </PretendText>
                                )
                            })}
                        </View>
                    </View>
                </View>
            </View>
            <View
                style={{
                    backgroundColor: Colors.GRAY9,
                    width: RatioUtil.lengthFixedRatio(360),
                    height: RatioUtil.lengthFixedRatio(10),
                }}
            />
        </View>
    )
}

interface ILastHit {
    roundStrokeSum?: number
    parSum?: number
    roundStrokeByRoundCode?: { [key: string]: number }
    score?: number
    totalScore?: number
}

export const WinnerComponent = ({
    top1Player,
    courseInfo,
    gameData,
}: {
    top1Player: ILeaderboard | undefined
    courseInfo: ICourse[]
    gameData?: ISeasonDetail
}) => {
    const [lastHit, setLastHit] = useState<ILastHit>({
        roundStrokeSum: undefined,
        parSum: undefined,
        roundStrokeByRoundCode: undefined,
    })
    const getPlayerData = async () => {
        if (!top1Player || !gameData) return

        const data = await liveSvc.getLeaderboardByPlayer(gameData, top1Player.GAME_CODE, top1Player.PLAYER_CODE)

        if (!data) return

        const roundStrokeSum = data.reduce((acc, curr) => acc + curr.roundStroke, 0)

        const roundStrokeByRoundCode = data.reduce<{ [key: string]: number }>((acc, curr) => {
            if (acc[curr.ROUND_CODE]) {
                acc[curr.ROUND_CODE] += curr.roundStroke
            } else {
                acc[curr.ROUND_CODE] = curr.roundStroke
            }
            return acc
        }, {})

        const parSum = courseInfo.reduce((acc, curr) => acc + parseInt(curr.par, 10), 0)

        const totalScore = data[data.length - 1]?.totalScore

        setLastHit({
            parSum,
            roundStrokeByRoundCode,
            roundStrokeSum,
            score: roundStrokeSum - parSum,
            totalScore,
        })
    }

    useEffect(() => {
        getPlayerData()
    }, [courseInfo, top1Player])

    const roundStrokes = lastHit.roundStrokeByRoundCode ? Object.values(lastHit.roundStrokeByRoundCode) : []
    const roundStrokesString = roundStrokes.join(",")

    return (
        <>
            <View
                style={{
                    backgroundColor: Colors.WHITE,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        marginTop: RatioUtil.height(20),
                        marginBottom: RatioUtil.height(30),
                        backgroundColor: "#f9f9f9",
                        ...RatioUtil.size(320, 120),
                        borderRadius: 10,
                    }}
                >
                    <Image
                        source={liveImg.winnercircle}
                        style={{
                            position: "absolute",
                            left: RatioUtil.width(22),
                            top: RatioUtil.height(22),
                            ...RatioUtil.sizeFixedRatio(74, 65.16),
                            resizeMode: "contain",
                            zIndex: 1,
                        }}
                    />
                    <Image
                        source={liveImg.winnertitle}
                        style={{
                            position: "absolute",
                            left: RatioUtil.width(39),
                            top: RatioUtil.height(80),
                            ...RatioUtil.size(40, 20),
                            resizeMode: "contain",
                            zIndex: 1,
                        }}
                    />

                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(12),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.GRAY8,
                            position: "absolute",
                            left: RatioUtil.width(108),
                            top: RatioUtil.height(54),
                        }}
                    >
                        {/* 우승상금 */}
                        {jsonSvc.findLocalById("110402")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(12),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.GRAY8,
                            position: "absolute",
                            left: RatioUtil.width(108),
                            top: RatioUtil.height(77),
                        }}
                    >
                        {/* 최종타수 */}
                        {jsonSvc.findLocalById("110303")}
                    </PretendText>
                    {top1Player && (
                        <>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                    position: "absolute",
                                    left: RatioUtil.width(108),
                                    top: RatioUtil.height(26),
                                }}
                            >
                                {top1Player.nameMain}
                            </PretendText>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                    position: "absolute",
                                    left: RatioUtil.width(160),
                                    top: RatioUtil.height(53),
                                }}
                            >
                                {NumberUtil.prize(Number(top1Player.prize))}
                            </PretendText>

                            {lastHit.roundStrokeSum !== undefined && lastHit.parSum !== undefined && (
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "400",
                                        color: Colors.BLACK,
                                        position: "absolute",
                                        left: RatioUtil.width(160),
                                        top: RatioUtil.height(76),
                                    }}
                                >
                                    {`${lastHit.roundStrokeSum}타(${lastHit?.totalScore ?? 0})/${roundStrokesString}`}
                                </PretendText>
                            )}
                            <Image
                                source={{ uri: top1Player.imageUrl }}
                                style={{
                                    ...RatioUtil.size(60, 60),
                                    borderRadius: 100,
                                    position: "absolute",
                                    left: RatioUtil.width(29),
                                    top: RatioUtil.height(29),
                                }}
                            />
                        </>
                    )}
                </View>
            </View>
        </>
    )
}

//   try {
//       // await liveSvc.getExtraInfo(gameData.GAME_CODE)
//       const extensionRoundSeq = 999
//       //연장전 response에는 데이터가 2명이 옴
//       const response = await axios.get(
//           `http://score.sports.media.daum.net/hermes/api/golf/stat/${gameData.GAME_CODE}.json?roundSeq=${extensionRoundSeq}`
//       )

//       const player1 = response.data.list[0]
//       const player2 = response.data.list[1]
//       setPlayer1Name(player1.person.nameMain)
//       setPlayer1Scores(
//           Object.values<number>(player1.stat)
//               .slice(3, 20) // 홀 점수
//               .map(score => score)
//       )
//       setPlayer1Total(NumberUtil.sum(player1Scores))
//       setPlayer2Name(player2.person.nameMain)
//       setPlayer2Scores(
//           Object.values<number>(player2.stat)
//               .slice(3, 20)
//               .map(score => score)
//       )
//       setPlayer2Total(NumberUtil.sum(player2Scores)) // 홀 점수 총합 = 승패구분때 사용
//       return response.data
//   } catch (error) {
//       console.error(error)
//   }

const getScoreText = (acc?: number, curr?: number) => {
    if (!acc || !curr) return ""

    return acc + curr
}
