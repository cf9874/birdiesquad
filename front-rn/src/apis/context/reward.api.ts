import { ErrorUtil } from "utils"
import { ABaseApi } from "./base.api"

export class TourRewardsApi extends ABaseApi {
    constructor() {
        super()
    }

    async getSeasonKey() {
        const { data } = await this.get<string>({
            url: `/api/v1/season-n/season-key`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async postTourRewardApi(gameId: number) {
        const { data } = await this.post<any>(
            {
                url: `/api/v1/live/${gameId}/tour-reward`,
                body: {
                    gameId: gameId,
                },
                options: await this.genAuthConfig(),
            },
            error => ErrorUtil.alreadyTookReward(error)
        )
        return data
    }

    async getGamesApi(gameId: number) {
        const { data } = await this.get<any>({
            url: `/api/v1/season-n/${gameId}/games`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async getTourRewardCheckApi(gameId: number) {
        const { data } = await this.get<any>({
            url: `/api/v1/live/${gameId}/tour-reward/check`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async getTourRewardApi(gameId: number) {
        const { data } = await this.get<any>({
            url: `/api/v1/live/${gameId}/tour-reward/show`,
            options: await this.genAuthConfig(),
        })
        return data
    }
}
