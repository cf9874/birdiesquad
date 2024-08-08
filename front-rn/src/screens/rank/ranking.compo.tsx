import { FanRank, liveImg, mainHeaderImg } from "assets/images"
import { PretendText } from "components/utils"
import { AnalyticsEventName, Colors, Screen } from "const"
import { rankStyle } from "styles"
import { View, Image, FlatList, TouchableOpacity } from "react-native"
import { ConfigUtil, NumberUtil, RatioUtil, navigate } from "utils"
import _ from "lodash"
import { Shadow } from "react-native-shadow-2"
import LinearGradient from "react-native-linear-gradient"
import { IMyRankDonation, IMyRankMost, IRankMost } from "apis/data/rank.data"
import panUserJson from "json/users_profile.json"
import ProfileImage from "components/utils/ProfileImage"
import { IMyProfile } from "apis/data"
import { useEffect, useState } from "react"
import { jsonSvc, profileSvc } from "apis/services"
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils"
import FastImage from "react-native-fast-image"
import moment from "moment"
import dayjs from "dayjs"
import { useCountdown } from "common/TimeCountDown"
import { useAsyncEffect } from "hooks"
import { Analytics } from "utils/analytics.util"

interface ItemProps {
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
}

export interface IMainGroupItemRank {
    onPress: () => void
    type: string
    title?: string
    listData: Array<ItemProps>
    myData?: IMyRankMost
    myDonation?: IMyRankDonation
    mySponsor?: IMyRankDonation
    myHeart?: IMyRankDonation
    myPopularity?: IMyRankDonation
}

export const RankItemEmpty = (props: ViewProps) => {
    return (
        <View
            style={{
                ...RatioUtil.sizeFixedRatio(320, 128),
                ...rankStyle.header.center,
                marginTop: RatioUtil.lengthFixedRatio(20),
                marginBottom: RatioUtil.lengthFixedRatio(42),
            }}
        >
            <Image
                source={liveImg.noData}
                style={{
                    width: RatioUtil.width(100),
                    height: RatioUtil.width(100),
                    marginBottom: RatioUtil.lengthFixedRatio(10),
                }}
            />
            <PretendText
                style={{
                    fontSize: RatioUtil.font(14),
                    color: Colors.GRAY2,
                    fontWeight: "400",
                }}
            >
                {/* 랭킹이 없음 */}
                {jsonSvc.findLocalById("150003")}
            </PretendText>
        </View>
    )
}

export interface IRankItemDetail {
    index: number
    type: string
    data: ItemProps
}

export const RankItemDetail = (props: IRankItemDetail) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignSelf: "center",
                alignItems: "center",
                paddingVertical: RatioUtil.lengthFixedRatio(8),
                paddingHorizontal: RatioUtil.lengthFixedRatio(20),
                ...RatioUtil.sizeFixedRatio(320, 60),
            }}
            key={props.index}
        >
            <View style={{ flexDirection: "row", ...rankStyle.header.center }}>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: Colors.BLACK,
                        marginRight: RatioUtil.width(10),
                    }}
                >
                    {`${props.data.rank}`}
                </PretendText>
                <TouchableOpacity
                    onPress={async () => {
                        if (props.type == "pro") {
                            navigate(Screen.PROPROFILE, {
                                player_code: props.data.info_player?.nPersonID,
                            })
                        } else {
                            await Analytics.logEvent(AnalyticsEventName.click_profile_image_150, {
                                hasNewUserData: true,
                            })
                            navigate(Screen.USERPROFILE, { userSeq: props.data.info?.USER_SEQ })
                        }
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
                        style={{
                            justifyContent: "center",
                            borderRadius: 50,
                            ...RatioUtil.sizeFixedRatio(44, 44),
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: Colors.WHITE,
                                ...RatioUtil.sizeFixedRatio(39, 39),
                                justifyContent: "center",
                                alignSelf: "center",
                                borderRadius: 50,
                            }}
                        >
                            {props.type === "pan" ? (
                                <ProfileImage
                                    name={props.data.info?.ICON_NAME}
                                    type={props.data.info?.ICON_TYPE}
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(32, 32),
                                        alignSelf: "center",
                                        borderRadius: 50,
                                    }}
                                    resizeMode="cover"
                                />
                            ) : props.type === "pro" ? (
                                <FastImage
                                    source={{
                                        uri: ConfigUtil.getPlayerImage(props.data.info_player?.sPlayerImagePath),
                                    }}
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(32, 32),
                                        alignSelf: "center",
                                        borderRadius: 50,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            ) : null}
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
                <View
                    style={{
                        marginLeft: RatioUtil.width(10),
                        justifyContent: "center",
                    }}
                >
                    <PretendText
                        style={{
                            color: Colors.BLACK,
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}
                    >
                        {props.type === "pan"
                            ? props.data.info?.NICK
                            : props.type === "pro"
                            ? props.data.info_player?.sPlayerName
                            : ""}
                    </PretendText>
                    {props.data?.info_player?.sPlayerName && props.type == "pan" && (
                        <PretendText
                            style={{
                                color: Colors.GRAY18,
                                fontSize: RatioUtil.font(14),
                            }}
                        >
                            {props.data?.info_player?.sPlayerName + ` ${jsonSvc.findLocalById("2041")}`}
                        </PretendText>
                    )}
                </View>
            </View>
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: Colors.WHITE3,
                    borderRadius: 20,
                    ...RatioUtil.sizeFixedRatio(60, 30),
                }}
            >
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: Colors.BLACK,
                    }}
                >
                    {NumberUtil.unitTransferFloat(props.data.score)}
                </PretendText>
            </View>
        </View>
    )
}

export const GroupItemRank = (props: IMainGroupItemRank) => {
    const [myProfile, setMyProfile] = useState<IMyProfile>()
    const dataInitailize = async () => {
        const profile = await profileSvc.getMyProfile()
        if (!profile) return <></>

        setMyProfile(profile)
    }
    useAsyncEffect(async () => {
        console.log(props)
    }, [])
    useEffect(() => {
        dataInitailize()
    }, [])

    return (
        <Shadow distance={7} startColor={Colors.WHITE3}>
            <TouchableOpacity
                onPress={props.onPress}
                style={{
                    ...RatioUtil.borderRadius(10, 10, 10, 10),
                    marginBottom: RatioUtil.lengthFixedRatio(25),
                    borderWidth: 1,
                    borderColor: Colors.GRAY13,
                    ...RatioUtil.sizeFixedRatio(
                        320,
                        props.myData || props.mySponsor || props.myDonation || props.myHeart || props.myPopularity
                            ? 333
                            : 281
                    ),
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottomColor: Colors.WHITE3,
                            borderBottomWidth: 1,
                            width: RatioUtil.width(280),
                            height: RatioUtil.lengthFixedRatio(60),
                            ...RatioUtil.paddingFixedRatio(20, 0, 20, 0),
                            ...RatioUtil.marginFixedRatio(0, 20, 20, 20),
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK,
                            }}
                        >
                            {props.title}
                        </PretendText>
                        <Image style={RatioUtil.sizeFixedRatio(25, 25)} source={FanRank.arrow.right} />
                    </View>

                    {props.listData.length == 0 ? (
                        <RankItemEmpty />
                    ) : (
                        <>
                            {props.listData.slice(0, 3).map((item, index) => (
                                <RankItemDetail index={index} type={props.type} data={item} />
                            ))}
                        </>
                    )}
                </View>

                {/* MY DATA COMPO */}
                {(props.myData || props.mySponsor || props.myDonation || props.myHeart || props.myPopularity) &&
                    props.type == "pan" && (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: Colors.WHITE3,
                                justifyContent: "space-between",
                                borderRadius: RatioUtil.width(10),
                                ...RatioUtil.sizeFixedRatio(300, 52),
                                position: "absolute",
                                bottom: 10,
                            }}
                        >
                            <View style={rankStyle.header.row}>
                                <View
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRightColor: Colors.GRAY3,
                                        width: RatioUtil.width(70),
                                        borderRightWidth: 1.5,
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(12),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {/* 내순위 */}
                                        {jsonSvc.findLocalById("150100")}
                                    </PretendText>
                                    {props.myData && (
                                        <PretendText
                                            numberOfLines={1}
                                            style={{
                                                fontSize: RatioUtil.font(12),
                                                ...rankStyle.listItem.textBold,
                                                color:
                                                    props.myData.RANK_MOSTS[0].RANK < 0 ? Colors.GRAY3 : Colors.BLACK,
                                            }}
                                        >
                                            {NumberUtil.numRank(props.myData.RANK_MOSTS[0].RANK)}
                                        </PretendText>
                                    )}
                                    {props.myDonation && (
                                        <PretendText
                                            numberOfLines={1}
                                            style={{
                                                fontSize: RatioUtil.font(12),
                                                ...rankStyle.listItem.textBold,
                                                opacity: props.myDonation.RANK_USERS[0].RANK < 0 ? 0.5 : 1,
                                            }}
                                        >
                                            {NumberUtil.numRank(props.myDonation.RANK_USERS[0].RANK)}
                                        </PretendText>
                                    )}
                                    {props.mySponsor && (
                                        <PretendText
                                            numberOfLines={1}
                                            style={{
                                                fontSize: RatioUtil.font(12),
                                                ...rankStyle.listItem.textBold,
                                                opacity: props.mySponsor.RANK_USERS[0].RANK < 0 ? 0.5 : 1,
                                            }}
                                        >
                                            {NumberUtil.numRank(props.mySponsor.RANK_USERS[0].RANK)}
                                        </PretendText>
                                    )}
                                    {props.myHeart && (
                                        <PretendText
                                            numberOfLines={1}
                                            style={{
                                                fontSize: RatioUtil.font(12),
                                                ...rankStyle.listItem.textBold,
                                                opacity: props.myHeart.RANK_USERS[0].RANK < 0 ? 0.5 : 1,
                                            }}
                                        >
                                            {NumberUtil.numRank(props.myHeart.RANK_USERS[0].RANK)}
                                        </PretendText>
                                    )}
                                    {props.myPopularity && (
                                        <PretendText
                                            numberOfLines={1}
                                            style={{
                                                fontSize: RatioUtil.font(12),
                                                ...rankStyle.listItem.textBold,
                                                opacity: props.myPopularity.RANK_USERS[0].RANK < 0 ? 0.5 : 1,
                                            }}
                                        >
                                            {NumberUtil.numRank(props.myPopularity.RANK_USERS[0].RANK)}
                                        </PretendText>
                                    )}
                                </View>
                                <View
                                    style={{
                                        paddingLeft: RatioUtil.width(10),
                                        ...rankStyle.header.row,
                                        ...rankStyle.header.center,
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri:
                                                ///My DATA
                                                props.myData
                                                    ? ConfigUtil.getProfile(myProfile?.ICON_NAME, myProfile?.ICON_TYPE)
                                                          .profile.uri
                                                    : ///My Donation
                                                    props.myDonation
                                                    ? ConfigUtil.getProfile(myProfile?.ICON_NAME, myProfile?.ICON_TYPE)
                                                          .profile.uri
                                                    : ///My Sponsor
                                                    props.mySponsor
                                                    ? ConfigUtil.getProfile(myProfile?.ICON_NAME, myProfile?.ICON_TYPE)
                                                          .profile.uri
                                                    : ///My Heart
                                                    props.myHeart
                                                    ? ConfigUtil.getProfile(myProfile?.ICON_NAME, myProfile?.ICON_TYPE)
                                                          .profile.uri
                                                    : ///My Popularity
                                                    props.myPopularity
                                                    ? ConfigUtil.getProfile(myProfile?.ICON_NAME, myProfile?.ICON_TYPE)
                                                          .profile.uri
                                                    : ConfigUtil.getProfile(myProfile?.ICON_NAME, myProfile?.ICON_TYPE)
                                                          .profile.uri,
                                        }}
                                        style={{
                                            ...RatioUtil.sizeFixedRatio(35, 35),
                                            marginRight: RatioUtil.width(10),
                                            // borderRadius: 50,
                                        }}
                                        resizeMode="cover"
                                    />
                                    {props.myData && (
                                        <View>
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontSize: RatioUtil.font(12),
                                                }}
                                            >
                                                {myProfile?.NICK}
                                            </PretendText>
                                            {props.listData?.find(
                                                d => d.info?.USER_SEQ == props.myData?.RANK_MOSTS[0].USER_SEQ
                                            )?.info_player?.sPlayerName && (
                                                <PretendText
                                                    style={{
                                                        color: Colors.GRAY18,
                                                        fontSize: RatioUtil.font(12),
                                                    }}
                                                >
                                                    {
                                                        props.listData?.find(
                                                            d =>
                                                                d.info?.USER_SEQ == props.myData?.RANK_MOSTS[0].USER_SEQ
                                                        )?.info_player?.sPlayerName
                                                    }
                                                </PretendText>
                                            )}
                                        </View>
                                    )}
                                    {props.myDonation && (
                                        <View>
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontSize: RatioUtil.font(12),
                                                }}
                                            >
                                                {myProfile?.NICK}
                                            </PretendText>
                                        </View>
                                    )}
                                    {props.mySponsor && (
                                        <View>
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontSize: RatioUtil.font(12),
                                                }}
                                            >
                                                {myProfile?.NICK}
                                            </PretendText>
                                        </View>
                                    )}
                                    {props.myHeart && (
                                        <View>
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontSize: RatioUtil.font(12),
                                                }}
                                            >
                                                {myProfile?.NICK}
                                            </PretendText>
                                        </View>
                                    )}
                                    {props.myPopularity && (
                                        <View>
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontSize: RatioUtil.font(12),
                                                }}
                                            >
                                                {myProfile?.NICK}
                                            </PretendText>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View style={[rankStyle.header.rowCenter, { marginRight: RatioUtil.width(20) }]}>
                                <Image
                                    source={FanRank.point_yellow}
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(14, 14),
                                        marginRight: RatioUtil.width(6),
                                        borderRadius: 50,
                                    }}
                                />

                                {props.myData && (
                                    <PretendText
                                        style={{ fontSize: RatioUtil.font(14), ...rankStyle.listItem.textBold }}
                                    >
                                        {props.myData?.EXPECT_TRAINING}
                                    </PretendText>
                                )}
                                {props.myDonation && (
                                    <PretendText
                                        style={{ fontSize: RatioUtil.font(14), ...rankStyle.listItem.textBold }}
                                    >
                                        {props.myDonation?.EXPECT_TRAINING}
                                    </PretendText>
                                )}
                                {props.mySponsor && (
                                    <PretendText
                                        style={{ fontSize: RatioUtil.font(14), ...rankStyle.listItem.textBold }}
                                    >
                                        {props.mySponsor?.EXPECT_TRAINING}
                                    </PretendText>
                                )}
                                {props.myHeart && (
                                    <PretendText
                                        style={{ fontSize: RatioUtil.font(14), ...rankStyle.listItem.textBold }}
                                    >
                                        {props.myHeart?.EXPECT_TRAINING}
                                    </PretendText>
                                )}
                                {props.myPopularity && (
                                    <PretendText
                                        style={{ fontSize: RatioUtil.font(14), ...rankStyle.listItem.textBold }}
                                    >
                                        {props.myPopularity?.EXPECT_TRAINING}
                                    </PretendText>
                                )}
                            </View>
                        </View>
                    )}
            </TouchableOpacity>
        </Shadow>
    )
}
export const TimeCheck = ({ isSettle }: { isSettle: boolean }) => {
    const today = dayjs().set("hour", 9).set("minute", 10).set("second", 0)
    const [date, hour, minute, second] = useCountdown(today)

    const timeToText = (seconds: number) => {
        seconds = Number(seconds)
        let d = Math.floor(seconds / (3600 * 24))
        let h = Math.floor((seconds % (3600 * 24)) / 3600)
        let m = Math.floor((seconds % 3600) / 60)
        let s = Math.floor(seconds % 60)

        let dDisplay = d > 0 ? d + "일 " : ""
        let hDisplay = h > 0 ? h + "시간 " : ""
        let mDisplay = m > 0 ? m + "분 " : ""
        let sDisplay = s > 0 ? s + "초 " : ""

        if (d === 0 && h === 0) {
            return mDisplay + sDisplay
        } else if (d === 0) {
            return hDisplay + mDisplay
        } else return dDisplay + hDisplay
    }

    return (
        <View>
            {isSettle ? (
                <LinearGradient
                    colors={[Colors.PURPLE6, Colors.PURPLE7]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        ...RatioUtil.paddingFixedRatio(0, 20, 0, 20),
                        marginHorizontal: RatioUtil.width(20),
                        justifyContent: "space-between",
                        borderRadius: RatioUtil.width(10),
                        ...RatioUtil.sizeFixedRatio(320, 50),
                    }}
                >
                    <View style={rankStyle.header.rowCenter}>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.WHITE,
                                opacity: 0.5,
                            }}
                        >
                            {/* 시즌종료 */}
                            {jsonSvc.findLocalById("150061")}
                        </PretendText>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.WHITE,
                                marginLeft: RatioUtil.width(10),
                            }}
                        >
                            {" "}
                            {/* 정산 완료까지 남은 시간 */}
                            {jsonSvc.findLocalById("150062")}
                        </PretendText>
                    </View>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.WHITE,
                        }}
                    >
                        {minute} : {second}
                    </PretendText>
                </LinearGradient>
            ) : (
                <LinearGradient
                    colors={[Colors.PURPLE6, Colors.PURPLE7]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        ...RatioUtil.paddingFixedRatio(0, 20, 0, 20),
                        marginHorizontal: RatioUtil.width(20),
                        justifyContent: "space-between",
                        borderRadius: RatioUtil.width(10),
                        ...RatioUtil.sizeFixedRatio(320, 50),
                    }}
                >
                    <View style={rankStyle.header.rowCenter}>
                        <Image
                            style={RatioUtil.sizeFixedRatio(16, 16)}
                            resizeMode="contain"
                            source={FanRank.time_outline}
                        />
                        <PretendText
                            style={{
                                marginLeft: RatioUtil.width(6),
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.WHITE,
                            }}
                        >
                            {" "}
                            {/* 랭크 종료까지 남은 시간 */}
                            {jsonSvc.findLocalById("150001")}
                        </PretendText>
                    </View>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.WHITE,
                        }}
                    >
                        {timeToText(moment().endOf("isoWeek").unix() - moment().unix())}
                    </PretendText>
                </LinearGradient>
            )}
        </View>
    )
}

export const ExpectReward = ({
    sumExpected,
    setIsVisibleRankHelp,
}: {
    sumExpected: number
    setIsVisibleRankHelp: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [dateTimeCurrent, setDateTimeCurrent] = useState<string | null>()

    useEffect(() => {
        getTimeCurrent()
    }, [])

    const getTimeCurrent = () => {
        let month = moment().month() + 1
        let day = moment().date()
        let hour = moment().hours()
        let minute = moment().minutes()
        // setDateTimeCurrent(month + "월 " + day + "일 " + hour + "시 " + minute + "분 " + "기준")
        setDateTimeCurrent(
            jsonSvc.formatLocal(jsonSvc.findLocalById("120009"), [
                month.toString(),
                day.toString(),
                hour.toString(),
                minute.toString(),
            ])
        )

        setInterval(() => {
            let month = moment().month() + 1
            let day = moment().date()
            let hour = moment().hours()
            let minute = moment().minutes()
            let second = moment().seconds()
            // setDateTimeCurrent(month + "월 " + day + "일 " + hour + "시 " + minute + "분 " + "기준")
            setDateTimeCurrent(
                jsonSvc.formatLocal(jsonSvc.findLocalById("120009"), [
                    month.toString(),
                    day.toString(),
                    hour.toString(),
                    minute.toString(),
                ])
            )
        }, 60000)
    }
    return (
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
                    numberOfLines={1}
                    style={{
                        fontSize: RatioUtil.font(16),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: Colors.BLACK,
                        height: RatioUtil.lengthFixedRatio(21),
                    }}
                >
                    {/* 보상 예정 육성포인트 */}
                    {jsonSvc.findLocalById("150004")}
                </PretendText>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        height: RatioUtil.lengthFixedRatio(31),
                        marginTop: RatioUtil.lengthFixedRatio(4),
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(24),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.BLACK,
                        }}
                    >
                        {sumExpected}P
                    </PretendText>
                    <PretendText
                        numberOfLines={1}
                        style={{
                            marginLeft: RatioUtil.lengthFixedRatio(4),
                            marginBottom: RatioUtil.lengthFixedRatio(3.5),
                            fontSize: RatioUtil.font(12),
                            color: Colors.GRAY3,
                        }}
                    >
                        {dateTimeCurrent}
                    </PretendText>
                </View>
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
    )
}
