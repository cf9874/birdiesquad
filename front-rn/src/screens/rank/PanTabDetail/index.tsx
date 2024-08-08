import { useState } from "react"
import { FlatList, Image, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAsyncEffect, useScreen } from "hooks"
import { NumberUtil, RatioUtil, navigate } from "utils"
import { AnalyticsEventName, Colors, Screen, ScreenParams } from "const"
import { useRoute, RouteProp } from "@react-navigation/native"
import React from "react"
import { PretendText } from "components/utils"
import { jsonSvc, profileSvc, rankSvc } from "apis/services"
import { IMyRankDonation, IMyRankMost } from "apis/data/rank.data"
import { ListItemRank } from "../ranking.itemList"
import { rankStyle } from "styles"
import nftPlayerJson from "json/nft_player.json"
import moment from "moment"
import { IMyProfile } from "apis/data"
import { liveImg } from "assets/images"
import { Analytics } from "utils/analytics.util"
import { RankUtil } from "utils/rank.util"
import { TabIndex } from "const/rank.const"
const PANDETAIL = (props: any) => {
    const route = useRoute<RouteProp<ScreenParams, Screen.RANKDETAIL>>()
    const [indexChoose, setIndexChoose] = useState(route.params.tabIndex == 0 ? route.params.subTabIndex : 0)
    const [weekCode, setWeekCode] = useState<number>(
        parseInt(moment.unix(moment().startOf("isoWeek").unix()).format("YYYYMMDD"))
    )

    const [dataRankMost, setDataRankMost] = useState<
        {
            playerCode?: number
            score: number
            rank: number
            info?: {
                ICON_TYPE: number
                ICON_NAME: string
                NICK: string
                HELLO?: string
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
            }
        }[]
    >()
    const [dataRankDonation, setDataRankDonation] = useState<
        {
            player_code?: number
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
            }
        }[]
    >()
    const [dataRankSponsor, setDataRankSponsor] = useState<
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
            }
        }[]
    >()
    const [dataRankHeart, setDataRankHeart] = useState<
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
            }
        }[]
    >()
    const [dataRankPopularity, setDataRankPopularity] = useState<
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
            }
        }[]
    >()
    const [dataMyMost, setDataMyMost] = useState<IMyRankMost>()
    const [dataMyDonation, setDataMyDonation] = useState<IMyRankDonation>()
    const [dataMySponsor, setDataMySponsor] = useState<IMyRankDonation>()
    const [dataMyHeart, setDataMyHeart] = useState<IMyRankDonation>()
    const [dataMyPopularity, setDataMyPopularity] = useState<IMyRankDonation>()

    const getData = (index: number) => {
        switch (index) {
            case 0:
                ;(async () => {
                    await rankSvc.rankMost({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankMost(data.rankMost)
                        setIsRefreshing(false)
                    })
                })()
                rankSvc.myRankMost({ weekcode: weekCode }).then(data => {
                    setDataMyMost(data)
                })
                setInterval(async () => {
                    await rankSvc.rankMost({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankMost(data.rankMost)
                        setIsRefreshing(false)
                    })
                }, 1000 * 60 * 5) // 5분
                break
            case 1:
                ;(async () => {
                    rankSvc.rankDonation({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankDonation(data.rankDonation)
                        setIsRefreshing(false)
                    })
                })()
                rankSvc.myRankDonation({ weekcode: weekCode }).then(data => {
                    setDataMyDonation(data)
                })
                setInterval(async () => {
                    rankSvc.rankDonation({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankDonation(data.rankDonation)
                        setIsRefreshing(false)
                    })
                }, 1000 * 60 * 5) // 5분
                break
            case 2:
                ;(async () => {
                    await rankSvc.rankSponsor({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankSponsor(data.rankSponsor)
                        setIsRefreshing(false)
                    })
                })()
                rankSvc.myRankSponsor({ weekcode: weekCode }).then(data => {
                    setDataMySponsor(data)
                })
                setInterval(async () => {
                    await rankSvc.rankSponsor({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankSponsor(data.rankSponsor)
                        setIsRefreshing(false)
                    })
                }, 1000 * 60 * 5) // 5분
                break
            case 3:
                ;(async () => {
                    await rankSvc.rankHeart({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankHeart(data.rankHeart)
                        setIsRefreshing(false)
                    })
                })()
                rankSvc.myRankHeart({ weekcode: weekCode }).then(data => {
                    setDataMyHeart(data)
                })
                setInterval(async () => {
                    await rankSvc.rankHeart({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankHeart(data.rankHeart)
                        setIsRefreshing(false)
                    })
                }, 1000 * 60 * 5) // 5분
                break
            case 4:
                ;(async () => {
                    await rankSvc.rankPopularity({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankPopularity(data.rankPopularity)
                        setIsRefreshing(false)
                    })
                })()
                rankSvc.myRankPopularity({ weekcode: weekCode }).then(data => {
                    setDataMyPopularity(data)
                })
                setInterval(async () => {
                    await rankSvc.rankPopularity({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                        setDataRankPopularity(data.rankPopularity)
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
    const [myProfile, setMyProfile] = useState<IMyProfile>()
    const getMyProfile = async () => {
        const profile = await profileSvc.getMyProfile()
        if (!profile) return <></>
        setMyProfile(profile)
    }
    useScreen(() => {
        getMyProfile()
    }, [])
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
                        { label: jsonSvc.findLocalById("150066") },
                        { label: jsonSvc.findLocalById("150056") },
                        { label: jsonSvc.findLocalById("150068") },
                        { label: jsonSvc.findLocalById("150070") },
                        { label: jsonSvc.findLocalById("7031") },
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
            {(dataRankMost?.length == 0 && indexChoose == 0) ||
            (dataRankDonation?.length == 0 && indexChoose == 1) ||
            (dataRankSponsor?.length == 0 && indexChoose == 2) ||
            (dataRankHeart?.length == 0 && indexChoose == 3) ||
            (dataRankPopularity?.length == 0 && indexChoose == 4) ? (
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
                    contentContainerStyle={{ paddingBottom: RatioUtil.lengthFixedRatio(60) }}
                    onRefresh={onRefresh}
                    refreshing={isRefreshing}
                    style={RatioUtil.paddingFixedRatio(10, 0, 0, 0)}
                    data={
                        indexChoose == 0
                            ? dataRankMost
                            : indexChoose == 1
                            ? dataRankDonation
                            : indexChoose == 2
                            ? dataRankSponsor
                            : indexChoose == 3
                            ? dataRankHeart
                            : indexChoose == 4
                            ? dataRankPopularity
                            : []
                    }
                    renderItem={({ item, index }) => (
                        <ListItemRank
                            data={item}
                            type="pan"
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

            {/* MY RANKING */}
            {indexChoose == 0 && (
                <RenderMyRank
                    rank={dataMyMost?.RANK_MOSTS[0].RANK ?? 0}
                    name={myProfile?.NICK ?? ""}
                    name_player={
                        nftPlayerJson.find(d => d.nPersonID == dataMyMost?.RANK_MOSTS[0].PLAYER_CODE)?.sPlayerName
                    }
                    score={dataMyMost?.RANK_MOSTS[0].SCORE ?? 0}
                />
            )}
            {indexChoose == 1 && (
                <RenderMyRank
                    rank={dataMyDonation?.RANK_USERS[0].RANK ?? 0}
                    name={myProfile?.NICK ?? ""}
                    score={dataMyDonation?.RANK_USERS[0].SCORE ?? 0}
                />
            )}
            {indexChoose == 2 && (
                <RenderMyRank
                    rank={dataMySponsor?.RANK_USERS[0].RANK ?? 0}
                    name={myProfile?.NICK ?? ""}
                    score={dataMySponsor?.RANK_USERS[0].SCORE ?? 0}
                />
            )}
            {indexChoose == 3 && (
                <RenderMyRank
                    rank={dataMyHeart?.RANK_USERS[0].RANK ?? 0}
                    name={myProfile?.NICK ?? ""}
                    score={dataMyHeart?.RANK_USERS[0].SCORE ?? 0}
                />
            )}
            {indexChoose == 4 && (
                <RenderMyRank
                    rank={dataMyPopularity?.RANK_USERS[0].RANK ?? 0}
                    name={myProfile?.NICK ?? ""}
                    score={dataMyPopularity?.RANK_USERS[0].SCORE ?? 0}
                />
            )}
        </View>
    )
}
const RenderMyRank = (props: { rank: number; name: string; name_player?: string; score: number }) => {
    return (
        <View
            style={{
                position: "absolute",
                bottom: RatioUtil.lengthFixedRatio(20),
                marginHorizontal: RatioUtil.width(20),
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: RatioUtil.width(10),
                    width: RatioUtil.width(320),
                    height: RatioUtil.lengthFixedRatio(52),
                    backgroundColor: Colors.BLACK + "80",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            borderRightColor: "#88898B",
                            borderRightWidth: 1,
                            width: RatioUtil.width(70),
                        }}
                    >
                        <PretendText
                            style={{
                                fontWeight: RatioUtil.fontWeightBold(),
                                fontSize: RatioUtil.font(12),
                                color: Colors.WHITE,
                            }}
                        >
                            {jsonSvc.findLocalById("150100")}
                        </PretendText>
                        <PretendText
                            numberOfLines={1}
                            style={{
                                fontSize: RatioUtil.font(12),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.WHITE,
                                opacity: props.rank < 0 ? 0.5 : 1,
                            }}
                        >
                            {NumberUtil.numRank(props.rank)}
                        </PretendText>
                    </View>
                    <View style={{ paddingLeft: RatioUtil.width(20), ...rankStyle.header.center }}>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(12),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.WHITE,
                            }}
                        >
                            {props.name}
                        </PretendText>
                        {props.name_player && (
                            <PretendText
                                style={{
                                    color: Colors.WHITE,
                                    fontWeight: "400",
                                    fontSize: RatioUtil.font(12),
                                    opacity: 0.5,
                                }}
                            >
                                {props.name_player + ` ${jsonSvc.findLocalById("2041")}`}
                            </PretendText>
                        )}
                    </View>
                </View>
                <View style={rankStyle.header.rowCenter}>
                    {/* <Image source={FanRank.point_blue} style={rankStyle.listItem.imageMyRank} /> */}
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.WHITE,
                            marginRight: RatioUtil.width(20),
                        }}
                    >
                        {props.rank < 0 ? "-" : NumberUtil.unitTransferFloat(props.score)}
                    </PretendText>
                </View>
            </View>
        </View>
    )
}

const text = (index: number) => {
    switch (index) {
        case 0:
            return jsonSvc.findLocalById("150014") //후원금액
        case 1:
            return jsonSvc.findLocalById("150014") //후원금액
        case 2:
            return jsonSvc.findLocalById("150017") //후원횟수
        case 3:
            return jsonSvc.findLocalById("150019") //하트전송횟수
        case 4:
            return jsonSvc.findLocalById("150020") //프로필UP수
    }
}

export default PANDETAIL
