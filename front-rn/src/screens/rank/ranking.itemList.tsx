import { PretendText } from "components/utils"
import { AnalyticsEventName, Colors, Screen } from "const"
import { rankStyle } from "styles"
import { View, Image, TouchableOpacity, Modal } from "react-native"
import { ConfigUtil, NumberUtil, RatioUtil, navigate } from "utils"
import _ from "lodash"
import LinearGradient from "react-native-linear-gradient"
import ProfileImage from "components/utils/ProfileImage"
import { jsonSvc, rankSvc } from "apis/services"
import { walletStyle } from "styles/wallet.style"
import { FanRank } from "assets/images"
import { useState } from "react"
import FastImage from "react-native-fast-image"
import { Analytics } from "utils/analytics.util"

interface ItemProps {
    playerCode?: number
    score: number
    rank: number
    totalAmount?: number
    totalCash?: number
    totalFans?: number
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
        sPlayerthumbnailImagePath?: string
    }
}

export interface IMainListItemRank {
    onPress: () => void
    type: string
    data: ItemProps

    index: number
}
export const ListItemRank = (props: IMainListItemRank) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignSelf: "center",
                    alignItems: "center",
                    paddingVertical: RatioUtil.lengthFixedRatio(8),
                    paddingHorizontal: RatioUtil.lengthFixedRatio(20),
                    ...RatioUtil.sizeFixedRatio(360, 60),
                }}
                key={props.index}
            >
                <View style={{ flexDirection: "row", ...rankStyle.header.center }}>
                    <PretendText
                        numberOfLines={2}
                        style={{
                            width: RatioUtil.width(40),
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.BLACK,
                            marginRight: RatioUtil.width(10),
                            textAlign: "center",
                        }}
                    >{`${props.data.rank}`}</PretendText>
                    <TouchableOpacity
                        // disabled={props.type == "pro" ? true : false}
                        onPress={async () => {
                            // console.log("INFO:", JSON.stringify(props.data))
                            // setInvalidUser(true)
                            // await rankSvc.userRecord({ userseq: props.data.info?.USER_SEQ })
                            if (props.type == "pro") {
                                // 프로 프로필 화면 뷰 로깅
                                await Analytics.logEvent(AnalyticsEventName.view_pro_profile_160, {
                                    hasNewUserData: true,
                                    player_code: props.data.info_player?.nPersonID,
                                    player_name: props.data.info_player?.sPlayerName,
                                })
                                navigate(Screen.PROPROFILE, {
                                    player_code: props.data.info_player?.nPersonID,
                                })
                            } else {
                                // 타 사용자 프로필 화면 뷰 로깅
                                await Analytics.logEvent(AnalyticsEventName.view_profile_160, {
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
                                {props.type == "pan" ? (
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
                                ) : props.type == "pro" ? (
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
                            {props.type == "pan"
                                ? props.data.info?.NICK
                                : props.type == "pro"
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
                        {props.data?.totalAmount && props.type == "pan" && (
                            <PretendText
                                style={{
                                    color: Colors.GRAY18,
                                    fontSize: RatioUtil.font(14),
                                }}
                            >
                                {/* {NumberUtil.addUnit(props.data.totalAmount ?? 0)} 후원 */}
                                {jsonSvc.formatLocal(jsonSvc.findLocalById("150018"), [
                                    NumberUtil.unitTransferFloat(props.data.totalAmount ?? 0),
                                ])}
                            </PretendText>
                        )}
                        {props.data?.totalFans && props.type == "pro" && (
                            <PretendText
                                style={{
                                    color: Colors.GRAY18,
                                    fontSize: RatioUtil.font(14),
                                }}
                            >
                                {/* 후원자 {NumberUtil.addUnit(props.data.totalFans ?? 0)}명 */}
                                {jsonSvc.formatLocal(jsonSvc.findLocalById("150012"), [
                                    NumberUtil.unitTransferFloat(props.data.totalFans ?? 0),
                                ])}
                            </PretendText>
                        )}
                        {props.data?.totalCash && props.type == "pro" && (
                            <PretendText
                                style={{
                                    color: Colors.GRAY18,
                                    fontSize: RatioUtil.font(14),
                                }}
                            >
                                {/* {jsonSvc.findLocalById("150056")} {NumberUtil.addUnit(props.data.totalCash ?? 0)} */}
                                {jsonSvc.formatLocal(jsonSvc.findLocalById("150058"), [
                                    NumberUtil.unitTransferFloat(props.data.totalCash ?? 0),
                                ])}
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
                            textAlign: "center",
                        }}
                    >
                        {NumberUtil.unitTransferFloat(props.data.score)}
                    </PretendText>
                </View>
            </View>
        </TouchableOpacity>
    )
}
