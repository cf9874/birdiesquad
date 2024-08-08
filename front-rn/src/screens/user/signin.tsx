import { View, Text, Image, ActivityIndicator } from "react-native"
import React, { useEffect, useState } from "react"
import { signinImg, kakaoIcon } from "assets/images"
import { userGStyle, userStyle } from "styles/user.style"
import { CustomButton, PretendText } from "components/utils"
import { SafeAreaView } from "react-native-safe-area-context"
import { ConfigUtil, ErrorUtil, navigate, navigateReset, navigationRef, RatioUtil } from "utils"
import { jsonSvc, signSvc } from "apis/services"
import { useScreen, useWrapDispatch } from "hooks"
// import { AnalyticsEventName, Colors, Screen } from "const"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LOGIN_SCREEN_TUTORIAL } from "const/wallet.const"
import { KAKAO_USER_STATUS } from "const/user.const"
import { SvgIcon } from "components/Common/SvgIcon"
import { APP_USER_ID } from "utils/env"
import { Analytics } from "utils/analytics.util"
import { AnalyticsEventName, Colors, Screen } from "const"
const Signin = () => {
    const [loading, setLoading] = useState(true)

    useScreen(() => {
        ;(async () => {
            await Analytics.logEventWithSessioniId(AnalyticsEventName.view_app_start)
            await Analytics.logEventWithSessioniId(AnalyticsEventName.view_login_1)

            try {
                const userStatus = await signSvc.appInit()

                if (
                    userStatus === undefined ||
                    userStatus === KAKAO_USER_STATUS.DELETE ||
                    userStatus === KAKAO_USER_STATUS.NONE
                ) {
                    ErrorUtil.termsModal() // 권한 동의 안내 모달
                    setLoading(false)
                    return
                }

                if (userStatus === null || userStatus === KAKAO_USER_STATUS.SLEEP) {
                    setLoading(false)
                    ErrorUtil.genModal("통합계정에 오류가 있습니다.")
                    return
                }
                const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
                const statusLoginTutorial = await AsyncStorage.getItem(USER_ID + LOGIN_SCREEN_TUTORIAL)

                if (statusLoginTutorial === "1") {
                    navigateReset(Screen.INTROTUTORIAL)
                } else {
                    navigateReset(Screen.NFTLIST)
                }

                setLoading(false)
            } catch (error) {
                setLoading(false)
            }

            // }
        })()
    }, [])

    const onLogin = (isOhter: boolean) => async () => {
        try {
            setLoading(true)

            if (isOhter) {
                await Analytics.logEventWithSessioniId(AnalyticsEventName.click_kakao_account_login_1)
            } else {
                await Analytics.logEventWithSessioniId(AnalyticsEventName.click_kakao_login_1)
            }

            await signSvc.loginHandler(isOhter)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size={"large"} color={Colors.BLUE} />
            </View>
        )
    }

    return (
        <SafeAreaView style={userStyle.signin.con}>
            <SvgIcon name="SigninImgSvg" style={userStyle.signin.logo} />
            <View
                style={{
                    ...userGStyle.userbtn.con,
                    marginTop: RatioUtil.height(185),
                    marginBottom: RatioUtil.height(83),
                }}
            >
                <CustomButton style={userGStyle.userbtn.box} onPress={onLogin(false)}>
                    <Image source={kakaoIcon.talk} style={userStyle.signin.kakaoIcon} resizeMode="contain" />
                    <PretendText style={{ ...userGStyle.userbtn.text, fontSize: RatioUtil.font(16) }}>
                        {/* 카카오 로그인 */}
                        {jsonSvc.findLocalById("4000")}
                    </PretendText>
                </CustomButton>
                <CustomButton
                    onPress={onLogin(true)}
                    style={{
                        height: RatioUtil.height(20),
                    }}
                >
                    <PretendText style={userStyle.signin.loginText}>
                        {/* 카카오계정으로 로그인 */}
                        {jsonSvc.findLocalById("4001")}
                    </PretendText>
                    <View style={userStyle.signin.loginTextUnderLine} />
                </CustomButton>
            </View>
        </SafeAreaView>
    )
}

export default Signin

//  <Button title="go to main" onPress={() => navigate(Screen.TEST)} />

//ios에서는 statusVeiw 하단에만 적용시 상단에 status높이(useSafeAreaInsert 사용)와 같은 view 넣어줘야함
