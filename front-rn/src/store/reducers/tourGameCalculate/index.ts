import { PayloadAction, createSlice } from "@reduxjs/toolkit"

/**
 * @brief 매 주 골프 경기가 끝나고 난 후 월요일 자정부터 정산이 시작되고 정산 종료 여부를 저장하는 상태관리
 * @author Nibble
 * @create 2023-07-07
 */
const tourGameCalculateSlice = createSlice({
    name: "tourGameCalculate",
    initialState: { isClculate: false },
    reducers: {
        // 정산 여부
        setTourGameCalculateResult: (state, action: PayloadAction<boolean>) => {
            state.isClculate = action.payload
        },
    },
})

export const { setTourGameCalculateResult } = tourGameCalculateSlice.actions
export default tourGameCalculateSlice.reducer