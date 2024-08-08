import { jsonSvc, loginAndGetAddressWallet, nftSvc, profileSvc, signSvc, walletSvc } from "apis/services"
import { MainHeader } from "components/layouts"
import { CustomButton, PretendText } from "components/utils"
import { AnalyticsEventName, Colors, Screen, ScreenParams } from "const"
import { useWrapDispatch } from "hooks"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Image, Modal, Platform, Pressable, ScrollView, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { setLoading } from "store/reducers/config.reducer"
import { walletTransStlye } from "styles/components/walletTrans.style"
import { WalletLoading } from "./components/popup/walletLoading"
import { RouteProp, useRoute } from "@react-navigation/native"
import { ConfigUtil, ErrorUtil, RatioUtil, navigate } from "utils"
import NftImage from "components/utils/NFTImage"
import { setGameLoader, setSetGameModalData } from "store/reducers/getGame.reducer"
import store from "store"
import { WalletImg } from "assets/images"
import { walletStyle } from "styles/wallet.style"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import { rankStyle } from "styles"
import { faceWalletSvc } from "apis/services/faceWallet.svc"
import Verification from "components/Verification"
import { callSetGameApi } from "common/GlobalFunction"
import { Analytics } from "utils/analytics.util"

const TransWallet = () => {
    const [isCert, setIsCert] = useState(false)
    const [isAdult, setIsAdult] = useState(false)
    const [certVisible, setCertVisible] = useState(false)

    const checkCertAndAdult = async () => {
        const response = await signSvc.checkCert()
        setIsCert(response)
        if (response === true) {
            const isAdult = await signSvc.checkAdult()
            setIsAdult(isAdult)
        }
    }
    // const createWallet = async () => {
    //     const isSuccess = await faceWalletSvc.loginAndGetAddressWallet()

    //     if (!isSuccess) return

    //     setIsVisibleWallet(false)
    // }

    const loadingDispatch = useWrapDispatch(setLoading)
    const [mytraining, setMytraining] = useState<number>(0)
    const [mybdst, setMybdst] = useState<number>(0)
    const [tbora, setTbora] = useState<number>(0)
    const route = useRoute<RouteProp<ScreenParams, Screen.TRANSWALLET>>()
    const [data, setData] = useState(route.params)
    const [doHaveWallet, setDohaveWallet] = useState<boolean>(false)
    const [isVisibleWallet, setIsVisibleWallet] = React.useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [isCompleteWallet, setIsCompleteWallet] = useState(false)

    const fetchSpending = async () => {
        const response = await walletSvc.getSpending()
        if (!response) return
        setDohaveWallet(response.doHaveWallet)
    }

    const transferToWallet = async () => {
        await Analytics.logEvent(AnalyticsEventName.click_send_wallet_100, {
            hasNewUserData: true,
            first_action: "FALSE",
        })
        const showModal = await callSetGameApi(true)
        if (showModal) {
            store.dispatch(setGameLoader(true))
            store.dispatch(
                setSetGameModalData({
                    // title: "지금은 투어 보상 정산 중입니다.",
                    title: jsonSvc.findLocalById("10000025"),

                    desc1: jsonSvc.findLocalById("10000063"),
                })
            )
            store.dispatch(setGameLoader(false))
            return
        }
        if (doHaveWallet) {
            setIsVisible(true)

            try {
                const response = await Promise.race([
                    walletSvc.nftToWallet(data.nftSeq),
                    new Promise((_, reject) => setTimeout(() => reject("Time out"), 5000)),
                ])

                if (response == null) {
                    setIsVisible(false)
                    navigate(Screen.WALLETS)
                } else {
                    setIsComplete(true)
                    setTimeout(() => {
                        navigate(Screen.NFTLIST)
                    }, 2500)
                }
            } catch (error) {
                if (error === "Time out") {
                    setIsComplete(true)
                    setTimeout(() => {
                        navigate(Screen.NFTLIST)
                    }, 2500)
                } else {
                    setIsVisible(false)
                    navigate(Screen.WALLETS)
                }
            }
        } else {
            setIsVisibleWallet(true)
        }
    }

    const playerInfo = nftSvc.getNftPlayer(data.playerCode)
    const playerGradeInfo = nftSvc.getNftGrade(data.grade)

    useEffect(() => {
        const fetchHeaderInfo = async () => {
            const response = await profileSvc.getAsset()
            setMytraining(response.asset.training ?? 0)
            setMybdst(response.asset.bdst ?? 0)
            setTbora(response.asset.tbora ?? 0)
            if (!response) return null
        }
        fetchHeaderInfo()
    }, [])
    useEffect(() => {
        checkCertAndAdult()
        fetchSpending()
    }, [isVisibleWallet, certVisible])

    return (
        <SafeAreaView style={{ backgroundColor: Colors.WHITE, flex: 1 }}>
            <MainHeader training={mytraining} bdst={mybdst} tbora={tbora} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={walletTransStlye.transPage.nftPageTitleBox}>
                    <PretendText numberOfLines={2} style={walletTransStlye.transPage.nftPageTitle}>
                        {/* {"스펜딩에서 지갑으로\n전송하시겠습니까?"} */}
                        {jsonSvc.findLocalById("2058")}
                    </PretendText>
                </View>
                <View>
                    <PretendText style={walletTransStlye.transPage.nftNotiText}>
                        {/* 지갑으로 전송시 투어대회 보상을 받을 수 없습니다. */}• {jsonSvc.findLocalById("1033")}
                    </PretendText>
                </View>
                <View style={walletTransStlye.transPage.nftcon}>
                    <NftImage
                        level={data.level}
                        grade={data.grade}
                        playerCode={data.playerCode}
                        birdie={data.golf.birdie}
                        style={{
                            width: RatioUtil.width(205),
                            height: RatioUtil.height(Platform.OS == "ios" ? 240 : 260),
                        }}
                    />
                </View>
                <View style={walletTransStlye.transPage.nftTokenBox}>
                    <View style={walletTransStlye.transPage.nftNumber}>
                        <PretendText style={walletTransStlye.transPage.nftTitleText}>#{data.nftSeq}</PretendText>
                    </View>
                </View>
                {/* <View style={walletTransStlye.transPage.nftInfocon}> */}
                <View style={{ alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                    <CustomButton style={walletTransStlye.transPage.transbtn} onPress={transferToWallet}>
                        <PretendText style={walletTransStlye.transPage.transbtnText}>
                            {/* 지갑으로 전송 */}
                            {jsonSvc.findLocalById("1013")}
                        </PretendText>
                    </CustomButton>
                </View>
                <Verification
                    visible={certVisible}
                    closeToggle={setCertVisible}
                    checkMode={2}
                    setIsCompleteWallet={() => setIsVisibleWallet(false)}
                />

                <Modal
                    statusBarTranslucent
                    animationType="slide"
                    transparent={true}
                    style={{
                        flex: 1,
                    }}
                    visible={isVisible}
                >
                    <View style={walletStyle.header.modalMainView}>
                        <View
                            style={{
                                ...RatioUtil.size(150, 185),
                                ...RatioUtil.borderRadius(10),
                                alignItems: "center",
                                justifyContent: "center",

                                backgroundColor: `${Colors.BLACK}99`,
                            }}
                        >
                            {isComplete ? (
                                <AnimatedLottieView
                                    source={lotties.check}
                                    style={{ width: RatioUtil.font(50), height: RatioUtil.font(50) }}
                                    autoPlay
                                    loop={false}
                                />
                            ) : (
                                <View style={{ ...RatioUtil.size(50, 50) }}>
                                    <AnimatedLottieView
                                        source={lotties.loadingToast}
                                        style={{ width: RatioUtil.font(50), height: RatioUtil.font(50) }}
                                        autoPlay
                                        loop
                                    />
                                </View>
                            )}
                            <View style={{ height: 10 }} />
                            <PretendText
                                style={{
                                    ...RatioUtil.size(135, 55),
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(14),
                                    color: Colors.WHITE,
                                    fontWeight: "600",
                                }}
                            >
                                {isComplete ? jsonSvc.findLocalById("9900006") : jsonSvc.findLocalById("10000018")}
                            </PretendText>
                        </View>
                    </View>
                </Modal>
                {/* Check do have Wallet */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    style={{
                        flex: 1,
                    }}
                    statusBarTranslucent
                    visible={isVisibleWallet}
                    onRequestClose={() => {
                        setIsVisibleWallet(false)
                    }}
                >
                    <Pressable
                        onPress={() => {
                            // setIsVisibleWallet(false)
                            // navigate(Screen.WALLETS, { tabIndex: 0 })
                        }}
                        style={rankStyle.header.modalMainView}
                    >
                        <View
                            style={{
                                ...RatioUtil.size(280, 160),
                                backgroundColor: Colors.WHITE,
                                alignItems: "center",
                                justifyContent: "center",
                                ...RatioUtil.borderRadius(20, 20, 20, 20),
                            }}
                        >
                            <PretendText style={{ ...walletStyle.header.text, ...RatioUtil.padding(0, 0, 10, 0) }}>
                                {/* 지갑 */}
                                {jsonSvc.findLocalById("1108")}
                            </PretendText>
                            <View
                                style={{
                                    ...RatioUtil.size(280, 70),
                                    ...walletStyle.header.rowCenter,
                                    justifyContent: "space-between",
                                    ...RatioUtil.padding(15, 15, 0, 15),
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
                                            ...RatioUtil.padding(0, 10, 0, 10),
                                            backgroundColor: Colors.GRAY7,
                                            borderRadius: 50,
                                            ...RatioUtil.size(115, 45),
                                        }}
                                    >
                                        <PretendText style={walletStyle.header.textConBlack}>
                                            {/* 취소 */}
                                            {jsonSvc.findLocalById("1021")}
                                        </PretendText>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={
                                        async () => {
                                            if (!isCert) {
                                                //미인증 user는 본인인증 창 켜기
                                                setCertVisible(true)
                                                setIsVisibleWallet(false)
                                            } else {
                                                if (!isAdult) {
                                                    ErrorUtil.genModal("지갑생성은 성인만 가능합니다.")
                                                    return
                                                }
                                                const isSuccess = await faceWalletSvc.loginAndGetAddressWallet()

                                                if (!isSuccess) return
                                                setIsVisibleWallet(false)
                                            }
                                        }
                                        // createWallet
                                    }
                                >
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            ...RatioUtil.padding(0, 10, 0, 10),
                                            backgroundColor: Colors.BLACK,
                                            borderRadius: 50,
                                            ...RatioUtil.size(115, 45),
                                        }}
                                    >
                                        <PretendText style={walletStyle.header.textConWhite}>
                                            {/* 지갑 생성 */}
                                            {jsonSvc.findLocalById("10000043")}
                                        </PretendText>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    )
}

export default TransWallet
