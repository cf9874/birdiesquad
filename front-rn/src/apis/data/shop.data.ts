export interface IShopChoice {
    SHOP_CODE: number
    PLAYER_CODE?: number
}
export interface IShopVerify {
    BILL_SEQ: number
}

export interface BILL_BEGIN {
    SEQ_NO: number
    SHOP_CODE: number
    BILL_UUID: string
    BILL_STEP: number
    BILL_RESULT: number
    USER_SEQ: number
}
export interface IPurchaseCancel {
    BILL_CANCEL: {
        SEQ_NO: number
        BILL_STEP: number
        USER_SEQ: number
    }
}

export interface IPurchaseEnd {
    BILL_END: {
        SEQ_NO: number
        SHOP_CODE: number
        BILL_STEP: number
        BILL_RESULT: number
        USER_SEQ: number
    }
    BILL_ITEMS: {
        SEQ_NO: number
        REG_AT: string
        ITEM_ID: number
        ITEM_COUNT: number
        PLAYER_CODE: number
        SEASON_CODE: number
        USER_SEQ: number
    }[]
}

export class BillError extends Error {
    public billSeq: number

    constructor(message: string, billSeq: number) {
        super(message)
        this.billSeq = billSeq
        // If your environment supports or requires it:
    }
}
