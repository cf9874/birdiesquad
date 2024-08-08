import { useAppSelector, useWrapDispatch } from "hooks"
import React, { useEffect } from "react"
import { shallowEqual } from "react-redux"
import { ReactNativeModal } from "react-native-modal"
import { setModal } from "store/reducers/config.reducer"
import { BackHandler, StatusBar, View, useWindowDimensions } from "react-native"
import { RatioUtil } from "utils"
import { useSafeAreaInsets } from "react-native-safe-area-context"
const Modal = () => {
    const { modal } = useAppSelector(state => state.configReducer, shallowEqual)
    const modalDispatch = useWrapDispatch(setModal)
    const { width, height } = useWindowDimensions()

    const onClose = () => modalDispatch({ open: false })

    const insets = useSafeAreaInsets()

    return (
        <ReactNativeModal
            isVisible={modal.open}
            deviceWidth={width}
            deviceHeight={height + insets.top}
            onBackdropPress={() => {
                if (modal.preventClose) return

                onClose()
            }}
            statusBarTranslucent
            style={{ margin: 0 }}
            onBackButtonPress={() => {
                if (modal.preventClose) return

                onClose()
            }}
        >
            {modal.children}
        </ReactNativeModal>
    )
}

export default Modal
