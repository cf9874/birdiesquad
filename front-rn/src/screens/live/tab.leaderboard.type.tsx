import { ICourse, ILeaderboard, ISeasonDetail } from "apis/data/season.data"

export interface RankItemProps {
    rank: string
    rankTiedCheck: boolean
    totalScore: number
    hole: string
    nameMain: string
    isPro: boolean
    playerImage: string
    personId: number
    like?: boolean
    prize: string
    playerStatus: string
    roundSeq: number
    roundScore: number
    roundStroke: number
    gameData?: ISeasonDetail
    endStatus: boolean
    courseInfo?: ICourse[]
    setLeaderboardData: React.Dispatch<React.SetStateAction<ILeaderboardByRender>>
    myPlayerData: ILeaderboard[]
    // handlePressLikeButton: (personId: number) => () => Promise<void>
}

export interface ILeaderBoardTab {
    gameData?: ISeasonDetail
    isEnd: boolean
}
export interface IplayerScore {
    inCourses: string[]
    outCourses: string[]
    outScore: (string | number)[]
    inScore: (string | number)[]
    cousre: {
        coursesInfo: ICourse[]
        outCourses: string[]
        inCourses: string[]
        outTotal: number
        inTotal: number
    }
    hole: {
        outTotal: number
        inTotal: number
        outDiff: number[]
        inDiff: number[]
    }
}

export type ILeaderboardByRender = {
    like: ILeaderboard[]
    all: ILeaderboard[]
}

export type SectionItem = { nameMain: "head" } | ILeaderboard

export type Status = "like" | "all"
export type Order = "asc" | "desc"

export interface IBoardHeader {
    status: Status
    leaderboardData: ILeaderboardByRender
    setLeaderboardData: React.Dispatch<React.SetStateAction<ILeaderboardByRender>>
    endStatus: boolean
}
