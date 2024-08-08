import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    TouchableOpacity,
    View,
    SafeAreaView,
    Platform,
    BackHandler,
    StatusBar,
    Linking,
} from "react-native"
// import { SafeAreaView } from "react-native-safe-area-context"
import { ConfigUtil, RatioUtil, navigate } from "utils"
import { AnalyticsEventName, Colors, Screen } from "const"
import { WalletImg } from "assets/images"
import { PretendText } from "components/utils"
import { walletStyle } from "styles/wallet.style"
import { useAsyncEffect, useWrapDispatch } from "hooks"
import { jsonSvc, walletSvc } from "apis/services"
import { Shadow } from "react-native-shadow-2"
import { SpendingAccount } from "../spendingAccount.compo"
import WebView from "react-native-webview"
import AsyncStorage from "@react-native-async-storage/async-storage"
import QRCode from "react-native-qrcode-svg"
import Clipboard from "@react-native-clipboard/clipboard"
import {
    ID_TOKEN_KAKAO,
    ACCESS_TOKEN_KAKAO,
    WALLET_ADDRESS,
    LINK_BUY_PLAYER,
    LINK_SALE_PLAYER,
} from "const/wallet.const"
import { useFocusEffect } from "@react-navigation/native"
import { scaleSize } from "styles/minixs"
import { CLOSE_WEBVIEW_MESSAGE, IWalletInfo } from "apis/data"
import { WalletRouteKey } from "apis/data/wallet.data"
import { faceWalletSvc } from "apis/services/faceWallet.svc"
import { setToast } from "store/reducers/config.reducer"
import { WalletToast } from "screens/nft/components"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Analytics } from "utils/analytics.util"

const WALLET = () => {
    const toastDispatch = useWrapDispatch(setToast)
    const [dataWallet, setDataWallet] = useState<IWalletInfo | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleQR, setIsVisibleQR] = useState(false)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const webview = useRef<WebView>(null)
    const [currentWebviewUrl, setCurrentWebviewUrl] = useState<string>("")
    const INJECTED_JAVASCRIPT = `
    (function() {
      function wrap(fn) {
        return function wrapper() {
          var res = fn.apply(this, arguments);
          window.ReactNativeWebView.postMessage('navigationStateChange');
          return res;
        }
      }

      history.pushState = wrap(history.pushState);
      history.replaceState = wrap(history.replaceState);
      window.addEventListener('popstate', function() {
        window.ReactNativeWebView.postMessage('navigationStateChange');
      });
    })();

    true;
  `
    const fetchDataWallet = async () => {
        //지갑 탭 접근 시 카카오 토큰 만료 시간 체크 후 갱신
        await walletSvc.isWalletTokenLive().then(async response => {
            if (!response || response.expires_in < 600) await walletSvc.getWalletRenwToken()
        })

        const address = await ConfigUtil.getStorage<string>(WALLET_ADDRESS)

        if (!address) {
            Alert.alert("지갑 주소를 불러오기 위해.\n다시 로그인해 주세요.")
            return
        }

        setWalletAddress(address)

        const response = await walletSvc.getWallet()
        console.error(response)

        if (!response) {
            return
        }

        setDataWallet(response)
    }

    const onAndroidBackPress = (): boolean => {
        if (webview.current) {
            if (currentWebviewUrl.includes("/market/list") || currentWebviewUrl.includes("/account/nft"))
                setIsVisible(false)
            else webview.current.goBack()
            return true // prevent default behavior (exit app)
        }
        return false
    }

    const handleLinkData = async (mode: number) => {
        // 토큰 만료시 백엔드에서 reflesh토큰으로 토큰 재발급필요 TokenKakaoUtil, WalletSvc의 token함수참고
        // Henry-kakao: 상단에 kakao액세스 토큰 만료시간 체크하여 갱신 하는 코드 추가했습니다.
        const access_token = await ConfigUtil.getStorage<string>(ACCESS_TOKEN_KAKAO)
        const id_token = await AsyncStorage.getItem(ID_TOKEN_KAKAO)

        if (!access_token || !id_token) {
            await walletSvc.walletSignOut(null)
            return
        }
        if (mode) {
            await Analytics.logEvent(AnalyticsEventName.click_sale_110, {
                hasNewUserData: true,
                first_action: "FALSE",
            })
        } else {
            await Analytics.logEvent(AnalyticsEventName.click_buy_110, {
                hasNewUserData: true,
                first_action: "FALSE",
            })
        }
        setLinkUrl(mode == 0 ? LINK_BUY_PLAYER + id_token : LINK_SALE_PLAYER + id_token)
        setIsVisible(true)
    }

    const [linkUrl, setLinkUrl] = useState<string>("")

    const formatWalletAddress = useMemo(() => {
        if (!walletAddress) return jsonSvc.findLocalById("10000069") //"지갑 주소가 없습니다."

        return walletAddress.slice(0, 8) + "....." + walletAddress.slice(walletAddress.length - 8, walletAddress.length)
    }, [walletAddress])

    useFocusEffect(
        useCallback(() => {
            fetchDataWallet()
        }, [isVisible])
    )

    function onClickCopy(item: string) {
        Clipboard.setString(item.toString())
    }

    const onQrAddress = useCallback(async () => {
        if (walletAddress) {
            await Analytics.logEvent(AnalyticsEventName.click_walletAddress_110, {
                hasNewUserData: true,
                first_action: "FALSE",
            })
            setIsVisibleQR(true)
            await Analytics.logEvent(AnalyticsEventName.view_walletAddress_115, {
                hasNewUserData: true,
            })
            return
        }
        await Analytics.logEvent(AnalyticsEventName.view_facewallet_105, {
            hasNewUserData: true,
            first_action: "FALSE",
        })
        const isSuccess = await faceWalletSvc.loginAndGetAddressWallet()

        if (!isSuccess) return

        const token = await AsyncStorage.getItem(WALLET_ADDRESS)

        setWalletAddress(token)
    }, [walletAddress])

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress)
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", onAndroidBackPress)
        }
    }, [currentWebviewUrl])

    const insets = useSafeAreaInsets()
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_spending_100, {
            hasNewUserData: true,
        })
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: Colors.WHITE, marginTop: RatioUtil.heightSafeArea(20) }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        ...RatioUtil.paddingFixedRatio(0, 20, 100, 20),
                        alignItems: "center",
                    }}
                >
                    <Shadow distance={7} startColor={Colors.WHITE3} style={{ ...walletStyle.header.shadowMainView }}>
                        <TouchableOpacity onPress={onQrAddress}>
                            <View
                                style={{
                                    width: RatioUtil.width(320),
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(280),
                                        height: RatioUtil.heightSafeArea(60),
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(18),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {/* 지갑 주소 */}
                                        {jsonSvc.findLocalById("2029")}
                                    </PretendText>
                                    <Image style={RatioUtil.sizeFixedRatio(20, 20)} source={WalletImg.arrow.right} />
                                </View>

                                <View
                                    style={{
                                        width: RatioUtil.width(280),
                                        height: RatioUtil.heightSafeArea(40),
                                        marginBottom: RatioUtil.heightSafeArea(20),
                                        borderRadius: RatioUtil.width(6),
                                        backgroundColor: Colors.GRAY15,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(16),
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {formatWalletAddress}
                                    </PretendText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Shadow>
                    <View style={{ height: RatioUtil.heightSafeArea(30) }} />
                    <SpendingAccount
                        onPress={() => {
                            console.log("Wallet")
                            navigate(Screen.WALLETTRANSFER, { swapMode: 2 })
                        }}
                        type={WalletRouteKey.WALLET}
                        // title="지갑 계좌"
                        title={jsonSvc.findLocalById("2030")}
                        data={dataWallet}
                    />
                    <View style={{ height: RatioUtil.heightSafeArea(30) }} />
                    <Shadow distance={7} startColor={Colors.WHITE3} style={{ ...walletStyle.header.shadowMainView }}>
                        <View
                            style={{
                                width: RatioUtil.width(320),
                                paddingVertical: RatioUtil.heightSafeArea(20),
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <TouchableOpacity
                                onPress={async () => {
                                    await Analytics.logEvent(AnalyticsEventName.click_outside_110, {
                                        hasNewUserData: true,
                                        first_action: "FALSE",
                                    })
                                    await faceWalletSvc.infoWallet()
                                }}
                            >
                                <View style={{ ...walletStyle.header.center, width: RatioUtil.width(72) }}>
                                    <Image
                                        style={{
                                            ...RatioUtil.size(34, 34),
                                            marginBottom: RatioUtil.heightSafeArea(10),
                                        }}
                                        source={WalletImg.wallet_ic1}
                                    />
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {/* 외부로 */}
                                        {jsonSvc.findLocalById("2031")}
                                    </PretendText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    await Analytics.logEvent(AnalyticsEventName.click_swap_110, {
                                        hasNewUserData: true,
                                        first_action: "FALSE",
                                    })
                                    await faceWalletSvc.infoWallet()
                                }}
                            >
                                <View
                                    style={{
                                        ...walletStyle.header.center,
                                        width: RatioUtil.width(72),
                                        marginLeft: RatioUtil.width(4),
                                    }}
                                >
                                    <Image
                                        style={{
                                            ...RatioUtil.size(34, 34),
                                            marginBottom: RatioUtil.heightSafeArea(10),
                                        }}
                                        source={WalletImg.wallet_ic2}
                                    />
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {/* 교환 */}
                                        {jsonSvc.findLocalById("2032")}
                                    </PretendText>
                                </View>
                            </TouchableOpacity>
                            {Platform.OS === "ios" ? null : (
                                <>
                                    <TouchableOpacity onPress={() => handleLinkData(0)}>
                                        <View
                                            style={{
                                                ...walletStyle.header.center,
                                                width: RatioUtil.width(72),
                                                marginLeft: RatioUtil.width(4),
                                            }}
                                        >
                                            <Image
                                                style={{
                                                    ...RatioUtil.size(34, 34),
                                                    marginBottom: RatioUtil.heightSafeArea(10),
                                                }}
                                                source={WalletImg.wallet_ic3}
                                            />
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(14),
                                                    fontWeight: RatioUtil.fontWeightBold(),
                                                    color: Colors.BLACK,
                                                }}
                                            >
                                                {/* 선수구매 */}
                                                {jsonSvc.findLocalById("2033")}
                                            </PretendText>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleLinkData(1)}>
                                        <View
                                            style={{
                                                ...walletStyle.header.center,
                                                width: RatioUtil.width(72),
                                                marginLeft: RatioUtil.width(4),
                                            }}
                                        >
                                            <Image
                                                style={{
                                                    ...RatioUtil.size(34, 34),
                                                    marginBottom: RatioUtil.heightSafeArea(10),
                                                }}
                                                source={WalletImg.wallet_ic4}
                                            />
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(14),
                                                    fontWeight: RatioUtil.fontWeightBold(),
                                                    color: Colors.BLACK,
                                                }}
                                            >
                                                {/* 선수판매 */}
                                                {jsonSvc.findLocalById("2034")}
                                            </PretendText>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </Shadow>
                </View>
                <Modal
                    animationType={"slide"}
                    visible={isVisible}
                    statusBarTranslucent
                    transparent
                    onRequestClose={() => onAndroidBackPress()}
                >
                    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
                        <View
                            style={{
                                flex: 1,
                                marginTop: insets.top,
                            }}
                        >
                            <WebView
                                source={{
                                    uri: linkUrl,
                                }}
                                ref={webview}
                                startInLoadingState
                                javaScriptEnabled={true}
                                injectedJavaScript={INJECTED_JAVASCRIPT}
                                onMessage={event => {
                                    let state = event.nativeEvent
                                    if (state.data.includes("http")) Linking.openURL(state.data)
                                    else if (state.data === CLOSE_WEBVIEW_MESSAGE) setIsVisible(false)
                                    else if (state.data === "navigationStateChange") setCurrentWebviewUrl(state.url)
                                }}
                            />
                        </View>
                    </SafeAreaView>
                </Modal>
                {/* QR code wallet address */}
                <Modal animationType={"fade"} visible={isVisibleQR} statusBarTranslucent transparent>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: `${Colors.BLACK}70`,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: Colors.WHITE,
                                alignItems: "center",
                                paddingVertical: RatioUtil.heightFixedRatio(30),
                                paddingHorizontal: RatioUtil.width(20),
                                borderRadius: RatioUtil.width(16),
                                width: RatioUtil.width(272),
                            }}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(18),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* 지갑 주소 */}
                                {jsonSvc.findLocalById("2029")}
                            </PretendText>
                            <View
                                style={{
                                    width: RatioUtil.width(186),
                                    marginTop: RatioUtil.heightFixedRatio(20),
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(12),
                                        color: Colors.GRAY2,
                                    }}
                                >
                                    {/* {walletAddress == null ? "지갑 주소가 없습니다." : walletAddress} */}
                                    {walletAddress == null ? jsonSvc.findLocalById("10000069") : walletAddress}
                                </PretendText>
                            </View>
                            <View
                                style={{
                                    backgroundColor: Colors.WHITE3,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: RatioUtil.width(10),
                                    ...RatioUtil.borderRadius(10),
                                    marginTop: RatioUtil.heightFixedRatio(23),
                                }}
                            >
                                <QRCode value={walletAddress ?? "null"} size={RatioUtil.width(130)} />
                            </View>
                            <View
                                style={{
                                    width: RatioUtil.width(232),
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: RatioUtil.heightFixedRatio(30),
                                }}
                            >
                                <TouchableOpacity
                                    onPress={async () => {
                                        await Analytics.logEvent(AnalyticsEventName.click_close_115, {
                                            hasNewUserData: true,
                                            first_action: "FALSE",
                                        })
                                        setIsVisibleQR(false)
                                    }}
                                    style={{
                                        width: RatioUtil.width(75),
                                        height: RatioUtil.heightFixedRatio(48),
                                        ...RatioUtil.borderRadius(24),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: Colors.GRAY7,
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.BLACK,
                                            textAlign: "center",
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            fontSize: RatioUtil.font(14),
                                        }}
                                    >
                                        {/* 닫기 */}
                                        {jsonSvc.findLocalById("7077")}
                                    </PretendText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={async () => {
                                        if (walletAddress) onClickCopy(walletAddress)
                                        await Analytics.logEvent(AnalyticsEventName.click_copy_115, {
                                            hasNewUserData: true,
                                            first_action: "FALSE",
                                        })
                                        setIsVisibleQR(false)
                                        toastDispatch({
                                            open: true,
                                            children: (
                                                <WalletToast
                                                    // message={`${grade} 등급은 지갑으로 전송이 불가합니다.`}
                                                    message={"주소가 복사되었습니다."}
                                                />
                                            ),
                                        })
                                        setTimeout(() => {
                                            toastDispatch({ open: false })
                                        }, 2000)
                                    }}
                                    style={{
                                        width: RatioUtil.width(151),
                                        height: RatioUtil.heightFixedRatio(48),
                                        ...RatioUtil.borderRadius(24),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: Colors.BLACK,
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            textAlign: "center",
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            fontSize: RatioUtil.font(14),
                                        }}
                                    >
                                        {/* 주소 복사하기 */}
                                        {jsonSvc.findLocalById("2039")}
                                    </PretendText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    )
}

export default WALLET
