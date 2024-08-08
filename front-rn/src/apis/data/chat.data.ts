import { CHAT_POLICE_TYPE, CHAT_TYPE } from "const"
import { IPlayerRank } from "./rank.data"
import { GOLF_STAT } from "const/live.const"

export interface IJoinGame {
    code: string
}
export interface IJoinGameData<T> {
    data: T
}
export interface IChatBotEvent {
    SEQ_NO: number
    REG_AT: string
    HOLE_STAT: GOLF_STAT
    REWARD_TRAINING: number
    REWARD_BDST: number
    HOLE_CODE: number
    PLAYER_CODE: number
    ROUND_CODE: number
    GAME_CODE: number
}
export interface IChatRes {
    seq: number
    name: string
    contents: string
    date: string
    isDeclare: boolean
    cash: number
    icon?: { type: number; name: string }
    type: ChatType
    playerCode: number
    userSeq: number
}
export interface IBotMsg {
    seq: number
    contents: string
    statMsg: string
    statMsgColor: string
    type: ChatType.BOT
    date: string
    bdst: number
    training: number
    regAt: string
}

//"SEQ_NO": 100,
//"REG_AT": "2023-05-03 17:35:09",
//"HOLE_STAT": -1,
//"REWARD_TRAINING": 30,
//"REWARD_BDST": 0,
//"HOLE_CODE": 9,
//"PLAYER_CODE": 1639663,
//"ROUND_CODE": 2,
//"GAME_CODE": 80069412

export interface IChat {
    SEQ_NO: number
    CHAT_TYPE: number
    CHAT_MSG: string
    PLAYER_CODE: number
    SPONSOR_CASH: number
    GAME_CODE: number
    USER_SEQ: number
    USER_NICK: string
    ICON_TYPE: number
    ICON_NAME: string
    REPORT: number
    REG_AT: string
}

export interface ISendMsg extends IJoinGame {
    data: {
        CHAT: IChat
    }
}

export interface IChatBot extends IJoinGame {
    data: IChatBotEvent[]
}

export interface ISendCashMsg extends IJoinGame {
    data: {
        CHAT: IChat
        DELETE_ITEMS: number[]
    }
}

export interface IRepeatRes {
    contents: string
    seq: number
    type: ChatType.REPEAT
}

export interface IReport extends IJoinGame {
    data: {
        CHAT_REPORT: {
            SEQ_NO: number
            REPORT: number
        }
        USER_POLICE: {
            POLICE_TYPE: number
            POLICE_MSG: string
            USER_SEQ: number
        }
    }
}

export interface ISendHeart extends IJoinGame {
    data: {
        HEART: {
            SEQ_NO: number
            REG_AT: string
            PLAYER_CODE: number
            HEART: number
            BDST: number
            GAME_CODE: number
            USER_SEQ: number
            USER_NICK: string
            ICON_TYPE: number
            ICON_NAME: string
        }
        USER_ASSET: {
            BDST: number
            USER_SEQ: number
        }
    }
}

export const enum ChatType {
    MSG = "msg",
    CASH = "cash",
    REPORT = "report",
    BOT = "bot",
    REPEAT = "repeat",
}

export interface IPayLoadDonate {
    msg: string
    code: number
}
