import { persistor, default as store } from "store"
import { Provider } from "react-redux"
import React from "react"
// import typography from "utils/typography"
import Prerequisites from "./Prerequisites"
// import App from "../src/context/App"
// import { Helmet } from "react-helmet
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"

export default ({ children }: React.PropsWithChildren<any>) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Prerequisites>{children}</Prerequisites>
            </PersistGate>
        </Provider>
    )
}
