import { ABaseApi } from "./base.api"
import { IDataWrapperRes, IErrorResData, SignApiData } from "../data"
import { ConfigUtil, ErrorUtil } from "utils"
import { KakaoProfile } from "@react-native-seoul/kakao-login"
import { API_URL, APP_USER_ID, DEVICE_KEY } from "utils/env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

export class SignApi extends ABaseApi {
    constructor() {
        super()
    }

    async signUpCheck(profile: KakaoProfile) {
        const { data } = await this.get<boolean>({
            url: `/api/v1/auth/is-registered?SNS_ID=${profile.id}`,
        })

        return data
    }
    async signInit() {
        const { data } = await this.post<SignApiData.SignInit.ResDao>({
            url: "/api/v1/account/first",
            options: await this.genAuthConfig(),
        })

        return SignApiData.SignInit.toResDto(data)
    }

    async signIn(signInDto: SignApiData.SignIn.ReqDto) {
        const { data } = await this.post<SignApiData.SignIn.ResDao>({
            url: "/api/v1/auth/sign-in",
            body: SignApiData.SignIn.toReqDao(signInDto),
        })

        return SignApiData.SignIn.toResDto(data)
    }
    async recovery(kakaoId:string,sleepAccessToken:string) {
        const { data } = await this.post({
            url: "/api/v1/account/recovery",
            body:{
                kakaoId
            },
            options: await ABaseApi.connector?.genAuthConfig(sleepAccessToken),
        })
        return !!data
    }

    async wake() {
        const { data } = await this.post({
            url: "/api/v1/account/wakeup",
            options: await this.genAuthConfig(),
        })
        return !!data
    }

    async signOut() {
        // const appId = await ConfigUtil.getStorage<string>(APP_USER_ID)

        const fcmToken = await AsyncStorage.getItem("FCM_TOKEN")

        const { data } = await this.post<{
            STATUS: number
            STATUS_AT: string
            USER_SEQ: number
        }>({
            url: "/api/v1/auth/sign-out",
            options: await this.genAuthConfig(),
            // body: { DEVICE_KEY: DEVICE_KEY + appId },
            body: { DEVICE_KEY: fcmToken ? fcmToken : DEVICE_KEY },
        })

        console.error("signOut", data)

        if (!data) return false

        return data.STATUS
    }
    // async WithdrawlCheck(appId: string) {
    //     const { data } = await axios<{
    //         resultCode: number
    //         title: string
    //         message: string
    //         resultType: string
    //         status: boolean
    //         resultMsg: string
    //     }>(`${API_URL}/api/v1/account/withdraw/available?kakaoId=${appId}`)
    //     return data
    // }
    async Withdrawal(REASON: string) {
        const header = await this.genAuthHeader()

        const { data } = await this.delete<{
            STATUS: number
            STATUS_AT: string
            USER_SEQ: number
        }>(
            {
                url: "/api/v1/account/secede",
                options: {
                    headers: {
                        ...header,
                    },
                    data: {
                        REASON,
                    },
                },
            }
            // error => ErrorUtil.Withdrawal(error)
        )

        return data
    }
    async checkCert() {
        const { data } = await this.get<boolean>({
            url: "/api/v1/auth/cert/verify",
            options: await this.genAuthConfig(),
        })
        return data
    }
    async checkAdult() {
        const { data } = await this.get<boolean>({
            url: "/api/v1/auth/cert/is-adult",
            options: await this.genAuthConfig(),
        })
        return data
    }
}
