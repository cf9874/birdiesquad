import { ABaseApi } from "./base.api"
import { RaffleList, RaffleListApply, RaffleListResultPopup } from "apis/data/raffle.data"
export class RaffleApi extends ABaseApi {
    constructor() {
        super()
    }

    async raffleList(order: string, page: number, take: number, status: number) {
        const { data } = await this.get<RaffleList>({
            url: `/api/v1/raffle/list?order=${order}&page=${page}&take=${take}&STATUS=${status}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async raffleListApply() {
        const { data } = await this.get<RaffleListApply[]>({
            url: `/api/v1/raffle/my-raffle`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async applyRaffle(raffle_id: number) {
        const { data } = await this.get({
            url: `/api/v1/raffle/apply?raffle_id=${raffle_id}`,
            options: await this.genAuthConfig(),
        })
        console.log("APPLY RAFFLE:", data)
        return data
    }
    async raffleListResultPopup() {
        const { data } = await this.get<RaffleListResultPopup[]>({
            url: `/api/v1/popup/list`,
            options: await this.genAuthConfig(),
        })
        return data
    }
}
