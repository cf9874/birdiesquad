import { useCallback, useEffect, useState } from "react"
import { Image, Modal, ScrollView, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ConfigUtil, NumberUtil, RatioUtil, navigate } from "utils"
import { AnalyticsEventName, Colors, Screen } from "const"
import { WalletImg } from "assets/images"
import { PretendText } from "components/utils"
import { walletStyle } from "styles/wallet.style"
import { SpendingAccount } from "../spendingAccount.compo"
import { TransactionHistory } from "../transactionHistory.compo"
import { jsonSvc, walletSvc } from "apis/services"
import Toast from "react-native-simple-toast"
import { NFT_SPENDING_SCREEN_TUTORIAL } from "const/wallet.const"
import { useAsyncEffect, useToggle } from "hooks"
import { useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Svg, { Polygon } from "react-native-svg"
import { ISpendingInfo, ITransferHistory } from "apis/data"
import { WalletRouteKey } from "apis/data/wallet.data"
import { APP_USER_ID } from "utils/env"
import { Analytics } from "utils/analytics.util"

const SPENDING = (props: { dataSpending: ISpendingInfo | null; callback?: (haveWallet: boolean) => void }) => {
    const [dataSpending, setDataSpending] = useState<ISpendingInfo | null>(props.dataSpending)

    useEffect(() => {
        setDataSpending(props.dataSpending)
    }, [props.dataSpending])

    const [dataTransactionHistory, setDataTransactionHistory] = useState<ITransferHistory[] | null>([])

    const [showTutorialSpending, setShowTutorialSpending] = useState<boolean>(false)

    const initTutorial = async () => {
        const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
        const statusSpendingTutorial = await AsyncStorage.getItem(USER_ID + NFT_SPENDING_SCREEN_TUTORIAL)
        if (statusSpendingTutorial === "1") {
            setShowTutorialSpending(true)
        }
    }

    const finishTutorial = async () => {
        const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
        await AsyncStorage.setItem(USER_ID + NFT_SPENDING_SCREEN_TUTORIAL, "2")
        setShowTutorialSpending(false)
    }

    useFocusEffect(
        useCallback(() => {
            // fetchSpending()
            fetchTransferList()
            // renderToggle()
        }, [])
    )

    useEffect(() => {
        initTutorial()
    }, [])

    const callbackFunction = (haveWallet: boolean) => {
        setDataSpending(data => {
            return data ? { ...data, doHaveWallet: haveWallet } : null
        })
    }

    // const fetchSpending = async () => {
    //     const response = await walletSvc.getSpending()

    //     if (response === null) return

    //     setDataSpending(response)

    //     const { trainingPoint, bdst, tbora } = response

    //     if (trainingPoint > MAX_NUM) {
    //         Toast.showWithGravity("최대 보유 가능 수량.", Toast.SHORT, Toast.TOP)
    //     } else if (bdst > MAX_NUM) {
    //         Toast.showWithGravity("더 이상 BDST를 획득 할 수 없습니다.", Toast.SHORT, Toast.TOP)
    //     } else if (tbora > MAX_NUM) {
    //         Toast.showWithGravity("더 이상 tBORA를 획득 할 수 없습니다.", Toast.SHORT, Toast.TOP)
    //     }
    // }

    const fetchTransferList = async () => {
        const response = await walletSvc.getTransferList({ page: 1 })

        if (!response) return

        setDataTransactionHistory(response.tokenTransferHistoryList)
    }
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_spending_100, {
            hasNewUserData: true,
        })
    }, [])
    return (
        <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        paddingHorizontal: RatioUtil.width(20),
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <View
                        style={{
                            width: RatioUtil.width(320),
                            height: RatioUtil.heightSafeArea(120),
                            paddingLeft: RatioUtil.width(10),
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View>
                            <PretendText
                                numberOfLines={1}
                                style={{
                                    fontSize: RatioUtil.font(18),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* 육성포인트 */}
                                {jsonSvc.findLocalById("2037")}
                            </PretendText>
                            <PretendText
                                style={{
                                    marginTop: RatioUtil.heightSafeArea(5),
                                    fontSize: RatioUtil.font(24),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                }}
                            >
                                {dataSpending
                                    ? jsonSvc.formatLocal(jsonSvc.findLocalById("2038"), [
                                          NumberUtil.addNumberWallet(dataSpending.trainingPoint),
                                      ])
                                    : "0"}
                            </PretendText>
                        </View>
                        <View style={{ ...walletStyle.popUp.buttonHelp, left: 10 }}>
                            <Image
                                style={{ backgroundColor: Colors.WHITE, ...RatioUtil.size(110, 110) }}
                                resizeMode="contain"
                                source={WalletImg.wallet_icon}
                            />
                        </View>
                    </View>

                    <SpendingAccount
                        onPress={() => navigate(Screen.WALLETTRANSFER, { swapMode: 1 })}
                        callback={value => {
                            callbackFunction(value)
                            props.callback?.(value)
                        }}
                        type={WalletRouteKey.SPEND}
                        title={jsonSvc.findLocalById("2003")}
                        data={dataSpending}
                    />
                    <View style={{ height: RatioUtil.heightSafeArea(20) }} />
                    <TransactionHistory
                        title={jsonSvc.findLocalById("2005")}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_transaction_100, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            navigate(Screen.SPENDINGTABDETAIL)
                        }}
                        data={dataTransactionHistory?.slice(0, 5) ?? []}
                    />
                    <View style={{ height: RatioUtil.heightSafeArea(100) }} />
                </View>
            </ScrollView>

            <Modal visible={showTutorialSpending} statusBarTranslucent transparent>
                <TouchableOpacity
                    onPress={finishTutorial}
                    style={{
                        flex: 1,
                        backgroundColor: `${Colors.BLACK}60`,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            position: "absolute",
                            top: RatioUtil.height(455),
                            // right: RatioUtil.width(10)
                        }}
                    >
                        <View
                            style={{
                                justifyContent: "center",
                                flexDirection: "row",
                                // right: RatioUtil.width(60),
                                marginBottom: -2,
                            }}
                        >
                            <Svg height={RatioUtil.width(12)} width={RatioUtil.width(12)} viewBox="0 0 12 12">
                                <Polygon
                                    points="0 12 6 0 12 12"
                                    fill={`${Colors.BLACK}80`}
                                    stroke={Colors.WHITE}
                                    strokeWidth={2}
                                />
                            </Svg>
                        </View>
                        <View
                            style={{
                                width: RatioUtil.width(320),
                                padding: RatioUtil.height(10),
                                height: RatioUtil.height(38),
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: RatioUtil.height(100),
                                backgroundColor: `${Colors.BLACK}80`,
                                borderColor: Colors.WHITE,
                                borderWidth: 2,
                            }}
                        >
                            <PretendText
                                style={{
                                    color: Colors.WHITE,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "600",
                                    borderColor: "white",
                                    height: RatioUtil.height(18),
                                    textAlign: "center",
                                    textAlignVertical: "center",
                                }}
                            >
                                {/* 선수 NFT만 지갑으로 전송할 수 있어요! */}
                                {jsonSvc.findLocalById("6025")}
                            </PretendText>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

export default SPENDING
