import { WBaseApi } from "./base.api"
import { ISpendingInfo, ITransferHistoryList, IWalletInfo, IWalletRegistNFT, IWalletRegistNFTList } from "../data"
import {
    RequestUpgradeNftMaterial,
    ResponseUpgradeNft,
    ResponseUpgradeNftInfo,
    ResponseUpgradeNftMaterials,
} from "screens/NftAdvancement/types"

export class WalletApi extends WBaseApi {
    constructor() {
        super()
    }
    async getSpending() {
        const { data } = await this.get<ISpendingInfo>({
            url: "/spendings",
            options: await this.genAuthConfig(),
        })

        return data
    }

    async getTransferList(page: number) {
        const { data } = await this.get<ITransferHistoryList>({
            url: `/spendings/tokens/transfer/list?page=${page}`,
            options: await this.genAuthConfig(),
        })

        return data
    }
    async updateWalletAddress(walletAddress: string) {
        const { data } = await this.post({
            url: `/wallets/wallet-address`,
            options: await this.genAuthConfig(),
            body: {
                walletAddress,
            },
        })

        console.error("/wallets/wallet-address")
        console.error(data)

        return data
    }
    async getWallet() {
        const { data } = await this.get<IWalletInfo>({
            url: "/wallets",
            options: await this.genAuthConfig(),
        })

        return data
    }
    async nftToWallet(userNftSeq: number) {
        const { data } = await this.post({
            url: `/spendings/nfts/transfer/wallets`,
            options: await this.genAuthConfig(),
            body: {
                userNftSeq,
            },
        })

        console.error("/spendings/nfts/transfer/wallets")
        console.error(data)

        return data
    }
    async nftToSpending(nftId: number) {
        const { data } = await this.post({
            url: `/wallets/nfts/transfer/spendings`,
            options: await this.genAuthConfig(),
            body: {
                nftId,
            },
        })

        console.error("/wallets/nfts/transfer/spendings")
        console.error(data)

        return data
    }
    async nftToSpendingResult(body: { nftId: string; nftHistorySeq: string; txHash: string }) {
        const { data } = await this.post({
            url: `/wallets/nfts/transfer/result`,
            options: await this.genAuthConfig(),
            body,
        })

        console.error("/wallets/nfts/transfer/result")
        console.error(data)

        return data
    }
    async walletNFTlist(start: number) {
        const { data } = await this.get<IWalletRegistNFTList>({
            url: `/wallets/nfts?start=${start}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    /**
     * @brief nft 승급 및 결과 가져오기
     * @author Henry
     * @create 2023-06-12
     * @param {RequestUpgradeNft}
     * @returns {ResponseUpgradeNft}
     */
    async upgradeNft(gameCode: number, targetNftId: number, subNftIds: [number, number]): Promise<any> {
        const { data } = await this.post<ResponseUpgradeNft>({
            url: `/nfts/upgrade`,
            options: await this.genAuthConfig(),
            body: {
                gameCode,
                targetNftId,
                subNftIds,
            },
        })
        return data
    }
    /**
     * @brief nft 승급 조건 정보 가져오기
     * @author Henry
     * @create 2023-06-12
     * @param {}
     * @returns {ResponseUpgradeNftInfo}
     */
    async getUpgradeNftInfo(): Promise<any> {
        const { data } = await this.get<ResponseUpgradeNftInfo>({
            url: `/nfts/upgrade`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    /**
     * @brief nft 재료 가져오기
     * @author Nibble
     * @create 2023-06-07
     * @param {RequestUpgradeNftMaterial} req
     * @returns {ResponseUpgradeNftMaterials}
     */
    async getNftMaterials(req: RequestUpgradeNftMaterial): Promise<ResponseUpgradeNftMaterials[]> {
        const LIMIT = 30
        const { data } = await this.get<any>({
            url: `/nfts/upgrade/sub-nfts?grade=${req.grade}&level=${req.level}&playerCode=${req.playerCode}&page=${req.page}&limit=${LIMIT}`,
            options: await this.genAuthConfig(),
        })
        return data.nfts
    }
}
