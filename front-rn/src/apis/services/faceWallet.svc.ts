import { Face } from "@haechi-labs/face-react-native-sdk"
import { DAPP_API_KEY, DO_HAVE_WALLET, ID_TOKEN_KAKAO, WALLET_ADDRESS } from "const/wallet.const"

import { Network } from "@haechi-labs/face-types"
import { Alert } from "react-native"
import { profileSvc, signSvc, walletSvc } from "apis/services"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { BytesLike, ethers } from "ethers"
import { ABaseScv } from "./base.svc"
import { navigate } from "utils"
import { Screen } from "const"
import Config from "react-native-config"

class FaceWalletSvc extends ABaseScv<FaceWalletSvc>() {
    private readonly face = new Face({
        network: Config.WALLET_NETWORK == "klaytn" ? Network.KLAYTN : Network.BAOBAB,
        apiKey: DAPP_API_KEY,
        scheme: "facewebview",
    })

    private readonly provider = new ethers.providers.Web3Provider(this.face.getEthLikeProvider())

    private readonly signer = this.provider.getSigner()

    loginAndGetAddressWallet = async () => {
        await AsyncStorage.removeItem(WALLET_ADDRESS)
        let unAuthIdToken = await AsyncStorage.getItem(ID_TOKEN_KAKAO)
        //id_token expire 타임 및 정상 여부 체크
        await walletSvc.isWalletTokenLive().then(async response => {
            if (!response || response.expires_in < 600) {
                await walletSvc.getWalletRenwToken().then(data => {
                    if (data) unAuthIdToken = data.id_token
                })
            }
        })
        const idToken = await this.isIdTokenLive(unAuthIdToken)

        if (!idToken) return

        const sig = await profileSvc.sigWallet({ idToken })

        try {
            const result = await this.face.auth.loginWithIdToken({
                idToken: idToken,
                sig,
            })

            if (!result) {
                Alert.alert("페이스 로그인 실패")
                return
            }

            if (!result.wallet?.address) {
                return
            }

            await AsyncStorage.setItem(WALLET_ADDRESS, result.wallet.address)

            await walletSvc.updateWalletAddress(result.wallet.address) // 이후 로그인 요청을 다시해서 지갑주소등 다시 설정필요
            await AsyncStorage.setItem(DO_HAVE_WALLET, "1")
            return true
        } catch (error: any) {
            Alert.alert(error.message)
            return
        }
    }

    sendTransactionNFT = async (to: string, data: BytesLike, nftHistorySeq: string, nftId: string) => {
        const unAuthIdToken = await AsyncStorage.getItem(ID_TOKEN_KAKAO)
        const idToken = await this.isIdTokenLive(unAuthIdToken)
        if (!idToken) return false
        const isLogin = await this.checkWalletLogin(idToken)
        if (!isLogin) return false
        try {
            const result = await this.signer
                .sendTransaction({ to: to, data: data })
                .then(
                    async ({ hash }) =>
                        await walletSvc
                            .nftToSpendingResult({ nftId: nftId, nftHistorySeq: nftHistorySeq, txHash: hash })
                            .then(() => {
                                return true
                            })
                            .catch(() => {
                                return false
                            })
                )
                .catch(() => {
                    return false
                })

            if (!result) {
                return false
            }
            return result
        } catch (error) {
            return false
        }
    }

    infoWallet = async () => {
        try {
            const unAuthIdToken = await AsyncStorage.getItem(ID_TOKEN_KAKAO)

            const idToken = await this.isIdTokenLive(unAuthIdToken)

            if (idToken == false) return
            const isLogin = await this.checkWalletLogin(idToken)

            isLogin && (await this.face.wallet.home())
        } catch (error: any) {
            Alert.alert(error.message)
            return
        }
    }

    private checkWalletLogin = async (idToken: string) => {
        try {
            const loggedIn = await this.face.auth.isLoggedIn()

            if (!loggedIn) {
                const sig = await profileSvc.sigWallet({ idToken })
                const loginSuccess = await this.face.auth.loginWithIdToken({ idToken, sig })
                console.log("loginWalletSuccess:", JSON.stringify(loginSuccess))
                if (!loginSuccess || loginSuccess == null) {
                    return false
                } else return true
            } else return true
            // return true
        } catch (error: any) {
            Alert.alert(error.message)
            return false
        }
    }

    private isIdTokenLive = async (idToken: string | null) => {
        if (!idToken) {
            const isSuccess = await signSvc.logout()
            isSuccess && navigate(Screen.SIGNIN)
            return false
        }

        return idToken
    }
}

export const faceWalletSvc = FaceWalletSvc.instance
