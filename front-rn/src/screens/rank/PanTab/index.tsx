import React, { useEffect, useRef, useState } from "react"
import { Image, Modal, ScrollView, Text, TouchableOpacity, View, SafeAreaView } from "react-native"
// import { SafeAreaView } from "react-native-safe-area-context"
import { RatioUtil, navigate } from "utils"
import { AnalyticsEventName, Colors, Screen } from "const"
import { FanRank, nftDetailImg } from "assets/images"
import LinearGradient from "react-native-linear-gradient"
import { PretendText } from "components/utils"
import { rankStyle } from "styles/rank.style"
import { ExpectReward, GroupItemRank, TimeCheck } from "../ranking.compo"
import { useScreen, useTimer } from "hooks"
import { jsonSvc, rankSvc } from "apis/services"
import { IMyRankDonation, IMyRankMost } from "../../../apis/data/rank.data"
import PanHelp from "./panHelp"
import ProHelp from "../ProTab/proHelp"
import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import moment from "moment"
import "moment/locale/pt-br"
import { callSetGameApi } from "common/GlobalFunction"
import dayjs from "dayjs"
import { useFocusEffect } from "@react-navigation/native"
import { Analytics } from "utils/analytics.util"

const renderScene = SceneMap({
    panHelp: PanHelp,
    proHelp: ProHelp,
})
const PAN = () => {
    const [index, setIndexRankHelp] = useState(0)
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
    const [dataMyMost, setDataMyMost] = useState<IMyRankMost>()
    const [dataMyDonation, setDataMyDonation] = useState<IMyRankDonation>()
    const [dataMySponsor, setDataMySponsor] = useState<IMyRankDonation>()
    const [dataMyHeart, setDataMyHeart] = useState<IMyRankDonation>()
    const [dataMyPopularity, setDataMyPopularity] = useState<IMyRankDonation>()
    const [sumExpected, setSumExpected] = useState<number | 0>(0)
    const [dataRankMost, setDataRankMost] = useState<
        {
            playerCode: number
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
            score: number
            rank: number
            info?: {
                ICON_TYPE: number
                ICON_NAME: string
                NICK: string
                USER_SEQ: number
            }
        }[]
    >()
    const [dataRankSponsor, setDataRankSponsor] = useState<
        {
            score: number
            rank: number
            info?: {
                ICON_TYPE: number
                ICON_NAME: string
                NICK: string
                USER_SEQ: number
            }
        }[]
    >()
    const [dataRankHeart, setDataRankHeart] = useState<
        {
            score: number
            rank: number
            info?: {
                ICON_TYPE: number
                ICON_NAME: string
                NICK: string
                USER_SEQ: number
            }
        }[]
    >()
    const [dataRankPopularity, setDataRankPopularity] = useState<
        {
            score: number
            rank: number
            info?: {
                ICON_TYPE: number
                ICON_NAME: string
                NICK: string
                USER_SEQ: number
            }
        }[]
    >()

    const myRankData = () => {
        rankSvc.myRankMost({ weekcode: weekCode }).then(data => {
            setDataMyMost(data)
        })
        rankSvc.myRankDonation({ weekcode: weekCode }).then(data => {
            setDataMyDonation(data)
        })
        rankSvc.myRankSponsor({ weekcode: weekCode }).then(data => {
            setDataMySponsor(data)
        })
        rankSvc.myRankHeart({ weekcode: weekCode }).then(data => {
            setDataMyHeart(data)
        })
        rankSvc.myRankPopularity({ weekcode: weekCode }).then(data => {
            setDataMyPopularity(data)
        })
    }

    useFocusEffect(
        React.useCallback(() => {
            checkSettleTime()
            myRankData()
            const promise1 = rankSvc.myRankMost({ weekcode: weekCode }).then(data => {
                return data.EXPECT_TRAINING
            })
            const promise2 = rankSvc.myRankDonation({ weekcode: weekCode }).then(data => {
                return data.EXPECT_TRAINING
            })
            const promise3 = rankSvc.myRankSponsor({ weekcode: weekCode }).then(data => {
                return data.EXPECT_TRAINING
            })
            const promise4 = rankSvc.myRankHeart({ weekcode: weekCode }).then(data => {
                return data.EXPECT_TRAINING
            })
            const promise5 = rankSvc.myRankPopularity({ weekcode: weekCode }).then(data => {
                return data.EXPECT_TRAINING
            })

            Promise.all([promise1, promise2, promise3, promise4, promise5]).then(values => {
                const sum = values.reduce((accumulator, value) => {
                    return accumulator + value
                }, 0)
                setSumExpected(sum)
            })
        }, [])
    )
    useScreen(() => {
        rankSvc.rankMost({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
            setDataRankMost(data.rankMost)
        })
        rankSvc.rankDonation({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
            setDataRankDonation(data.rankDonation)
        })
        rankSvc.rankSponsor({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
            setDataRankSponsor(data.rankSponsor)
        })
        rankSvc.rankHeart({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
            setDataRankHeart(data.rankHeart)
        })
        rankSvc.rankPopularity({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
            setDataRankPopularity(data.rankPopularity)
        })

        const interval = setInterval(async () => {
            rankSvc.rankMost({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                setDataRankMost(data.rankMost)
            })
            rankSvc.rankDonation({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                setDataRankDonation(data.rankDonation)
            })
            rankSvc.rankSponsor({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                setDataRankSponsor(data.rankSponsor)
            })
            rankSvc.rankHeart({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                setDataRankHeart(data.rankHeart)
            })
            rankSvc.rankPopularity({ weekcode: weekCode, max: 100, min: 1 }).then(data => {
                setDataRankPopularity(data.rankPopularity)
            })
        }, 1000 * 60 * 5) //  5 Minutes
        return () => clearInterval(interval)
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
                    <ExpectReward sumExpected={sumExpected} setIsVisibleRankHelp={setIsVisibleRankHelp} />
                    {/* Most Fan */}
                    <GroupItemRank
                        type="pan"
                        // title="모스트팬 순위"
                        title={jsonSvc.findLocalById("150069")}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_rank_most_150, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            navigate(Screen.RANKDETAIL, { tabIndex: 0, subTabIndex: 0 })
                        }}
                        listData={dataRankMost ?? []}
                        myData={dataMyMost}
                    />
                    {/* donation ranking */}
                    <GroupItemRank
                        type="pan"
                        // title="후원금 순위"
                        title={jsonSvc.findLocalById("130023")}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_rank_support_150, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            navigate(Screen.RANKDETAIL, { tabIndex: 0, subTabIndex: 1 })
                        }}
                        listData={dataRankDonation ?? []}
                        myDonation={dataMyDonation}
                    />
                    {/* sponsor ranking */}
                    <GroupItemRank
                        type="pan"
                        // title="후원 횟수 순위"
                        title={jsonSvc.findLocalById("130021")}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_rank_supportCount_150, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            navigate(Screen.RANKDETAIL, { tabIndex: 0, subTabIndex: 2 })
                        }}
                        listData={dataRankSponsor ?? []}
                        mySponsor={dataMySponsor}
                    />
                    {/* heart ranking */}
                    <GroupItemRank
                        type="pan"
                        // title="하트 순위"
                        title={jsonSvc.findLocalById("130020")}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_rank_heart_150, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            navigate(Screen.RANKDETAIL, { tabIndex: 0, subTabIndex: 3 })
                        }}
                        listData={dataRankHeart ?? []}
                        myHeart={dataMyHeart}
                    />
                    {/* popularity profile ranking */}
                    <GroupItemRank
                        type="pan"
                        // title="프로필 인기 순위"
                        title={jsonSvc.findLocalById("150011")}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_rank_profile_150, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            navigate(Screen.RANKDETAIL, { tabIndex: 0, subTabIndex: 4 })
                        }}
                        listData={dataRankPopularity ?? []}
                        myPopularity={dataMyPopularity}
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
                                    {" "}
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

export default PAN
