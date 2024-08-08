import { ABaseApi } from "./base.api"
import { Nft, NftApiData, PageMeta } from "../data"
import { LiveApiData } from "apis/data/live.data"

export class LiveApi extends ABaseApi {
    constructor() {
        super()
    }
    async getSeasonKey() {
        const { data } = await this.get({
            url: "/api/v1/season/season-key?",
            options: await this.genAuthConfig(),
        })
        return data
    }

    async getGameList(seasonKey: string) {
        const { data } = await this.get({
            url: "/api/v1/season/game-all?seasonKey=" + seasonKey,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async getGameDetail(gameId: number) {
        const { data } = await this.get({
            url: "/api/v1/season/game-detail?gameId=" + gameId,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async getGameParticipant(gameId: number) {
        const { data } = await this.get({
            url: "/api/v1/season/game-participant?gameId=" + gameId,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async getLikePlayer<T>() {
        const { data } = await this.get<T>({
            url: "/api/v1/season/like-all",
            options: await this.genAuthConfig(),
        })

        return data
    }

    async likePlayerToggle(playerCode: number) {
        const { data } = await this.post({
            url: "/api/v1/season/do-like",
            options: await this.genAuthConfig(),
            body: {
                PLAYER_CODE: playerCode,
            },
        })
        return data
    }
    async sendChatbot(roundCode: number, gameId?: number) {
        console.error(gameId)

        const { data } = await this.post({
            url: `/api/v1/live/${gameId}/bot/${roundCode}/info`,
            options: await this.genAuthConfig(),
        })

        return data
    }
}
