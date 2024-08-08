import { createNavigationContainerRef } from "@react-navigation/native"

import { Screen } from "const"
import { CommonActions } from "@react-navigation/native"

export const navigationRef = createNavigationContainerRef()

export const navigate = <P extends object>(name: typeof Screen[keyof typeof Screen], params?: P) => {
    if (!navigationRef.isReady()) return

    if (name === Screen.BACK) {
        navigationRef.canGoBack() && navigationRef.dispatch(CommonActions.goBack())
    } else {
        navigationRef.dispatch(CommonActions.navigate(name, params))
    }
}
export const navigateReset = <P extends object>(name: typeof Screen[keyof typeof Screen], params?: P) => {
    if (!navigationRef.isReady()) return

    navigationRef.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name, params }],
        })
    )
}
