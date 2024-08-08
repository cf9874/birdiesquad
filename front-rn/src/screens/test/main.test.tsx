import Config from "react-native-config";

import AsyncStorage from "@react-native-async-storage/async-storage"
import { signSvc } from "apis/services"
import { Dimension } from "const"
import { useToggle } from "hooks"
import * as React from "react"
import { useEffect, useState } from "react"
import { Alert, Button, Linking, Platform, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import WebView from "react-native-webview"
import { ConfigUtil, RatioUtil } from "utils"

const Test = () => {
    const [flag, toggle] = useToggle(false)
    const [token, setToken] = useState<string | null>(null)

    const initData = async () => {
        const token = await ConfigUtil.getStorage<string>(TOKEN_ID)
        setToken(token)
    }

    useEffect(() => {
        initData()
    }, [])

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

    const handleMessage = async (event: any) => {
        const data = JSON.parse(event?.nativeEvent?.data)
        // console.log(event, data)

        if (data?.result == "success") {
            // 인증에 성공시 실행함수 입력
        } else if (data?.result == "duplicate") {
            // 이미 존재하는 정보일때
        } else if (data?.result == "error") {
            // 에러 처리
        } else {
            // 기본 처리 함수
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {flag && token !== null ? (
                <WebView
                    source={{
                        uri: API_URL + "/api/v1/auth/cert/start",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }}
                    style={{ width: RatioUtil.width(Dimension.BASE.WIDTH), height: "100%" }}
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
            <Button title="test" onPress={toggle} />
        </SafeAreaView>
    )
}

export default Test
