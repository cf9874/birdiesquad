export interface IRankAmount {
    GAME_CODE: number
    POOL_AMOUNT: number
}

interface IRank {
    SCORE: number
    RANK: number
}

export interface IPlayerRank extends IRank {
    PLAYER_CODE: number
    USER_SEQ: number
}
interface IUserRank extends IRank {
    USER_SEQ: number
    SCORE: number
    RANK: number
    CASH_AMOUNT: number
    EXPECT_BDST: number
}

interface IRankWrapperData {
    GAME_CODE: number
    RANK_TYPE: string
}

export interface IPlayerRankList extends IRankWrapperData {
    RANK_PLAYERS: IPlayerRank[]
}
export interface IPlayerRankCount {
    WEEK_CODE: number
    RANK_TYPE: string
    RANK_COUNT: number
    RANK_SCORE: number
}

export interface IUserRankList extends IRankWrapperData {
    PLAYER_CODE: number
    RANK_USERS: IUserRank[]
    USER_PROFILES: {
        ICON_TYPE: number
        ICON_NAME: string
        NICK: string
        USER_SEQ: number
    }[]
}

export interface IMyRankList extends IUserRankList {
    USER_PROFILES: {
        USER_SEQ: number
        ICON_TYPE: number
        ICON_NAME: string
        NICK: string
        HELLO: string
    }[]
}

export interface IUserCount {
    GAME_CODE: number
    RANK_TYPE: string
    PLAYER_CODE: number
    RANK_COUNT: number
}
export interface IUsersRankMostList {
    WEEK_CODE: number
    RANK_TYPE: string
    RANK_MOSTS: IPlayerRank[]
    USER_PROFILES: {
        ICON_TYPE: number
        ICON_NAME: string
        NICK: string
        USER_SEQ: number
    }[]
}
export interface IUsersRankingList {
    WEEK_CODE: number
    RANK_TYPE: string
    RANK_USERS: IUserRank[]
    USER_PROFILES: {
        ICON_TYPE: number
        ICON_NAME: string
        NICK: string
        USER_SEQ: number
    }[]
}
export interface IRankMost {
    USER_SEQ: number
    PLAYER_CODE?: number
    SCORE: number
    RANK: number
}
export interface IMyRankMost {
    WEEK_CODE: number
    RANK_TYPE: string
    PLAYER_CODE: number
    RANK_MOSTS: IRankMost[]
    EXPECT_TRAINING: number
}
export interface IMyRankDonation {
    WEEK_CODE: number
    RANK_TYPE: string
    RANK_USERS: IRankMost[]
    EXPECT_TRAINING: number | 0
}
export interface IPlayerRankRro extends IRank {
    PLAYER_CODE: number
    USER_COUNT?: number
    CASH_AMOUNT?: number
}
export interface IRankPro {
    WEEK_CODE: number
    RANK_TYPE: string
    RANK_PLAYERS: IPlayerRankRro[]
}
export interface IRankHeartAmout {
    WEEK_CODE: number
    PLAYER_CODE: number
    RANK_TYPE: string
    RANK_SCORE: number
}
///REWARDS

export interface IReward {
    WEEK_CODE: number
    REWARD_TRAINING: number
    RANK_MOST: {
        WEEK_CODE: number
        RANK_TYPE: string
        RANK_MOSTS: IRankMost[]
        EXPECT_TRAINING: number
    }
    RANK_CASH_AMOUNT: {
        WEEK_CODE: number
        RANK_TYPE: string
        RANK_USERS: IRankMost[]
        EXPECT_TRAINING: number
    }
    RANK_CASH_COUNT: {
        WEEK_CODE: number
        RANK_TYPE: string
        RANK_USERS: IRankMost[]
        EXPECT_TRAINING: number
    }
    RANK_HEAET_COUNT: {
        WEEK_CODE: number
        RANK_TYPE: string
        RANK_USERS: IRankMost[]
        EXPECT_TRAINING: number
    }
    RANK_UP_COUNT: {
        WEEK_CODE: number
        RANK_TYPE: string
        RANK_USERS: IRankMost[]
        EXPECT_TRAINING: number
    }
}
export interface ITakeReward {
    WEEK_CODE: number
    USER_ASSET: {
        TRAINING: number
        USER_SEQ: number
    }
}

export interface USER_RECORD {
    TOTAL_NFT_COUNT: number
    NFT_GRADE_TOP: number
    PREV_BDST_AMOUNT: number
    PREV_TRAINING_AMOUNT: number
    TOP_BLOOD_PLAYER_CODE: number
    TOTAL_CASH_AMOUNT: number
    TOTAL_CASH_COUNT: number
    TOTAL_HEART_COUNT: number
    TOTAL_NFT_GRADE_UP_COUNT: number
    TOTAL_NFT_LEVEL_UP_COUNT: number
    USER_SEQ: number
}
