import { useState } from "react"
import { FlatList, Image, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAsyncEffect, useScreen } from "hooks"
import { RatioUtil, navigate } from "utils"
import { AnalyticsEventName, Colors, Screen, ScreenParams } from "const"
import { useRoute, RouteProp } from "@react-navigation/native"
import React from "react"
import { PretendText } from "components/utils"
import { jsonSvc, rankSvc } from "apis/services"
import { ListItemRank } from "../ranking.itemList"
import { rankStyle } from "styles"
import moment from "moment"
import { liveImg } from "assets/images"
import { Analytics } from "utils/analytics.util"
import { RankUtil } from "utils/rank.util"
import { TabIndex } from "const/rank.const"
const PRODETAIL = (props: any) => {
    const route = useRoute<RouteProp<ScreenParams, Screen.RANKDETAIL>>()
    const [indexChoose, setIndexChoose] = useState(route.params.tabIndex == 1 ? route.params.subTabIndex : 0)
    const [weekCode, setWeekCode] = useState<number>(
        parseInt(moment.unix(moment().startOf("isoWeek").unix()).format("YYYYMMDD"))
    )
    const [dataRankRevenuePro, setDataRankRevenuePro] = useState<
        {
            playerCode?: number
            score: number
            rank: number
            info?: {
                ICON_TYPE: number
                ICON_NAME: string
                NICK: string
                USER_SEQ: number
            }
            info_player?: {
                nID?: number
                nPersonID?: number
                nSeasonKey?: number
                nChoiceSalesAmount?: number
                sPublishYear?: string
                sPlayerName?: string
                sBirth?: Date | string
                sTeam?: string
                sDebut?: string
                sPlayerImagePath?: string
                sPlayerthumbnailImagePath?: string
            }
        }[]
    >()
    const [dataRankSponsorPro, setDataRankSponsorPro] = useState<
        {
            playerCode?: number
            score: number
            rank: number
            info?: {
                ICON_TYPE: number
                ICON_NAME: string
                NICK: string
                USER_SEQ: number
            }
            info_player?: {
                nID?: number
                nPersonID?: number
                nSeasonKey?: number
                nChoiceSalesAmount?: number
                sPublishYear?: string
                sPlayerName?: string
                sBirth?: Date | string
                sTeam?: string
                sDebut?: string
                sPlayerImagePath?: string
                sPlayerthumbnailImagePath?: string
            }
        }[]
    >()
    const [dataRankHeartPro, setDataRankHeartPro] = useState<
        {
            playerCode?: number
            score: number
            rank: number
            info?: {
                ICON_TYPE: number
                ICON_NAME: string
                NICK: string
                USER_SEQ: number
            }

            info_player?: {
                nID?: number
                nPersonID?: number
                nSeasonKey?: number
                nChoiceSalesAmount?: number
                sPublishYear?: string
                sPlayerName?: string
                sBirth?: Date | string
                sTeam?: string
                sDebut?: string
                sPlayerImagePath?: string
                sPlayerthumbnailImagePath?: string
            }
        }[]
    >()
    const [dataRankPopularityPro, setDataRankPopularityPro] = useState<
        {
            playerCode?: number
            score: number
            rank: number
            info?: {
                ICON_TYPE: number
                ICON_NAME: string
                NICK: string
                USER_SEQ: number
            }
            info_player?: {
                nID?: number
                nPersonID?: number
                nSeasonKey?: number
                nChoiceSalesAmount?: number
                sPublishYear?: string
                sPlayerName?: string
                sBirth?: Date | string
                sTeam?: string
                sDebut?: string
                sPlayerImagePath?: string
                sPlayerthumbnailImagePath?: string
            }
        }[]
    >()

    const getData = (index: number) => {
        switch (index) {
            case 0:
                ;(async () => {
                    await rankSvc.rankRevenuePro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankRevenuePro(data.rankPlayers)
                        setIsRefreshing(false)
                    })
                })()
                setInterval(async () => {
                    await rankSvc.rankRevenuePro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankRevenuePro(data.rankPlayers)
                        setIsRefreshing(false)
                    })
                }, 1000 * 60 * 5) // 5분
                break
            case 1:
                ;(async () => {
                    rankSvc.rankSponsorPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankSponsorPro(data.rankPlayers)
                        setIsRefreshing(false)
                    })
                })()
                setInterval(async () => {
                    rankSvc.rankSponsorPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankSponsorPro(data.rankPlayers)
                        setIsRefreshing(false)
                    })
                }, 1000 * 60 * 5) // 5분
                break
            case 2:
                ;(async () => {
                    await rankSvc.rankHeartPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankHeartPro(data.rankPlayers)
                        setIsRefreshing(false)
                    })
                })()
                setInterval(async () => {
                    await rankSvc.rankHeartPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankHeartPro(data.rankPlayers)
                        setIsRefreshing(false)
                    })
                }, 1000 * 60 * 5) // 5분
                break
            case 3:
                ;(async () => {
                    await rankSvc.rankPopularityPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankPopularityPro(data.rankPlayers)
                        setIsRefreshing(false)
                    })
                })()
                setInterval(async () => {
                    await rankSvc.rankPopularityPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankPopularityPro(data.rankPlayers)
                        setIsRefreshing(false)
                    })
                }, 1000 * 60 * 5) // 5분
                break
        }
    }
    useScreen(() => {
        getData(indexChoose)
    }, [indexChoose])

    useAsyncEffect(async () => {
        const eventInfo = RankUtil.findEventName({ tabIndex: TabIndex.FAN, subIndex: indexChoose })
        await Analytics.logEvent(
            AnalyticsEventName[`view_detail_${eventInfo.indexName}_${eventInfo.indexNumber}` as AnalyticsEventName],
            {
                hasNewUserData: true,
            }
        )
    }, [indexChoose])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const onRefresh = () => {
        setIsRefreshing(true)
        getData(indexChoose)
    }

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginTop: RatioUtil.lengthFixedRatio(20),
                    marginLeft: RatioUtil.lengthFixedRatio(20),
                    marginRight: RatioUtil.lengthFixedRatio(20),
                    height: RatioUtil.lengthFixedRatio(34),
                }}
            >
                <FlatList
                    horizontal
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    data={[
                        { label: jsonSvc.findLocalById("150054") },
                        // { label: 수익 },
                        { label: jsonSvc.findLocalById("150068") },
                        // { label: 후원수 },
                        { label: jsonSvc.findLocalById("150070") },
                        // { label: 하트 },
                        { label: jsonSvc.findLocalById("7031") },
                        // { label : 프로필 },
                    ]}
                    keyExtractor={(item: { label: any }) => item.label}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={{ ...RatioUtil.margin(0, 2, 0, 2) }}
                            onPress={() => setIndexChoose(index)}
                        >
                            <View
                                style={{
                                    ...RatioUtil.borderRadius(20, 20, 20, 20),
                                    ...RatioUtil.sizeFixedRatio(60, 34),
                                    borderWidth: 1,
                                    borderColor: Colors.GRAY13,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: indexChoose == index ? Colors.BLACK : Colors.WHITE,
                                }}
                            >
                                <PretendText
                                    allowFontScaling={false}
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: indexChoose == index ? Colors.WHITE : Colors.BLACK,
                                    }}
                                >
                                    {item.label}
                                </PretendText>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ...RatioUtil.sizeFixedRatio(360, 44),
                    marginTop: RatioUtil.lengthFixedRatio(10),
                    ...RatioUtil.paddingFixedRatio(0, 20, 0, 20),
                }}
            >
                <View
                    style={{
                        width: RatioUtil.width(90),
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <PretendText
                        style={{
                            width: RatioUtil.width(40),
                            fontSize: RatioUtil.font(14),
                            color: Colors.GRAY18,
                            textAlign: "center",
                        }}
                    >
                        {jsonSvc.findLocalById("7030")}
                    </PretendText>
                    <PretendText
                        style={{
                            width: RatioUtil.width(40),
                            fontSize: RatioUtil.font(14),
                            color: Colors.GRAY18,
                            textAlign: "center",
                        }}
                    >
                        {jsonSvc.findLocalById("7031")}
                    </PretendText>
                </View>
                <PretendText style={{ fontSize: RatioUtil.font(14), color: Colors.GRAY18, textAlign: "center" }}>
                    {text(indexChoose)}
                </PretendText>
            </View>
            <View style={{ ...RatioUtil.sizeFixedRatio(360, 1), borderTopWidth: 1, borderColor: Colors.GRAY13 }} />
            {(dataRankRevenuePro?.length == 0 && indexChoose == 0) ||
            (dataRankSponsorPro?.length == 0 && indexChoose == 1) ||
            (dataRankHeartPro?.length == 0 && indexChoose == 2) ||
            (dataRankPopularityPro?.length == 0 && indexChoose == 3) ? (
                <View
                    style={{
                        ...RatioUtil.sizeFixedRatio(360, 128),
                        ...rankStyle.header.center,
                        flexDirection: "column",
                        marginTop: RatioUtil.height(100),
                    }}
                >
                    <Image
                        source={liveImg.noData}
                        style={{
                            width: RatioUtil.width(100),
                            height: RatioUtil.width(100),
                        }}
                    />
                    <PretendText
                        style={{
                            marginTop: RatioUtil.lengthFixedRatio(10),
                            fontSize: RatioUtil.font(14),
                            color: Colors.GRAY2,
                            fontWeight: "400",
                        }}
                    >
                        {/* 랭킹이 없음 */}
                        {jsonSvc.findLocalById("150003")}
                    </PretendText>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={{ paddingBottom: 100 }}
                    onRefresh={onRefresh}
                    refreshing={isRefreshing}
                    style={RatioUtil.paddingFixedRatio(10, 0, 0, 0)}
                    data={
                        indexChoose == 0
                            ? dataRankRevenuePro
                            : indexChoose == 1
                            ? dataRankSponsorPro
                            : indexChoose == 2
                            ? dataRankHeartPro
                            : indexChoose == 3
                            ? dataRankPopularityPro
                            : []
                    }
                    renderItem={({ item, index }) => (
                        <ListItemRank
                            data={item}
                            type="pro"
                            index={index}
                            onPress={async () => {
                                if (indexChoose == 0) {
                                    await Analytics.logEvent(AnalyticsEventName.click_feverfan_150, {
                                        hasNewUserData: true,
                                    })
                                    navigate(Screen.PASSIONATEFANS, { info_player: item?.info_player })
                                }
                            }}
                        />
                    )}
                />
            )}
        </View>
    )
}

const text = (index: number) => {
    switch (index) {
        case 0:
            // return 수익
            return jsonSvc.findLocalById("150054")
        case 1:
            // return 후원받은횟수
            return jsonSvc.findLocalById("150055")
        case 2:
            // return 하트받은횟수
            return jsonSvc.findLocalById("150057")
        case 3:
            // return 프로필UP수
            return jsonSvc.findLocalById("150020")
    }
}

export default PRODETAIL
