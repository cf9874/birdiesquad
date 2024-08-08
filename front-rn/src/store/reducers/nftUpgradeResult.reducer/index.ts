import { PayloadAction, createSlice } from "@reduxjs/toolkit"

/**
 * @brief nft 승급 결과 상태 관리
 * @author Nibble
 * @create 2023-06-15
 */
const nftUpgradeResultSlice = createSlice({
    name: "nftUpgrade",
    initialState: { isUpgrade: false },
    reducers: {
        // 승급 결과 설정
        setNftUpgradeResult: (state, action: PayloadAction<boolean>) => {
            state.isUpgrade = action.payload
        },
    },
})

export const { setNftUpgradeResult } = nftUpgradeResultSlice.actions
export default nftUpgradeResultSlice.reducer