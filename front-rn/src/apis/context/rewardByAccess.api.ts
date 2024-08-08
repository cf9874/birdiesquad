import { shopChoiceBilling } from "apis/endpoints"
import { ABaseApi } from "./base.api"
import { IShopChoice, IShopVerify } from "../data"

export class RewardByAccessApi extends ABaseApi {
    constructor() {
        super()
    }

    async getDailyRewardList() {
        const { data } = await this.get<{
            DAY_CODE: number
            // SIGNUP_REWARDS: {
            //     SEQ_NO: number
            //     REG_AT: string
            //     USER_SEQ: number
            //     ITEM_SEQ: number
            // }[]
            SIGNUP_REWARD_INFO: {
                SEQ_NO: number
                REG_AT: string
                REWARD_NO: number
                USER_SEQ: number
                ITEM_SEQS: number[]
            }[]
        }>({
            url: "/api/v1/account/daily/info",
            options: await this.genAuthConfig(),
        })
        return data
    }

    async recieveAccessReward() {
        const { data } = await this.post<{
            SIGNUP_REWARD: {
                SEQ_NO: number
                REG_AT: string
                USER_SEQ: number
                REWARD_NO: number
            }
            REWARD_ITEMS: {
                BILL_SEQ: number
                ITEM_COUNT: number
                ITEM_DELETE: number
                ITEM_ID: number
                NFT_SEQ: number
                PAYMENT_PATH_TYPE: number
                PLAYER_CODE: number
                REG_AT: string
                SEASON_CODE: number
                SEQ_NO: number
                UDT_AT: string
                USER_SEQ: number
            }[]
        }>({
            url: "/api/v1/account/do-reward/signup",
            options: await this.genAuthConfig(),
        })

        return data
    }
}
