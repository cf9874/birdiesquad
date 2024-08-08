import React, { useEffect, useState } from "react"
import { shallowEqual } from "react-redux"
import { useAppSelector, useScreen, useWrapDispatch } from "hooks"

import { signSvc } from "apis/services"
import { Text } from "react-native-svg"
import { View } from "react-native"
import { setLoading } from "store/reducers/config.reducer"
import { Colors } from "const"
// import { Screen } from "const"
// import { navigate } from "utils"

export const AuthHoc = (Component: React.FC) => {
    const AuthCheck: React.FC = props => {
        useScreen(() => {
            ;(async () => {
                await signSvc.AuthHandler()
            })()
        }, [])

        return <Component {...props} />
    }

    return AuthCheck
}
