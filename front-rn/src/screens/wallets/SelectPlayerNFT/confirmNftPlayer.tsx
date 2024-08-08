import React, { useState } from "react"
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RatioUtil, navigate } from "utils"
import { AnalyticsEventName, Colors, Screen, ScreenParams } from "const"
import { nftDetailImg, profileHeaderImg, WalletImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { walletStyle } from "styles/wallet.style"
import { RouteProp, useRoute } from "@react-navigation/native"
import { jsonSvc, nftSvc, sendTransactionNFT, walletSvc } from "apis/services"
import NftImage from "components/utils/NFTImage"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import { walletTransStlye } from "styles/components/walletTrans.style"
import { faceWalletSvc } from "apis/services/faceWallet.svc"
import { callSetGameApi } from "common/GlobalFunction"
import store from "store"
import { setGameLoader, setSetGameModalData } from "store/reducers/getGame.reducer"
import { SvgIcon } from "components/Common/SvgIcon"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import NftImageScale from "components/utils/NFTImageScale"
import { useAsyncEffect } from "hooks"
import { Analytics } from "utils/analytics.util"

const ConfirmPlayerNFT = () => {
    const route = useRoute<RouteProp<ScreenParams, Screen.CONFIRMPLAYERNFT>>()
    const [dataNFTSpending, setDataNFTSpending] = useState(route.params.itemSpending)
    const [dataNFTWallet, setDataNFTWallet] = useState(route.params.itemWallet)
    const [mode, setMode] = useState(route.params.mode)
    const [isVisible, setIsVisible] = useState(false)
    const [isComplete, setIsComplete] = useState(false)

    const transferNFTToWallet = async () => {
        const isSettle = await callSetGameApi(true)
        if (isSettle) {
            store.dispatch(
                setSetGameModalData({
                    // title: "지금은 투어 보상 정산 중입니다.",
                    title: jsonSvc.findLocalById("10000025"),
                    // desc2: "NFT 이동은\n잠시 후 다시 진행 해 주세요.",
                    desc1: jsonSvc.findLocalById("10000063"),
                })
            )
            store.dispatch(setGameLoader(false))
            return
        }
        const response = await walletSvc.nftToWallet(dataNFTSpending.seq)
        if (response == null) {
            navigate(Screen.WALLETS)
        } else {
            setIsComplete(true)
            setTimeout(() => {
                navigate(Screen.WALLETS)
            }, 4000)
        }
    }
    const transferNFTToSpending = async () => {
        const isSettle = await callSetGameApi(true)
        if (isSettle) {
            store.dispatch(
                setSetGameModalData({
                    // title: "지금은 투어 보상 정산 중입니다.",
                    title: jsonSvc.findLocalById("10000025"),
                    // desc2: "NFT 이동은\n잠시 후 다시 진행 해 주세요.",
                    desc1: jsonSvc.findLocalById("10000063"),
                })
            )
            store.dispatch(setGameLoader(false))
            return
        }
        const response = await walletSvc.nftToSpending(dataNFTWallet.seq)
        if (response == null) {
            navigate(Screen.WALLETS)
        } else {
            const success = await faceWalletSvc.sendTransactionNFT(
                response.boraData.to,
                response.boraData.data,
                response.nftHistorySeq.toString(),
                dataNFTWallet.seq.toString()
            )

            if (success) {
                const player = nftSvc.getNftPlayer(mode === 1 ? dataNFTSpending.playerCode : dataNFTWallet.playerCode)
                await Analytics.logEvent(AnalyticsEventName.view_toast_success_sending_120, {
                    hasNewUserData: true,
                    sendStart_title: mode === 1 ? "SPENDING" : "WALLET",
                    player_code: mode === 1 ? dataNFTSpending.playerCode : dataNFTWallet.playerCode,
                    player_name: player?.sPlayerName,
                    player_grade: mode === 1 ? dataNFTSpending.grade : dataNFTWallet.grade,
                    player_level: mode === 1 ? dataNFTSpending.level : dataNFTWallet.level,
                })
                setIsComplete(true)
                setTimeout(() => {
                    navigate(Screen.WALLETS)
                }, 3000)
            } else {
                await Analytics.logEvent(AnalyticsEventName.view_toast_fail_sending_120, {
                    hasNewUserData: true,
                })
                setIsVisible(false)
                navigate(Screen.WALLETS)
            }
        }
    }

    const insets = useSafeAreaInsets()
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_send_120, {
            hasNewUserData: true,
            sendStart_title: mode === 1 ? "SPENDING" : "WALLET",
        })
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE, alignItems: "center" }}>
            <View
                style={{
                    width: RatioUtil.width(360),
                    height: RatioUtil.heightFixedRatio(44),
                    ...RatioUtil.padding(0, 15, 0, 15),
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                <Pressable
                    onPress={() => {
                        navigate(Screen.BACK)
                    }}
                >
                    {/* <Image resizeMode="contain" style={RatioUtil.size(10, 16)} source={profileHeaderImg.arrow} /> */}
                    <SvgIcon name="BackSvg" />
                </Pressable>

                <Pressable
                    onPress={() => {
                        navigate(Screen.WALLETS)
                    }}
                >
                    <Image resizeMode="contain" style={RatioUtil.size(30, 30)} source={nftDetailImg.close} />
                </Pressable>
            </View>
            <View
                style={{
                    flex: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View>
                    <View
                        style={{
                            width: RatioUtil.width(320),
                            marginTop: RatioUtil.heightFixedRatio(20),
                            marginLeft: RatioUtil.width(20),
                        }}
                    >
                        <PretendText
                            numberOfLines={2}
                            style={{
                                fontSize: RatioUtil.font(24),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK,
                                lineHeight: RatioUtil.font(24) * 1.3,
                            }}
                        >
                            {/* {"스펜딩에서 지갑으로\n전송하시겠습니까?"} */}
                            {mode === 1 ? jsonSvc.findLocalById("2058") : "지갑에서 스펜딩으로\n전송하시겠습니까?"}
                        </PretendText>
                    </View>

                    <View
                        style={{
                            marginTop: RatioUtil.heightFixedRatio(30),
                        }}
                    >
                        {mode === 1 ? (
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    marginLeft: RatioUtil.width(20),
                                    color: "#66666B",
                                    fontWeight: "400",
                                }}
                            >
                                {/* 지갑으로 전송시투어대회 보상을 받을 수 없습니다. */}•{" "}
                                {jsonSvc.findLocalById("1033")}
                            </PretendText>
                        ) : null}
                    </View>
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {mode == 1 ? (
                        <NftImageScale
                            level={dataNFTSpending.level}
                            grade={dataNFTSpending.grade}
                            playerCode={dataNFTSpending.playerCode}
                            birdie={dataNFTSpending.birdie}
                            width={RatioUtil.width(155)}
                        />
                    ) : mode == 2 ? (
                        <NftImageScale
                            level={dataNFTWallet.level}
                            grade={dataNFTWallet.grade}
                            playerCode={dataNFTWallet.playerCode}
                            birdie={dataNFTWallet.birdie}
                            width={RatioUtil.width(205)}
                        />
                    ) : null}
                    <View
                        style={{
                            ...RatioUtil.sizeFixedRatio(155, 38),
                            borderRadius: 10,
                            overflow: "hidden",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: Colors.GRAY7,
                            marginTop: RatioUtil.heightFixedRatio(20),
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK,
                            }}
                        >
                            #{mode === 1 ? dataNFTSpending.seq : dataNFTWallet.seq}
                        </PretendText>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={async () => {
                        const player = nftSvc.getNftPlayer(
                            mode === 1 ? dataNFTSpending.playerCode : dataNFTWallet.playerCode
                        )

                        await Analytics.logEvent(AnalyticsEventName.click_send_120, {
                            hasNewUserData: true,
                            sendStart_title: mode === 1 ? "SPENDING" : "WALLET",
                            player_code: mode === 1 ? dataNFTSpending.playerCode : dataNFTWallet.playerCode,
                            player_name: player?.sPlayerName,
                            player_grade: mode === 1 ? dataNFTSpending.grade : dataNFTWallet.grade,
                            player_level: mode === 1 ? dataNFTSpending.level : dataNFTWallet.level,
                        })
                        setIsVisible(true)
                        mode == 1 ? transferNFTToWallet() : mode == 2 ? transferNFTToSpending() : null
                        // setTimeout(() => {
                        //     navigate(Screen.WALLETS)
                        // }, 5500)
                    }}
                    style={{
                        ...RatioUtil.sizeFixedRatio(320, 60),
                        ...RatioUtil.borderRadius(100),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.BLACK,
                        marginBottom: RatioUtil.heightFixedRatio(20),
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(16),
                            color: Colors.WHITE,
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}
                    >
                        전송
                    </PretendText>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                statusBarTranslucent
                transparent={true}
                style={{
                    flex: 1,
                }}
                visible={isVisible}
            >
                <View style={walletStyle.header.modalMainView}>
                    <View
                        style={{
                            ...RatioUtil.sizeFixedRatio(144, 166),
                            ...RatioUtil.borderRadius(8),
                            alignItems: "center",
                            justifyContent: "space-around",
                            paddingVertical: RatioUtil.heightFixedRatio(10),
                            backgroundColor: `${Colors.BLACK}99`,
                        }}
                    >
                        {isComplete ? (
                            <AnimatedLottieView
                                source={lotties.check}
                                style={{ width: RatioUtil.width(50), height: RatioUtil.width(50) }}
                                autoPlay
                                loop={false}
                            />
                        ) : (
                            <View style={{ ...RatioUtil.sizeFixedRatio(50, 50) }}>
                                <AnimatedLottieView
                                    source={lotties.loadingToast}
                                    style={{ width: RatioUtil.width(50), height: RatioUtil.width(50) }}
                                    autoPlay
                                    loop
                                />
                            </View>
                        )}
                        <PretendText
                            style={{
                                textAlign: "center",
                                fontSize: RatioUtil.font(14),
                                color: Colors.WHITE,
                                fontWeight: RatioUtil.fontWeightBold(),
                                lineHeight: RatioUtil.font(14) * 1.3,
                            }}
                        >
                            {/* {isComplete
                                ? "전송이\n료되었습니다."
                                : "전송까지\n 약 5~10초의 시간이\n소요될 수 있습니다."} */}
                            {isComplete ? jsonSvc.findLocalById("9900006") : jsonSvc.findLocalById("10000018")}
                        </PretendText>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default ConfirmPlayerNFT
