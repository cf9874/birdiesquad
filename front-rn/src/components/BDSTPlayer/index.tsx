import { Colors, GameStatus, Grade } from "const"
import { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, Image, TouchableOpacity, View } from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { ConfigUtil, RatioUtil, NumberUtil, GameUtil } from "utils"
import { styles } from "./styles"
import { BoxShadow } from "react-native-shadow"
import { jsonSvc, rewardSvc } from "apis/services"
import nftPlayerJson from "json/nft_player.json"
import { IBdstPlayer, ILeaderboard, ICourse, IHole, ISeasonDetail } from "apis/data/season.data"
import { ICounterScore } from "apis/data/reward.data"
import { PretendText } from "components/utils"
import { NftUtil } from "utils/nft.util"
import NftPlayerImage from "./nftPlayerImage"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import { liveSvc } from "apis/services/live.svc"
import LinearGradient from "react-native-linear-gradient"
import FastImage from "react-native-fast-image"

export interface BDSTPlayerProps {
    data: IBdstPlayer
    index: number
    onPress: () => void
    isEnd: boolean
    gameData: ISeasonDetail | undefined
}

const BDSTPlayer = ({ data, index, onPress, isEnd, gameData }: BDSTPlayerProps) => {
    if (!data) return <></>

    const { width, height } = Dimensions.get("window")
    const [showDetails, setshowDetails] = useState<boolean>(false)
    const AnimateHeight = useRef(new Animated.Value(height)).current
    const [reachedStart, setReachedStart] = useState<boolean>(false)
    const [round, setRound] = useState<number>(1)
    const [graphLoader, setgraphLoader] = useState<boolean>(false)
    const [graphData, setgraphData] = useState<ICounterScore[]>([])
    const [courseData, setCourseData] = useState<IplayerScore>()
    const [leaderboard, setLeaderboard] = useState<ILeaderboard>()
    const [initRender, setInitRender] = useState<boolean>(true)
    const graphColumns = ["합계", "홀", "Par", "Score", "보상"]

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

    useEffect(() => {
        setUpInitialValues(data, round)
    }, [round, data, data?.PLAYER_CODE])

    const setUpInitialValues = async (data: IBdstPlayer, round: number) => {
        if (!data || !data.season || round <= 0) return
        const { data: roundData } = GameUtil.checkRound(gameData)
        const { current, prev, isEnd } = roundData.round

        const roundSeq = isEnd ? prev : current //99면 끝

        if (roundSeq === undefined || roundSeq === null) return

        setRound(round == current ? roundSeq : initRender ? roundSeq : round)
        if (initRender) setInitRender(false)

        setgraphLoader(true)

        const _hole = data.holes.find(hole => hole.roundSeq === round)
        const leaderboard = data.leaderboard.find(lb => lb.roundSeq === round)

        if (!_hole || !leaderboard) {
            setgraphLoader(false)
            setLeaderboard(undefined)
            setCourseData(undefined)
            setgraphData([])
            return
        }

        setLeaderboard(leaderboard)

        const newArray = rewardSvc.mapCoursesToScores(data.gameCourse.COURSES, _hole, leaderboard)

        const countScores = rewardSvc.getCountScores(newArray)

        setgraphData(countScores)

        setgraphLoader(false)
        // setgraphRData(data.roundStrokeArray)

        const onlyHole = []
        for (const key in _hole) {
            if (key.includes("hole")) onlyHole.push(_hole[key as keyof IHole])
        }

        const outCourses = liveSvc.filterByHoleRange(data.gameCourse.COURSES, 1, 9)
        const inCourses = liveSvc.filterByHoleRange(data.gameCourse.COURSES, 10, 18)
        const outScore = onlyHole.filter((_, i) => i >= 0 && i < 9).map(score => score)
        const inScore = onlyHole.filter((_, i) => i >= 9 && i < 18).map(score => score)

        const cousre = {
            coursesInfo: data.gameCourse.COURSES.filter(e => e.hole),
            outCourses,
            inCourses,
            outTotal: NumberUtil.sum(outCourses),
            inTotal: NumberUtil.sum(inCourses),
        }

        const hole = {
            outTotal: NumberUtil.sum(outScore),
            inTotal: NumberUtil.sum(inScore),
            outDiff: outScore.map((score, i) => Number(score) - Number(outCourses[i])),
            inDiff: inScore.map((score, i) => Number(score) - Number(inCourses[i])),
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
    }

    const onShowDetails = () => {
        if (showDetails) {
            Animated.timing(AnimateHeight, {
                toValue: width,
                duration: 250,
                useNativeDriver: true,
            }).start(() => setshowDetails(false))
        } else {
            setshowDetails(true)
            Animated.timing(AnimateHeight, {
                toValue: RatioUtil.height(0),
                duration: 250,
                useNativeDriver: true,
            }).start()
        }
    }

    const gradeColor = (grade: Grade | undefined) => {
        switch (grade) {
            case Grade.COMMON:
                return Colors.GRAY14
            case Grade.UNCOMMON:
                return Colors.GREEN3
            case Grade.RARE:
                return Colors.YELLOW17
            case Grade.SUPERRARE:
                return Colors.BLUE4
            case Grade.EPIC:
                return Colors.PURPLE10
            case Grade.LEGENDARY:
                return Colors.RED3
            default:
                return Colors.GRAY14
        }
    }

    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x
        if (contentOffset === 0 && !reachedStart) {
            setReachedStart(true)
        } else if (contentOffset > -10 && reachedStart) {
            setReachedStart(false)
        }
    }

    const getCurrentScore = (data: IBdstPlayer) => {
        const noneStatus = "-" as const

        if (!data) {
            return noneStatus
        }

        const { gameCourse, leaderboard } = data

        if (!gameCourse?.ROUNDS?.length || !leaderboard?.length || !gameCourse) {
            return noneStatus
        }

        if (isEnd) {
            const { totalScore } = leaderboard[leaderboard.length - 1] ?? {}

            return totalScore === 0 ? jsonSvc.findLocalById("7035") : totalScore > 0 ? `+${totalScore}` : totalScore
        }

        const lastRound = gameCourse.ROUNDS[gameCourse.ROUNDS.length - 1]

        const currentStatus = lastRound.roundStatus

        const { totalScore, playerStatus, roundStroke } = leaderboard.find(lb => lb.roundSeq === round) ?? {}

        if (currentStatus === GameStatus.END) {
            return !totalScore || totalScore == 0 ? jsonSvc.findLocalById("7035") : totalScore
        } else {
            return playerStatus && playerStatusList.includes(playerStatus) ? playerStatus : roundStroke
        }
    }

    return (
        <View>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    onPress()
                    onShowDetails()
                }}
                style={[
                    styles.mainView,
                    {
                        borderBottomColor: showDetails ? Colors.WHITE : "#DFDFDF",
                    },
                ]}
            >
                <View style={styles.playerRankMainView}>
                    <PretendText style={styles.playerRank}>{index + 1}</PretendText>
                    <FastImage
                        source={{
                            uri: ConfigUtil.getPlayerImage(
                                nftPlayerJson.find(d => d.nPersonID == data?.personId)?.sPlayerImagePath
                            ),
                        }}
                        style={styles.playerImage}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={styles.playerInfoView}>
                        <PretendText
                            style={[
                                styles.playerGradeTitle,
                                {
                                    color: gradeColor(data.grade),
                                },
                            ]}
                        >
                            {NftUtil.findGrade(data.grade)}
                        </PretendText>
                        <PretendText style={styles.playerName}>
                            {nftPlayerJson.find(d => d.nPersonID == data?.personId)?.sPlayerName}
                        </PretendText>
                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                        style={[
                            styles.playerDataView,
                            {
                                minWidth: RatioUtil.lengthFixedRatio(60),
                            },
                        ]}
                    >
                        <PretendText style={styles.playerDataTitle}>
                            {/* 현재타수 */}
                            {jsonSvc.findLocalById("110301")}
                        </PretendText>
                        <PretendText style={styles.playerDataRank}>{getCurrentScore(data)}</PretendText>
                    </View>
                    <View
                        style={[
                            styles.playerDataView,
                            {
                                minWidth: RatioUtil.lengthFixedRatio(60),
                                marginRight: RatioUtil.lengthFixedRatio(10),
                            },
                        ]}
                    >
                        <PretendText style={styles.playerDataTitle}>
                            {/* BDST */}
                            {jsonSvc.findLocalById("10001")}
                        </PretendText>
                        <PretendText numberOfLines={1} style={styles.playerDataRank}>
                            {data?.totalBDST ?? 0}
                        </PretendText>
                    </View>
                </View>
            </TouchableOpacity>
            {showDetails ? (
                // <Animated.View style={styles.detailsView}>
                <Animated.View
                    style={[
                        styles.detailsAnimatedView,
                        {
                            transform: [{ translateY: AnimateHeight }],
                        },
                    ]}
                >
                    <View style={styles.detailsTopView}>
                        <NftPlayerImage playerCode={data.PLAYER_CODE} grade={data.grade} birdie={data.golf.BIRDIE} />

                        <View style={styles.detailsInnerView}>
                            {/* {data?.gameDetails?.gameStatus == "LIVE" ? ( */}
                            <View style={styles.detailsMainInnerView}>
                                <PretendText style={styles.atBatsTitle}>
                                    {/* 최종타수 */}
                                    {jsonSvc.findLocalById("110303")}
                                </PretendText>
                                {data.leaderboard ? (
                                    <PretendText style={styles.atBatsStrokes}>
                                        {data.leaderboard.reduce((acc, curr) => acc + curr.roundStroke, 0)}타 (
                                        {data.leaderboard.reduce((acc, curr) => acc + curr.roundScore, 0) ?? 0})
                                    </PretendText>
                                ) : null}
                            </View>
                            {/* ) : null} */}
                            <View style={styles.strokesDataView}>
                                <FlatList
                                    keyExtractor={(_, index) => index.toString()}
                                    data={data.leaderboard}
                                    numColumns={2}
                                    renderItem={({ item, index }) => (
                                        <View style={styles.strokesDataRow}>
                                            <View
                                                style={{
                                                    ...RatioUtil.sizeFixedRatio(20, 20),
                                                    backgroundColor: Colors.GRAY4,
                                                    borderRadius: RatioUtil.width(10),
                                                    marginRight: RatioUtil.width(8),
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText style={styles.strokesDataIndex}>{index + 1}R</PretendText>
                                            </View>
                                            <PretendText style={styles.strokesDataTitle}>
                                                {item.roundStroke > 0
                                                    ? item.roundStroke + "타 (" + item.roundScore + ")"
                                                    : "-"}
                                            </PretendText>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.graphMainView}>
                        <View
                            style={{
                                marginLeft: RatioUtil.lengthFixedRatio(20),
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                borderBottomWidth: 1,
                                borderColor: "#DFDFDF",
                            }}
                        >
                            {data.leaderboard.map((_, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setRound(index + 1)
                                    }}
                                    activeOpacity={0.9}
                                    style={[
                                        styles.graphTitleMapView,
                                        {
                                            borderBottomColor: round == index + 1 ? Colors.BLACK : "transparent",
                                            marginRight: RatioUtil.lengthFixedRatio(30),
                                        },
                                    ]}
                                >
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: round == index + 1 ? Colors.BLACK : Colors.GRAY8,
                                        }}
                                    >
                                        {index + 1}R
                                    </PretendText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {graphLoader ? (
                            <View style={styles.emptyView}>
                                <AnimatedLottieView
                                    source={lotties.loading}
                                    style={RatioUtil.size(30, 30)}
                                    autoPlay
                                    loop
                                />
                            </View>
                        ) : courseData?.hole === undefined ? (
                            <View
                                style={{
                                    height: RatioUtil.width(184),
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <PretendText>아직 홀 정보가 준비되지 않았어요.</PretendText>
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
                                            height: RatioUtil.lengthFixedRatio(180),
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
                                                                leaderboard?.roundScore === 0
                                                                    ? "#9B9BA3"
                                                                    : leaderboard?.roundScore > 0
                                                                    ? "#5465FF"
                                                                    : "#FF686B",
                                                        }}
                                                    >
                                                        {leaderboard?.roundScore === 0
                                                            ? "E"
                                                            : leaderboard?.roundScore > 0
                                                            ? `+${leaderboard?.roundScore}`
                                                            : leaderboard?.roundScore}
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
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                }}
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                                    <View
                                                        style={{
                                                            width: RatioUtil.lengthFixedRatio(36),
                                                            height: RatioUtil.lengthFixedRatio(35),
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <PretendText
                                                            key={`reward_${i}`}
                                                            style={{
                                                                fontSize: RatioUtil.font(12),
                                                                fontWeight: "normal",
                                                                color: "#000000",
                                                            }}
                                                        >
                                                            {graphData[i - 1]?.holeScore > 0 && data.season
                                                                ? parseFloat(
                                                                      rewardSvc
                                                                          .calcBdstForPlayer(
                                                                              data,
                                                                              graphData[i - 1],
                                                                              data.season
                                                                          )
                                                                          .toFixed(1)
                                                                  )
                                                                : ""}
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
                                                        {data.season
                                                            ? parseFloat(
                                                                  rewardSvc
                                                                      .calcBdstForPlayerCourse(
                                                                          data,
                                                                          graphData.slice(0, 9),
                                                                          data.season
                                                                      )
                                                                      .toFixed(1)
                                                              )
                                                            : 0}
                                                    </PretendText>
                                                </View>
                                                {[10, 11, 12, 13, 14, 15, 16, 17, 18].map(i => (
                                                    <View
                                                        style={{
                                                            width: RatioUtil.lengthFixedRatio(36),
                                                            height: RatioUtil.lengthFixedRatio(35),
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <PretendText
                                                            key={`reward_${i}`}
                                                            style={{
                                                                fontSize: RatioUtil.font(12),
                                                                fontWeight: "normal",
                                                                color: "#000000",
                                                            }}
                                                        >
                                                            {graphData[i - 1]?.holeScore > 0 && data.season
                                                                ? rewardSvc
                                                                      .calcBdstForPlayer(
                                                                          data,
                                                                          graphData[i - 1],
                                                                          data.season
                                                                      )
                                                                      .toFixed(1)
                                                                : ""}
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
                                                        {data.season
                                                            ? parseFloat(
                                                                  rewardSvc
                                                                      .calcBdstForPlayerCourse(
                                                                          data,
                                                                          graphData.slice(9, 18),
                                                                          data.season
                                                                      )
                                                                      .toFixed(1)
                                                              )
                                                            : 0}
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
                                                        {data.season
                                                            ? parseFloat(
                                                                  rewardSvc
                                                                      .calcBdstForPlayerCourse(
                                                                          data,
                                                                          graphData,
                                                                          data.season
                                                                      )
                                                                      .toFixed(1)
                                                              )
                                                            : 0}
                                                    </PretendText>
                                                </View>
                                            </View>
                                        </View>
                                    </ScrollView>
                                    <View style={{ position: "absolute" }}>
                                        {/* <View style={[styles.container, isScrolling && styles.containerShadow]}> */}

                                        {graphColumns.map(item => (
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
                </Animated.View>
            ) : // </Animated.View>
            null}
        </View>
    )
}

const getScoreText = (acc?: number, curr?: number) => {
    if (!acc || !curr) return ""

    return acc + curr
}

export default BDSTPlayer

const playerStatusList = ["CUT", "MDF", "WD", "DNS", "DQ"]

export interface IplayerScore {
    inCourses: string[]
    outCourses: string[]
    outScore: (string | number)[]
    inScore: (string | number)[]
    cousre: {
        coursesInfo: ICourse[]
        outCourses: string[]
        inCourses: string[]
        outTotal: number
        inTotal: number
    }
    hole: {
        outTotal: number
        inTotal: number
        outDiff: number[]
        inDiff: number[]
    }
}
