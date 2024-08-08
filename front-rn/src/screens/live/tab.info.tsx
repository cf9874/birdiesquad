import { View, Text, Image, ViewStyle } from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { ArrayUtil, DateUtil, GameUtil, RatioUtil } from "utils"
import { Colors, GameStatus } from "const"
import { CustomButton, PretendText } from "components/utils"
import { liveImg } from "assets/images"
import { ScrollView } from "react-native-gesture-handler"
import { ICourse, IGroup, IN_OUT, ISeasonDetail } from "apis/data/season.data"
import { liveSvc } from "apis/services/live.svc"
import { jsonSvc } from "apis/services"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(isBetween)
dayjs.extend(customParseFormat)

const InfoTab: React.FC<IInfoTab> = ({ gameData }) => {
    const [infoData, setInfoData] = useState<any>()
    const [round, setRound] = useState<number>(gameData?.roundSeq ?? 1)
    const [groupData, setGroupData] = useState<IGroup[][][][]>([])

    const [isRoundEmpty, setIsRoundEmpty] = useState(Array(roundCount).fill(false))

    const getCurrentTime = () => {
        const currentDate = DateUtil.currentDate()
        const currentHour = currentDate.getHours()
        const currentMinute = currentDate.getMinutes()

        return `${currentHour}:${currentMinute}`
    }

    const [currentTime, setCurrentTime] = useState(getCurrentTime())

    const initInfoData = async (gameData?: ISeasonDetail) => {
        if (!gameData) return

        console.log("gameData: " + JSON.stringify(gameData))

        const winnerList = await liveSvc.getWinnersBefore(gameData.GAME_CODE)

        const firstWinner = {
            winnerName: winnerList?.[0]?.nameKo ?? "",
            winnerImg: winnerList?.[0]?.imageUrl ?? "",
        }

        const courseList = await liveSvc.getCompetitionAllCourse(gameData.GAME_CODE)

        // let competitionPeriod = 4
        // try {
        //     const reg = /(\d{4})(\d{2})(\d{2})/g

        //     console.log(gameData.startDate)
        //     console.log(gameData.endDate)

        //     const startDateString = gameData.startDate.replace(reg, "$1-$2-$3")
        //     const endDateString = gameData.endDate.replace(reg, "$1-$2-$3")

        //     competitionPeriod =
        //         Math.round(
        //             (new Date(endDateString).getTime() - new Date(startDateString).getTime()) / (1000 * 60 * 60 * 24)
        //         ) + 1
        // } catch (e) {}

        let competitionPeriod = 4
        try {
            const startDate = dayjs(gameData.startDate, "YYYYMMDD")
            const endDate = dayjs(gameData.endDate, "YYYYMMDD")

            if (startDate.isValid() && endDate.isValid()) {
                competitionPeriod = endDate.diff(startDate, "day") + 1
            } else {
                throw new Error("Invalid date format")
            }
        } catch (e) {}

        setInfoData({
            ...firstWinner,
            prize: gameData.prize ?? "",
            startDate: gameData.startDate ?? "",
            endDate: gameData.endDate ?? "",
            clubName: courseList?.[0]?.clubName ?? "",
            outCourses: courseList?.filter((e: ICourse) => e.hole <= 9) ?? [],
            inCourses: courseList?.filter((e: ICourse) => e.hole > 9) ?? [],
            startTime: gameData.startTime ?? "",
            competitionPeriod: competitionPeriod,
        })

        getGroupData(gameData)
    }

    /*
    const getRoundData = async (gameData?: ISeasonDetail) => {
        if (!gameData) return

        for (let i = 1; i <= 4; i++) {
            const groupEachRound = await liveSvc.getGroupEachRound(gameData.GAME_CODE, i)

            const isEmpty = Object.keys(groupEachRound).length === 0 && groupEachRound.constructor === Object
            setIsRoundEmpty(prevState => {
                const newState = [...prevState]
                newState[i - 1] = isEmpty || !groupEachRound
                return newState
            })
        }
    }
    */

    const getGroupData = async (gameData?: ISeasonDetail) => {
        if (!gameData) return

        const _groupData: IGroup[][][][] = []

        for (var _round = 1; _round < 4 + 1; _round++) {
            const groupEachRound = await liveSvc.getGroupEachRound(gameData.GAME_CODE, _round)
            if (!groupEachRound) return

            const isEmpty = Object.keys(groupEachRound).length === 0 && groupEachRound.constructor === Object
            setIsRoundEmpty(prevState => {
                const newState = [...prevState]
                newState[_round - 1] = isEmpty || !groupEachRound
                return newState
            })

            const groupedArr = ArrayUtil.toUniq(groupEachRound, (a, b) => a.PLAYER_CODE === b.PLAYER_CODE).reduce(
                (acc: IGroup[][], cur: IGroup) => {
                    const foundIndex = acc.findIndex(item => item[0].startTime === cur.startTime)
                    if (foundIndex !== -1) {
                        acc[foundIndex].push(cur)
                    } else {
                        acc.push([cur])
                    }
                    return acc
                },
                []
            )

            const compireTime = (t?: string) => {
                if (!t) return

                return t
                    .split(" ")[0]
                    .split(":")
                    .map(x => +x)
            }

            const sortedGroupedArr = groupedArr.sort((acc, cur) => {
                const AccStartTime = compireTime(acc?.[0]?.startTime)

                const curStartTime = compireTime(cur?.[0]?.startTime)

                if (!AccStartTime || !curStartTime) return 0

                return AccStartTime[0] - curStartTime[0] || AccStartTime[1] - curStartTime[1]
            })

            const transformedArr: IGroup[][][] = sortedGroupedArr.reduce((acc: IGroup[][][], cur: IGroup[]) => {
                const inGroup: IGroup[] = []
                const outGroup: IGroup[] = []

                cur.forEach(item => {
                    if (item.inOut === IN_OUT.IN) {
                        inGroup.push(item)
                    } else if (item.inOut === IN_OUT.OUT) {
                        outGroup.push(item)
                    }
                })

                if (inGroup.length > 0 || outGroup.length > 0) {
                    acc.push([outGroup, inGroup])
                }

                return acc
            }, [])

            _groupData.push(transformedArr)
        }

        setGroupData(_groupData)
    }

    useEffect(() => {
        initInfoData(gameData)
        //getRoundData(gameData)
    }, [gameData])

    /*
    useEffect(() => {
        getGroupData(gameData)
    }, [gameData])
    */

    useEffect(() => {}, [gameData])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(getCurrentTime())
        }, 3000)

        return () => clearInterval(intervalId)
    }, [])

    const prizeChange = (num: number) => {
        const base = 10000
        const digits = num.toString().length
        const level = Math.floor((digits - 1) / 4)
        let result = ""
        let amount = num % base ** (level + 1)
        if (amount >= 10 ** 8) {
            result = Math.floor(amount / 10 ** 8) + "억"
            amount %= 10 ** 8
        }
        if (amount >= base) {
            result += Math.floor(amount / base) + "만"
            amount %= base
        }
        // if (amount > 0) {
            result += amount>0?amount.toLocaleString():'' + "원"
        // }
        let unitIndex = level - 1
        while (unitIndex >= 0) {
            const divider = base ** (unitIndex + 1)
            const quotient = Math.floor(num / divider)
            if (quotient > 0) {
                result += result ? " " : ""
                num -= quotient * divider
            }
            unitIndex--
        }

        return result
    }

    const handlePressRound = (round: number) => () => {
        setRound(round)
    }

    const formatDateRange = (startDate: string, endDate: string) => {
        const startYear = startDate.slice(0, 4)
        const startMonth = Number(startDate.slice(4, 6)).toString()
        const startDay = Number(startDate.slice(6, 8)).toString()
        const endMonth = Number(endDate.slice(4, 6)).toString()
        const endDay = Number(endDate.slice(6, 8)).toString()
        // const startStr = `${startYear}년 ${startMonth}월 ${startDay}일`
        // const endStr = `${endMonth}월 ${endDay}일`
        const result = jsonSvc.formatLocal(jsonSvc.findLocalById("110414"), [
            startYear,
            startMonth,
            startDay,
            endMonth,
            endDay,
        ])
        return result
    }

    const compareTimeColor = (
        currentTimeStr: string,
        groupTimeStr: string,
        groupNextTimeStr: string,
        groupRound: number
    ) => {
        if (!gameData) return { colors: null, backgroundColor: Colors.GRAY13, flexs: "none" }

        const { data } = GameUtil.checkRound(gameData)
        const { current, prev, isEnd } = data.round

        const roundSeq = isEnd ? prev : current

        const currentTime = DateUtil.convertToSeconds(currentTimeStr)
        const groupTime = DateUtil.convertToSeconds(groupTimeStr)
        const groupNextTime = DateUtil.convertToSeconds(groupNextTimeStr)

        const isTimeInGroupRange = currentTime >= groupTime && currentTime < groupNextTime

        const isPlayinSameRound = gameData.gameStatus === GameStatus.LIVE && groupRound == roundSeq

        if (isTimeInGroupRange && isPlayinSameRound) {
            return { colors: Colors.PURPLE, backgroundColor: Colors.PURPLE, flexs: "flex" }
        } else {
            return { colors: null, backgroundColor: Colors.GRAY13, flexs: "none" }
        }
    }

    const GroupList = ({ groupTime, groupNextTime, courseIn, courseOut, currentTime, groupRound }: GroupListProps) => {
        return (
            <View style={{ width: RatioUtil.width(360), flexDirection: "row" }}>
                <View
                    style={{
                        marginTop: RatioUtil.lengthFixedRatio(30),
                        marginLeft: RatioUtil.lengthFixedRatio(20),
                        ...RatioUtil.sizeFixedRatio(40, 36),
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <Text
                        style={{
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(14),
                            textAlign: "center",
                            color: "#000000",
                        }}
                    >
                        {/* {groupTime.replace(/^0/, "")} */}
                        {groupTime.replace(/^0/, "")}
                    </Text>
                    <Text
                        style={{
                            fontWeight: "400",
                            fontSize: RatioUtil.font(14),
                            textAlign: "center",
                            color: "#000000",
                        }}
                    >
                        {groupTime
                            ? groupTime.length === 5 && parseInt(groupTime.slice(0, 2)) >= 12
                                ? jsonSvc.findLocalById("110428")
                                : jsonSvc.findLocalById("110427")
                            : ""}
                    </Text>
                </View>

                <View
                    style={{
                        ...RatioUtil.sizeFixedRatio(8, 8),
                        backgroundColor: compareTimeColor(currentTime, groupTime, groupNextTime, groupRound)
                            .backgroundColor,
                        borderRadius: 100,
                        top: RatioUtil.lengthFixedRatio(37),
                        left: RatioUtil.lengthFixedRatio(68),
                        position: "absolute",
                        zIndex: 1,
                    }}
                />
                <View
                    style={
                        {
                            position: "absolute",
                            ...RatioUtil.sizeFixedRatio(20, 20),
                            backgroundColor: Colors.PURPLE,
                            borderRadius: 100,
                            left: RatioUtil.lengthFixedRatio(62),
                            top: RatioUtil.lengthFixedRatio(31),
                            opacity: 0.2,
                            display: compareTimeColor(currentTime, groupTime, groupNextTime, groupRound).flexs,
                        } as ViewStyle
                    }
                />
                <View
                    style={{
                        marginLeft: RatioUtil.lengthFixedRatio(11.8),
                        marginTop: RatioUtil.lengthFixedRatio(41),
                        width: 1,
                        height: "100%",
                        backgroundColor: Colors.GRAY13,
                    }}
                />
                <View
                    style={{
                        marginLeft: RatioUtil.lengthFixedRatio(72),
                        marginTop: RatioUtil.lengthFixedRatio(30),
                        flex: 1,
                        alignItems: "flex-start",
                    }}
                >
                    {courseOut &&
                        courseOut.map(item => (
                            <PretendText
                                style={{
                                    fontWeight: "400",
                                    fontSize: RatioUtil.font(14),
                                    color: "black",
                                    paddingBottom: RatioUtil.lengthFixedRatio(12),
                                }}
                            >
                                {item.length > 6 ? `${item.slice(0, 6)}...` : item}
                            </PretendText>
                        ))}
                </View>
                <View
                    style={{
                        marginLeft: RatioUtil.lengthFixedRatio(10),
                        marginTop: RatioUtil.lengthFixedRatio(30),
                        flex: 1,
                        alignItems: "flex-start",
                    }}
                >
                    {courseIn &&
                        courseIn.map(item => (
                            <PretendText
                                style={{
                                    fontWeight: "400",
                                    fontSize: RatioUtil.font(14),
                                    color: "black",
                                    paddingBottom: RatioUtil.lengthFixedRatio(12),
                                }}
                            >
                                {item.length > 6 ? `${item.slice(0, 6)}...` : item}
                            </PretendText>
                        ))}
                </View>
            </View>
        )
    }

    return (
        <View>
            <View
                style={{
                    backgroundColor: Colors.GRAY7,
                    ...RatioUtil.sizeFixedRatio(360, 1),
                }}
            />
            <ScrollView>
                {/* <View style={{ ...RatioUtil.size(360, 207), backgroundColor: Colors.WHITE }}>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(18),
                            lineHeight: 27,
                            fontWeight: RatioUtil.fontWeightBold(),
                            position: "absolute",
                            left: RatioUtil.width(20),
                            top: RatioUtil.height(20),
                            color: Colors.BLACK,
                        }}
                    >
                        지난 시즌 우승자
                    </PretendText>
                    <View
                        style={{
                            position: "absolute",
                            left: RatioUtil.width(20),
                            top: RatioUtil.height(57),
                            backgroundColor: Colors.GRAY9,
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
                                ...RatioUtil.size(74, 65.16),
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
                        <Image
                            source={liveImg.winnercheck}
                            style={{
                                position: "absolute",
                                left: RatioUtil.width(154),
                                top: RatioUtil.height(29),
                                ...RatioUtil.size(15, 15),
                                resizeMode: "contain",
                            }}
                        />
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(12),
                                fontWeight: RatioUtil.fontWeightBold(),
                                lineHeight: 15.6,
                                color: Colors.GRAY8,
                                position: "absolute",
                                left: RatioUtil.width(108),
                                top: RatioUtil.height(54),
                            }}
                        >
                            우승상금
                        </PretendText>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(12),
                                fontWeight: RatioUtil.fontWeightBold(),
                                lineHeight: 15.6,
                                color: Colors.GRAY8,
                                position: "absolute",
                                left: RatioUtil.width(108),
                                top: RatioUtil.height(77),
                            }}
                        >
                            최종타수
                        </PretendText>
                        {infoData && (
                            <>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "400",
                                        color: Colors.BLACK,
                                        position: "absolute",
                                        left: RatioUtil.width(108),
                                        top: RatioUtil.height(26),
                                    }}
                                >
                                    {infoData.winnerName}
                                </PretendText>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "400",
                                        lineHeight: 18.2,
                                        color: Colors.BLACK,
                                        position: "absolute",
                                        left: RatioUtil.width(160),
                                        top: RatioUtil.height(53),
                                    }}
                                >
                                    우승상금
                                </PretendText>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "400",
                                        lineHeight: 18.2,
                                        color: Colors.BLACK,
                                        position: "absolute",
                                        left: RatioUtil.width(160),
                                        top: RatioUtil.height(76),
                                    }}
                                >
                                    최종타수
                                </PretendText>
                                <Image
                                    source={{ uri: infoData.winnerImg }}
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
                </View> */}
                <View
                    style={{
                        ...RatioUtil.sizeFixedRatio(360, 399),
                        backgroundColor: Colors.WHITE,
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(18),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.BLACK,
                            position: "absolute",
                            left: RatioUtil.lengthFixedRatio(20),
                            top: RatioUtil.lengthFixedRatio(20),
                        }}
                    >
                        {/* 경기·코스 정보 */}
                        {jsonSvc.findLocalById("110409")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(12),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.GRAY8,
                            position: "absolute",
                            left: RatioUtil.lengthFixedRatio(20),
                            top: RatioUtil.lengthFixedRatio(65),
                        }}
                    >
                        {/* 장소 */}
                        {jsonSvc.findLocalById("7066")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(12),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.GRAY8,
                            position: "absolute",
                            left: RatioUtil.lengthFixedRatio(20),
                            top: RatioUtil.lengthFixedRatio(110),
                        }}
                    >
                        {/* 상금 */}
                        {jsonSvc.findLocalById("7050")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(12),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.GRAY8,
                            position: "absolute",
                            left: RatioUtil.lengthFixedRatio(20),
                            top: RatioUtil.lengthFixedRatio(155),
                        }}
                    >
                        {/* 일정 */}
                        {jsonSvc.findLocalById("7065")}
                    </PretendText>

                    <View
                        style={{
                            ...RatioUtil.sizeFixedRatio(320, 1),
                            backgroundColor: Colors.GRAY15,
                            position: "absolute",
                            left: RatioUtil.lengthFixedRatio(20),
                            top: RatioUtil.lengthFixedRatio(94),
                        }}
                    ></View>
                    {infoData && (
                        <>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                    position: "absolute",
                                    left: RatioUtil.lengthFixedRatio(51),
                                    top: RatioUtil.lengthFixedRatio(63),
                                }}
                            >
                                {infoData?.clubName ?? "-"}
                            </PretendText>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                    position: "absolute",
                                    left: RatioUtil.lengthFixedRatio(51),
                                    top: RatioUtil.lengthFixedRatio(108),
                                }}
                            >
                                {prizeChange(infoData.prize)}
                            </PretendText>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                    position: "absolute",
                                    left: RatioUtil.lengthFixedRatio(51),
                                    top: RatioUtil.lengthFixedRatio(153),
                                }}
                            >
                                {formatDateRange(infoData.startDate, infoData.endDate)}
                            </PretendText>
                        </>
                    )}
                    <View
                        style={{
                            ...RatioUtil.sizeFixedRatio(320, 1),
                            backgroundColor: Colors.GRAY15,
                            position: "absolute",
                            left: RatioUtil.lengthFixedRatio(20),
                            top: RatioUtil.lengthFixedRatio(139),
                        }}
                    ></View>

                    <View
                        style={{
                            ...RatioUtil.sizeFixedRatio(320, 187),
                            backgroundColor: Colors.GRAY11,
                            position: "absolute",
                            left: RatioUtil.lengthFixedRatio(20),
                            top: RatioUtil.lengthFixedRatio(184),
                            borderWidth: 1,
                            borderColor: Colors.GRAY13,
                        }}
                    >
                        <View
                            style={{
                                ...RatioUtil.sizeFixedRatio(49, 30),
                                backgroundColor: Colors.WHITE5,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(10),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* OUT */}
                                {jsonSvc.findLocalById("7057")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                ...RatioUtil.sizeFixedRatio(49, 30),
                                backgroundColor: Colors.GRAY11,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                marginTop: RatioUtil.height(1),
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(10),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* Par */}
                                {jsonSvc.findLocalById("110313")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                ...RatioUtil.sizeFixedRatio(49, 30),
                                backgroundColor: Colors.GRAY11,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                marginTop: RatioUtil.height(1),
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(10),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* yd */}
                                {jsonSvc.findLocalById("110418")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                ...RatioUtil.sizeFixedRatio(49, 30),
                                backgroundColor: Colors.WHITE5,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                marginTop: RatioUtil.height(1),
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(10),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* IN */}
                                {jsonSvc.findLocalById("7058")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                ...RatioUtil.sizeFixedRatio(49, 30),
                                backgroundColor: Colors.GRAY11,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                marginTop: RatioUtil.height(1),
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(10),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* Par */}
                                {jsonSvc.findLocalById("110313")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                ...RatioUtil.sizeFixedRatio(49, 30),
                                backgroundColor: Colors.GRAY11,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                marginTop: RatioUtil.height(1),
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(10),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* yd */}
                                {jsonSvc.findLocalById("110418")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                width: RatioUtil.lengthFixedRatio(268),
                                height: RatioUtil.lengthFixedRatio(30),
                                backgroundColor: Colors.WHITE5,
                                alignItems: "center",
                                position: "absolute",
                                left: RatioUtil.lengthFixedRatio(50),
                            }}
                        >
                            {numbersUp.map(number => (
                                <PretendText
                                    key={number}
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(10),
                                        fontWeight: "400",
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {number}
                                </PretendText>
                            ))}
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                width: RatioUtil.lengthFixedRatio(268),
                                height: RatioUtil.lengthFixedRatio(30),
                                backgroundColor: Colors.WHITE5,
                                alignItems: "center",
                                position: "absolute",
                                left: RatioUtil.lengthFixedRatio(50),
                                top: RatioUtil.lengthFixedRatio(93),
                            }}
                        >
                            {numbersDown.map(number => (
                                <PretendText
                                    key={number}
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(10),
                                        fontWeight: "400",
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {number}
                                </PretendText>
                            ))}
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                width: RatioUtil.lengthFixedRatio(268),
                                height: RatioUtil.lengthFixedRatio(30),
                                backgroundColor: "white",
                                alignItems: "center",
                                position: "absolute",
                                left: RatioUtil.lengthFixedRatio(50),
                                top: RatioUtil.lengthFixedRatio(31),
                            }}
                        >
                            {infoData?.outCourses.map((outCourse: any) => (
                                <PretendText
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(10),
                                        fontWeight: "400",
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {outCourse.par}
                                </PretendText>
                            ))}
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                width: RatioUtil.lengthFixedRatio(268),
                                height: RatioUtil.lengthFixedRatio(30),
                                backgroundColor: "white",
                                alignItems: "center",
                                position: "absolute",
                                left: RatioUtil.lengthFixedRatio(50),
                                top: RatioUtil.lengthFixedRatio(62),
                            }}
                        >
                            {infoData?.outCourses.map((outCourse: any) => (
                                <PretendText
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(10),
                                        fontWeight: "400",
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {outCourse.yard}
                                </PretendText>
                            ))}
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                width: RatioUtil.lengthFixedRatio(268),
                                height: RatioUtil.lengthFixedRatio(30),
                                backgroundColor: "white",
                                alignItems: "center",
                                position: "absolute",
                                left: RatioUtil.lengthFixedRatio(50),
                                top: RatioUtil.lengthFixedRatio(124),
                            }}
                        >
                            {infoData?.inCourses.map((inCourse: any) => (
                                <PretendText
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(10),
                                        fontWeight: "400",
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {inCourse.par}
                                </PretendText>
                            ))}
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                width: RatioUtil.lengthFixedRatio(268),
                                height: RatioUtil.lengthFixedRatio(30),
                                backgroundColor: "white",
                                alignItems: "center",
                                position: "absolute",
                                left: RatioUtil.lengthFixedRatio(50),
                                top: RatioUtil.lengthFixedRatio(155),
                            }}
                        >
                            {infoData?.inCourses.map((inCourse: any) => (
                                <PretendText
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(10),
                                        fontWeight: "400",
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {inCourse.yard}
                                </PretendText>
                            ))}
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        ...RatioUtil.sizeFixedRatio(360, 130),
                        marginTop: RatioUtil.lengthFixedRatio(10),
                        backgroundColor: "white",
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(18),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.BLACK,
                            position: "absolute",
                            left: RatioUtil.lengthFixedRatio(20),
                            top: RatioUtil.lengthFixedRatio(20),
                        }}
                    >
                        {/* 조편성 */}
                        {jsonSvc.findLocalById("8004")}
                    </PretendText>
                    <CustomButton
                        style={{
                            ...RatioUtil.sizeFixedRatio(18, 28),
                            top: RatioUtil.lengthFixedRatio(63),
                            left: RatioUtil.lengthFixedRatio(20),
                            position: "absolute",
                            display: !isRoundEmpty[0] ? "flex" : "none",
                        }}
                        onPress={handlePressRound(1)}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: round === 1 ? Colors.BLACK : Colors.GRAY8,
                            }}
                        >
                            {/* 1R */}
                            {jsonSvc.findLocalById("7041")}
                        </PretendText>
                        {round === 1 ? (
                            <View
                                style={{
                                    ...RatioUtil.sizeFixedRatio(18, 2),
                                    backgroundColor: Colors.BLACK,
                                    borderRadius: 15,
                                    position: "absolute",
                                    bottom: 0,
                                    display: !isRoundEmpty[0] ? "flex" : "none",
                                }}
                            ></View>
                        ) : null}
                    </CustomButton>
                    {infoData?.competitionPeriod > 1 && (
                        <CustomButton
                            style={{
                                ...RatioUtil.sizeFixedRatio(18, 28),
                                top: RatioUtil.lengthFixedRatio(63),
                                left: RatioUtil.lengthFixedRatio(68),
                                position: "absolute",
                                display: !isRoundEmpty[1] ? "flex" : "none",
                            }}
                            onPress={handlePressRound(2)}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: round === 2 ? Colors.BLACK : Colors.GRAY8,
                                }}
                            >
                                {/* 2R */}
                                {jsonSvc.findLocalById("7042")}
                            </PretendText>
                            {round === 2 ? (
                                <View
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(18, 2),
                                        backgroundColor: Colors.BLACK,
                                        borderRadius: 15,
                                        position: "absolute",
                                        bottom: 0,
                                        display: !isRoundEmpty[1] ? "flex" : "none",
                                    }}
                                ></View>
                            ) : null}
                        </CustomButton>
                    )}
                    {infoData?.competitionPeriod > 2 && (
                        <CustomButton
                            style={{
                                ...RatioUtil.sizeFixedRatio(18, 28),
                                top: RatioUtil.lengthFixedRatio(63),
                                left: RatioUtil.lengthFixedRatio(116),
                                position: "absolute",
                                display: !isRoundEmpty[2] ? "flex" : "none",
                            }}
                            onPress={handlePressRound(3)}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: round === 3 ? Colors.BLACK : Colors.GRAY8,
                                }}
                            >
                                {/* 3R */}
                                {jsonSvc.findLocalById("7043")}
                            </PretendText>
                            {round === 3 ? (
                                <View
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(18, 2),
                                        backgroundColor: Colors.BLACK,
                                        borderRadius: 15,
                                        position: "absolute",
                                        bottom: 0,
                                        display: !isRoundEmpty[2] ? "flex" : "none",
                                    }}
                                ></View>
                            ) : null}
                        </CustomButton>
                    )}
                    {infoData?.competitionPeriod > 3 && (
                        <CustomButton
                            style={{
                                ...RatioUtil.sizeFixedRatio(18, 28),
                                top: RatioUtil.lengthFixedRatio(63),
                                left: RatioUtil.lengthFixedRatio(164),
                                position: "absolute",
                                display: !isRoundEmpty[3] ? "flex" : "none",
                            }}
                            onPress={handlePressRound(4)}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: round === 4 ? Colors.BLACK : Colors.GRAY8,
                                }}
                            >
                                {/* 4R */}
                                {jsonSvc.findLocalById("7044")}
                            </PretendText>
                            {round === 4 ? (
                                <View
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(18, 2),
                                        backgroundColor: Colors.BLACK,
                                        borderRadius: 15,
                                        position: "absolute",
                                        bottom: 0,
                                        display: !isRoundEmpty[3] ? "flex" : "none",
                                    }}
                                ></View>
                            ) : null}
                        </CustomButton>
                    )}
                    <View
                        style={{
                            ...RatioUtil.sizeFixedRatio(360, 44),
                            backgroundColor: Colors.GRAY9,
                            position: "absolute",
                            top: RatioUtil.lengthFixedRatio(91),
                            borderWidth: 1,
                            borderColor: Colors.GRAY13,
                            justifyContent: "center",
                            display: groupData.length ? "flex" : "none",
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.GRAY8,
                                position: "absolute",
                                width: RatioUtil.lengthFixedRatio(84),
                                left: RatioUtil.lengthFixedRatio(120),
                                textAlign: "center",
                            }}
                        >
                            {/* 1번티 OUT */}
                            {jsonSvc.findLocalById("110424")}
                        </PretendText>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.GRAY8,
                                position: "absolute",
                                width: RatioUtil.lengthFixedRatio(80),
                                left: RatioUtil.lengthFixedRatio(235),
                                textAlign: "center",
                            }}
                        >
                            {/* 10번티 IN */}
                            {jsonSvc.findLocalById("110425")}
                        </PretendText>
                    </View>
                </View>
                {groupData.length >= round && groupData[round - 1].length > 0 ? (
                    <View style={{ flexGrow: 1 }}>
                        <View>
                            {groupData[round - 1].map((group: IGroup[][], index: number) => {
                                const groups = group[0][0] ? group[0][0] : group[1][0]

                                const groupNextTime =
                                    index + 1 <= groupData[round - 1].length - 1
                                        ? groupData[round - 1][index + 1][0].length
                                            ? groupData[round - 1][index + 1][0][0].startTime
                                            : groupData[round - 1][index + 1][1][0].startTime
                                        : "24:00"

                                return (
                                    <GroupList
                                        groupTime={groups?.startTime ?? ""}
                                        groupNextTime={groupNextTime}
                                        currentTime={currentTime}
                                        courseOut={group[0]?.map(e => e.nameKo)}
                                        courseIn={group[1]?.map(e => e.nameKo)}
                                        groupRound={groups.ROUND_CODE}
                                    />
                                )
                            })}
                        </View>
                    </View>
                ) : (
                    <View
                        style={{
                            ...RatioUtil.size(360, 280),
                            paddingTop: RatioUtil.height(50),
                            backgroundColor: Colors.WHITE,
                        }}
                    >
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Image
                                source={liveImg.noData}
                                style={{
                                    width: RatioUtil.height(100),
                                    height: RatioUtil.height(100),
                                    marginBottom: RatioUtil.height(10),
                                }}
                                resizeMode="contain"
                            />
                        </View>
                        <PretendText style={{ textAlign: "center", color: Colors.GRAY2, fontSize: RatioUtil.font(14) }}>
                            {"조편성 정보가 \n아직 준비 되지 않았어요!"}
                        </PretendText>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

export default InfoTab

interface IInfoTab {
    gameData?: ISeasonDetail
}
type GroupListProps = {
    groupTime: string
    groupNextTime: string
    courseIn: string[]
    courseOut: string[]
    currentTime: any
    groupRound: number
}

const numbersUp = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const numbersDown = [10, 11, 12, 13, 14, 15, 16, 17, 18]
const roundCount = 4
