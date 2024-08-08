import { ErrorUtil } from "utils"
import { ABaseApi } from "./base.api"

export class BattleApi extends ABaseApi {
    constructor() {
        super()
    }

    async getDonatedUsers(GAME_CODE: number) {
        const { data } = await this.get<{
            RECENT_SPONSORS: {
                CHAT_TYPE: number
                GAME_CODE: number
                ICON_NAME: string
                ICON_TYPE: number
                PLAYER_CODE: number
                REG_AT: string
                SEQ_NO: number
                SPONSOR_CASH: number
                USER_NICK: string
                USER_SEQ: number
            }[]
        }>({
            url: `/api/v1/live/${GAME_CODE}/recent/sponsors`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async getBattlePlayer(GAME_CODE: number, playerCode: number) {
        const { data } = await this.get<{
            GAME_CODE: number
            PLAYER_CODE: number
            SCORE_CHEER: number
            RANK_CHEER: number
            SCORE_CASH_AMOUNT: number
            SCORE_HEART_COUNT: number
        }>({
            url: `/api/v1/live/${GAME_CODE}/choice/player?PLAYER_CODE=${playerCode}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async getBattlePlayerList(GAME_CODE: number, playerCode: string) {
        const { data } = await this.get<{
            CHOICE_PLAYERS: {
                GAME_CODE: number
                PLAYER_CODE: number
                SCORE_CHEER: number
                RANK_CHEER: number
                SCORE_CASH_AMOUNT: number
                SCORE_HEART_COUNT: number
            }[]
        }>({
            url: `/api/v1/live/${GAME_CODE}/choice/players?${playerCode}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    //only dev
    async testChatbot(GAME_CODE: number, ROUND_CODE: number) {
        const { data } = await this.get({
            url: `/api/v1/live/${GAME_CODE}/bot/${ROUND_CODE}/info`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async getChatBotReward(GAME_CODE: number, BOT_SEQ: number) {
        const { data } = await this.post<{
            GAME_CODE: number
            BOT_SEQ: number
            USER_ASSET: {
                TRAINING: number
                BDST: number
                TBORA: number
                USER_SEQ: number
            }
        }>(
            {
                url: `/api/v1/live/${GAME_CODE}/bot/reward`,
                options: await this.genAuthConfig(),
                body: {
                    BOT_SEQ,
                },
            },
            err => {
                ErrorUtil.genModal(`GAME_CODE:${GAME_CODE} , BOT_SEQ:${BOT_SEQ} \nmsg:${err.data?.message}`)
            }
        )
        return data
    }
}
