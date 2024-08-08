import React, { useCallback, useEffect } from "react"
import { View, StyleSheet, Modal } from "react-native"
import Video from "react-native-video"
import { navigate } from "utils"
import { Screen } from "const"
import { INft } from "./nftDetailVx"
import { useDispatch } from "react-redux"
import { removeAllSelectedUpgradeMaterialNft } from "store/reducers/nftUpgradeMaterials.reducer"

const NftUpgradeEffectPlayer = ({
    nftData,
    isNftUpgrade,
    videoUrl,
    modalVisible,
    setModalVisible,
}: {
    nftData: INft
    isNftUpgrade?: boolean
    videoUrl: string
    modalVisible: boolean
    setModalVisible: Function
}) => {
    const ungradeEffectPlayerEndTime = 10000
    const dispatch = useDispatch()
    
    // 모달 닫기
    const closeModal = useCallback((nextPage: any, data: any) => {
        setModalVisible(false);
        dispatch(removeAllSelectedUpgradeMaterialNft());
        navigate(nextPage, data)
    }, [dispatch, nftData, setModalVisible]);

    // 비디오 플레이어 타임이 지나면 강제로 결과 페이지로 이동한다.
    useEffect(() => {
        if (modalVisible) {
            const timer = setTimeout(() => {
                if (isNftUpgrade) {
                    closeModal(Screen.OPENNFTSCREEN, { nftseq: nftData.seq, playerCode: nftData.playerCode, isFirst: false });
                } else {
                    closeModal(Screen.NFTADVANCEMENT, nftData);
                }
            }, ungradeEffectPlayerEndTime);
            return () => {
                return clearTimeout(timer)
            };
        } 
    }, [modalVisible, isNftUpgrade, nftData, closeModal])

    return (
        <Modal visible={modalVisible} statusBarTranslucent transparent>
            <View style={styles.modalContent}>
                <Video
                    source={videoUrl}
                    style={styles.video}
                    resizeMode="cover"
                    repeat={false}
                    selectedVideoTrack={{ // 화질 제한
                        type: "resolution",
                        value: 480
                    }}
                    useTextureView={false} // 비디오 재생 성능 우선시
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: "black",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
    video: {
        width: "100%",
        height: "100%",
    },
})

export default NftUpgradeEffectPlayer
