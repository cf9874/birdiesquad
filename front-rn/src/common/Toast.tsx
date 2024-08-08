import { PretendText } from "components/utils"
import { Colors } from "const"
import { useAppSelector, useWrapDispatch } from "hooks"
import { Image, Modal, Text, useWindowDimensions, View } from "react-native"
import ReactNativeModal from "react-native-modal"
import { shallowEqual } from "react-redux"
import { setToast } from "store/reducers/config.reducer"
import { RatioUtil } from "utils"

const Toast = () => {
    const { toast } = useAppSelector(state => state.configReducer, shallowEqual)
    const toastDispatch = useWrapDispatch(setToast)
    const { width, height } = useWindowDimensions()

    return (
        <ReactNativeModal
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            hasBackdrop={false}
            isVisible={toast.open}
            deviceWidth={width}
            statusBarTranslucent
            deviceHeight={height}
            style={{ margin: 0 }}
        >
            {toast.children}
        </ReactNativeModal>
    )
}

export default Toast
