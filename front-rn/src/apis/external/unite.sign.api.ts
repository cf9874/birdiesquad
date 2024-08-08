import { KakaoProfile } from "@react-native-seoul/kakao-login"
import { ABaseApi } from "apis/context"
import { Platform } from "react-native"

export class UniteSignApi extends ABaseApi {
    constructor() {
        super()
    }

    //회원가입
    async signUp(kakaoProfile: KakaoProfile) {
        const { data } = await this.post<{
            kakaovx: {
                status: boolean
                code: number
                msg: string
                data: {
                    master_id: number
                    id: string
                    kakao_id: number
                    kakao_email: string
                    phone: string
                    gender: 1 | 0
                    reg_dt: string
                }
            }
        }>({
            url: "/api/v1/auth/kakaovx-bypass",
            body: {
                LINK: `/v1/users/${kakaoProfile.id}`,
                METHOD: "POST",
                BODY: JSON.stringify({
                    kakao_email: kakaoProfile.email === "null" ? "" : kakaoProfile.email,

                    join_platform: "app",
                    join_service: "bdsquad",
                    account_type: "kakao",
                    phone: kakaoProfile.phoneNumber === "null" ? "" : kakaoProfile.phoneNumber,

                    gender: 0,
                }),
                LINK_TYPE: "signup",
            },
        })

        return data
    }
    //회원가입 상태 -  가입용
    async signUpCheck(kakaoProfile: KakaoProfile) {
        const { data } = await this.post<{
            kakaovx: {
                code: number
                status: boolean
                msg: string
                data: {
                    terms: {
                        title: string
                        content: string
                        reg_dt: string
                        open_dt: string
                        close_dt: string
                    }[]
                    active_flag: "Y" | "D"
                    id_isexist: 0 | 1
                    sleep_isexist: 0 | 1
                    sleepAccessToken?: string
                }
            }
        }>({
            url: "/api/v1/auth/kakaovx-bypass",
            body: {
                LINK: `/v1/users/${kakaoProfile.id}/status`,
                METHOD: "GET",
                BODY: JSON.stringify({
                    account_type: "kakao",
                }),
                LINK_TYPE: "signupCheck",
            },
        })
        return data
    }
    //회원가입 상태 -  앱시작용
    async appInit(id: string) {
        let errData = {};
        const { data } = await this.post<{
            kakaovx: {
                status: boolean
                code: number
                msg: string
                data: {
                    active_flag: "Y" | "D"
                    sleep_isexist: 0 | 1
                    join_service: string
                    appBasicVersion: string
                    appForceVersion: string
                    appStoreUrl: string
                }
            }
        }>({
            url: "/api/v1/auth/kakaovx-bypass",
            body: {
                LINK: `/v1/users/${id}/wakeup`,
                METHOD: "GET",
                BODY: JSON.stringify({
                    account_type: "kakao",
                }),
                LINK_TYPE: "appInit",
                osType: Platform.OS,
            },
        },
        err => {
            errData = err;
        })

        return {data, errData}
    }
    async signIn(kakaoProfile: KakaoProfile) {
        const { data } = await this.post<{
            kakaovx: {
                status: boolean
                code: number
                msg: string
                data: {
                    id: string
                    kakao_email: string
                    kakao_id: string
                    reg_dt: string
                    master_id: string
                    phone: string
                    last_login_dt: string
                }
            }
        }>({
            url: "/api/v1/auth/kakaovx-bypass",
            body: {
                LINK: `/v1/users/${kakaoProfile.id}/login`,
                METHOD: "POST",
                BODY: JSON.stringify({
                    account_type: "kakao",
                    join_platform: "app",
                    join_service: "bdsquad",
                    kakao_email: kakaoProfile.email === "null" ? "" : kakaoProfile.email,
                }),
                LINK_TYPE: "signIn",
            },
        })
        return data
    }
    async secession(kakaoProfile: KakaoProfile) {
        const { data } = await this.post<{
            kakaovx: {
                status: boolean
                code: number
                msg: string
                data: {
                    del_dt: string
                    master_id: string
                }
            }
        }>({
            url: "/api/v1/auth/kakaovx-bypass",
            body: {
                LINK: `/v1/users/${kakaoProfile.id}/secede`,
                METHOD: "DELETE",
                BODY: JSON.stringify({
                    account_type: "kakao",
                }),
                LINK_TYPE: "secede",
            },
        })
        return data
    }
}
//const { accessToken } = await getAccessToken()
