import {
    MySquadInsert,
    MySquadList,
    MySquadNftsList,
    MySquadResponse,
    MySquadUpdate,
    RewardPlayer,
} from "apis/data/mySquad.data"
import { ABaseApi } from "./base.api"

export class MySquadApi extends ABaseApi {
    constructor() {
        super()
    }
    //[hazel]-장착한 마이스쿼드 조회
    async getMySquadList(gameSeq: number) {
        return await this.getTotalResponse<MySquadResponse>({
            url: `/api/v1/my-squad?gameSeq=${gameSeq}`,
            options: await this.genAuthConfig(),
        })
    }

    //[hazel]-마이스쿼드에 장착할 NFT 리스트 조회
    async getMySquadNftsList(gameSeq: number) {
        const { data } = await this.get<MySquadNftsList>({
            url: `/api/v1/my-squad/nfts?gameSeq=${gameSeq}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    //[hazel]-마이스쿼드 생성
    async postMySquadInsert(requestBody: {
        gameSeq: number
        reward: number
        players:
            | {
                  userNftSeq: number
                  reward: number
              }[]
            | undefined
    }) {
        const { data } = await this.post<MySquadInsert>({
            url: `/api/v1/my-squad/`,
            body: requestBody,
            options: await this.genAuthConfig(),
        })

        console.log("마이스쿼드 생성 post api : ", requestBody)
        return data
    }

    //[hazel]-마이스쿼드 변경
    async patchMySquadUpdate(requestBody: {
        mySquadSeq: number | undefined
        reward: number | undefined
        players:
            | {
                  mySquadPlayerSeq: number
                  userNftSeq: number
                  reward: number
              }[]
            | undefined
    }) {
        const { data } = await this.patch<MySquadUpdate>({
            url: `/api/v1/my-squad/`,
            body: requestBody,
            options: await this.genAuthConfig(),
        })

        console.log("마이스쿼드 변경 patch api : ", requestBody)
        return data
    }

    //hazel - usernft 기준 예상 보상량 조회
    async getRewardPlayer(gameCode: number, nftSeq: number) {
        const { data } = await this.get<RewardPlayer>({
            url: `/api/v1/live/${gameCode}/tour-rewards/nfts/${nftSeq}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
}
