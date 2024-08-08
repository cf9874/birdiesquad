import React, { useRef, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { RECORDHELPER } from "dummy"
import { AnalyticsEventName, Colors, Screen, ScreenParams } from "const"
import { NumberUtil, RatioUtil } from "utils"
import { useAsyncEffect, useQuery, useWrapDispatch } from "hooks"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { CommentMenu, FeedMenu, HelperPopUp, ProfileDataBox, ProfileInfo } from "screens/user/profile/profile.compo"
import { Tab, useTab } from "components/Tab"
import { jsonSvc, liveSvc, profileSvc } from "apis/services"
import GestureRecognizer from "react-native-swipe-gestures"
import { Animated, Image, StatusBar, View, ScrollView } from "react-native"
import { profileCompoStyle, profileStyle } from "styles/profile.style"
import { CustomButton } from "components/utils"
import { profileImg } from "assets/images"
import { ProfileHeader } from "components/layouts"
import { ReadyModal } from "components/Common"
import { useRoute, RouteProp } from "@react-navigation/native"
import { Analytics } from "utils/analytics.util"

//기획안 1.0.7 반영
const Pro = () => {
    // const [show, setShow] = useState(true)
    const route = useRoute<RouteProp<ScreenParams, Screen.PROPROFILE>>()
    const params = route.params
    const [data] = useQuery(
        {
            proInfo: () => {
                return params && profileSvc.getProProfileDetail(params.player_code) //
            },
            currentSeason: liveSvc.getSetSeason,
        },
        { loading: false }
    )

    const { proInfo, currentSeason } = data ?? {}

    const modalDispatch = useWrapDispatch(setModal)
    const popUpDispatch = useWrapDispatch(setPopUp)
    // const [currentComponent, setCurrentComponent] = useState(0)
    // const topPosition = 0
    // const animateComponent = (componentNumber: number) => {
    //     setCurrentComponent(componentNumber)
    //     Animated.timing(animationValue, {
    //         toValue: componentNumber,
    //         duration: 500,
    //         useNativeDriver: true,
    //     }).start()
    // }
    // const swipeDown = () => {
    //     animateComponent(RatioUtil.height(0))
    // }
    // const swipeUp = () => {
    //     animateComponent(RatioUtil.height(-328))
    // }
    // const animationValue = useRef(new Animated.Value(RatioUtil.height(0))).current

    const haveSeasonData = (value: undefined | number | string) => {
        return value != undefined
    }
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_pro_profile_160, {
            hasNewUserData: true,
        })
    }, [])
    const stats = [
        {
            // title: "현재 수익 순위",
            title: jsonSvc.findLocalById("171026"),
            // context: proInfo?.PROFILE_RECORD.CURRENT_RANK_CASH_AMOUNT + "위",
            context: jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [
                (proInfo?.PROFILE_RECORD.CURRENT_RANK_CASH_AMOUNT ?? 0).toString(),
            ]),
        },
        {
            // title: "누적 수익 금액",
            title: jsonSvc.findLocalById("171027"),
            context: NumberUtil.addUnit(proInfo?.PROFILE_RECORD.TOTAL_CASH_AMOUNT ?? 0),
        },
        {
            // title: "현재 응원챗 순위",
            title: jsonSvc.findLocalById("171028"),
            // context: proInfo?.PROFILE_RECORD.CURRENT_RANK_CASH_COUNT + "위",
            context: jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [
                (proInfo?.PROFILE_RECORD.CURRENT_RANK_CASH_COUNT ?? "").toString(),
            ]),
        },
        {
            // title: "현재 하트 순위",
            title: jsonSvc.findLocalById("171029"),
            context:
                proInfo?.PROFILE_RECORD.CURRENT_RANK_HEART_COUNT === -1
                    ? // "순위없음"
                      jsonSvc.findLocalById("150060")
                    : jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [
                          (proInfo?.PROFILE_RECORD.CURRENT_RANK_HEART_COUNT ?? "").toString(),
                      ]),
            //
        },
        {
            // title: "현재 프로필 UP 순위",
            title: jsonSvc.findLocalById("171030"),
            context:
                proInfo?.PROFILE_RECORD.CURRENT_RANK_UP_COUNT === -1
                    ? // "순위없음"
                      jsonSvc.findLocalById("150060")
                    : // : proInfo?.PROFILE_RECORD.CURRENT_RANK_UP_COUNT + "위",
                      jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [
                          (proInfo?.PROFILE_RECORD.CURRENT_RANK_UP_COUNT ?? "").toString(),
                      ]),
        },
        // jsonSvc.formatLocal(jsonSvc.findLocalById("7025"),[(??"").toString()])
        {
            // title: "NFT 판매 수",
            title: jsonSvc.findLocalById("171031"),
            context: `${NumberUtil.addUnit(proInfo?.PROFILE_RECORD.TOTAL_NFT_SELL_COUNT ?? 0)}`,
        },
    ]
    const season = [
        {
            // title: "시즌 기록",
            title: jsonSvc.findLocalById("160020"),
            // context: proInfo?.PROFILE_SEASON.seasonKey + " 시즌",
            context: haveSeasonData(proInfo?.PROFILE_SEASON?.seasonKey)
                ? jsonSvc.formatLocal(jsonSvc.findLocalById("171034"), [
                      (proInfo?.PROFILE_SEASON?.seasonKey ?? "").toString(),
                  ])
                : "정보 없음",
        },
        {
            // title: "상금 (순위)",
            title: jsonSvc.findLocalById("160021"),
            context:
                proInfo?.PROFILE_SEASON?.rank == -1 || proInfo?.PROFILE_SEASON?.rank == undefined
                    ? // "순위없음"
                      jsonSvc.findLocalById("150060")
                    : // : `${proInfo?.PROFILE_RECORD.CURRENT_RANK_CASH_AMOUNT.toLocaleString()}원 (${
                      //       proInfo?.PROFILE_SEASON.rank
                      //   }위)`,
                      jsonSvc.formatLocal(jsonSvc.findLocalById("171035"), [
                          NumberUtil.addUnit(
                              proInfo?.PROFILE_SEASON?.seasonKey == `${currentSeason}`
                                  ? Number(proInfo?.PROFILE_RECORD.CURRENT_RANK_CASH_AMOUNT ?? 0)
                                  : Number(proInfo?.PROFILE_SEASON.earnings ?? 0)
                          ).toString(),
                          (proInfo?.PROFILE_SEASON.rank.toLocaleString() ?? "").toString(),
                      ]),
        },
        {
            // title: "평균 타수",
            title: jsonSvc.findLocalById("160022"),
            context: proInfo?.PROFILE_SEASON?.strokeAvg ?? "정보 없음",
        },
        {
            // title: "최장 드라이브 비거리",
            title: jsonSvc.findLocalById("160023"),
            context: proInfo?.PROFILE_SEASON?.drivingDist ?? "정보 없음",
        },
        {
            // title: "페어웨이 안착률",
            title: jsonSvc.findLocalById("160024"),
            context: proInfo?.PROFILE_SEASON?.greensInReg ?? "정보 없음",
        },
        {
            // title: "평균 퍼팅 횟수",
            title: jsonSvc.findLocalById("160025"),
            context: proInfo?.PROFILE_SEASON?.puttAvg ?? "정보 없음",
        },
    ]

    if (!proInfo) return null

    //탭 진입 시 갱신
    return (
        <SafeAreaView>
            {/* <StatusBar translucent={false} /> */}
            <View
                style={{
                    width: RatioUtil.width(360),
                    height: RatioUtil.height(44),
                    zIndex: 1,
                    padding: 0,
                }}
            >
                {/* <ProfileHeader title="선수 프로필" /> */}
                <ProfileHeader title={jsonSvc.findLocalById("7031")} />
            </View>
            <ScrollView style={{ position: "relative", zIndex: -5 }}>
                <View style={[{ minHeight: RatioUtil.height(700) }]}>
                    <ProfileInfo data={proInfo} />
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            width: RatioUtil.width(360),
                            minHeight: RatioUtil.height(270),
                            flex: 1,
                            paddingHorizontal: RatioUtil.width(20),
                            paddingTop: RatioUtil.height(20),
                        }}
                    >
                        <CustomButton
                            onPress={() => {
                                popUpDispatch({
                                    open: true,
                                    children: <HelperPopUp data={RECORDHELPER.pro} />,
                                })
                            }}
                            style={{
                                position: "absolute",
                                top: RatioUtil.height(0),
                                right: RatioUtil.width(21),
                                width: RatioUtil.width(18),
                                height: RatioUtil.width(18),
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                source={profileImg.info}
                                resizeMode="contain"
                                style={{
                                    width: RatioUtil.width(16),
                                    height: RatioUtil.width(16),
                                }}
                            />
                        </CustomButton>
                        <ProfileDataBox data={stats} />
                        <ProfileDataBox
                            data={season}
                            conStyle={{ marginTop: RatioUtil.height(10), marginBottom: RatioUtil.height(100) }}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Pro
