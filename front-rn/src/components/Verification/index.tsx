import { AnalyticsEventName, Colors, Dimension } from "const"
import { useEffect, useState } from "react"
import { Alert, Dimensions, Linking, Modal, Platform, Pressable, TouchableOpacity, View } from "react-native"
import { styles } from "./styles"
import { BlurView } from "@react-native-community/blur"
import { PretendText } from "components/utils"
import { jsonSvc, signSvc } from "apis/services"
import { useToggle } from "hooks"
import { ConfigUtil, ErrorUtil, RatioUtil } from "utils"
import { API_URL, TOKEN_ID } from "utils/env"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { Image } from "react-native"
import { nftDetailImg } from "assets/images"
import { faceWalletSvc } from "apis/services/faceWallet.svc"
import { CLOSE_WEBVIEW_MESSAGE } from "apis/data"
import { Analytics } from "utils/analytics.util"

const Verification = ({
    visible,
    closeToggle,
    callback,
    checkMode,
    setIsCompleteWallet,
}: {
    visible: boolean
    closeToggle: React.Dispatch<React.SetStateAction<boolean>>
    setIsCompleteWallet: React.Dispatch<React.SetStateAction<boolean>>
    callback?: (haveWallet: boolean) => void
    checkMode: number
}) => {
    const inset = useSafeAreaInsets()

    // const [flag, toggle] = useToggle(true)
    const [token, setToken] = useState<string | null>(null)

    const initData = async () => {
        const token = await ConfigUtil.getStorage<string>(TOKEN_ID)
        setToken(token)
    }

    useEffect(() => {
        initData()
    }, [token])

    const onShouldStartLoadWithRequest = (event: any) => {
        if (
            event.url.startsWith("http://") ||
            event.url.startsWith("https://") ||
            event.url.startsWith("about:blank")
        ) {
            return true
        }

        if (Platform.OS === "android") {
            if (event.url.includes("intent")) {
                var SendIntentAndroid = require("react-native-send-intent")

                SendIntentAndroid.openAppWithUri(event.url)
                    .then((isOpened: boolean) => {
                        if (!isOpened) {
                            Alert.alert("앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.")
                        }
                    })
                    .catch((err: any) => {
                        console.log(err)
                    })
            }

            return false
        } else {
            Linking.openURL(event.url).catch(err => {
                Alert.alert("앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.")
            })
            return false
        }
    }

    const handleMessage = async (event: WebViewMessageEvent) => {
        const data = event.nativeEvent.data
        if (data === CLOSE_WEBVIEW_MESSAGE) {
            closeToggle(false)
            const isAdult = await signSvc.checkAdult()

            if (checkMode) {
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
                callback?.(true)
                setIsCompleteWallet(true)
            }
        }
    }

    return (
        <Modal visible={visible} statusBarTranslucent transparent>
            <View
                style={{
                    height: RatioUtil.heightFixedRatio(44) + inset.top,
                    backgroundColor: Colors.WHITE,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                }}
            >
                <Pressable
                    style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end" }}
                    onPress={() => {
                        closeToggle(false)
                    }}
                >
                    <Image
                        resizeMode="contain"
                        style={{ ...RatioUtil.size(30, 30), marginRight: RatioUtil.width(15) }}
                        source={nftDetailImg.close}
                    />
                </Pressable>
            </View>
            {token !== null ? (
                <WebView
                    source={{
                        uri: API_URL + `/api/v1/auth/cert/start?checkMode=${checkMode}`,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }}
                    style={{ width: RatioUtil.width(Dimension.BASE.WIDTH) }}
                    javaScriptEnabled={true}
                    onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                    onMessage={handleMessage}
                    domStorageEnabled={true}
                    mixedContentMode={"compatibility"}
                    sharedCookiesEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    originWhitelist={["*"]}
                />
            ) : null}
        </Modal>
    )
}

export default Verification
