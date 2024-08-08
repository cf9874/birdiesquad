import { ABaseScv } from "./base.svc"
import { RewardByAccessApi } from "apis/context/rewardByAccess.api"
import { jsonSvc } from "./json.svc"
import dayjs from "dayjs"
import dailyJson from "json/daily_luckydraw.json"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

class RewardByAccessSvc extends ABaseScv<RewardByAccessSvc>() {
    private readonly RewardByAccessApi = new RewardByAccessApi()

    handleRewardByAccess = async () => {
        const { SIGNUP_REWARD_INFO } = (await this.RewardByAccessApi.getDailyRewardList()) || {}

        // if (SIGNUP_REWARD_INFO.length === 0 || ) {
        //     // 최초보상
        //     const data = await this.tryReceiveReward()

        //     return data
        // }

        if (this.checkReward(SIGNUP_REWARD_INFO)) {
            const count = SIGNUP_REWARD_INFO.length > 0 ? jsonSvc.findCountById(SIGNUP_REWARD_INFO[0].REWARD_NO) : 0

            if (count === dailyJson.length) return false

            const data = await this.tryReceiveReward()

            if (!data) return false

            return data
        }

        // return false
    }

    // handleRewardByAccess = async () => {
    //     const { SIGNUP_REWARDS } = await this.RewardByAccessApi.getDailyRewardList()

    //     const recentRewardDate = this.getRecentRewardDate(SIGNUP_REWARDS.map(reward => reward.REG_AT))
    //     if (SIGNUP_REWARDS.length > 2) return
    //     if (SIGNUP_REWARDS.length === 0) {
    //         //최초보상
    //         const itemSeq = await this.tryReceiveReward()
    //         await AsyncStorage.setItem(SIGNUP_REWARD, (itemSeq ?? "").toString())
    //         return { itemSeq, rewardCount: SIGNUP_REWARDS.length + 1 }
    //     }
    //     if (this.checkRewardDate(recentRewardDate)) {
    //         //마지막 수령보상보다 하루가 지났다면 n일차 보상
    //         const itemSeq = await this.tryReceiveReward()
    //         await AsyncStorage.setItem(SIGNUP_REWARD, (itemSeq ?? "").toString())
    //         return { itemSeq, rewardCount: SIGNUP_REWARDS.length + 1 }
    //     }

    //     return false
    // }
    // checkRewardHistory = async () => {
    //     const { SIGNUP_REWARDS } = await this.RewardByAccessApi.getDailyRewardList()
    //     return SIGNUP_REWARDS.length
    // }

    private tryReceiveReward = async () => {
        const data = await this.RewardByAccessApi.recieveAccessReward()

        if (!data) return null
        console.error("REWARD_NO", data.SIGNUP_REWARD.REWARD_NO)
        console.error("REWARD_ITEMS", data.REWARD_ITEMS)

        const count = jsonSvc.findCountById(data.SIGNUP_REWARD.REWARD_NO)

        const [reward] = data.REWARD_ITEMS

        return { count, reward }
    }

    // private getRecentRewardDate = (dates: string[]): Date => {
    //     return dates.reduce((latestDate, currentDate) => {
    //         const currentParsedDate = new Date(currentDate)
    //         return currentParsedDate > latestDate ? currentParsedDate : latestDate
    //     }, new Date(dates[0]))
    // }

    checkReward = (
        data: {
            SEQ_NO: number
            REG_AT: string
            REWARD_NO: number
            USER_SEQ: number
            ITEM_SEQS: number[]
        }[]
    ) => {
        if (data === undefined) return false

        if (data.length === 0) return true

        const [item] = data

        if (!dayjs(item.REG_AT).isValid()) return false

        const now = dayjs.utc().add(9, "hour")
        const endOfCurrentDate = dayjs.utc(item.REG_AT).add(9, "hour").endOf("day")

        return now.isAfter(endOfCurrentDate)
    }
    // isYesterday = (dayCode: string) => {
    //     const year = dayCode.slice(0, 4)
    //     const month = dayCode.slice(4, 6)
    //     const day = dayCode.slice(6, 8)
    //     const dayCodeDate = dayjs(`${year}-${month}-${day}`)

    //     const yesterday = dayjs().subtract(1, "day")

    //     return dayCodeDate.isSame(yesterday, "day")
    // }

    // private checkRewardDate = (date: Date): boolean => {
    //     const currentDate = new Date()
    //     const today = currentDate.getDate()
    //     const rewardDate = date.getDate()

    //     return today > rewardDate && today !== rewardDate
    // }
}

export const rewardByAccessSvc = RewardByAccessSvc.instance
