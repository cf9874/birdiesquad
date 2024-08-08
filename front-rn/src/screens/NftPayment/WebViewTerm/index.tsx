import { Image, View, TouchableOpacity, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { navigate } from "utils"
import { Colors, Screen, ScreenParams } from "const"
import { NFTCardImages } from "assets/images"
import { styles } from "../PlayerSelection/styles"
import WebView from "react-native-webview"
import { useRoute, RouteProp } from "@react-navigation/native"
import { useRef } from "react"
import { CLOSE_WEBVIEW_MESSAGE } from "apis/data"
import { PretendText } from "components/utils"

const WebViewTerm = () => {
    const { params } = useRoute<RouteProp<ScreenParams, Screen.WEBVIEWTERM>>()
    const webViewRef = useRef<WebView | null>(null)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            {!params.hideBack ? (
                <View style={styles.headerView}>
                    <TouchableOpacity
                        onPress={() => {
                            navigate(Screen.BACK)
                        }}
                        style={styles.backButton}
                    >
                        <Image resizeMode="contain" source={NFTCardImages.back} style={styles.backImage} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleView}>
                        <PretendText style={styles.headerTitle}></PretendText>
                    </View>
                </View>
            ) : null}
            <WebView
                source={{
                    uri: `${params.url || ""}`,
                }}
                ref={webViewRef}
                javaScriptEnabled={true}
                onMessage={event => {
                    if (event.nativeEvent.data.includes("http")) Linking.openURL(event.nativeEvent.data)
                    else event.nativeEvent.data === CLOSE_WEBVIEW_MESSAGE ? navigate(Screen.BACK) : null
                }}
            />
        </SafeAreaView>
    )
}

export default WebViewTerm
