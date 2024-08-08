import { WalletApi } from "apis/context/wallet.api"
import { WBaseScv } from "./base.svc"
import axios from "axios"
import {
    ACCESS_TOKEN_KAKAO,
    ID_TOKEN_KAKAO,
    LINK_CHECK_EXPIRE,
    LINK_RENEW_TOKEN,
    REFRESH_TOKEN_KAKAO,
} from "const/wallet.const"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ConfigUtil, ErrorUtil, navigate } from "utils"
import { signSvc } from "./sign.svc"
import { Screen } from "const"

import { NftApi } from "apis/context"
import { IWalletRegistNFT, NftApiData } from "apis/data"
import { nftSvc } from "./nft.svc"
import Config from "react-native-config"
import {
    RequestUpgradeNft,
    RequestUpgradeNftMaterial,
    ResponseUpgradeNft,
    ResponseUpgradeNftInfo,
    ResponseUpgradeNftMaterials,
} from "screens/NftAdvancement/types"
import { API_URL, DEVICE_KEY, REFRESH_TOKEN_ID, TOKEN_ID } from "utils/env"

class WalletSvc extends WBaseScv<WalletSvc>() {
    private readonly wBaseApi = new WalletApi()
    private readonly nftApi = new NftApi()

    getSpending = async () => {
        return await this.wBaseApi.getSpending()
    }

    getTransferList = async ({ page }: { page: number }) => {
        return await this.wBaseApi.getTransferList(page)
    }
    updateWalletAddress = async (wallet_address: string) => {
        await this.wBaseApi.updateWalletAddress(wallet_address)

        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_ID)
        const fcmToken = await AsyncStorage.getItem("FCM_TOKEN")
        if (!refreshToken) return null

        const { data } = await axios
            .post<{ code: string; data: { accessToken: string; refreshToken: string } }>(
                API_URL + "/api/v1/auth/jwt/refresh",
                {
                    refreshToken,
                    deviceKey: fcmToken ? fcmToken : DEVICE_KEY,
                }
            )
            .catch(err => ({ data: { code: 0, data: -1 } }))

        if (typeof data.data === "number") {
            ErrorUtil.genModal("서버상태가 불안정합니다.\n다시 로그인해주세요", signSvc.logout, true)

            return
        }

        await AsyncStorage.setItem(TOKEN_ID, data.data.accessToken || "")
        await AsyncStorage.setItem(REFRESH_TOKEN_ID, data.data.refreshToken || "")

        return data.data
    }
    getWallet = async () => {
        return await this.wBaseApi.getWallet()
    }
    nftToWallet = async (userNftSeq: number) => {
        return await this.wBaseApi.nftToWallet(userNftSeq)
    }
    nftToSpending = async (nftId: number) => {
        return await this.wBaseApi.nftToSpending(nftId)
    }
    nftToSpendingResult = async (body: { nftId: string; nftHistorySeq: string; txHash: string }) => {
        return await this.wBaseApi.nftToSpendingResult(body)
    }
    walletNFTList = async ({ start }: { start: number }) => {
        return await this.wBaseApi.walletNFTlist(start)
    }
    /**
     * @brief nft 승급 및 결과 가져오기
     * @author Henry
     * @create 2023-06-12
     * @param {RequestUpgradeNft}
     * @returns {ResponseUpgradeNft}
     */
    upgradeNft = async ({ gameCode, targetNftId, subNftIds }: RequestUpgradeNft): Promise<ResponseUpgradeNft> => {
        return await this.wBaseApi.upgradeNft(gameCode, targetNftId, subNftIds)
    }
    /**
     * @brief nft 승급 조건 정보 가져오기
     * @author Henry
     * @create 2023-06-12
     * @param {}
     * @returns {ResponseUpgradeNftInfo}
     */
    getUpgradeNftInfo = async (): Promise<ResponseUpgradeNftInfo> => {
        return await this.wBaseApi.getUpgradeNftInfo()
    }
    /**
     * @brief nft 승급 재료 리스트 가져오기
     * @author Nibble
     * @create 2023-06-07
     * @param {RequestUpgradeNftMaterial} req
     * @returns {ResponseUpgradeNftMaterials}
     */
    getNftMaterials = async (req: RequestUpgradeNftMaterial): Promise<ResponseUpgradeNftMaterials[]> => {
        return await this.wBaseApi.getNftMaterials(req)
    }
    isWalletTokenLive = async () => {
        const access_token = await ConfigUtil.getStorage<string>(ACCESS_TOKEN_KAKAO)

        const isSignOut = await this.walletSignOut(access_token)

        if (isSignOut) return false

        try {
            const { data } = await axios.get(LINK_CHECK_EXPIRE, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
            return data
        } catch (error: any) {
            if (error.response && error.response.status === 401) return false
        }
    }

    getWalletRenwToken = async () => {
        const refresh_token = await AsyncStorage.getItem(REFRESH_TOKEN_KAKAO)

        const isSignOut = await this.walletSignOut(refresh_token)

        if (isSignOut) return false

        try {
            const { data } = await axios.post<{
                access_token: string
                id_token: string
            }>(
                LINK_RENEW_TOKEN,
                {
                    grant_type: "refresh_token",
                    client_id: Config.KAKAO_APP_KEY,
                    refresh_token: refresh_token,
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            )
            await AsyncStorage.setItem(ACCESS_TOKEN_KAKAO, data.access_token)
            await AsyncStorage.setItem(ID_TOKEN_KAKAO, data.id_token)

            return data
        } catch (error) {
            await this.walletSignOut(null)

            return false
        }
    }

    walletSignOut = async (token: string | null) => {
        if (token) return false

        const isSuccess = await signSvc.logout()
        isSuccess && navigate(Screen.SIGNIN)

        return true
    }
    private findPropertyByTratType = ({
        properties,
        type,
        max,
    }: {
        properties: {
            value: string | number
            trait_type: string
            max_value?: number
        }[]
        type: string
        max?: boolean
    }) => {
        const value =
            type === "Grade"
                ? nftSvc.getGradeNumber((properties.find(e => e.trait_type === type)?.value ?? "").toString())
                : properties.find(e => e.trait_type === type)?.value ?? ""
        const formatValue = Number(value)
        const maxValue = properties.find(e => e.trait_type === type)?.max_value ?? 0
        return max ? maxValue : formatValue
    }

    mapWallettNftList = async ({ start = 1 }: { start: number }) => {
        const response = await this.walletNFTList({ start })
        if (!response) return

        const result = response.nfts.map(nft => {
            const { properties } = nft

            return {
                level: this.findPropertyByTratType({ properties, type: "Level" }),
                grade: this.findPropertyByTratType({ properties, type: "Grade" }),
                season: this.findPropertyByTratType({ properties, type: "Season" }),
                playerCode: this.findPropertyByTratType({ properties, type: "PlayerCode" }),
                birdie: this.findPropertyByTratType({ properties, type: "Birdie" }),
                training: this.findPropertyByTratType({ properties, type: "LevelPoint" }),
                trainingMax: this.findPropertyByTratType({ properties, type: "LevelPoint", max: true }),
                energy: this.findPropertyByTratType({ properties, type: "Energy" }) || 100,
                imgUri: nft.image,
                seq: parseInt(nft.id),
                name: nft.title,
            }
        })
        return result
        // try {
        //     const [wallet, myNfts] = await Promise.all([
        //         this.walletNFTList({ start }),
        //         this.nftApi.getMyNftList({ order: "ASC", take: 0, page: 1 }),
        //     ])
        //     if (!wallet) return
        //     console.log(121, wallet.nfts)
        //     const filteredMyNfts = myNfts.data.filter(e => e.is_locked === 1)
        //     const mappedList = wallet.nfts.reduce((acc, spending) => {
        //         const foundNft = filteredMyNfts.find(nft => nft.seq === parseInt(spending.id))
        //         if (foundNft) {
        //             acc.push(this.getMatchNftList(spending, foundNft))
        //         }
        //         return acc
        //     }, [] as Promise<NftApiData.NftData>[])
        //     const nft = await Promise.all(mappedList)
        //     return nft
        // } catch (error) {
        //     return []
        // }
    }
    // private getMatchNftList = async (a: IWalletRegistNFT, b: NftApiData.NftData) => {
    //     const result = {
    //         ...b,
    //         imgUri: a.image,
    //     }
    //     return result
    // }
}

export const walletSvc = WalletSvc.instance
