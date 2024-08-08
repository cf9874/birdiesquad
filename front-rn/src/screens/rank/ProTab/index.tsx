import { useEffect, useRef, useState } from "react"
import { Image, Modal, ScrollView, Text, TouchableOpacity, View, SafeAreaView } from "react-native"
// import { SafeAreaView } from "react-native-safe-area-context"
import { ConfigUtil, RatioUtil, navigate } from "utils"
import { AnalyticsEventName, Colors, Screen } from "const"
import { FanRank, nftDetailImg } from "assets/images"
import LinearGradient from "react-native-linear-gradient"
import { PretendText } from "components/utils"
import { rankStyle } from "styles/rank.style"
import { GroupItemRank, TimeCheck } from "../ranking.compo"
import { useAsyncEffect, useQuery, useScreen, useTimer } from "hooks"
import { jsonSvc, rankSvc } from "apis/services"
import { IMyRankDonation, IMyRankMost, IUsersRankMostList } from "../../../apis/data/rank.data"
import PanHelp from "../PanTab/panHelp"
import ProHelp from "./proHelp"
import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import moment from "moment"
import localJson from "json/local.json"
import dayjs from "dayjs"
import { callSetGameApi } from "common/GlobalFunction"
import { Analytics } from "utils/analytics.util"
const renderScene = SceneMap({
    panHelp: PanHelp,
    proHelp: ProHelp,
})
const PRO = () => {
    const [index, setIndexRankHelp] = useState(1)
    const [routes] = useState([
        // { key: "panHelp", title: "팬" },
        { key: "panHelp", title: jsonSvc.findLocalById("150002") },
        // { key: "proHelp", title: "프로" },
        { key: "proHelp", title: jsonSvc.findLocalById("2041") },
    ])
    const onSelectRankHelp = (data: React.SetStateAction<number>) => {
        setIndexRankHelp(data)
    }
    const [isSettle, setIsSettle] = useState(false)
    const [weekCode, setWeekCode] = useState<number>(
        parseInt(moment.unix(moment().startOf("isoWeek").unix()).format("YYYYMMDD"))
    )
    const [isVisibleRankHelp, setIsVisibleRankHelp] = useState(false)
    const [dataRevenuePro, setDataRevenuePro] = useState<
        {
            score: number
            rank: number
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
    const [dataSponsorPro, setDataSponsorPro] = useState<
        {
            score: number
            rank: number
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
    const [dataHeartPro, setDataHeartPro] = useState<
        {
            score: number
            rank: number
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
    const [dataPopularityPro, setDataPopularityPro] = useState<
        {
            score: number
            rank: number
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

    useEffect(() => {
        checkSettleTime()
    }, [])
    useScreen(() => {
        rankSvc.rankRevenuePro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
            setDataRevenuePro(data.rankPlayers)
        })
        rankSvc.rankSponsorPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
            setDataSponsorPro(data.rankPlayers)
        })
        rankSvc.rankHeartPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
            setDataHeartPro(data.rankPlayers)
        })
        rankSvc.rankPopularityPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
            setDataPopularityPro(data.rankPlayers)
        })

        setInterval(async () => {
            rankSvc.rankRevenuePro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                setDataRevenuePro(data.rankPlayers)
            })
            rankSvc.rankSponsorPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                setDataSponsorPro(data.rankPlayers)
            })
            rankSvc.rankHeartPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                setDataHeartPro(data.rankPlayers)
            })
            rankSvc.rankPopularityPro({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                setDataPopularityPro(data.rankPlayers)
            })
        }, 1000 * 60 * 5) // 5 Minutes
    }, [])
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.click_pro_tab_150, {
            hasNewUserData: true,
            first_action: "FALSE",
        })
    }, [])
    const checkSettleTime = async () => {
        const isSettleNow = await callSetGameApi(false)
        if (!isSettleNow) return
        setIsSettle(!!isSettleNow)
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={{ marginTop: RatioUtil.lengthFixedRatio(20) }} onPress={() => {}}>
                    <TimeCheck isSettle={isSettle} />
                </TouchableOpacity>
                <View
                    style={{
                        marginTop: RatioUtil.lengthFixedRatio(30),
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            marginHorizontal: RatioUtil.width(30),
                            marginBottom: RatioUtil.lengthFixedRatio(25),
                            width: RatioUtil.width(300),
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View>
                            <PretendText
                                numberOfLines={2}
                                style={{
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                }}
                            >
                                {/* 응원하는 선수의
                          
                                순위를 확인해보세요! */}
                                {jsonSvc.findLocalById("150071")}
                            </PretendText>
                        </View>
                        <TouchableOpacity
                            onPress={async () => {
                                await Analytics.logEvent(AnalyticsEventName.click_help_150, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                                setIsVisibleRankHelp(true)
                            }}
                        >
                            <View
                                style={{
                                    ...RatioUtil.borderRadius(20, 20, 20, 20),
                                    height: RatioUtil.lengthFixedRatio(22),
                                    backgroundColor: Colors.GRAY15,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(14, 14),
                                        ...RatioUtil.marginFixedRatio(4, 3, 4, 4),
                                    }}
                                    resizeMode="contain"
                                    source={FanRank.notice}
                                />
                                <PretendText
                                    numberOfLines={1}
                                    style={{
                                        fontSize: RatioUtil.font(12),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: Colors.GRAY3,
                                        marginRight: RatioUtil.lengthFixedRatio(7),
                                    }}
                                >
                                    {/* 랭크 도움말 */} {jsonSvc.findLocalById("912005")}
                                </PretendText>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* revenue ranking */}
                    <GroupItemRank
                        type="pro"
                        title={jsonSvc.findLocalById("130019")}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_rank_earning_155, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            navigate(Screen.RANKDETAIL, { tabIndex: 1, subTabIndex: 0 })
                        }}
                        listData={dataRevenuePro ?? []}
                    />
                    {/* sponsor ranking */}
                    <GroupItemRank
                        type="pro"
                        title={jsonSvc.findLocalById("130021")}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_rank_supportCount_155, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            navigate(Screen.RANKDETAIL, { tabIndex: 1, subTabIndex: 1 })
                        }}
                        listData={dataSponsorPro ?? []}
                    />
                    {/* heart ranking */}
                    <GroupItemRank
                        type="pro"
                        title={jsonSvc.findLocalById("130020")}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_rank_heart_155, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            navigate(Screen.RANKDETAIL, { tabIndex: 1, subTabIndex: 2 })
                        }}
                        listData={dataHeartPro ?? []}
                    />
                    {/* popularity profile ranking */}
                    <GroupItemRank
                        type="pro"
                        title={jsonSvc.findLocalById("150011")}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_rank_profile_155, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            navigate(Screen.RANKDETAIL, { tabIndex: 1, subTabIndex: 3 })
                        }}
                        listData={dataPopularityPro ?? []}
                    />
                    <View style={{ height: RatioUtil.height(60) }}></View>
                </View>
            </ScrollView>

            {/* RANK HELP */}
            <Modal
                animationType="fade"
                statusBarTranslucent
                transparent={true}
                style={{ flex: 1 }}
                visible={isVisibleRankHelp}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ ...rankStyle.header.modalMainView, backgroundColor: Colors.BLACK }}>
                        <View style={{ flex: 1, ...RatioUtil.size(360) }}>
                            <View style={rankStyle.header.con}>
                                <PretendText style={rankStyle.header.text}>
                                    {/* 랭크 도움말 */}
                                    {jsonSvc.findLocalById("912005")}
                                </PretendText>
                                <View
                                    style={{
                                        right: RatioUtil.width(20),
                                        position: "absolute",
                                    }}
                                >
                                    <TouchableOpacity onPress={() => setIsVisibleRankHelp(false)}>
                                        <Image
                                            source={nftDetailImg.close}
                                            style={{
                                                ...RatioUtil.margin(30, 0, 20, 0),
                                                width: RatioUtil.width(25),
                                                height: RatioUtil.height(25),
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TabView
                                renderTabBar={props => (
                                    <TabBar
                                        style={{ backgroundColor: Colors.WHITE }}
                                        indicatorStyle={{ backgroundColor: Colors.BLACK }}
                                        activeColor={Colors.BLACK}
                                        inactiveColor={Colors.GRAY18}
                                        labelStyle={{
                                            color: Colors.BLACK,
                                            fontWeight: "600",
                                            fontSize: RatioUtil.font(14),
                                        }}
                                        {...props}
                                    />
                                )}
                                style={{ backgroundColor: Colors.WHITE }}
                                navigationState={{ index, routes }}
                                renderScene={renderScene}
                                onIndexChange={onSelectRankHelp}
                                //   initialLayout={{ width: layout.width }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    )
}

export default PRO
