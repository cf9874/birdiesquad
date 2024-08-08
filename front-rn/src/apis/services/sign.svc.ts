import { ConfigUtil, DateUtil, ErrorUtil, navigate, navigateReset, navigationRef } from "utils"
import store from "store"
import { setIsFirst, setIsLogin, setUserInfo } from "store/reducers/sign.reducer"
import { APP_USER_ID, DEVICE_KEY, NODE_ENV, REFRESH_TOKEN_ID, TOKEN_ID } from "utils/env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SanctionMsg, Screen, ThirdPartyAnalyticsEventName } from "const"
import { SignApi } from "apis/context"
import { KakaoSignApi, UniteSignApi } from "apis/external"
import { ABaseScv } from "./base.svc"
import { KakaoProfile } from "@react-native-seoul/kakao-login"
import { Alert } from "react-native"
import { KAKAO_USER_STATUS, SANCTION_STATUS, USER_STATUS } from "const/user.const"
import {
    ACCESS_TOKEN_KAKAO,
    ID_TOKEN_KAKAO,
    LOGIN_SCREEN_TUTORIAL,
    REFRESH_TOKEN_KAKAO,
    WALLET_ADDRESS,
} from "const/wallet.const"
import { Platform } from "react-native"
import VersionCheck from "react-native-version-check"
import { setAppVersionInfo } from "store/reducers/appVersionInfo.reducer"
import { Analytics } from "utils/analytics.util"

class SignSvc extends ABaseScv<SignSvc>() {
    private readonly signApi = new SignApi()
    private readonly kakaoSignApi = new KakaoSignApi()
    private readonly uniteSignApi = new UniteSignApi()

    login = async (accessToken?: string, profile?: KakaoProfile) => {
        const token = accessToken || (await this.kakaoSignApi.getAccessToken())
        const profileData = profile || (await this.kakaoSignApi.getProfile())

        if (!token) return

        const version = VersionCheck.getCurrentVersion()

        await AsyncStorage.setItem(APP_USER_ID, profileData?.id?.toString() || "")

        const fcmToken = await AsyncStorage.getItem("FCM_TOKEN")

        const signInDto = await this.signApi.signIn({
            accessToken: token,
            id: profileData.id,
            appVersion: version,
            // deviceKey: DEVICE_KEY + appId,
            // devicePushKey: DEVICE_KEY + appId,
            deviceKey: fcmToken ? fcmToken : DEVICE_KEY,
            devicePushKey: fcmToken ? fcmToken : DEVICE_KEY,
            osType: Platform.OS === "android" ? "aos" : "ios",
        })

        console.error(signInDto.walletAddress)

        if (!signInDto) return

        Analytics.thirdPartyLogEvent(ThirdPartyAnalyticsEventName.af_login)

        await AsyncStorage.setItem(TOKEN_ID, signInDto.token ?? "")
        await AsyncStorage.setItem("regAt", signInDto.regAt ?? "")
        await AsyncStorage.setItem(REFRESH_TOKEN_ID, signInDto.refreshToken ?? "")
        await AsyncStorage.setItem(WALLET_ADDRESS, signInDto.walletAddress ?? "")
        await AsyncStorage.setItem(SANCTION_STATUS, signInDto.sanctionStatus.toString() ?? "")
        // store.dispatch(setIsFirst(signInDto.isfirst))
        if (signInDto.isfirst) {
            const isError = await this.signApi.signInit()
            if (isError === null) this.removeAccountData()
        }
    }

    signUp = async () => {
        const profile = await this.kakaoSignApi.getProfile()
        const token = await this.kakaoSignApi.getAccessToken()

        if (token) {
            const { kakaovx } = await this.uniteSignApi.signUp(profile)
            if (kakaovx.status && kakaovx.code === 1) {
                await this.login(token, profile)
                navigateReset(Screen.TERM)
            }
        } else {
            navigate(Screen.SIGNIN)
            // navigate(Screen.TEST)
        }
    }

    loginHandler = async (isOther: boolean) => {
        let accessToken, idToken, refreshToken

        if (isOther) {
            ;({ accessToken, idToken, refreshToken } = await this.kakaoSignApi.signInOtherAccount())
        } else {
            ;({ accessToken, idToken, refreshToken } = await this.kakaoSignApi.signIn())
        }

        await AsyncStorage.setItem(ACCESS_TOKEN_KAKAO, accessToken ?? "")
        await AsyncStorage.setItem(REFRESH_TOKEN_KAKAO, refreshToken ?? "")
        await AsyncStorage.setItem(ID_TOKEN_KAKAO, idToken ?? "")

        const profile = await this.kakaoSignApi.getProfile()

        this.signApi.setConnector()

        const alreadySignUp = await this.signApi.signUpCheck(profile)

        const { kakaovx } = alreadySignUp
            ? await this.uniteSignApi.signIn(profile)
            : await this.uniteSignApi.signUpCheck(profile)

        const userStatus = await this.statusHandler(kakaovx.code)

        if (userStatus === KAKAO_USER_STATUS.SLEEP) {

            ErrorUtil.genTitleConfirmCancelModal("VX 통합멤버쉽","카카오 VX 통합멤버십 휴면 계정입니다.\n휴면 상태를 해제 하시겠습니까?", ()=>this.recovery(profile.id, kakaovx.data?.sleepAccessToken))
            // ErrorUtil.genTitleModal("VX 통합멤버쉽","카카오 VX 통합멤버십 휴면 계정입니다.\n휴면 상태를 해제 하시겠습니까?")
            
            return
        }

        if (userStatus === KAKAO_USER_STATUS.DELETE || userStatus === KAKAO_USER_STATUS.NONE || !alreadySignUp) {
            const unitedata = await this.uniteSignApi.signUp(profile)

            if (unitedata.kakaovx?.code === KAKAO_USER_STATUS.NORMAL) navigate(Screen.TERM)
            else ErrorUtil.genModal("통합계정 가입에 실패하였습니다.")
            return
        }

        if (alreadySignUp && userStatus === KAKAO_USER_STATUS.NORMAL) {
            // 이미 사용자가 동의를 했다고 판단

            await this.login(accessToken, profile)
            navigateReset(Screen.NFTLIST)
        }
    }

    statusHandler = async (code: number) => {
        if (code === KAKAO_USER_STATUS.SLEEP) {
            return KAKAO_USER_STATUS.SLEEP
        } else if (code === KAKAO_USER_STATUS.DELETE || code === KAKAO_USER_STATUS.NONE) {
            // const data = await this.uniteSignApi.signUp(profile)

            // if (!data || !data.kakaovx.code) return null

            return code
        } else if (code === KAKAO_USER_STATUS.NORMAL) {
            const token = await AsyncStorage.getItem(TOKEN_ID)
            if (token) {
                this.signApi.wake()
            }
            return KAKAO_USER_STATUS.NORMAL
        }
        // undefined는 로그아웃 , null이면 통합계정

        // if (code === 1000 || code === 1003) {
        //     await this.uniteSignApi.signUp(profile)
        //     return USER_STATUS.DELETE
        // } else if (code === 1005) {
        //     await this.signApi.wake()
        //     return USER_STATUS.SLEEP
        // } else if (code === 1) {
        //     return USER_STATUS.NONE
        // }
    }

    // 휴면 계정 복구처리
    recovery = async (kakaoId:string, sleepAccessToken:string): Promise<void> =>{
        const isWakeUp = await this.signApi.recovery(kakaoId, sleepAccessToken)
    }
    
    appInit = async () => {
        let appId = await ConfigUtil.getStorage<string>(APP_USER_ID)

        // const kakaoProfile = await this.kakaoSignApi.getProfile()

        // const appId = kakaoProfile?.id?.toString() || ""

        const accessToken = await ConfigUtil.getStorage<string>(TOKEN_ID)
        if (!accessToken) return

        if (!appId) {
            const kakaoProfile = await this.kakaoSignApi.getProfile()
            appId = kakaoProfile?.id
        }

        // 앱 버전 정보 확인
        // const appInit: any = await this.uniteSignApi.appInit(appId)

        // if (!appId) return

        // await AsyncStorage.setItem(APP_USER_ID, appId)

        const { data, errData } = await this.uniteSignApi.appInit(appId || "")

        if (!data?.kakaovx?.status) return errData

        const { appBasicVersion, appForceVersion, appStoreUrl } = data.kakaovx.data
        store.dispatch(setAppVersionInfo({ appBasicVersion, appForceVersion, appStoreUrl }))

        return await this.statusHandler(data.kakaovx.code)
    }

    logout = async () => {
        const isSignout = await this.signApi.signOut()
        if (isSignout !== null) {
            try {
                await this.kakaoSignApi.signOut()
            } finally {
                await this.removeAccountData()
                return isSignout
            }
        }
        return isSignout
    }

    removeAccountData = async () => {
        await AsyncStorage.removeItem(WALLET_ADDRESS)
        await AsyncStorage.removeItem(TOKEN_ID)
        await AsyncStorage.removeItem(APP_USER_ID)
        await AsyncStorage.removeItem(REFRESH_TOKEN_ID)
        await AsyncStorage.removeItem("regAt")
        store.dispatch(setIsLogin(false))
        store.dispatch(setUserInfo({}))
    }

    Withdrawal = async (REASON: string) => {
        const result = await this.signApi.Withdrawal(REASON)

        const isDelete = result?.STATUS === USER_STATUS.DELETE

        if (isDelete) {
            await this.kakaoSignApi.unLink()
            await this.removeAccountData()
        }

        return isDelete
    }
    // WithdrawalCheck = async () => {
    //     let appId = await ConfigUtil.getStorage<string>(APP_USER_ID)
    //     const result = this.signApi.WithdrawlCheck(appId || "")
    //     return result
    // }
    checkCert = async () => {
        const result = await this.signApi.checkCert()
        return result
    }
    checkAdult = async () => {
        const result = this.signApi.checkAdult()
        return result
    }
}

export const signSvc = SignSvc.instance
