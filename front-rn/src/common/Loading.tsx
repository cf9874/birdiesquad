import { useAppSelector, useStyle } from "hooks"
import React from "react"
import { shallowEqual } from "react-redux"
import { ActivityIndicator, View } from "react-native"
import { CommonStyle } from "styles/common.style"
const Loading = () => {
    const { loading } = useAppSelector(state => state.configReducer, shallowEqual)
    const { style: loadingCss } = useStyle(CommonStyle.genLoading)

    return <View style={[loadingCss.loading, !loading.isloading && { display: "none" }]}>{loading.children}</View>
}

export default Loading
