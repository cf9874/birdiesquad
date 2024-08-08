export interface RaffleRule {
    USERS_LIMIT: number
    RANKING_LIMIT: number
    QUANTITY_LIMIT: number
}

export interface Raffle {
    SEQ_NO: number
    START_DT: string
    END_DT: string
    RAFFLE_NAME: string
    RAFFLE_ORDER: number
    RAFFLE_AMOUNT: number
    RAFFLE_AMOUNT_UNIT: string
    RAFFLE_AMOUNT_INCREASEMENT: number
    ICON_TYPE: string
    ICON_NAME: string
    LANDING_URL: string | null
    NUMBER_OF_DRAWS: number
    NUMBER_OF_APPLICATIONS: number
    RAFFLE_RULE: RaffleRule
    CHECK_MATCH_RULE: boolean
    STATUS: number
    STATUS_DT: string | null
    REG_AT: string
    UDT_AT: string
    IS_DELETED: number
    TOTAL_APPLIED: string
    IS_NOTIFICATION: number
    IS_TBORA_RAFFLE: number
    REG_BY: number
}
export interface RaffleList {
    data: Raffle[]
}
export interface RaffleListApply {
    RAFFLE_SEQ: number
    TOTAL_APPLIED: string
}
export interface RaffleListResultPopup {
    SEQ_NO: number
    START_DT: string
    END_DT: string
    IS_PUBLISHED: number
    POPUP_ORDER: number
    POPUP_MEMO: string
    POPUP_IMAGE: string
    POPUP_LINK: string
    RAFFLE_WINNER_PUSH: number
    STATUS: number
    STATUS_DT: string | null
    REG_AT: string
    UDT_AT: string
    REG_BY: string
}
