import { ABaseApi } from "./base.api"
import { Nft, NftApiData, PageMeta } from "../data"

export class NftApi extends ABaseApi {
    constructor() {
        super()
    }

    async getMyNftList(dto: PageMeta.ReqDto) {
        const { data } = await this.get<NftApiData.NftList.ResDao>({
            url: "/api/v1/nft/page-my-nft?" + PageMeta.toReqDao(dto),
            options: await this.genAuthConfig(),
        })

        return NftApiData.NftList.toResDto(data)
    }

    async getMySquadNftList(dto: PageMeta.ReqDto) {
        const { data } = await this.get<NftApiData.NftList.ResDao>({
            url: "/api/v1/nft/myNfts?" + PageMeta.toReqDao(dto),
            options: await this.genAuthConfig(),
        })

        return NftApiData.NftList.toResDto(data)
    }

    async getMyNftListSpending(dto: PageMeta.ReqDto) {
        const { data } = await this.get<NftApiData.NftList.ResDao>({
            url: "/api/v1/nft/myNfts?" + PageMeta.toReqDao(dto),
            options: await this.genAuthConfig(),
        })
        return NftApiData.NftList.toResDto(data)
    }
    async getTestMyNftList() {
        const { data } = await this.get<any[]>({
            url: `/api/v1/nft/page-my-nft?order=ASC&page=1&take=0`,
            options: await this.genAuthConfig(),
        })

        return data
    }
    async getSnapNftList(GAME_CODE: number) {
        const { data } = await this.get<{
            GAME_NFTS: {
                GRADE: number
                LEVEL: number
                ENERGY: number
                EAGLE: number
                BIRDIE: number
                PAR: number
                BOGEY: number
                DOUBLE_BOGEY: number
                PLAYER_CODE: number
                SEASON_CODE: number
                NFT_SEQ: number
                USER_SEQ: number
                EARN_AMOUNT: number
            }[]
        }>({
            url: `/api/v1/live/${GAME_CODE}/nfts`,
            options: await this.genAuthConfig(),
        })

        return {
            data: data?.GAME_NFTS?.map(nft => ({
                season: nft.SEASON_CODE,
                grade: nft.GRADE,
                level: nft.LEVEL,
                energy: nft.ENERGY,
                amount: nft.EARN_AMOUNT,
                golf: {
                    birdie: nft.BIRDIE,
                    par: nft.PAR,
                    bogey: nft.BOGEY,
                    doubleBogey: nft.DOUBLE_BOGEY,
                    eagle: nft.EAGLE,
                },
                playerCode: nft.PLAYER_CODE,
                userSeq: nft.USER_SEQ,
                seq: nft.NFT_SEQ,
            })),
        } as NftApiData.NftList.ResDto
    }
    async getUserNftList(dto: NftApiData.NftList.ReqDto) {
        const { data } = await this.get<NftApiData.NftList.ResDao>({
            url: "/api/v1/nft/page-user-nft?" + PageMeta.toReqDao(dto) + `&USER_SEQ=${dto.seq}`,
            options: await this.genAuthConfig(),
        })

        return NftApiData.NftList.toResDto(data)
    }
    // async getBdst() {
    //     const { data } = await this.get({
    //         url: "/api/v1/nft/expected-bdst",
    //         options: await this.genAuthConfig(),
    //     })

    //     return null
    // }
    async getDetail(seq: number) {
        const { data } = await this.get<Nft.Dao>({
            url: `/api/v1/nft/detail-nft?NFT_SEQ=${seq}`,
            options: await this.genAuthConfig(),
        })

        return Nft.toDto(data)
    }
    async open(seq: number) {
        const { data } = await this.post<NftApiData.Open.ResDao>({
            url: "/api/v1/nft/do-open/lucky",
            options: await this.genAuthConfig(),
            body: NftApiData.Open.toReqDao(seq),
        })
        return NftApiData.Open.toResDto(data)
    }
    async charge(dto: NftApiData.ChargeTraning.ReqDto) {
        const { data } = await this.post<NftApiData.ChargeTraning.ResDao>({
            url: "/api/v1/nft/do-charge/energy",
            options: await this.genAuthConfig(),
            body: NftApiData.ChargeTraning.toReqDao(dto),
        })

        return NftApiData.ChargeTraning.toResDto(data)
    }
    async chargeAll(dto: number[]) {
        const { data } = await this.post<NftApiData.ChargeAllEnergy.ResDao>({
            url: "/api/v1/nft/do-charge/energy/all",
            options: await this.genAuthConfig(),
            body: NftApiData.ChargeAllEnergy.toReqDao(dto),
        })
        return NftApiData.ChargeAllEnergy.toResDto(data)
    }
    async training(dto: NftApiData.ChargeTraning.ReqDto) {
        const { data } = await this.post<NftApiData.ChargeTraning.ResDao>({
            url: "/api/v1/nft/do-training",
            options: await this.genAuthConfig(),
            body: NftApiData.ChargeTraning.toReqDao(dto),
        })

        return NftApiData.ChargeTraning.toResDto(data)
    }
    async levelup(seq: number) {
        const { data } = await this.post<NftApiData.LevelUp.ResDao>({
            url: "/api/v1/nft/do-level-up",
            options: await this.genAuthConfig(),
            body: NftApiData.LevelUp.toReqDao(seq),
        })

        return NftApiData.LevelUp.toResDto(data)
    }
    async doOpenChoice(dto: NftApiData.IDoOpenChoice) {
        const { data } = await this.post<NftApiData.LevelUp.ResDao>({
            url: "/api/v1/nft/do-open/choice",
            options: await this.genAuthConfig(),
            body: dto,
        })

        return data
    }
    async doOpenLucky(dto: NftApiData.IDoOpenChoice) {
        const { data } = await this.post<any>({
            url: "/api/v1/nft/do-open/lucky",
            options: await this.genAuthConfig(),
            body: dto,
        })

        return data
    }
    // async gradeup() {
    //     const { data } = await this.post({
    //         url: "/api/v1/nft/do-level-up",
    //         options: await this.genAuthConfig(),
    //     })

    //     return null
    // }
    // async extend() {
    //     const { data } = await this.post({
    //         url: "/api/v1/nft/do-extend-slot",
    //         options: await this.genAuthConfig(),
    //     })

    //     return null
    // }
    // async walletSend() {
    //     const { data } = await this.post({
    //         url: "/api/v1/nft/do-send-into-wallet",
    //         options: await this.genAuthConfig(),
    //     })
    //     return null
    // }
}
