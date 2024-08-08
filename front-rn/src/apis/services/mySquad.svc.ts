import { MySquadApi, ProfileApi } from "apis/context"
import { ABaseScv } from "./base.svc"
import { MySquadInsert, MySquadList, MySquadNftsList, MySquadResponse } from "apis/data/mySquad.data"
import { PlayerCode } from "apis/data/season.data"

class MySquadSvc extends ABaseScv<MySquadSvc>() {
    private readonly ABaseScv = new MySquadApi()

    // [hazel] - 장착한 My Squad 조회
    getMySquadList = async (gameSeq: number): Promise<MySquadResponse> => {
        return await this.ABaseScv.getMySquadList(gameSeq)
    }
    // [hazel] - 장착할 Nft 리스트 조회
    getMySquadNftsList = async (gameSeq: number): Promise<MySquadNftsList> => {
        return await this.ABaseScv.getMySquadNftsList(gameSeq)
    }
    // [hazel] - 마이스쿼드 생성
    postMySquadInsert = async (requestBody: {
        gameSeq: number
        reward: number
        players:
            | {
                  userNftSeq: number
                  reward: number
              }[]
            | undefined
    }): Promise<MySquadInsert> => {
        return await this.ABaseScv.postMySquadInsert(requestBody)
    }

    patchMySquadUpdate = async (requestBody: {
        mySquadSeq: number | undefined
        reward: number | undefined
        players:
            | {
                  mySquadPlayerSeq: number
                  userNftSeq: number
                  reward: number
              }[]
            | undefined
    }): Promise<MySquadInsert> => {
        return await this.ABaseScv.patchMySquadUpdate(requestBody)
    }
    //hazel - userNft 기준 예상 보상량 조회
    getRewardPlayer = async (gameId: number, nftSeq: number) => {
        return await this.ABaseScv.getRewardPlayer(gameId, nftSeq)
    }
}

export const mySquadSvc = MySquadSvc.instance
