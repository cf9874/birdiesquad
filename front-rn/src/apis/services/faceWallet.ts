import { Face } from "@haechi-labs/face-react-native-sdk"
import { DAPP_API_KEY, ID_TOKEN_KAKAO, WALLET_ADDRESS } from "const/wallet.const"

import { Network } from "@haechi-labs/face-types"
import { Linking, Alert } from "react-native"
import { profileSvc, signSvc, walletSvc } from "apis/services"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ethers } from "ethers"
import { InAppBrowser } from "react-native-inappbrowser-reborn"

export const face = new Face({
    network: Network.BAOBAB,
    apiKey: DAPP_API_KEY,
    scheme: "facewebview",
})

const provider = new ethers.providers.Web3Provider(face.getEthLikeProvider())
const signer = provider.getSigner()

export const loginAndGetAddressWallet = async () => {
    const idToken = await AsyncStorage.getItem(ID_TOKEN_KAKAO)
    const sig = await profileSvc.sigWallet({ idToken: idToken ?? "" })
    const result = await face.auth
        .loginWithIdToken({
            idToken: idToken ?? "",
            sig: sig,
        })
        .then(async value => {
            await AsyncStorage.setItem(WALLET_ADDRESS, value?.wallet?.address ?? "")

            await walletSvc.updateWalletAddress(value?.wallet?.address ?? "").then(async () => {
                await signSvc.login()
            })
        })
        .catch(error => {
            console.warn(error)
            Alert.alert(error.toString())
            return
        })
    if (result === null) {
        return
    }
}

export const sendTransactionNFT = async (to: string, data: any, nftHistorySeq: string, nftId: string) => {
    const loggedIn = await face.auth.isLoggedIn()
    if (loggedIn == false) {
        const idToken = await AsyncStorage.getItem(ID_TOKEN_KAKAO)
        const sig = await profileSvc.sigWallet({ idToken: idToken ?? "" })
        await face.auth.loginWithIdToken({
            idToken: idToken ?? "",
            sig: sig,
        })
    }

    const result = await signer
        .sendTransaction({
            to: to,
            data: data,
        })
        .then(async value => {
            return await walletSvc
                .nftToSpendingResult({ nftId: nftId, nftHistorySeq: nftHistorySeq, txHash: value.hash })
                .then(() => {
                    return true
                })
                .catch(error => {
                    console.log("FAIL:", error)
                    return false
                })
        })
        .catch(error => {
            console.log("FAIL:", error)
            return false
        })

    // const receipt = await result.wait()
    // const txHash = receipt.transactionHash

    if (!result) {
        return false
    }
    return result
}
export const infoWallet = async () => {
    const loggedIn = await face.auth.isLoggedIn()
    console.log("logged in", loggedIn)
    if (loggedIn == false) {
        const idToken = await AsyncStorage.getItem(ID_TOKEN_KAKAO)
        const sig = await profileSvc.sigWallet({ idToken: idToken ?? "" })
        await face.auth.loginWithIdToken({
            idToken: idToken ?? "",
            sig: sig,
        })
    }
    const result = await face.wallet.home()
}
