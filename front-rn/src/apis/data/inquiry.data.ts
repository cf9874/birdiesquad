export interface AnswerInquiry {
    SEQ_NO: number
    CONTENT: string
    ANSWER_AT: string
    VX_ID: string
}

export interface MyListInquiry {
    SEQ_NO: number
    INQUIRY_TYPE: number
    TITLE: string
    CONTENT: string
    ATTACHED_FILE: string
    INQUIRE_AT: string
    STATUS: number
    answers: AnswerInquiry[]
}
