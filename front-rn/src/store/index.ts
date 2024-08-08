import configure, { AppDispatch } from "./configure"
import { RootState } from "./reducers"

const { store, persistor } = configure()

export default store
export { persistor }
export { type RootState, type AppDispatch }
