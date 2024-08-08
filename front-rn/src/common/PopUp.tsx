import { useAppSelector, useWrapDispatch } from "hooks"
import React, { useEffect } from "react"
import { shallowEqual } from "react-redux"
import { ReactNativeModal } from "react-native-modal"
import { setPopUp } from "store/reducers/config.reducer"
import { View, useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
const PopUp = () => {
    const { popUp } = useAppSelector(state => state.configReducer, shallowEqual)
    const popUpDispatch = useWrapDispatch(setPopUp)
    const { width, height } = useWindowDimensions()

    const onClose = () => popUpDispatch({ open: false })

    const insets = useSafeAreaInsets()

    return (
        <ReactNativeModal
            isVisible={popUp.open}
            deviceWidth={width}
            deviceHeight={height}
            onBackdropPress={onClose}
            statusBarTranslucent
            style={{ margin: 0 }}
            onBackButtonPress={onClose}
        >
            {popUp.children}
        </ReactNativeModal>
    )
}

export default PopUp
