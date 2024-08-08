import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import { Colors } from "const"
import { useSelector } from "react-redux"
import { useEffect, useRef } from "react"
import { RatioUtil } from "utils"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import store from "store"
import { setShowGameModal } from "store/reducers/getGame.reducer"
import { globalStyle } from "styles"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import { PretendText } from "components/utils"

const GameModal = () => {
    const { showModal, title, desc1, desc2, showloader } = useSelector((state: any) => ({
        showModal: state.getGameReducer.showModal,
        title: state.getGameReducer.title,
        desc1: state.getGameReducer.desc1,
        desc2: state.getGameReducer.desc2,
        showloader: state.getGameReducer.showloader,
    }))
    const innerViewRef = useRef(null)

    // useEffect(() => {
    //     console.warn(showModal)
    // }, [showModal])

    return (
        <View>
            <Modal visible={showModal} statusBarTranslucent transparent>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={event => {
                        // if (innerViewRef.current && event.target !== innerViewRef.current) {
                        store.dispatch(setShowGameModal(false))
                        // }
                    }}
                    style={styles.mainView}
                >
                    <View ref={innerViewRef} style={styles.innerView}>
                        <PretendText style={styles.title}>{title}</PretendText>
                        <PretendText style={styles.desc}>{desc1}</PretendText>
                        {desc2 ? <PretendText style={styles.desc}>{desc2}</PretendText> : null}
                    </View>
                </TouchableOpacity>
            </Modal>
            <Modal visible={showloader} statusBarTranslucent transparent>
                <View style={styles.mainView}>
                    <AnimatedLottieView
                        source={lotties.loading}
                        style={{ width: RatioUtil.font(48), height: RatioUtil.font(48) }}
                        autoPlay
                        loop
                    />
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00000090",
    },
    innerView: {
        // height: 100,
        width: RatioUtil.width(270),
        borderRadius: RatioUtil.width(15),
        backgroundColor: Colors.WHITE3,
        alignItems: "center",
        justifyContent: "center",
        padding: RatioUtil.width(30),
    },
    title: {
        fontFamily: globalStyle.defaultFontText.fontFamily,
        fontSize: RatioUtil.width(15),
        lineHeight: RatioUtil.width(18),
        fontWeight: "700",
        color: Colors.BLACK,
        marginBottom: RatioUtil.width(5),
    },
    desc: {
        fontFamily: globalStyle.defaultFontText.fontFamily,
        fontSize: RatioUtil.width(14),
        lineHeight: RatioUtil.width(20),
        // fontWeight: '700',
        color: Colors.GRAY10,
        textAlign: "center",
    },
})
export default GameModal
