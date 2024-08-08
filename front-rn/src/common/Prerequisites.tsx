import AsyncStorage from "@react-native-async-storage/async-storage"
import { useBackHandler } from "@react-native-community/hooks"
import { shopSvc } from "apis/services"
import React, { useEffect } from "react"
import { StatusBar } from "react-native"
import { endConnection, finishTransaction, getAvailablePurchases, initConnection } from "react-native-iap"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { navigate, navigationRef } from "utils"
import Loading from "./Loading"
import Modal from "./Modal"
import PopUp from "./PopUp"
import Toast from "./Toast"
import { useFcmServices } from "hooks"
import { Screen } from "const"
import DisplayEnviroment from "./DisplayEnvironment"

const Prerequisites = ({ children }: React.PropsWithChildren<any>): JSX.Element => {
    useBackHandler(() => {
        if (navigationRef.canGoBack()) {
            if (navigationRef.getCurrentRoute()?.name === Screen.LIVE) {
                navigate(Screen.NFTLIST)
            }
            return true
        }

        return false
    })
    useEffect(() => {
        initConnection().then(async () => {
            const availablePurchases = await getAvailablePurchases()
            const seq = await AsyncStorage.getItem("AVAILABLE_PURCHASE_SEQ")

            for (let purchase of availablePurchases) {
                let _seq = seq && JSON.parse(seq)
                if (_seq.productId === purchase.productId) {
                    await shopSvc
                        .purchaseEnd(_seq.seqNo, purchase.transactionReceipt, purchase.transactionId)
                        .then(async () => {
                            finishTransaction({ purchase, isConsumable: true }),
                                await AsyncStorage.removeItem("AVAILABLE_PURCHASE_SEQ")
                        })
                        .catch(err => console.error(err))
                }
            }
        })
        return () => {
            endConnection()
        }
    }, [])

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="dark-content" backgroundColor={"transparent"} translucent={true} />
            {children}
            <Loading />
            <Modal />
            <PopUp />
            <Toast />
            <DisplayEnviroment />
        </SafeAreaProvider>
    )
}

export default Prerequisites
