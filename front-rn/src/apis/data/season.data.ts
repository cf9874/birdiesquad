export interface ISeason {
    SEQ_NO: number
    REG_AT: number
    UDT_AT: number
    seasonId: number
    seasonKey: string
    nameMain: string
    startDate: string
    endDate: string
    name: string
    SEASON_CODE: SeasonCode
    BEGIN_AT: Date
    END_AT: Date
}
export interface ISeasonDetail {
    SEQ_NO: number
    REG_AT: number
    UDT_AT: number
    gameId: number
    cpGameId: string
    roundSeq: number
    gameName: string
    startDate: string
    startTime: string
    endDate: string
    periodType: string
    gameStatus: string
    existLiveData: string
    onair: boolean
    liveLinkId: string
    prize: string
    moneyUnit: string
    GAME_CODE: GameCode
    SEASON_CODE: SeasonCode
    BEGIN_AT: Date
    END_AT: Date
}

export interface ICompetition extends ISeason {
    ROUNDS: IRound[]
    COURSES: ICourse[]
    PAST_WINNERS: IWinners
}
export interface IRound {
    SEQ_NO: number
    REG_AT: number
    UDT_AT: number
    round: string
    roundStatus: string
    ROUND_CODE: RoundCode
    GAME_CODE: GameCode
}

export interface ICourse {
    SEQ_NO: number
    REG_AT: number
    UDT_AT: number
    par: string
    yard: string
    hole: number
    clubName: string
    HOLE_CODE: HoleCode
    GAME_CODE: GameCode
}

//hazel - 대회라운드  interface
export interface IROUNDINFO {
    SEQ_NO: number
    REG_AT: string
    UDT_AT: string
    round: string
    roundStatus: string
    ROUND_CODE: number
    GAME_CODE: number
}
;[]

export interface IWinners {
    SEQ_NO: number
    REG_AT: number
    UDT_AT: number
    seasonKey: string
    personId: number
    nameKo: string
    imageUrl: string
    SEASON_CODE: SeasonCode
    GAME_CODE: GameCode
}

export interface IParticipants {
    SEQ_NO: number
    REG_AT: number
    UDT_AT: number
    personId: number
    cpPersonId: string
    nameKo: string
    sponsor: string
    imageUrl: string
    PLAYER_CODE: PlayerCode
    GAME_CODE: GameCode
}
export interface IGroup {
    SEQ_NO: number
    REG_AT: number
    UDT_AT: Date
    roundSeq: number
    personId: number
    startTime: string
    nameKo: string
    PLAYER_CODE: PlayerCode
    GROUP_CODE: GroupCode
    ROUND_CODE: RoundCode
    GAME_CODE: GameCode
    inOut: IN_OUT
}

export const enum IN_OUT {
    IN = "IN",
    OUT = "OUT",
}

export interface ILeaderboard {
    SEQ_NO: number
    REG_AT: number
    UDT_AT: number
    personId: number
    cpPersonId: string
    nameMain: string
    imageUrl: string
    namePosition: string // position.nameMain
    roundSeq: number
    rank: string
    prize: string
    hole: string
    totalScore: number
    roundScore: number
    roundStroke: number
    playerStatus: string
    orderSeq: number
    PLAYER_CODE: PlayerCode
    ROUND_CODE: RoundCode
    GAME_CODE: GameCode
    rankTiedCheck: boolean
    like?: boolean
    startHole: number // 차후 타입추가 예정
}
export interface IHole {
    SEQ_NO: number
    REG_AT: number
    UDT_AT: number
    personId: number
    roundSeq: number
    nameKo: string
    hole1: string
    hole2: string
    hole3: string
    hole4: string
    hole5: string
    hole6: string
    hole7: string
    hole8: string
    hole9: string
    hole10: string
    hole11: string
    hole12: string
    hole13: string
    hole14: string
    hole15: string
    hole16: string
    hole17: string
    hole18: string
    ROUND_CODE: RoundCode
    PLAYER_CODE: PlayerCode
    GAME_CODE: GameCode
}

export interface ILikePlayers {
    LIKES: ILikes[]
}
export interface ILikes {
    PLAYER_CODE: number
    REG_AT: string
    SEQ_NO: number
}
export interface ILikePlayer {
    LIKE: ILike
    TOGGLE: boolean
}
export interface ILike {
    PLAYER_CODE: number
    REG_AT: number
    SEQ_NO: number
}
export interface IsCalculating {
    isCalculating: boolean
}
export interface IRewardSize {
    GAME_CODE: number
    REWARD_CHEER: {
        GAME_CODE: number
        PLAYER_CODE: number
        RANK_TYPE: string
        RANK_USERS: {
            USER_SEQ: number
            SCORE: number
            RANK: number
            EXPECT_BDST: number
        }[]
    }
    REWARD_TOUR: {
        REWARD_BDST: number
        REWARD_TRAINING: number
        GAME_CODE: number
        USER_SEQ: number
        isCalculating: boolean
        NFTS: {
            seqNo: number
            name: string
            grade: number
            level: number
            training: number
            trainingMax: number
            energy: number
            eagle: number
            birdie: number
            par: number
            bogey: number
            doubleBogey: number
            earnAmount: number
            playerCode: number
            seasonCode: number
            isEquipped: number
            expectReward: {
                training: number
                bdst: number
                energy: number
                commission: number
            }
        }[]
    }
    USER_SEQ: number
}
export interface IReward {
    GAME_CODE: number
    USER_ASSET: {
        TRAINING: number
        BDST: number
        USER_SEQ: number
    }
    USER_NFTS: {
        SEQ_NO: number
        ENERGY: number
        USER_SEQ: number
        UDT_AT: string
    }[]
}
export interface IParticipantsWithGrade extends IParticipants {
    grade?: number
    energy?: number
    season?: number
    maxReward: number
    golf: {
        PAR: number
        EAGLE: number
        DOUBLE_BOGEY: number
        BIRDIE: number
        BOGEY: number
    }
}
export interface IParticipantsWithGradeAndExtraData extends IParticipantsWithGrade {
    leaderboard: ILeaderboard[]
    holes: IHole[]
}

export interface IBdstPlayer extends IParticipantsWithGradeAndExtraData {
    totalBDST: string
    nftSeq: number
    gameCourse: ICompetition
    currentSeason: SeasonCode
}

export interface counterScore {
    count: number
    score: string | number
    roundScore: number | null
    scoreName: string | undefined
}
export interface ICompetitionRoundDetail {
    SEQ_NO: number
    REG_AT: string
    UDT_AT: string
    gameId: number
    cpGameId: number
    roundSeq: number
    gameName: string
    startDate: string
    startTime: null
    endDate: string
    periodType: string
    gameStatus: string
    existLiveData: string
    onair: boolean
    liveLinkId: string
    prize: string
    moneyUnit: string
    GAME_CODE: number
    SEASON_CODE: number
    BEGIN_AT: string
    END_AT: string
    ROUNDS: IRound[]
    COURSES: ICourse[]
    PAST_WINNERS: IWinners
}
//hazel - 추가
export interface CurrentDate {
    currentDate: string | number
}

export type SeasonCode = number
export type GameCode = number
export type PlayerCode = number
export type RoundCode = number
export type HoleCode = number
export type GroupCode = number
