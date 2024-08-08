import { WalletImg } from "assets/images"
import { PretendText } from "components/utils"
import { AnalyticsEventName, Colors } from "const"
import { walletStyle } from "styles/wallet.style"
import { View, Image, TouchableOpacity, Modal, Pressable, ScrollView } from "react-native"
import { ErrorUtil, NumberUtil, RatioUtil } from "utils"
import _ from "lodash"
import { Shadow } from "react-native-shadow-2"
import { rankStyle } from "styles"
import { useEffect, useState } from "react"
import { jsonSvc, signSvc } from "apis/services"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DO_HAVE_WALLET, FLAG } from "const/wallet.const"
import { ISpendingInfo, IWalletInfo } from "apis/data"
import { WalletRouteKey } from "apis/data/wallet.data"
import { faceWalletSvc } from "apis/services/faceWallet.svc"
import Verification from "components/Verification"
import { Analytics } from "utils/analytics.util"
import { useAsyncEffect } from "hooks"

export interface IMainGroupItemRank {
    onPress: () => void
    data: ISpendingInfo | IWalletInfo | null
    callback?: (haveWallet: boolean) => void
    type: WalletRouteKey
    title?: string
}
export const SpendingAccount = (props: IMainGroupItemRank) => {
    const [isCert, setIsCert] = useState(false)
    const [isAdult, setIsAdult] = useState(false)
    const [certVisible, setCertVisible] = useState(false)
    const [isCompleteWallet, setIsCompleteWallet] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleHelp, setIsVisibleHelp] = useState(false)

    const { data } = props

    const formatTobora = data?.tbora ?? 0

    const formatNftCount = data?.nftCount ? data?.nftCount : 0

    const onTransferWallet = async () => {
        await Analytics.logEvent(AnalyticsEventName.click_send_wallet_100, {
            hasNewUserData: true,
            first_action: "FALSE",
        })
        // props.onPress()
        // return
        const doHaveWallet = await AsyncStorage.getItem(DO_HAVE_WALLET)
        console.error(doHaveWallet)
        doHaveWallet === "0" ? setIsVisible(true) : props.onPress()
    }

    const checkCertAndAdult = async () => {
        const response = await signSvc.checkCert()
        setIsCert(response)
        if (response === true) {
            const isAdult = await signSvc.checkAdult()
            setIsAdult(isAdult)
        }
    }
    useEffect(() => {
        checkCertAndAdult()
    }, [certVisible])

    return (
        <Shadow distance={7} startColor={Colors.WHITE3} style={walletStyle.header.shadowMainView}>
            <View
                style={{
                    width: RatioUtil.width(320),
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottomColor: Colors.WHITE3,
                        borderBottomWidth: RatioUtil.heightSafeArea(1),
                        marginHorizontal: RatioUtil.width(20),
                        height: RatioUtil.heightSafeArea(60),
                        width: RatioUtil.width(280),
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(18),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.BLACK,
                        }}
                    >
                        {props.title}
                    </PretendText>
                    <TouchableOpacity
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_help_100, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            setIsVisibleHelp(true)
                        }}
                    >
                        <Image style={RatioUtil.sizeFixedRatio(18, 18)} source={WalletImg.notice_wallet} />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        height: RatioUtil.heightSafeArea(100),
                        width: RatioUtil.width(280),
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: RatioUtil.heightSafeArea(20),
                        marginHorizontal: RatioUtil.width(20),
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: RatioUtil.width(280),
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                source={WalletImg.wallet_tbora}
                                style={{
                                    ...RatioUtil.size(20, 20),
                                    alignSelf: "center",
                                    borderRadius: 50,
                                }}
                                resizeMode="contain"
                            />
                            <PretendText
                                style={{
                                    color: Colors.BLACK,
                                    fontSize: RatioUtil.font(16),
                                    marginLeft: RatioUtil.width(10),
                                }}
                            >
                                {/* tBORA */}
                                {jsonSvc.findLocalById("10002")}
                            </PretendText>
                        </View>
                        <PretendText
                            numberOfLines={1}
                            style={{
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK,
                                fontSize: RatioUtil.font(16),
                            }}
                        >
                            {NumberUtil.addNumberWallet(formatTobora)}
                        </PretendText>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: RatioUtil.width(280),
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                source={WalletImg.wallet_player}
                                style={{
                                    ...RatioUtil.size(20, 20),
                                    alignSelf: "center",
                                    borderRadius: 50,
                                }}
                                resizeMode="contain"
                            />
                            <PretendText
                                style={{
                                    color: Colors.BLACK,
                                    fontSize: RatioUtil.font(16),
                                    marginLeft: RatioUtil.width(10),
                                }}
                            >
                                {/* 선수 */}
                                {jsonSvc.findLocalById("2041")}
                            </PretendText>
                        </View>
                        <PretendText
                            numberOfLines={1}
                            style={{
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK,
                                fontSize: RatioUtil.font(16),
                            }}
                        >
                            {NumberUtil.addNumberWallet(formatNftCount, FLAG.NFT)}
                        </PretendText>
                    </View>
                </View>
            </View>
            {props.type === WalletRouteKey.SPEND ? (
                <TouchableOpacity onPress={onTransferWallet}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            height: RatioUtil.heightSafeArea(60),
                            ...RatioUtil.borderRadius(0, 0, 10, 10),
                            backgroundColor: Colors.BLACK,
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: "white",
                            }}
                        >
                            {/* 지갑으로 전송 */}
                            {jsonSvc.findLocalById("1013")}
                        </PretendText>
                        <Image
                            source={WalletImg.wallet_right}
                            style={{
                                ...RatioUtil.size(20, 20),
                                marginLeft: RatioUtil.width(6),
                            }}
                            resizeMode="contain"
                        />
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={async () => {
                        await Analytics.logEvent(AnalyticsEventName.click_send_spending_110, {
                            hasNewUserData: true,
                            first_action: "FALSE",
                        })
                        props.onPress()
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            height: RatioUtil.heightSafeArea(60),
                            ...RatioUtil.borderRadius(0, 0, 10, 10),
                            backgroundColor: Colors.BLACK,
                        }}
                    >
                        <Image
                            source={WalletImg.wallet_left}
                            style={{
                                ...RatioUtil.size(20, 20),
                                marginRight: RatioUtil.width(6),
                            }}
                            resizeMode="contain"
                        />
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: "white",
                            }}
                        >
                            {/* 스펜딩으로 보내기 */}
                            {jsonSvc.findLocalById("2036")}
                        </PretendText>
                    </View>
                </TouchableOpacity>
            )}
            <Verification
                visible={certVisible}
                closeToggle={setCertVisible}
                setIsCompleteWallet={() => {
                    props.callback?.(true)
                }}
                checkMode={2}
            />
            <Modal
                animationType="fade"
                statusBarTranslucent
                transparent={true}
                style={{
                    flex: 1,
                }}
                visible={isVisible}
            >
                <View style={rankStyle.header.modalMainView}>
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
                                    setIsVisible(false)
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
                                    setIsVisible(false)
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
                                        props.callback?.(true)
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
                </View>
            </Modal>
            {/* Modal help wallet */}
            <Modal
                animationType="slide"
                statusBarTranslucent
                transparent={true}
                style={{ flex: 1 }}
                visible={isVisibleHelp}
            >
                <View style={walletStyle.popUp.helpView}>
                    <View style={walletStyle.popUp.helpViewColor}>
                        <View style={{ height: RatioUtil.height(15) }} />
                        <View
                            style={{
                                ...RatioUtil.size(320, 60),
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(16),
                                    color: Colors.BLACK,
                                    fontWeight: "700",
                                }}
                            >
                                {/* {"스펜딩 및 지갑 도움말"} */}
                                {jsonSvc.findLocalById("911200")}
                            </PretendText>
                            <Pressable
                                // style={{ position: "absolute", right: RatioUtil.width(15) }}
                                onPress={() => {
                                    setIsVisibleHelp(false)
                                }}
                            >
                                <Image
                                    resizeMode="contain"
                                    style={RatioUtil.size(25, 25)}
                                    source={WalletImg.close_help}
                                />
                            </Pressable>
                        </View>
                        <View style={walletStyle.popUp.helpBody}>
                            <ScrollView>
                                <PretendText style={walletStyle.popUp.helpName}>
                                    {/* {"육성 포인트"} */}
                                    {jsonSvc.findLocalById("2037")}
                                </PretendText>
                                <PretendText style={walletStyle.popUp.helpDetail}>
                                    {/* {
                                        "육성 포인트는 NFT의 레벨업을 위한 준비를 하는데 필요한 버디스쿼드 재화입니다. 투어, 랭크 등을 통해 획득 가능합니다."
                                    } */}
                                    {jsonSvc.findLocalById("911201")}
                                </PretendText>
                                <View style={{ height: RatioUtil.height(10) }} />
                                <PretendText style={walletStyle.popUp.helpName}>
                                    {jsonSvc.findLocalById("10001")}
                                </PretendText>
                                <PretendText style={walletStyle.popUp.helpDetail}>
                                    {/* {
                                        "BDST는 NFT 레벨업, 래플 응모 등 다양한 곳에서 사용되는 버디스쿼드 재화입니다. 투어, 랭크 등을 통해 획득 가능합니다."
                                    } */}
                                    {jsonSvc.findLocalById("911202")}
                                </PretendText>
                                <View style={{ height: RatioUtil.height(10) }} />
                                <PretendText style={walletStyle.popUp.helpName}>
                                    {/* {"선수"} */}
                                    {jsonSvc.findLocalById("2041")}
                                </PretendText>
                                <PretendText
                                    style={{
                                        // textAlign: "center",
                                        fontSize: RatioUtil.font(14),
                                        color: Colors.GRAY8,
                                        fontWeight: "500",
                                    }}
                                >
                                    {/* {"선수는 NFT를 의미합니다."} */}
                                    {jsonSvc.findLocalById("911203")}
                                </PretendText>
                                <View style={{ height: RatioUtil.height(10) }} />
                                <PretendText style={walletStyle.popUp.helpName}>
                                    {jsonSvc.findLocalById("1107")}
                                </PretendText>
                                <PretendText style={walletStyle.popUp.helpDetail}>
                                    {/* {
                                        "스펜딩은 버디스쿼드 내에서 재화와 NFT를 저장하는 곳으로 사용되는 공간입니다. 스펜딩에 보유한 NFT를 지갑으로 전송시켜 사용자간 거래를 할 수 있습니다."
                                    } */}
                                    {jsonSvc.findLocalById("911204")}
                                </PretendText>
                                <View style={{ height: RatioUtil.height(10) }} />
                                <PretendText style={walletStyle.popUp.helpName}>
                                    {jsonSvc.findLocalById("1108")}
                                </PretendText>
                                <PretendText style={walletStyle.popUp.helpDetail}>
                                    {/* {
                                        "지갑은 외부 거래를 위한 개인 공간으로 스펜딩에서 지갑으로 이동시켜야지만 외부 거래가 가능합니다."
                                    } */}
                                    {jsonSvc.findLocalById("911205")}
                                </PretendText>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        </Shadow>
    )
}
