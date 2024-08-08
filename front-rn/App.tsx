import React, { useEffect, useRef } from "react"
import Main from "./src/screens"
import Common from "./src/common"
import GameModal from "common/GameModal"
import { withIAPContext } from "react-native-iap"
import { useCodePush } from "hooks/useCodePush"
import { Alert, AppState, AppStateStatus } from "react-native"
import { signSvc } from "apis/services"
import { KAKAO_USER_STATUS } from "const/user.const"
import { ConfigUtil, ErrorUtil, navigate } from "utils"
import { AnalyticsEventName, Screen, SettingMenu, settingMenu } from "const"
import NetWorkCheck from "common/NetworkCheck"
import { SETTING_ID } from "utils/env"
import Config from "react-native-config"
import JailMonkey from "jail-monkey"
import RNExitApp from "react-native-exit-app"
import { useFcmServices } from "hooks"
import { Analytics } from "utils/analytics.util"
import { DeepLinks } from "utils/deepLinks.util"


// 루팅된 디바이스인지 체크
const getJailbreak = () => {
    const isJailbreak = Config.CHECK_JAILBREAK === "true" && JailMonkey.isJailBroken()
    if (isJailbreak) {
        Alert.alert(
            "루팅된 핸드폰 입니다.",
            "앱이 종료됩니다.",
            [
                {
                    text: "확인",
                    onPress: () => RNExitApp.exitApp(),
                },
            ],
            { cancelable: false }
        )
        setTimeout(() => {
            RNExitApp.exitApp()
        }, 5000)
    }
}

const App = (): JSX.Element => {
    const appState = useRef(AppState.currentState)
    getJailbreak()

    const onLogOut = async () => {
        const isSignOut = await signSvc.logout()

        if (isSignOut === null) {
            signSvc.removeAccountData()
        }

        navigate(Screen.SIGNIN)
    }

    const appActive = async () => {
        const userStatus = await signSvc.appInit()
        try {
            if (userStatus === KAKAO_USER_STATUS.DELETE || userStatus === KAKAO_USER_STATUS.NONE) {
                ErrorUtil.genModal("통합계정이 탈퇴되었습니다.\n다시 가입해주세요.", onLogOut, true)
            } else if (userStatus === KAKAO_USER_STATUS.SLEEP) {
                ErrorUtil.genModal("통합계정에 오류가 있습니다.", onLogOut, true)
            }
        } catch (error: any) {
            if (error.message === "expired_or_invalid_refresh_token") {
                ErrorUtil.genModal("계정정보가 만료되었습니다.\n다시 로그인해주세요", onLogOut, true)
                return
            }
        }
    }

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                // 앱의 상태값이 변경하면 다시 루팅 체크
                getJailbreak()
                appActive().catch(error => console.error(error))
            }
            appState.current = nextAppState
        })
        return () => {
            subscription.remove()
        }
    }, [])

    useEffect(() => {
        const checkAndInitSettings = async () => {
            const data = await ConfigUtil.getStorage<SettingMenu>(SETTING_ID)

            if (!data) {
                await ConfigUtil.setStorage({
                    [SETTING_ID]: JSON.stringify(settingMenu),
                })
            } else {
                await ConfigUtil.setStorage({
                    [SETTING_ID]: JSON.stringify(data),
                })
            }
        }

        DeepLinks.setUp()
        checkAndInitSettings()
    }, [])

    useFcmServices()
    useCodePush()
    return (
        //<Provider store={store}>
        <Common>
            <NetWorkCheck />
            <Main />
            {/* <GetReward /> */}
            <GameModal />
        </Common>
        //</Provider>
        // <Chat />
    )
}

const AppWithIAP = withIAPContext(App)
export default AppWithIAP
