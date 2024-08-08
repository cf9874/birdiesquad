import { ICourse, IHole, ILeaderboard, IParticipants } from "./season.data"

export interface IParticipantsWithGrade extends IParticipants {
    grade?: number
    energy?: number
    season?: number
    golf: {
        PAR: number
        EAGLE: number
        DOUBLE_BOGEY: number
        BIRDIE: number
    }
}

export interface IParticipantsWithGradeAndExtraData extends IParticipantsWithGrade {
    leaderboard: ILeaderboard[]
    holes: IHole[]
}

// export interface ICounterScore {
//     count: number
//     score: string | number
//     roundScore: number | null
//     scoreName: string | undefined
// }
export interface ICounterScore extends IScore {
    count: number
}

export interface IScore {
    course: ICourse
    holeScore: number
    score: number
    par: number
    name: "PAR" | "EAGLE" | "DOUBLE_BOGEY" | "BIRDIE" | "BOGEY"
    count: number
}

// export interface IScore {
//     data: ICourse
//     par: string
//     score: string | number
//     roundScore: number | null
//     scoreName: string | undefined
// }
