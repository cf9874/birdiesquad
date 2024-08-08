import { useRoute } from "@react-navigation/native"
import { jsonSvc, profileSvc } from "apis/services"
import { profileImg } from "assets/images"
import { ReadyModal } from "components/Common"
import { Tab, useTab } from "components/Tab"
import { ProfileHeader } from "components/layouts"
import { CustomButton } from "components/utils"
import { Colors, Screen, ScreenParams } from "const"
import { RECORDHELPER } from "dummy"
import { useQuery, useWrapDispatch } from "hooks"
import React, { useEffect, useState } from "react"
import { Image, ScrollView, StatusBar, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { CommentMenu, FeedMenu, HelperPopUp, ProfileDataBox, ProfileInfo } from "screens/user/profile/profile.compo"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { profileCompoStyle, profileStyle } from "styles/profile.style"
import { DateUtil, NumberUtil, RatioUtil, navigate } from "utils"

//기획안 1.0.7 반영
import { RouteProp } from "@react-navigation/native"

const User = () => {
    const route = useRoute<RouteProp<ScreenParams, Screen.USERPROFILE>>()
    const params = route.params
    // const [show, setShow] = useState(true)
    const [rotateShow, setRotateShow] = useState(true)
    const [userInfo] = useQuery(
        () =>
            profileSvc.getFanProfileDetail(params.userSeq).then(value => {
                if (value == null) navigate(Screen.BACK)
                else return value
            }),
        { loading: false }
    )

    useEffect(() => {
        // if (userInfo) {
        //     navigate(Screen.BACK)
        // }
    }, [])

    const modalDispatch = useWrapDispatch(setModal)
    const popUpDispatch = useWrapDispatch(setPopUp)
    //추가한 코드 스와이프 관련
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
    //     setRotateShow(true)
    // }
    // const swipeUp = () => {
    //     animateComponent(RatioUtil.height(-328))
    //     setRotateShow(false)
    // }
    // const animationValue = useRef(new Animated.Value(RatioUtil.height(0))).current

    const date = DateUtil.format(userInfo?.PROFILE_USER.REG_AT)
    const stats = [
        {
            // title: "가입일",
            title: jsonSvc.findLocalById("170039"),
            // context: date ? `${date.year}.${date.month}.${date.day}` : "",
            context: date
                ? jsonSvc.formatLocal(jsonSvc.findLocalById("2044"), [
                      date.year.toString(),
                      date.month.toString(),
                      date.day.toString(),
                  ])
                : "",
        },
        {
            // title: "누적 후원 금액",
            title: jsonSvc.findLocalById("171004"),
            context: userInfo?.PROFILE_RECORD.TOTAL_CASH_AMOUNT,
        },
        {
            // title: "누적 레벨업 횟수",
            title: jsonSvc.findLocalById("171010"),
            context: userInfo?.PROFILE_RECORD.TOTAL_NFT_LEVEL_UP_COUNT,
        },
        {
            // title: "응원챗 누적 발송 횟수",
            title: jsonSvc.findLocalById("171007"),
            // context: userInfo?.PROFILE_RECORD.TOTAL_CASH_COUNT
            //     ? `${userInfo?.PROFILE_RECORD.TOTAL_CASH_COUNT}회 (${NumberUtil.addUnit(
            //           userInfo?.PROFILE_RECORD.TOTAL_CASH_AMOUNT
            //       )})`
            //     : "0회",
            context: userInfo?.PROFILE_RECORD.TOTAL_CASH_COUNT
                ? jsonSvc.formatLocal(jsonSvc.findLocalById("171018"), [
                      userInfo?.PROFILE_RECORD.TOTAL_CASH_COUNT.toString(),
                      NumberUtil.addUnit(userInfo?.PROFILE_RECORD.TOTAL_CASH_AMOUNT),
                  ])
                : "0회",
        },
        {
            // title: "하트 누적 발송 횟수",
            title: jsonSvc.findLocalById("171008"),
            context: userInfo?.PROFILE_RECORD.TOTAL_HEART_COUNT
                ? NumberUtil.addUnit(userInfo?.PROFILE_RECORD.TOTAL_HEART_COUNT)
                : 0,
        },
        {
            // title: "프로필 업 누적 횟수",
            title: jsonSvc.findLocalById("171012"),
            context: userInfo?.PROFILE_UP.TOTAL_UP_COUNT ? NumberUtil.addUnit(userInfo?.PROFILE_UP.TOTAL_UP_COUNT) : 0,
        },
    ]

    const TabCtx = useTab([
        {
            // title: "기록 및 통계",
            title: jsonSvc.findLocalById("171013"),
            component: (
                <View style={profileCompoStyle.menu.con}>
                    <CustomButton
                        onPress={() => {
                            popUpDispatch({
                                open: true,
                                children: <HelperPopUp data={RECORDHELPER.user} />,
                            })
                        }}
                        style={profileStyle.helper.con}
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
                </View>
            ),
        },
        {
            // title: "피드",
            title: jsonSvc.findLocalById("171014"),
            component: <FeedMenu />,
        },
        {
            // title: "댓글",
            title: jsonSvc.findLocalById("171015"),
            component: <CommentMenu />,
        },
    ])

    if (!userInfo) return null

    //탭 진입 시 갱신
    return (
        <SafeAreaView style={{ backgroundColor: Colors.WHITE }}>
            {/* <StatusBar translucent={false} /> */}
            <View
                style={{
                    width: RatioUtil.width(360),
                    height: RatioUtil.height(44),
                    zIndex: 1,
                    padding: 0,
                }}
            >
                {/* <ProfileHeader title="프로필" userSeq={userInfo.PROFILE_USER.USER_SEQ} rotateMenu={!rotateShow} /> */}
                <ProfileHeader
                    title={jsonSvc.findLocalById("7031")}
                    userSeq={userInfo.PROFILE_USER.USER_SEQ}
                    rotateMenu={!rotateShow}
                />
            </View>
            <ScrollView style={{ position: "relative", zIndex: -5 }}>
                <View style={[{ minHeight: RatioUtil.height(630) }]}>
                    <ProfileInfo data={userInfo} />
                    <Tab.Container
                        {...TabCtx}
                        initialLayout={{ width: RatioUtil.width(360) }}
                        swipeEnabled={false}
                        renderTabBar={props => {
                            return (
                                <>
                                    <Tab.Bar
                                        {...props}
                                        indicatorStyle={profileStyle.tabMenu.indicator}
                                        labelStyle={profileStyle.tabMenu.label}
                                        style={profileStyle.tabMenu.style}
                                        activeColor={Colors.BLACK}
                                        pressColor={Colors.WHITE}
                                        onTabPress={scene => {
                                            if (scene.route.key !== "0") {
                                                scene.preventDefault()
                                                modalDispatch({
                                                    open: true,
                                                    children: <ReadyModal />,
                                                })
                                            }
                                        }}
                                    />
                                </>
                            )
                        }}
                    />
                </View>
                <View style={{ height: RatioUtil.lengthFixedRatio(50) }} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default User
