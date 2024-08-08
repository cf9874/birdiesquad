import React, { useCallback, useEffect, useState } from "react"
import { Linking, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { useSelector } from "react-redux"
import { RatioUtil } from "utils"
import { Colors } from "react-native/Libraries/NewAppScreen"
import Config from "react-native-config"

export const AppForceUpdatePopup = ({ modalVisible }: { modalVisible: boolean }) => {
    const appInfoData = useSelector((state: any) => state.appVersionInfoReducer)
    const [isModalVisible, SetIsModalVisible] = useState(modalVisible);

    const onConfirm = useCallback(() => {
        // appInfoData.appStoreUrl로 이동
        // Linking.openURL(appInfoData.appStoreUrl).catch(err => console.error("Failed to open URL: ", err));
        if (Platform.OS === "android") {
            handlePress(appInfoData.appStoreUrl, Config.GOOGLE_PLAY_STORE_WEB_LINK)
        } else {
            handlePress(appInfoData.appStoreUrl, Config.APPLE_APP_STORE_WEB_LINK)
        }
    })

    // 각각의 버튼에 대한 실행될 링크(url)와 링크가 실행되지 않을 때 대체 링크(alterUrl)
    const handlePress = useCallback(async (url: string, alterUrl: string) => {
        // 만약 어플이 설치되어 있으면 true, 없으면 false
        const supported = await Linking.canOpenURL(url)

        if (supported) {
            // SetIsModalVisible(false)
            // 설치되어 있으면
            await Linking.openURL(url)
        } else {
            // SetIsModalVisible(false)
            // 앱이 없으면
            await Linking.openURL(alterUrl)
        }
    }, [])

    useEffect(() => {
        SetIsModalVisible(modalVisible)
    }, [modalVisible])

    return (
        // <View style={{ flex: 1, backgroundColor: "white" }}>
            <Modal animationType="slide" transparent={true} statusBarTranslucent visible={isModalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitleText}>업데이트 안내</Text>
                        <Text style={styles.modalText}>
                            {"새로운 서비스 이용을 위해 최신 버전의 \n 버디스쿼드로 업데이트 합니다"}
                        </Text>
                        <Pressable style={styles.button} onPress={onConfirm}>
                            <Text style={styles.textStyle}>확인</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        // </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitleText: {
        marginBottom: 15,
        fontSize: 18,
        fontWeight: "600",
    },
    button: {
        padding: 10,
        width: RatioUtil.width(150),
        backgroundColor: Colors.black,
        borderRadius: RatioUtil.width(100),
        elevation: 2,
    },
    textStyle: {
        textAlign: "center",
        color: "white",
        fontSize: 14,
    },
    modalText: {
        marginBottom: 20,
        fontSize: 14,
        fontWeight: "400",
        textAlign: "center",
    },
})
