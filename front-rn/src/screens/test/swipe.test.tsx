import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { RECORDHELPER } from "dummy"
import { Colors, Screen, ScreenParams } from "const"
import { navigationRef, RatioUtil } from "utils"
import { useWrapDispatch } from "hooks"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { CommentMenu, FeedMenu, HelperPopUp, ProfileDataBox, ProfileInfo } from "screens/user/profile/profile.compo"
import { Tab, useTab } from "components/Tab"
import GestureRecognizer from "react-native-swipe-gestures"
import { useQuery } from "hooks"
import { profileSvc } from "apis/services"
import { profileCompoStyle, profileStyle } from "styles/profile.style"
import { Animated, Easing, Image, View } from "react-native"
import { CustomButton } from "components/utils"
import { profileImg } from "assets/images"
import { ProfileHeader } from "components/layouts"
import { ReadyModal } from "components/Common"
import { ParamListBase, useRoute } from "@react-navigation/native"
//기획안 1.0.7 반영
import { RouteProp } from "@react-navigation/native"
import { Text } from "react-native-svg"
const User = () => {
    const route = useRoute<RouteProp<ScreenParams, Screen.USERPROFILE>>()

    const params = route.params
    const [show, setShow] = useState(true)
    const [userInfo, setUserInfo] = useQuery(() => {
        return params && profileSvc.getPanInfo(params.userSeq)
    })
    const modalDispatch = useWrapDispatch(setModal)
    const popUpDispatch = useWrapDispatch(setPopUp)

    //
    const [yPosition, setYPosition] = useState(-RatioUtil.height(0))

    const onSwipeDown = () => {
        Animated.timing(yPosition, {
            toValue: -RatioUtil.height(660),
            duration: 5000,

            useNativeDriver: true,
        }).start()
    }

    const onSwipe = () => {
        Animated.timing(yPosition, {
            toValue: RatioUtil.height(330),
            duration: 5000,
            useNativeDriver: true,
        }).start()
    }
    const TabCtx = useTab([
        {
            title: "기록",
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
                    <ProfileDataBox data={userInfo?.profile.userStat?.slice(3)} />
                </View>
            ),
        },
        {
            title: "피드",
            component: <FeedMenu />,
        },
        {
            title: "댓글",
            component: <CommentMenu />,
        },
    ])

    if (!userInfo) return null

    //탭 진입 시 갱신
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <GestureRecognizer
                onSwipeDown={() => setShow(true)}
                onSwipeUp={() => setShow(false)}
                style={{ flex: 1 }}
                config={{
                    velocityThreshold: 0.1,
                    directionalOffsetThreshold: 100,
                }}
            > */}
            <Animated.View
                style={[
                    { width: RatioUtil.width(360), height: RatioUtil.height(660) },
                    { transform: [{ translateY: yPosition }] },
                ]}
            >
                <ProfileHeader title="프로필" userSeq={params.userSeq} rotateMenu={!show} />
                {show ? <ProfileInfo data={userInfo} /> : null}

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
            </Animated.View>
            {/* </GestureRecognizer> */}
        </SafeAreaView>
    )
}

export default User
