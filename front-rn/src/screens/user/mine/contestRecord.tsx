import { ActivityIndicator, BackHandler, Image, ScrollView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { CustomButton, PretendText } from "components/utils"
import { ProfileHeader } from "components/layouts"
import { mineGStyle, mineStyle } from "styles"
import { DateUtil, RatioUtil, navigate } from "utils"
import { Colors, GameStatus, REWARD_TYPE, Screen } from "const"
import { coninImg, liveImg, myPageImg } from "assets/images"
import { SafeAreaView } from "react-native-safe-area-context"
import { liveSvc } from "apis/services/live.svc"
import { jsonSvc } from "apis/services"
import { SvgIcon } from "components/Common/SvgIcon"

const ContestRecord = () => {
    const [record, setRecord] = useState<
        {
            title: string
            date: string
            data: {
                title: string
                subTitle: string
                value: { point: number; type: Type | null }[]
                // rewardBdstSum: number
                // rewardTrainingSum: number
                // type: Type | null
            }[]
            isOpen: boolean
        }[]
    >([])
    const [loading, setLoading] = useState(false)
    const getRecords = async () => {
        const seasonKey = await liveSvc.getSetSeason()

        if (!seasonKey) return

        const gameList = await liveSvc.getGameList(seasonKey)

        const recordList = gameList
            .filter(v => v.gameStatus === GameStatus.END)
            .sort((a, b) => new Date(a.BEGIN_AT).getTime() - new Date(b.BEGIN_AT).getTime())

        const asyncRecordReward = recordList.map(async v => {
            const beginDate = DateUtil.format(v.BEGIN_AT)
            const endDate = DateUtil.format(v.END_AT)

            const { REWARDS } = await liveSvc.getMyRewardedList(v.GAME_CODE)

            const data = REWARDS.map(reward => {
                let title = ""
                // let type = null

                switch (reward.REWARD_TYPE) {
                    case REWARD_TYPE.TOUR:
                        // title = "투어 보상"
                        title = jsonSvc.findLocalById("170008")
                        // type = Type.BDST
                        break
                    case REWARD_TYPE.CHEER:
                        // title = "응원랭킹 보상"
                        title = jsonSvc.findLocalById("170009")
                        // type = Type.BDST
                        break
                    case REWARD_TYPE.WEEK:
                        //  title = "랭크 보상"
                        title = jsonSvc.findLocalById("170010")
                        // type = Type.POINT
                        break
                    case REWARD_TYPE.CHATBOT:
                        // title = "라이브중계 보상"
                        title = jsonSvc.findLocalById("170011")
                        // type = Type.POINT
                        break
                    default:
                        break
                }

                const { rewardTrainingSum, rewardBdstSum } = reward.REWARD_DATA.reduce(
                    (accumulator, current) => {
                        const rewardTraining = current.REWARD_TRAINING || 0
                        const rewardBdst = current.REWARD_BDST || 0

                        accumulator.rewardTrainingSum += rewardTraining
                        accumulator.rewardBdstSum += rewardBdst

                        return accumulator
                    },
                    { rewardTrainingSum: 0, rewardBdstSum: 0 }
                )

                return {
                    title,
                    subTitle: "",
                    value: [
                        { point: parseFloat(rewardTrainingSum.toFixed(1)), type: Type.POINT },
                        { point: parseFloat(rewardBdstSum.toFixed(1)), type: Type.BDST },
                    ],
                    // type,
                }
            }).filter(item => item.value[0].point !== 0 || item.value[1].point !== 0)

            return {
                title: v.gameName,
                // date: `${beginDate?.month}월 ${beginDate?.day}일 ~ ${endDate?.month}월 ${endDate?.day}일`,
                date: jsonSvc.formatLocal(jsonSvc.findLocalById("170007"), [
                    (beginDate.month ?? "").toString(),
                    (beginDate.day ?? "").toString(),
                    (endDate.month ?? "").toString(),
                    (endDate.day ?? "").toString(),
                ]),
                data,
                isOpen: false,
            }
        })
        const list = (await Promise.all(asyncRecordReward)).slice(-10).reverse()
        setRecord(list)
        setLoading(true)
    }
    useEffect(() => {
        const backAction = () => {
            navigate(Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])
    useEffect(() => {
        getRecords()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            {/* <ProfileHeader title="대회 기록" /> */}
            <ProfileHeader title={jsonSvc.findLocalById("170004")} />
            <ScrollView style={mineGStyle.bgCon}>
                {!loading ? (
                    <View
                        style={{
                            marginTop: RatioUtil.height(250),
                        }}
                    >
                        <ActivityIndicator size={50} color={Colors.GRAY10} />
                    </View>
                ) : record.length ? (
                    record.map((v, i) => (
                        <CustomButton
                            key={v.title}
                            style={{
                                width: RatioUtil.width(360),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => {
                                setRecord(list =>
                                    list.map(value =>
                                        value.title === v.title ? { ...value, isOpen: !value.isOpen } : value
                                    )
                                )
                            }}
                        >
                            <View style={mineStyle.record.listCon}>
                                <View>
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "600",
                                            lineHeight: RatioUtil.font(14) * 1.4,
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {v.date}
                                    </PretendText>
                                    <PretendText style={mineStyle.record.listTitleText}>{v.title}</PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(24),
                                        height: RatioUtil.width(24),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <SvgIcon
                                        name="Arrow"
                                        style={{
                                            width: RatioUtil.width(7),
                                            height: RatioUtil.height(12),
                                            transform: [{ rotate: v.isOpen ? "-0deg" : "180deg" }],
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={mineGStyle.grayBar} />
                            {v.isOpen ? (
                                v.data.length ? (
                                    <View
                                        style={{
                                            width: RatioUtil.width(360),
                                            paddingHorizontal: RatioUtil.width(20),
                                            paddingBottom: RatioUtil.width(20),
                                            backgroundColor: Colors.GRAY9,
                                        }}
                                    >
                                        {v.data.map((e, j) => {
                                            return (
                                                <View>
                                                    {e.value.map((item, index) => {
                                                        return (
                                                            <View key={index} style={mineStyle.record.dataCon}>
                                                                <View
                                                                    style={{
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        height: RatioUtil.height(40),
                                                                    }}
                                                                >
                                                                    <View style={mineStyle.record.icon}>
                                                                        {/* <Image
                                                                            style={{ width: "50%", height: "50%" }}
                                                                            source={
                                                                                item.type
                                                                                    ? coninImg.birdie
                                                                                    : coninImg.point
                                                                            }
                                                                        /> */}

                                                                        <SvgIcon
                                                                            name={item.type ? "Birdie" : "Point"}
                                                                            style={{ width: "50%", height: "50%" }}
                                                                        />
                                                                    </View>
                                                                    <View>
                                                                        <PretendText
                                                                            style={{
                                                                                fontSize: RatioUtil.font(16),
                                                                                fontWeight: "600",
                                                                                lineHeight: RatioUtil.font(16) * 1.4,
                                                                                color: Colors.BLACK2,
                                                                            }}
                                                                        >
                                                                            {e.title}
                                                                        </PretendText>
                                                                        {e.subTitle ? (
                                                                            <PretendText
                                                                                style={{
                                                                                    fontSize: RatioUtil.font(12),
                                                                                    fontWeight: "400",
                                                                                    lineHeight:
                                                                                        RatioUtil.font(12) * 1.4,
                                                                                    color: Colors.GRAY8,
                                                                                }}
                                                                            >
                                                                                {e.subTitle}
                                                                            </PretendText>
                                                                        ) : null}
                                                                    </View>
                                                                </View>
                                                                <View>
                                                                    <PretendText style={mineStyle.record.valueText}>
                                                                        {jsonSvc.formatLocal(
                                                                            jsonSvc.findLocalById("170014"),
                                                                            [item.point.toString()]
                                                                        )}
                                                                    </PretendText>
                                                                    <PretendText style={mineStyle.record.typeText}>
                                                                        {item.type
                                                                            ? jsonSvc.findLocalById("10001")
                                                                            : jsonSvc.findLocalById("170036")}
                                                                    </PretendText>
                                                                </View>
                                                            </View>
                                                        )
                                                    })}
                                                </View>
                                            )
                                        })}
                                    </View>
                                ) : (
                                    <View style={mineStyle.record.emptyListCon}>
                                        <PretendText
                                            style={{
                                                fontSize: RatioUtil.font(16),
                                                fontWeight: "600",
                                                lineHeight: RatioUtil.font(16) * 1.4,
                                                color: Colors.GRAY12,
                                            }}
                                        >
                                            {/* 보상목록이 없습니다. */}
                                            {jsonSvc.findLocalById("170037")}
                                        </PretendText>
                                    </View>
                                )
                            ) : null}
                        </CustomButton>
                    ))
                ) : (
                    <View style={{ ...mineGStyle.bgCon, alignItems: "center" }}>
                        <View style={mineStyle.record.emptyIcon}>
                            <Image
                                source={liveImg.noData}
                                style={{
                                    ...RatioUtil.size(100, 100),
                                }}
                            />
                        </View>
                        <PretendText style={mineStyle.record.emptyText}>
                            {/* 대회 기록이 없습니다. */}
                            {jsonSvc.findLocalById("170038")}
                        </PretendText>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default ContestRecord
const enum Type {
    POINT = 0,
    BDST = 1,
}
const recordList = [
    {
        title: "S-OIL 챔피언십 2022",
        date: "10월 31일 ~ 11월 6일",
        data: [
            { title: "투어 보상", subTitle: "", value: "76", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "다시 보기 보상", value: "40", type: Type.POINT },
            { title: "응원랭킹 보상", subTitle: "", value: "500", type: Type.BDST },
            {
                title: "이벤트 보상",
                subTitle: "운영자 및 시스템 발송",

                value: "300",
                type: Type.BDST,
            },
            { title: "라이브중계 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "랭크 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "다시 보기 보상", subTitle: "", value: "40", type: Type.POINT },
        ],
        isOpen: true,
    },
    {
        title: "SK 네트웍스 서울경제 레이디스 클래식",
        date: "10월 31일 ~ 11월 6일",
        data: [
            { title: "투어 보상", subTitle: "", value: "76", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "다시 보기 보상", value: "40", type: Type.POINT },
            { title: "응원랭킹 보상", subTitle: "", value: "500", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "운영자 및 시스템 발송", value: "300", type: Type.BDST },
            { title: "라이브중계 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "랭크 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "다시 보기 보상", subTitle: "", value: "40", type: Type.POINT },
        ],
        isOpen: false,
    },
    {
        title: "WEMIX 챔피언십 with 와우매니지먼트그룹 SBS Golf",
        date: "10월 31일 ~ 11월 6일",
        data: [
            { title: "투어 보상", subTitle: "", value: "76", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "다시 보기 보상", value: "40", type: Type.POINT },
            { title: "응원랭킹 보상", subTitle: "", value: "500", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "운영자 및 시스템 발송", value: "300", type: Type.BDST },
            { title: "라이브중계 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "랭크 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "다시 보기 보상", subTitle: "", value: "40", type: Type.POINT },
        ],
        isOpen: false,
    },
    {
        title: "S-OIL 챔피언십2 2022",
        date: "10월 31일 ~ 11월 6일",
        data: [
            { title: "투어 보상", subTitle: "", value: "76", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "다시 보기 보상", value: "40", type: Type.POINT },
            { title: "응원랭킹 보상", subTitle: "", value: "500", type: Type.BDST },
            {
                title: "이벤트 보상",
                subTitle: "운영자 및 시스템 발송",

                value: "300",
                type: Type.BDST,
            },
            { title: "라이브중계 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "랭크 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "다시 보기 보상", subTitle: "", value: "40", type: Type.POINT },
        ],
        isOpen: false,
    },
    {
        title: "SK 네트웍스 서울경제 레이디스 클래식2",
        date: "10월 31일 ~ 11월 6일",
        data: [
            { title: "투어 보상", subTitle: "", value: "76", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "다시 보기 보상", value: "40", type: Type.POINT },
            { title: "응원랭킹 보상", subTitle: "", value: "500", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "운영자 및 시스템 발송", value: "300", type: Type.BDST },
            { title: "라이브중계 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "랭크 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "다시 보기 보상", subTitle: "", value: "40", type: Type.POINT },
        ],
        isOpen: false,
    },
    {
        title: "WEMIX 챔피언십 with 와우매니지먼트그룹 SBS Golf2",
        date: "10월 31일 ~ 11월 6일",
        data: [
            { title: "투어 보상", subTitle: "", value: "76", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "다시 보기 보상", value: "40", type: Type.POINT },
            { title: "응원랭킹 보상", subTitle: "", value: "500", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "운영자 및 시스템 발송", value: "300", type: Type.BDST },
            { title: "라이브중계 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "랭크 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "다시 보기 보상", subTitle: "", value: "40", type: Type.POINT },
        ],
        isOpen: false,
    },
    {
        title: "S-OIL 챔피언십3 2022",
        date: "10월 31일 ~ 11월 6일",
        data: [
            { title: "투어 보상", subTitle: "", value: "76", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "다시 보기 보상", value: "40", type: Type.POINT },
            { title: "응원랭킹 보상", subTitle: "", value: "500", type: Type.BDST },
            {
                title: "이벤트 보상",
                subTitle: "운영자 및 시스템 발송",

                value: "300",
                type: Type.BDST,
            },
            { title: "라이브중계 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "랭크 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "다시 보기 보상", subTitle: "", value: "40", type: Type.POINT },
        ],
        isOpen: false,
    },
    {
        title: "SK 네트웍스 서울경제 레이디스 클래식3",
        date: "10월 31일 ~ 11월 6일",
        data: [],
        isOpen: false,
    },
    {
        title: "WEMIX 챔피언십 with 와우매니지먼트그룹 SBS Golf3",
        date: "10월 31일 ~ 11월 6일",
        data: [
            { title: "투어 보상", subTitle: "", value: "76", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "다시 보기 보상", value: "40", type: Type.POINT },
            { title: "응원랭킹 보상", subTitle: "", value: "500", type: Type.BDST },
            { title: "이벤트 보상", subTitle: "운영자 및 시스템 발송", value: "300", type: Type.BDST },
            { title: "라이브중계 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "랭크 보상", subTitle: "", value: "20", type: Type.POINT },
            { title: "다시 보기 보상", subTitle: "", value: "40", type: Type.POINT },
        ],
        isOpen: false,
    },
]
