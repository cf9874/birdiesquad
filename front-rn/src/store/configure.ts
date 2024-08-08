import { configureStore, Store } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import modules from "./reducers"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { persistReducer, persistStore } from "redux-persist"
import thunk from "redux-thunk"
import { NODE_ENV } from "utils/env"
export let store: Store
const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    blacklist: ["configReducer", "getGameReducer"],
    whitelist: [],
}

const persistedReducer = persistReducer(persistConfig, modules)

const logger = createLogger()

const createStore = () => {
    store = configureStore({
        reducer: persistedReducer,
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
                serializableCheck: false,
            })
                //.concat(logger)
                .concat(thunk),
        devTools: NODE_ENV !== "qa",
        //preloadedState: {},
        enhancers: defaultEnhancers => [...defaultEnhancers],
    })

    const persistor = persistStore(store)

    // if (process.env.NODE_ENV === "production")
    //   store = createStore(persistReducer(persistConfig, modules), applyMiddleware(thunk))
    // else store = createStore(persistReducer(persistConfig, modules), composeWithDevTools(applyMiddleware(thunk, logger)))

    return { store, persistor }
}

export default createStore

export type AppDispatch = typeof store.dispatch
