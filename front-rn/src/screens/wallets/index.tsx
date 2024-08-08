import { useEffect, useState, useCallback } from "react"
import { MyPageFooter } from "components/layouts"
import { AnalyticsEventName, Screen } from "const"
import { Image, Text, View, Pressable, Modal, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "const"
import { ConfigUtil, ErrorUtil, navigate, RatioUtil } from "utils"
import { walletStyle } from "styles/wallet.style"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"

import SPENDING from "./SpendingTab"
import WALLET from "./WalletTab"
import { jsonSvc, loginAndGetAddressWallet, signSvc, walletSvc } from "apis/services"
import { PretendText } from "components/utils"
import { rankStyle } from "styles"
import { useScreen, useToggle } from "hooks"
import { useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DO_HAVE_WALLET } from "const/wallet.const"
import { ISpendingInfo } from "apis/data"
import { WalletRouteKey } from "apis/data/wallet.data"

import { WALLET_ADDRESS } from "const/wallet.const"

import { faceWalletSvc } from "apis/services/faceWallet.svc"
import Verification from "components/Verification"
import { SvgIcon } from "components/Common/SvgIcon"
import { Analytics } from "utils/analytics.util"

const Wallets = () => {
    const [index, setIndex] = useState<number>(0)

    const [routes] = useState([
        // { key: "spending", title: "스펜딩" },
        { key: WalletRouteKey.SPEND, title: jsonSvc.findLocalById("1107") },
        // { key: "wallet", title: "지갑" },
        { key: WalletRouteKey.WALLET, title: jsonSvc.findLocalById("1108") },
    ])

    const [dataSpending, setDataSpending] = useState<ISpendingInfo | null>(null)

    const [isVisibleWallet, setIsVisibleWallet] = useState(false)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)

    const [isCert, setIsCert] = useState(false)
    const [isAdult, setIsAdult] = useState(false)
    const [certVisible, setCertVisible] = useState(false)
    const [isCompleteWallet, setIsCompleteWallet] = useState(false)

    const checkCertAndAdult = async () => {
        const response = await signSvc.checkCert()
        setIsCert(response)
        if (response === true) {
            const isAdult = await signSvc.checkAdult()
            setIsAdult(isAdult)
        }
    }

    const fetchSpending = async () => {
        const address = await ConfigUtil.getStorage<string>(WALLET_ADDRESS)
        setWalletAddress(address)

        const response = await walletSvc.getSpending()

        if (!response) return
        setDataSpending(response)

        await AsyncStorage.setItem(DO_HAVE_WALLET, response.doHaveWallet ? "1" : "0")
    }

    useFocusEffect(
        useCallback(() => {
            checkCertAndAdult()
            fetchSpending()
        }, [isVisibleWallet, certVisible, isCompleteWallet])
    )

    const callbackFunction = (haveWallet: boolean) => {
        setIsCompleteWallet(haveWallet)
    }

    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case WalletRouteKey.SPEND:
                return <SPENDING dataSpending={dataSpending} callback={callbackFunction} />
            case WalletRouteKey.WALLET:
                return <WALLET />
            default:
                return null
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            <View
                style={{
                    height: RatioUtil.heightSafeArea(44),
                    flexDirection: "row",
                    backgroundColor: Colors.WHITE,
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <TouchableOpacity
                    onPress={async () => {
                        await Analytics.logEvent(AnalyticsEventName.click_back_100, {
                            hasNewUserData: true,
                            first_action: "FALSE",
                        })
                        navigate(Screen.BACK)
                    }}
                    style={{
                        marginLeft: RatioUtil.width(15),
                        ...RatioUtil.size(30, 30),
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* <Image source={mainHeaderImg.back["1x"]} /> */}
                    <SvgIcon name="BackSvg" />
                </TouchableOpacity>
            </View>
            <TabView
                lazy={({ route }) => route.key === WalletRouteKey.WALLET}
                renderTabBar={props => (
                    <TabBar
                        onTabPress={async ({ route, preventDefault }) => {
                            if (!dataSpending) {
                                Alert.alert("서버와 연결되지 않았습니다.")
                                preventDefault()
                            } else if (
                                (!dataSpending?.doHaveWallet && route.key === WalletRouteKey.WALLET) ||
                                walletAddress == null
                            ) {
                                preventDefault()
                                setIsVisibleWallet(true)

                                await Analytics.logEvent(AnalyticsEventName.view_create_wallet_popup_105, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                            }
                            if (route.key === WalletRouteKey.SPEND) {
                                await Analytics.logEvent(AnalyticsEventName.click_spending_tab_110, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                            }
                            if (route.key === WalletRouteKey.WALLET) {
                                await Analytics.logEvent(AnalyticsEventName.click_wallet_tab_100, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                            }
                        }}
                        style={{ backgroundColor: Colors.WHITE, height: RatioUtil.heightSafeArea(49) }}
                        indicatorStyle={{ backgroundColor: Colors.BLACK }}
                        activeColor={Colors.BLACK}
                        inactiveColor={Colors.GRAY3}
                        labelStyle={{
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(14),
                        }}
                        {...props}
                    />
                )}
                swipeEnabled={false}
                style={{ backgroundColor: Colors.WHITE }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={index => setIndex(index)}
            />
            {/* <MyPageFooter /> */}
            {/* Check do have Wallet */}
            <Modal
                animationType="fade"
                statusBarTranslucent
                transparent={true}
                style={{
                    flex: 1,
                }}
                visible={isVisibleWallet}
                onRequestClose={() => setIsVisibleWallet(false)}
            >
                <Pressable
                    onPress={() => {
                        navigate(Screen.WALLETS, { tabIndex: 0 })
                    }}
                    style={rankStyle.header.modalMainView}
                >
                    <View
                        style={{
                            ...RatioUtil.sizeFixedRatio(272, 161),
                            backgroundColor: Colors.WHITE,
                            alignItems: "center",
                            justifyContent: "center",
                            ...RatioUtil.borderRadius(20, 20, 20, 20),
                            ...RatioUtil.paddingFixedRatio(30, 20, 30, 20),
                        }}
                    >
                        <PretendText
                            style={{
                                marginBottom: RatioUtil.heightFixedRatio(30),
                                height: RatioUtil.heightFixedRatio(23),
                                fontSize: RatioUtil.font(18),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK,
                            }}
                        >
                            {/* 지갑 생성 */}
                            {jsonSvc.findLocalById("10000043")}
                        </PretendText>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: RatioUtil.width(232),
                            }}
                        >
                            <TouchableOpacity
                                onPress={async () => {
                                    await Analytics.logEvent(AnalyticsEventName.click_cancel_105, {
                                        hasNewUserData: true,
                                        first_action: "FALSE",
                                    })
                                    setIsVisibleWallet(false)
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: Colors.GRAY7,
                                        borderRadius: 50,
                                        ...RatioUtil.sizeFixedRatio(113, 48),
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {/* 취소 */}
                                        {jsonSvc.findLocalById("10010001")}
                                    </PretendText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    //지갑 생성 버튼
                                    await Analytics.logEvent(AnalyticsEventName.click_create_wallet_105, {
                                        hasNewUserData: true,
                                        first_action: "FALSE",
                                    })
                                    setIsVisibleWallet(false)
                                    if (!isCert) {
                                        //미인증 user는 본인인증 창 켜기
                                        setCertVisible(true)
                                    } else {
                                        if (!isAdult) {
                                            ErrorUtil.genModal("지갑생성은 성인만 가능합니다.")
                                            return
                                        }
                                        await Analytics.logEvent(AnalyticsEventName.view_facewallet_105, {
                                            hasNewUserData: true,
                                            first_action: "FALSE",
                                        })
                                        const isSuccess = await faceWalletSvc.loginAndGetAddressWallet()
                                        if (!isSuccess) return
                                    }
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: Colors.BLACK,
                                        borderRadius: 50,
                                        ...RatioUtil.sizeFixedRatio(113, 48),
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: Colors.WHITE,
                                        }}
                                    >
                                        {/* 확인 */}
                                        {jsonSvc.findLocalById("1012")}
                                    </PretendText>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
            <Verification
                visible={certVisible}
                closeToggle={setCertVisible}
                checkMode={2}
                setIsCompleteWallet={setIsCompleteWallet}
            />
        </SafeAreaView>
    )
}

export default Wallets
