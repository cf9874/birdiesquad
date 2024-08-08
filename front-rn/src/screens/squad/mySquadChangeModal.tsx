import { MySquadImg } from "assets/images"
import React, { useState } from "react"
import { View, StyleSheet, Button, Modal, Text, TouchableOpacity, Image } from "react-native"
import { RatioUtil } from "utils"

const MySquadChangeModal = ({
    modalVisible,
    setModalVisible,
    title,
    onPressConfirm,
}: {
    modalVisible: boolean
    setModalVisible: Function
    title: string
    onPressConfirm: Function
}) => {
    const closeModal = () => {
        setModalVisible(false)
    }
    const [visible, setvisible] = useState(false)
    const [visibleAuth, setvisibleAuth] = useState(false)

    const handleConfirm = () => {
        closeModal()
        onPressConfirm()
    }

    return (
        <Modal visible={modalVisible} statusBarTranslucent transparent>
            <View style={styles.mainView}>
                <View style={styles.modalMainView}>
                    <Image
                        source={MySquadImg.alert}
                        style={{
                            height: RatioUtil.lengthFixedRatio(50),
                            width: RatioUtil.lengthFixedRatio(50),
                            marginBottom: RatioUtil.lengthFixedRatio(16),
                        }}
                    />
                    <Text style={styles.desc}>{title}</Text>
                    <View>
                        <TouchableOpacity onPress={handleConfirm} style={[styles.buttonView]}>
                            <Text style={styles.buttonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalMainView: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 16,
        height: 228,
        alignItems: "center",
        width: RatioUtil.width(272),
    },
    title: {
        fontSize: 17,
        lineHeight: 19,
        fontWeight: "700",
        color: "#000000",
        marginVertical: 10,
    },
    desc: {
        fontSize: 13,
        lineHeight: 19,
        fontWeight: "400",
        color: "#000000",
        width: 160,
        textAlign: "center",
        marginBottom: 24,
    },
    buttonView: {
        alignItems: "center",
        justifyContent: "center",
        width: RatioUtil.lengthFixedRatio(232),
        height: RatioUtil.lengthFixedRatio(48),
        borderRadius: RatioUtil.width(100),
        backgroundColor: "#000000",
    },
    buttonText: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
})
export default MySquadChangeModal
