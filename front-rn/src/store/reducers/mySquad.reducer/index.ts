import { PayloadAction, createSlice, Reducer } from "@reduxjs/toolkit"
import { ICompetitionRoundDetail } from "apis/data/season.data"

interface MySquadState {
    gameSeq: number
    gameCode: number
    mySquadList: any[]
    mySquadNft: any[]
    gameRound: ICompetitionRoundDetail[]
    playerReward: any[]
    gameFilter: any[]
}
const initialState: MySquadState = {
    gameSeq: 0,
    gameCode: 0,
    mySquadList: [],
    mySquadNft: [],
    gameRound: [],
    playerReward: [],
    gameFilter: [],
}

const mySquadGameSeq = createSlice({
    name: "mySquad",

    initialState,
    reducers: {
        // 경기 seq 설정
        setGameSeq: (state, action: PayloadAction<number>) => {
            state.gameSeq = action.payload

            return state
        },
        //경기Code 설정
        setGameCode: (state, action: PayloadAction<number>) => {
            state.gameCode = action.payload

            return state
        },
        //선택한 마이스쿼드 리스트
        mySquadSelectList: (state, action: PayloadAction<any>) => {
            state.mySquadList = action.payload
            return state
        },
        //보유 NFT
        mySquadNft: (state, action: PayloadAction<any>) => {
            state.mySquadNft = action.payload

            return state
        },
        //대회 라운드 정보
        gameRound: (state, action: PayloadAction<any>) => {
            state.gameRound = action.payload

            return state
        },
        //선수별 예상보상량
        playerReward: (state, action: PayloadAction<any>) => {
            state.playerReward = action.payload

            return state
        },
        //월요일 마다 경기 있는지 판단 후 넣는 ㄷ ㅔ이터
        gameFilterMonday: (state, action: PayloadAction<any>) => {
            state.gameFilter = action.payload

            return state
        },
    },
})

export const { setGameSeq, setGameCode, mySquadSelectList, mySquadNft, gameRound, playerReward, gameFilterMonday } =
    mySquadGameSeq.actions

export default mySquadGameSeq.reducer
