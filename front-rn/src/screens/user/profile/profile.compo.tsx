import React, { useState } from "react"
import { Image, ScrollView, View, ViewStyle } from "react-native"
import { AnalyticsEventName, Colors } from "const"
import { ConfigUtil, DateUtil, RatioUtil } from "utils"
import { profileImg } from "assets/images"
import { CustomButton } from "components/utils/CustomButton"
import { profileCompoStyle, profileStyle } from "styles/profile.style"
import { useWrapDispatch } from "hooks"
import { setPopUp } from "store/reducers/config.reducer"
import { jsonSvc, nftSvc, profileSvc } from "apis/services"
import { IPanProfile, IProDetail, ProfileApiData } from "apis/data"
import ProfileImage from "components/utils/ProfileImage"
import { PretendText } from "components/utils"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { Analytics } from "utils/analytics.util"

export const HelperPopUp = ({ data }: { data: Array<{ title: string; content: string }> }) => {
    const popUpDispatch = useWrapDispatch(setPopUp)
    const insets = useSafeAreaInsets()
    return (
        <ScrollView style={{ ...profileCompoStyle.modal.helperCon, ...{ marginTop: insets.top } }}>
            <PretendText
                style={{
                    position: "absolute",
                    top: RatioUtil.height(41.08),
                    left: RatioUtil.width(20),
                    color: Colors.BLACK,
                    fontSize: RatioUtil.font(16),
                    fontWeight: "700",
                    lineHeight: RatioUtil.font(16) * 1.5,
                }}
            >
                {/* 기록 및 통계 도움말 */}
                {jsonSvc.findLocalById("911000")}
            </PretendText>
            <CustomButton
                onPress={() => {
                    popUpDispatch({ open: false })
                }}
                style={{
                    position: "absolute",
                    top: RatioUtil.height(41.08),
                    right: RatioUtil.width(16),
                    width: RatioUtil.width(24),
                    height: RatioUtil.width(24),
                }}
            >
                <Image
                    resizeMode="contain"
                    source={profileImg.close}
                    style={{
                        width: RatioUtil.width(22),
                        height: RatioUtil.width(22),
                    }}
                />
            </CustomButton>
            <View
                style={{
                    marginTop: RatioUtil.height(85.08),
                    borderColor: Colors.GRAY7,
                    borderWidth: 1,
                    borderRadius: RatioUtil.width(10),
                    paddingHorizontal: RatioUtil.width(10),
                    paddingVertical: RatioUtil.height(20),
                    marginHorizontal: RatioUtil.width(20),
                }}
            >
                {data.map(detail => {
                    return (
                        <View key={detail.title} style={{ marginBottom: RatioUtil.height(12) }}>
                            <PretendText
                                style={{
                                    color: Colors.BLACK,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "600",
                                    lineHeight: RatioUtil.font(14) * 1.4,
                                    marginBottom: RatioUtil.height(3),
                                }}
                            >
                                {detail.title}
                            </PretendText>
                            <PretendText
                                style={{
                                    color: Colors.GRAY8,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "400",
                                    lineHeight: RatioUtil.font(14) * 1.4,
                                    letterSpacing: RatioUtil.font(14) * -0.02,
                                }}
                            >
                                {detail.content}
                            </PretendText>
                        </View>
                    )
                })}
            </View>
        </ScrollView>
    )
}
export const ProfileDataBox = ({
    data,
    conStyle,
}: {
    data: Array<{ title: string; context?: string | number }> | undefined
    conStyle?: ViewStyle
}) => {
    return (
        <View style={{ ...profileCompoStyle.menu.dataCon, ...conStyle }}>
            {data?.map(({ title, context }) => (
                <View
                    key={title}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: RatioUtil.height(5),
                    }}
                >
                    <PretendText style={profileCompoStyle.menu.text}>{title}</PretendText>
                    <PretendText style={profileCompoStyle.menu.text}>{context}</PretendText>
                </View>
            ))}
        </View>
    )
}
export const ProfileInfo = ({ data }: { data: IProDetail | IPanProfile }) => {
    // const topStat = isUser ? data.userStat?.slice(0, 3) : data.proStat?.slice(0, 3)

    const isPanProfile = (data: IPanProfile | IProDetail): data is IPanProfile => !("PLAYER_CODE" in data)
    const isProDetail = (data: IPanProfile | IProDetail): data is IProDetail => "PLAYER_CODE" in data

    const [isUp, setIsUp] = useState(Boolean(data.PROFILE_UP.TOGGLE))
    const [count, setCount] = useState(data.PROFILE_UP.WEEK_UP_COUNT)

    const onUp = async (data: IPanProfile | IProDetail) => {
        if (isUp) return

        // UP 버튼
        await Analytics.logEvent(AnalyticsEventName.click_up_160, {
            hasNewUserData: true,
        })

        let upCount, id
        if (isProDetail(data)) {
            upCount = await profileSvc.postProProfileUpCount(data.PLAYER_CODE)
            id = data.PLAYER_CODE
            const count = await profileSvc.getProProfileUpCount(data.PLAYER_CODE)
            setCount(count.WEEK_UP_COUNT)
        } else if (isPanProfile(data)) {
            upCount = await profileSvc.postFanProfileUpCount(data.PROFILE_USER.USER_SEQ)
            id = data.PROFILE_USER.USER_SEQ
            const count = await profileSvc.getFanProfileUpCount(data.PROFILE_USER.USER_SEQ)
            setCount(count.WEEK_UP_COUNT)
        } else {
            return
        }
        setIsUp(Boolean(upCount.TOGGLE))
    }

    const isUser = isPanProfile(data)
    const menuList = isUser
        ? [
              {
                  //   title: "NFT 보유수",
                  title: jsonSvc.findLocalById("171000"),
                  context: data.PROFILE_RECORD.TOTAL_NFT_COUNT,
              },
              {
                  //   title: "보유 최고 등급",
                  title: jsonSvc.findLocalById("171001"),
                  context: nftSvc.getGradeText(data.PROFILE_RECORD.NFT_GRADE_TOP),
              },
              {
                  //   title: "열혈 응원 선수",
                  title: jsonSvc.findLocalById("171005"),
                  context: nftSvc.getNftPlayer(data.PROFILE_RECORD.TOP_BLOOD_PLAYER_CODE)?.sPlayerName ?? "없음",
              },
          ]
        : [
              {
                  //   title: "응원 팬 수",
                  title: jsonSvc.findLocalById("171023"),
                  context: data.PROFILE_RECORD.CHEER_FAN_COUNT,
              },
              {
                  //   title: "1위 열혈 팬",
                  title: jsonSvc.findLocalById("171024"),
                  context: data.PROFILE_RECORD.TOP_BLOOD_FAN,
              },
              {
                  //   title: "NFT 최고 금액",
                  title: jsonSvc.findLocalById("171025"),
                  context: data.PROFILE_RECORD.TOP_NFT_PRICE,
              },
          ]

    return (
        <View style={{ ...profileCompoStyle.info.con }}>
            <View style={{ alignItems: "center", position: "relative" }}>
                <View
                    style={{
                        width: RatioUtil.width(106),
                        height: RatioUtil.height(108),
                        marginTop: RatioUtil.height(18),
                        alignItems: "center",
                        paddingTop: RatioUtil.height(2),
                    }}
                >
                    {/* <Image
                        source={
                            isPanProfile(data)
                                ? ConfigUtil.getProfile(data.PROFILE_USER.ICON_NAME, data.PROFILE_USER.ICON_TYPE)
                                : ConfigUtil.getProfile(`${data.PROFILE_SEASON.seasonKey}_${data.PLAYER_CODE}`)
                        }
                        resizeMode="contain"
                        style={{
                            width: RatioUtil.width(102),
                            height: RatioUtil.width(102),
                            borderWidth: 3,
                            borderColor: Colors.WHITE,
                            borderRadius: RatioUtil.width(51),
                        }}
                    /> */}
                    <ProfileImage
                        name={
                            isUser
                                ? data.PROFILE_USER.ICON_NAME
                                : `${data.PROFILE_SEASON.seasonKey}_${data.PLAYER_CODE}`
                        }
                        type={isUser ? data.PROFILE_USER.ICON_TYPE : undefined}
                        resizeMode="contain"
                        style={{
                            width: RatioUtil.width(102),
                            height: RatioUtil.width(102),
                            borderWidth: 3,
                            borderColor: Colors.WHITE,
                            borderRadius: RatioUtil.width(51),
                        }}
                    />
                </View>
                <CustomButton
                    style={{
                        width: RatioUtil.width(76),
                        height: RatioUtil.height(32),
                        position: "absolute",
                        top: RatioUtil.height(111),
                        backgroundColor: isUp ? Colors.PURPLE : Colors.BLACK,
                        flexDirection: "row",
                        borderWidth: 2,
                        borderColor: Colors.GRAY7,
                        borderRadius: 100,
                        ...profileStyle.layout.center,
                    }}
                    onPress={() => onUp(data)}
                >
                    <View
                        style={{
                            width: RatioUtil.width(19.27),
                            height: RatioUtil.height(19.2),
                            marginRight: RatioUtil.width(2.14),
                            ...profileStyle.layout.center,
                        }}
                    >
                        <Image
                            source={profileImg.whiteLike}
                            resizeMode="contain"
                            style={{
                                width: RatioUtil.width(16.06),
                                height: RatioUtil.height(15.2),
                            }}
                        />
                    </View>
                    <PretendText
                        style={{
                            color: Colors.WHITE,
                            fontSize: RatioUtil.font(14),
                            fontWeight: "700",
                            lineHeight: RatioUtil.font(14) * 1.22,
                        }}
                    >
                        {count}
                    </PretendText>
                </CustomButton>
            </View>
            <View style={{ marginTop: RatioUtil.height(33), alignItems: "center" }}>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(24),
                        fontWeight: "700",
                        lineHeight: RatioUtil.font(24) * 1.21,
                        color: Colors.BLACK,
                    }}
                >
                    {isUser ? data.PROFILE_USER.NICK : data.PROFILE_PLAYER?.sPlayerName}
                </PretendText>
                <PretendText
                    style={{
                        width: RatioUtil.width(249),
                        textAlign: "center",
                        fontSize: RatioUtil.font(16),
                        fontWeight: "400",
                        lineHeight: RatioUtil.font(16) * 1.5,
                        color: Colors.BLACK,
                        marginTop: RatioUtil.height(10),
                    }}
                >
                    {isUser
                        ? data.PROFILE_USER.HELLO
                        : (() => {
                              //   const date = DateUtil.format(data.PROFILE_PLAYER?.sBirth)
                              return `${data.PROFILE_PLAYER?.sTeam} |  ${`${data.PROFILE_PLAYER?.sBirth} 출생`}`
                          })()}
                </PretendText>
            </View>
            <View style={{ flexDirection: "row", marginVertical: RatioUtil.height(20) }}>
                {menuList?.map((v, i) => (
                    <View
                        key={v.title}
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.GRAY7,
                            borderRadius: RatioUtil.width(10),
                            width: RatioUtil.width(100),
                            height: RatioUtil.height(67),
                            ...profileStyle.layout.center,
                            marginLeft: i ? RatioUtil.width(10) : 0,
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(13),
                                fontWeight: "600",
                                lineHeight: RatioUtil.font(13) * 1.24,
                                color: Colors.GRAY3,
                            }}
                        >
                            {v.title}
                        </PretendText>
                        <View
                            style={{ flexDirection: "row", justifyContent: "center", marginTop: RatioUtil.height(7) }}
                        >
                            {isPanProfile(data) && i === 0 ? (
                                <Image
                                    source={profileImg.nft}
                                    resizeMode="contain"
                                    style={{
                                        width: RatioUtil.width(19),
                                        height: RatioUtil.height(19),
                                        marginRight: RatioUtil.width(6),
                                    }}
                                />
                            ) : null}
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "700",
                                    lineHeight: RatioUtil.font(16) * 1.19,
                                    color: Colors.BLACK,
                                }}
                            >
                                {`${v.context}`}
                            </PretendText>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}
//임시 Menu 추후 Pro, User 따로 만들 예정
export const FeedMenu = () => <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
export const CommentMenu = () => <View style={{ flex: 1, backgroundColor: "#000" }} />

const proStatTitles = [
    "응원 팬 수",
    "1위 열혈팬",
    "NFT 최고 금액",
    "현재 수익 순위",
    "누적 수익 금액",
    "현재 응원챗 순위",
    "현재 하트 순위",
    "현재 프로필 UP 순위",
    "NFT 판매 수",
    "프로 피드 언급 수",
]

const userStatTitles = [
    "NFT 보유 수",
    "보유 최고 등급",
    "열혈 응원 선수",
    "이전 시즌 BDST 획득 순위",
    "이전 시즌 육성 포인트 획득 순위",
    "누적 후원 금액",
    "프로 소통 수",
    "응원챗 누적 발송 횟수",
    "하트 누적 발송 횟수",
    "누적 승급 횟수",
    "누적 레벨업 횟수",
    "획득 배지 수",
]
