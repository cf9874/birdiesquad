import { useState } from "react"
import { PretendText } from "components/utils"
import { AnalyticsEventName, Screen, ScreenParams } from "const"
import { FlatList, Image, TouchableOpacity, View, ImageBackground } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "const"
import { ConfigUtil, navigate, NumberUtil, RatioUtil } from "utils"
import { rankStyle } from "styles/rank.style"
import { RouteProp, useRoute } from "@react-navigation/native"
import { IMyRankDonation, IPlayerRankCount } from "apis/data/rank.data"
import { jsonSvc, profileSvc, rankSvc } from "apis/services"
import { useAsyncEffect, useScreen } from "hooks"
import LinearGradient from "react-native-linear-gradient"
import { ProfileHeader } from "components/layouts"
import userProfile from "json/users_profile.json"
import moment from "moment"
import { IMyProfile } from "apis/data"
import { FanRank } from "assets/images"
import ProfileImage from "components/utils/ProfileImage"
import FastImage from "react-native-fast-image"
import { Analytics } from "utils/analytics.util"

const PassionateFans = () => {
    const route = useRoute<RouteProp<ScreenParams, Screen.PASSIONATEFANS>>()
    const data_player = route.params.info_player
    const [weekCode, setWeekCode] = useState<number>(
        parseInt(moment.unix(moment().startOf("isoWeek").unix()).format("YYYYMMDD"))
    )
    const [dataPassionateFan, setPassionateFan] = useState<
        {
            player_code: number
            user_seq: number
            rank: number
            score: number
            user_name?: string
            user_type?: number
            user_image?: string
        }[]
    >()

    const [dataMyPassionate, setDataMyPassionate] = useState<IMyRankDonation>()
    const [rankCount, setRankCount] = useState<IPlayerRankCount>()
    const [cashAmountPlayer, setCashAmount] = useState<IPlayerRankCount>()

    useScreen(() => {
        getData()
        dataInitailize()
    }, [])
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_feverfan_150, {
            hasNewUserData: true,
            playercode: data_player.nPersonID,
            player_name: data_player.sPlayerName,
        })
    }, [])
    const getData = async () => {
        ;(async () => {
            rankSvc
                .rankPassionate({ weekcode: weekCode, playercode: data_player.nPersonID, max: 100, min: 1 })
                .then(data => {
                    setPassionateFan(data.listPassionate)
                    setIsRefreshing(false)
                })
        })()
        setInterval(async () => {
            rankSvc
                .rankPassionate({ weekcode: weekCode, playercode: data_player.nPersonID, max: 100, min: 1 })
                .then(data => {
                    setPassionateFan(data.listPassionate)
                    setIsRefreshing(false)
                })
        }, 1000 * 60 * 5) // 5분
        rankSvc.myRankPassionate({ weekcode: weekCode, player_code: data_player.nPersonID }).then(data => {
            setDataMyPassionate(data)
        })
        rankSvc.myPlayerRankCount({ weekcode: weekCode, player_code: data_player.nPersonID }).then(data => {
            setRankCount(data)
        })
        rankSvc.myPlayerCashAmountScore({ weekcode: weekCode, player_code: data_player.nPersonID }).then(data => {
            setCashAmount(data)
        })
    }
    const [isRefreshing, setIsRefreshing] = useState(false)
    const onRefresh = () => {
        setIsRefreshing(true)
        getData()
    }

    const [myProfile, setMyProfile] = useState<IMyProfile>()
    const dataInitailize = async () => {
        const profile = await profileSvc.getMyProfile()
        if (!profile) return <></>

        setMyProfile(profile)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            {/* <ProfileHeader title={"열혈팬 순위"} /> */}
            <ProfileHeader title={jsonSvc.findLocalById("130022")} />
            <ImageBackground
                resizeMode="cover"
                source={FanRank.background_rank}
                style={{ ...rankStyle.header.center, ...RatioUtil.size(360, 190) }}
            >
                <FastImage
                    source={{
                        uri: ConfigUtil.getPlayerImage(data_player.sPlayerImagePath),
                    }}
                    style={{
                        ...RatioUtil.size(85, 85),
                        borderRadius: 50,
                        backgroundColor: Colors.WHITE,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <PretendText style={rankStyle.passionate.textName}>{data_player.sPlayerName ?? ""}</PretendText>
                <PretendText style={rankStyle.passionate.textCount}>
                    {/* 총 후원자 {rankCount?.RANK_COUNT}명 */}
                    {jsonSvc.formatLocal(jsonSvc.findLocalById("150016"), [(rankCount?.RANK_COUNT ?? 0).toString()])}
                </PretendText>
                <PretendText style={rankStyle.passionate.textName}>
                    {NumberUtil.unitTransferFloat(cashAmountPlayer?.RANK_SCORE ?? 0)}
                </PretendText>
            </ImageBackground>
            <View
                style={{
                    ...rankStyle.detailMain.header1,
                    marginHorizontal: 20,
                }}
            >
                <View style={rankStyle.detailMain.header2}>
                    <PretendText style={{ fontWeight: "400", color: Colors.GRAY18 }}>
                        {/* 순위 */}
                        {jsonSvc.findLocalById("7030")}
                    </PretendText>
                    <PretendText style={{ fontWeight: "400", color: Colors.GRAY18 }}>
                        {/* 프로필 */}
                        {jsonSvc.findLocalById("7031")}
                    </PretendText>
                </View>
                <PretendText style={{ fontWeight: "400", color: Colors.GRAY18 }}>
                    {/* 후원금액 */}
                    {jsonSvc.findLocalById("150014")}
                </PretendText>
            </View>
            <View style={{ ...RatioUtil.size(360, 1), borderTopWidth: 1.5, borderColor: Colors.GRAY13 }} />
            <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                onRefresh={onRefresh}
                refreshing={isRefreshing}
                style={RatioUtil.padding(10, 0, 0, 0)}
                data={dataPassionateFan ?? []}
                renderItem={({ item, index }) => <ListItemRank data={item} index={index} onPress={() => {}} />}
            />
            <View style={rankStyle.passionate.positionView}>
                <View
                    style={{
                        ...rankStyle.listItem.myRankCon,
                        width: RatioUtil.width(340),
                        backgroundColor: Colors.GRAY2,
                    }}
                >
                    <View style={rankStyle.header.row}>
                        <View style={rankStyle.listItem.myRankTextCon}>
                            <PretendText
                                style={{
                                    ...rankStyle.header.textConWhite,
                                    fontSize: RatioUtil.font(13),
                                }}
                            >
                                {jsonSvc.findLocalById("150100")}
                            </PretendText>
                            <PretendText
                                numberOfLines={1}
                                style={{
                                    ...rankStyle.listItem.opacityMyRank,
                                    opacity: dataMyPassionate?.RANK_USERS?.[0]?.RANK <= 0 ? 0.5 : 1,
                                }}
                            >
                                {NumberUtil.numRank(dataMyPassionate?.RANK_USERS?.[0]?.RANK ?? 0)}
                            </PretendText>
                        </View>
                        <View style={{ paddingLeft: 10, ...rankStyle.header.row, ...rankStyle.header.center }}>
                            <View>
                                <PretendText
                                    style={{
                                        ...rankStyle.header.textConWhite,
                                        fontSize: RatioUtil.font(14),
                                    }}
                                >
                                    {myProfile?.NICK}
                                </PretendText>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <PretendText
                            style={{
                                ...rankStyle.header.textConWhite,
                            }}
                        >
                            {dataMyPassionate?.RANK_USERS[0].SCORE == 0 ? "-" : dataMyPassionate?.RANK_USERS[0].SCORE}
                        </PretendText>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
export interface IMainListItemRank {
    onPress: () => void
    data: {
        player_code: number
        user_seq: number
        rank: number
        score: number
        user_name?: string
        user_type?: number
        user_image?: string
    }
    index: number
}
const ListItemRank = (props: IMainListItemRank) => {
    return (
        <View style={{ ...rankStyle.listItem.rankListItem, width: RatioUtil.width(360) }} key={props.index}>
            <View style={{ flexDirection: "row", ...rankStyle.header.center }}>
                <PretendText style={rankStyle.listItem.textRank}>{`${props.data.rank}`}</PretendText>
                <View style={{ flexDirection: "row", ...rankStyle.header.center }}>
                    <TouchableOpacity
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.view_profile_160, {
                                hasNewUserData: true,
                            })
                            navigate(Screen.USERPROFILE, { userSeq: props.data.user_seq })
                        }}
                    >
                        <LinearGradient
                            colors={
                                props.index == 0
                                    ? [Colors.YELLOW11, Colors.YELLOW12]
                                    : props.index == 1
                                    ? [Colors.GRAY16, Colors.GRAY17]
                                    : props.index == 2
                                    ? [Colors.YELLOW13, Colors.YELLOW14]
                                    : [Colors.WHITE3, Colors.WHITE3]
                            }
                            start={{ x: 0.0, y: 1.0 }}
                            end={{ x: 1.0, y: 1.0 }}
                            style={{ justifyContent: "center", borderRadius: 50, ...RatioUtil.size(44, 44) }}
                        >
                            <View style={rankStyle.listItem.userAvatar}>
                                <ProfileImage
                                    name={props.data.user_image}
                                    type={props.data.user_type}
                                    style={{
                                        ...RatioUtil.size(32, 32),
                                        alignSelf: "center",
                                        borderRadius: 50,
                                    }}
                                    resizeMode="cover"
                                />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                    <View style={{ marginLeft: RatioUtil.width(10) }}>
                        <PretendText style={{ color: Colors.BLACK, fontSize: RatioUtil.font(14) }}>
                            {props.data?.user_name}
                        </PretendText>
                    </View>
                </View>
            </View>
            <View style={rankStyle.listItem.textScore}>
                <PretendText style={{ ...rankStyle.listItem.textBold, fontSize: RatioUtil.font(14) }}>
                    {NumberUtil.unitTransferFloat(props.data.score ?? 0)}
                </PretendText>
            </View>
        </View>
    )
}

export default PassionateFans
