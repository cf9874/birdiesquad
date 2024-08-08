// GET
// /api/v1/profile/check-nick
// [닉네임 중복 체크]

// GET
// /api/v1/profile/my/profile
// [나의 프로필] - 나의 간략 프로필 정보
export interface IMyProfile {
    REG_AT: string
    ICON_TYPE: number
    ICON_NAME: string
    NICK: string
    NICK_SANCTION_AT: string
    HELLO: string
    HELLO_SANCTION_AT: string
    BLAME: number
    BLAME_END_AT: string
    USER_SEQ: number
}

export interface ISetting {
    isLiveHeart: boolean
    isLiveStartPush: boolean
    isTourRewardPush: boolean
    isRaffleOpenPush: boolean
    isRaffleResultPush: boolean
    isUpPush: boolean
    isInquiryPush: boolean
}

// GET
// /api/v1/profile/my/up-count
// [나의 프로필] - 나의 주간 UP 정보

//IUserProfileUP

// GET
// /api/v1/profile/my/record
// [나의 프로필] - 나의 기록/통계 정보
//IUserProfileRecord

// GET
// /api/v1/profile/my/detail
// [나의 프로필] - 나의 모든 프로필 정보
export interface IMyProfileDetail {
    PROFILE_USER: IMyProfile
    PROFILE_UP: IUserProfileUP
    PROFILE_RECORD: IUserProfileRecord
}
// POST
// /api/v1/profile/my/edit-profile
// [나의 프로필 변경] - 수정

//req
// {
//   "NICK": "string",
//   "HELLO": "string",
//   "ICON_TYPE": 0,
//   "NFT_SEQ": 0
// }
export interface IMyProfileEdit {
    USER_PROFILE: {
        ICON_TYPE: number
        ICON_NAME: string
        NICK: string
        HELLO: string
        USER_SEQ: number
    }
    USER_NFTS: {
        SEQ_NO: number
        PROFILE: number
        USER_SEQ: number
    }[]
}

// GET
// /api/v1/profile/user/profile
// [팬 프로필] - 간략 프로필 정보
//IMyProfile

// GET
// /api/v1/profile/user/up-count
// [팬 프로필] - 주간 UP 정보
//IUserProfileUP

// POST
// /api/v1/profile/user/up-count
// [팬 주간 UP]

//req
// {
//   "USER_SEQ": 0
// }
//IUserProfileUP

// GET
// /api/v1/profile/user/record
// [팬 프로필] - 유저 기록/통계 정보
//IUserProfileRecord

// GET
// /api/v1/profile/user/detail
// [팬 프로필] - 유저 모든 프로필 정보
export interface IPanProfile {
    PROFILE_USER: IMyProfile
    PROFILE_UP: IUserProfileUP
    PROFILE_RECORD: IUserProfileRecord
}
// GET
// /api/v1/profile/player/profile
// [프로 프로필] - 간략 프로필 정보

// 아직 스키마 안나옴

// GET
// /api/v1/profile/player/up-count
// [프로 프로필] - 시즌 UP 정보
//IProProfileUP

// POST
// /api/v1/profile/player/up_count
// [프로 시즌 UP]

//req
// {
//   "PLAYER_CODE": 0
// }
export interface IProUpStats {
    SEASON_CODE: number
    SEASON_UP: number
    UP_SEQ: number
    TOTAL_UP: number
    PLAYER_CODE: number
}

// GET
// /api/v1/profile/player/record
// [프로 프로필] - 프로 기록/통계 정보
//IProProfileRecord

// GET
// /api/v1/profile/player/season
// [프로 프로필] - 프로 기록/시즌 정보
export interface IProSeason {
    seasonKey: string
    personId: number
    nameKo: string
    birthDate: string
    rank: number
    earnings: string
    strokeAvg: string
    drivingDist: string
    drivingAcc: string
    greensInReg: string
    puttAvg: string
    PLAYER_CODE: number
}
// GET
// /api/v1/profile/player/detail
// [프로 프로필] - 프로 모든 프로필 정보
import nftPlayer from "json/nft_player.json"
export interface IProDetail {
    PLAYER_CODE: number
    PROFILE_PLAYER?: typeof nftPlayer[number]
    PROFILE_UP: IProProfileUP
    PROFILE_RECORD: IProProfileRecord
    PROFILE_SEASON: IProSeason
}
// POST
// /api/v1/profile/do-blame
// [프로필 신고]
//req
// {
//   "USER_SEQ": 0
// }

export interface IProfileBlame {
    WANTED_SEQ: number
    BLAME_COUNT: number
    UDT_AT: string
    USER_SEQ: number
}

// GET
// /api/v1/profile/blame-history
export interface IProfileBlameHistory {
    BLAME_HISTORY: {
        WANTED_SEQ: number
        BLAME_COUNT: number
        UDT_AT: string
        USER_SEQ: number
    }[]
}

export interface IProfileUp {
    WEEK_CODE: number
    WEEK_UP_COUNT: number
    TOTAL_UP_COUNT: number
    TOGGLE: 0 | 1
}
export interface IUserProfileUP extends IProfileUp {
    USER_SEQ: number
}
export interface IProProfileUP extends IProfileUp {
    PLAYER_CODE: number
}

export interface IProProfileRecord {
    TOTAL_CASH_AMOUNT: number
    CHEER_FAN_COUNT: number
    TOP_BLOOD_FAN: string
    CURRENT_RANK_CASH_AMOUNT: number
    CURRENT_RANK_CASH_COUNT: number
    CURRENT_RANK_HEART_COUNT: number
    CURRENT_RANK_UP_COUNT: number
    TOTAL_NFT_SELL_COUNT: number
    TOP_NFT_PRICE: number
    PLAYER_CODE: number
}
export interface IUserProfileRecord {
    TOTAL_CASH_AMOUNT: number
    TOTAL_NFT_COUNT: number
    NFT_GRADE_TOP: number
    PREV_BDST_AMOUNT: number
    PREV_TRAINING_AMOUNT: number
    TOTAL_CASH_COUNT: number
    TOTAL_HEART_COUNT: number
    TOTAL_NFT_GRADE_UP_COUNT: number
    TOTAL_NFT_LEVEL_UP_COUNT: number
    USER_SEQ: number
    TOP_BLOOD_PLAYER_CODE: number
}
