export const enum ResultSendMessage {
    Success,
    TrashChat, // 도배했을 때
    PreventTrashChat, // 도배 이후 입력 막혔을 때
}

export const enum CHAT_TYPE {
    SYSTEM = 0,
    SAY = 1,
    SPONSOR = 2,
}

export const enum CHAT_POLICE_TYPE {
    UNKNOWN = 0,
    SPAM = 1,
    SEXUAL = 2,
    INSULT = 3,
    EXPOSURE = 4,
}
