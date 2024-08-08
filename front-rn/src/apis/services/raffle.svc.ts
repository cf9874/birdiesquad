import { ABaseScv } from "./base.svc"
import { ProfileApiData } from "apis/data"
import { KakaoSignApi } from "apis/external"
import { RankApi } from "apis/context/rank.api"
import { RaffleApi } from "apis/context/raffle.api"

class RaffleSvc extends ABaseScv<RaffleSvc>() {
    private readonly raffleApi = new RaffleApi()
    raffleList = async ({
        order,
        page,
        take,
        status,
    }: {
        order: string
        page: number
        take: number
        status: number
    }) => {
        return await this.raffleApi.raffleList(order, page, take, status)
    }
    raffleListApply = async () => {
        return await this.raffleApi.raffleListApply()
    }
    raffleApply = async (raffle_id: number) => {
        return await this.raffleApi.applyRaffle(raffle_id)
    }
    raffleListResultPopup = async () => {
        return await this.raffleApi.raffleListResultPopup()
    }
}

export const raffleSvc = RaffleSvc.instance
