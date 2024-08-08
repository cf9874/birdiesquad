import analytics from "@react-native-firebase/analytics"
import { AnalyticsEventName, ThirdPartyAnalyticsEventName } from "const"
import { ConfigUtil } from "./config.util"
import { APP_USER_ID } from "./env"
import dayjs from "dayjs"
import appsFlyer from "react-native-appsflyer"

type IAnalyticParam = { [key: string]: any }

export class Analytics {
    static async logEventWithSessioniId(name: AnalyticsEventName): Promise<boolean> {
        const sessionId = await analytics().getSessionId()
        if (!sessionId) {
            return false
        }

        Analytics.logEvent(name, { sessionId })
        return true
    }

    static async logEvent(name: AnalyticsEventName, params?: IAnalyticParam & { hasNewUserData?: boolean }) {
        const userId = await ConfigUtil.getStorage<string>(APP_USER_ID)

        if (!userId) {
            return false
        }

        const result = await Analytics.genNewUserParams(params)

        analytics().logEvent(name, Analytics.checkParams({ userId, ...result }))
    }

    static thirdPartyLogEvent(name: ThirdPartyAnalyticsEventName, params: IAnalyticParam = {}) {
        appsFlyer.logEvent(
            name,
            params,
            res => {
                console.warn(res)
            },
            err => {
                console.error(err)
            }
        )
    }

    private static checkNewUser(regAt: dayjs.Dayjs) {
        const now = dayjs()
        return now.diff(regAt, "hour") < 24
    }

    private static async genNewUserParams(params: IAnalyticParam = {}): Promise<IAnalyticParam> {
        const newUserParams: IAnalyticParam & { hasNewUserData: boolean } = { hasNewUserData: false, ...params }

        const { hasNewUserData, ...restParams } = newUserParams

        if (!hasNewUserData) {
            return restParams
        } else {
            //서버작업완료 이후 로그인할때 전달되는 가입날짜로 수정필요
            const regString = await ConfigUtil.getStorage<string>("regAt")
            const regAt = dayjs(regString)
            const newUserCheck = Analytics.checkNewUser(regAt) ? "TRUE" : "FALSE"
            return { newUserCheck, ...restParams }
        }
    }

    private static checkParams(params?: IAnalyticParam): IAnalyticParam {
        // HACK: 현재 정수형 6자리 넘어가면 기록이 안되는 현상이 있음... OTL
        // 일단 6자리 넘어가면 문자열로 변경해서 기록.
        for (const key in params) {
            const v = params[key]
            if (Number.isInteger(v)) {
                params[key] = v > 999999 ? `${v}` : v
            }
        }

        return { ...params }
    }
}
