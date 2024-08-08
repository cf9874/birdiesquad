import { View, Text } from "react-native"
import React, { useEffect, useState } from "react"
import Video from "react-native-video"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from "react-native-reanimated"
import { ErrorUtil, navigate, navigateReset } from "utils"
import { signinImg } from "assets/images"
import { Screen, Colors, ErrorType } from "const"

import { MyNftActions } from "store/reducers/myNft.reducer"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { screenInsets } from "utils"
import { systemSvc } from "apis/services"
import DeviceInfo from "react-native-device-info"
import { setAppVersionInfo } from "store/reducers/appVersionInfo.reducer"
import store from "store"
import semver from "semver"
import { AppForceUpdatePopup } from "screens/nft/components/popup/appForceUpdate.popup"
import { firebase } from "@react-native-firebase/analytics"
import { DeepLinks } from "utils/deepLinks.util"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { TOKEN_ID } from "utils/env"
import messaging from "@react-native-firebase/messaging"
import { onOpenNotification } from "hooks"
import { EventNavigate } from "utils/eventNavigate.util"

const SplashScreenView = ({ navigation }) => {
    const [FourceUpdateModalVisible, setFourceUpdateModalVisible] = useState(false)

    async function onEndVideo() {
        const { osVersionInfo, errData } = await systemSvc.getOsVersionInfo()
        const token = await AsyncStorage.getItem(TOKEN_ID)

        // 점검중 여부
        if (errData?.code == 9999) {
            const code = errData?.code ?? ""
            const message = errData?.data?.message ?? ""
            if (code === ErrorType.SERVER_MAINTENANCE_CHECK) {
                const errMsg = message.split("__")
                ErrorUtil.genTitleModal(errMsg[0], errMsg[1], () => navigation.push(Screen.SPLASH), true)
                return
            }
        } else {
            // 강업 여부 체크
            if (osVersionInfo) {
                const { appBasicVersion, appForceVersion, appStoreUrl } = osVersionInfo
                const currentVersion = DeviceInfo.getVersion() // 사용자의 현재 앱 버전을 가져옴
                store.dispatch(setAppVersionInfo({ appBasicVersion, appForceVersion, appStoreUrl }))

                if (appForceVersion && semver.lt(currentVersion, appForceVersion)) {
                    setFourceUpdateModalVisible(true)
                    return
                }
            }
        }
        const link = await firebase.dynamicLinks().getInitialLink()
        console.log(`dynamic links`)
        console.log(link)
        if (token && link) {
            console.log("quit state")
            DeepLinks.process(link.url, false)
            return
        }

        const PUSH_EVENT_TYPE = await AsyncStorage.getItem("PUSH_EVENT_TYPE")
        if (PUSH_EVENT_TYPE) {
            EventNavigate.navigateQuit(Number(PUSH_EVENT_TYPE))
            return
        }

        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log("-------------------------->>>>APP Background STATE!", remoteMessage)
            console.log(remoteMessage.data?.EVENT_TYPE)
            EventNavigate.navigateNormal(Number(remoteMessage.data?.EVENT_TYPE))
            return
        })
        navigateReset(Screen.SIGNIN)
    }

    MyNftActions.resetDatas()

    const insets = useSafeAreaInsets()
    screenInsets.top = insets.top
    screenInsets.bottom = insets.bottom

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors.WHITE,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Animated.View style={[{ width: "100%", height: "100%" }]}>
                <Video
                    source={signinImg.splash}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    paused={false}
                    resizeMode="contain"
                    onEnd={onEndVideo}
                    playWhenInactive={true}
                    //ignoreSilentSwitch="ignore"
                    //muted={true}
                    disableFocus={true}
                    mixWithOthers="mix"
                />
            </Animated.View>
            <AppForceUpdatePopup modalVisible={FourceUpdateModalVisible} />
        </View>
    )
}

export default SplashScreenView
