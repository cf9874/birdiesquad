import { size } from "lodash"
import React, { useState } from "react"
import { View, StyleSheet, Button, Modal, Text, TouchableOpacity } from "react-native"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { scaleSize } from "styles/minixs"
import { RatioUtil } from "utils"

const MySquadSaveModal = ({
    modalVisible,
    setModalVisible,
    onPressConfirm,
}: {
    modalVisible: boolean
    setModalVisible: Function
    onPressConfirm: Function
}) => {
    const closeModal = () => {
        setModalVisible(false)
    }
    const handleConfirm = () => {
        onPressConfirm()
    }
    const [visible, setvisible] = useState(false)
    const [propOnConfirm, setPropOnConfirm] = useState(false)

    return (
        <Modal visible={modalVisible} statusBarTranslucent transparent>
            <View style={styles.mainView}>
                <View style={styles.modalMainView}>
                    <Text style={styles.title}>{"저장 하시겠습니까?"}</Text>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={styles.desc}>{"스쿼드 교체 후 더 이상"}</Text>
                        <Text style={styles.subDesc}>{"변경이 불가합니다."}</Text>
                    </View>
                    <View style={styles.buttonMainView}>
                        <TouchableOpacity onPress={closeModal} style={[styles.buttonView, styles.cancelButton]}>
                            <Text style={[styles.btnText, styles.cancelButtonText]}>{"취소"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleConfirm()}
                            style={[styles.buttonView, styles.saveButton]}
                        >
                            <Text style={[styles.btnText, styles.saveButtonText]}>{"저장"}</Text>
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
        width: RatioUtil.lengthFixedRatio(272),
        height: RatioUtil.lengthFixedRatio(193),
        alignItems: "center",
    },
    title: {
        fontSize: 17,
        lineHeight: 19,
        fontWeight: "700",
        color: "#000000",
        marginVertical: 10,
        marginTop: RatioUtil.width(30),
    },
    desc: {
        fontSize: 13,
        lineHeight: 19,
        fontWeight: "300",
        color: "#000000",
        width: 150,
        textAlign: "center",
    },
    subDesc: {
        fontSize: 13,
        lineHeight: 19,
        fontWeight: "300",
        color: "#000000",
        width: 150,
        textAlign: "center",
        marginBottom: 20,
    },
    buttonMainView: {
        height: 45,
        width: 240,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    btnText: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: "500",
    },
    buttonView: {
        flex: 0.48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        backgroundColor: "#E9ECEF",
    },
    saveButton: {
        backgroundColor: "#000000",
    },
    cancelButtonText: {
        color: "#000000",
        fontWeight: "700",
        size: 14,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        size: 14,
    },
})
export default MySquadSaveModal
