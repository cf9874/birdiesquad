import { combineReducers } from "@reduxjs/toolkit"
import signReducer from "./sign.reducer"
import configReducer from "./config.reducer"
// import checkModalReducer from './checkModal.reducer'
import getGameReducer from "./getGame.reducer"
import donateReducer from "./donate.reducer"
import nftUpgradeMaterialsReducer from "./nftUpgradeMaterials.reducer"
import upgradeNftReducer from "./upgradeNft.reducer"
import nftUpgradeResultReducer from "./nftUpgradeResult.reducer"
import appVersionInfoReducer from "./appVersionInfo.reducer"
import mySquadReducer from "./mySquad.reducer"
import myNftReducer from "./myNft.reducer"
import tourGameCalculateReducer from "./tourGameCalculate"

const rootReducer = combineReducers({
    signReducer,
    configReducer,
    // checkModalReducer,
    getGameReducer,
    donateReducer,
    nftUpgradeMaterialsReducer,
    upgradeNftReducer,
    nftUpgradeResultReducer,
    appVersionInfoReducer,
    mySquadReducer,
    myNftReducer,
    tourGameCalculateReducer
})
export default rootReducer

export type RootState = ReturnType<typeof rootReducer>
