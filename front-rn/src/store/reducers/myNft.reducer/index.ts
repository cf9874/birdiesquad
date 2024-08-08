import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"

interface MyNftState {
    numNfts: number
    numItems: number
    isNeedNftUpdate: boolean
    isNeedItemUpdate: boolean
    nfts: any[]
    items: any[]
}
const initialState: MyNftState = {
    numNfts: 0,
    numItems: 0,
    isNeedNftUpdate: true,
    isNeedItemUpdate: true,
    nfts: [],
    items: []
}

const myNftSlice = createSlice({
    name: "myNft",

    initialState,
    reducers: {
        setNumNfts: (state, action: PayloadAction<number>) => {
            state.numNfts = action.payload
            return state
        },
        setNumItems: (state, action: PayloadAction<number>) => {
            state.numItems = action.payload
            return state
        },
        setIsNeedNftUpdate: (state, action: PayloadAction<boolean>) => {
            state.isNeedNftUpdate = action.payload
            return state
        },
        setIsNeedItemUpdate: (state, action: PayloadAction<boolean>) => {
            state.isNeedItemUpdate = action.payload
            return state
        },
        setNfts: (state, action: PayloadAction<any[]>) => {
            state.nfts = action.payload
            return state
        },
        setItems: (state, action: PayloadAction<any[]>) => {
            state.items = action.payload
            return state
        }
    }
})

export const MyNftActions = {
    resetDatas: () => {
        const dispatch = useDispatch()
        dispatch(setIsNeedNftUpdate(true))
        dispatch(setIsNeedItemUpdate(true))
    },
}

export const { setNumNfts, setNumItems, setIsNeedNftUpdate, setIsNeedItemUpdate, setNfts, setItems } = myNftSlice.actions

export default myNftSlice.reducer