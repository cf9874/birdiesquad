import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { INft } from "screens/NftAdvancement/nftDetailVx"

// NFT 승급 재료로 선택된 배열 초기 상태
const NFT_UPGRADE_MATERIAL_COUNT = 2
const initialState: any = new Array(NFT_UPGRADE_MATERIAL_COUNT).fill({})

interface INftWithIndex {
    nft: INft
    index: number
}

const nftUpgradeMaterialsSlice = createSlice({
    name: "selectedNft",
    initialState,
    reducers: {
        // 선택된 NFT 추가
        addSelectedUpgradeMaterialNft: (state, action: PayloadAction<INftWithIndex>) => {
            state[action.payload.index] = action.payload.nft
        },

        // 선택된 NFT 제거
        removeSelectedUpgradeMaterialNft: (state, action: PayloadAction<number>) => {
            state[action.payload] = {}
        },

        removeAllSelectedUpgradeMaterialNft: () => {
            return initialState
        },
    },
})

export const { addSelectedUpgradeMaterialNft, removeSelectedUpgradeMaterialNft, removeAllSelectedUpgradeMaterialNft } =
    nftUpgradeMaterialsSlice.actions
export default nftUpgradeMaterialsSlice.reducer
