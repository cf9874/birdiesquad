import dayjs from "dayjs"
import { _proStat, _season, _userStat } from "dummy"
import { ObjectUtil } from "utils"
export namespace Profile {
    export interface Dao {
        SEQ_NO: number
        REG_AT: number
        UDT_AT: number
        ICON_TYPE: number
        ICON_NAME: string
        NICK: string
        //HELLO: string
        HELLO?: string
        USER_SEQ?: number
        TEAM?: string
        BIRTH?: string
        PLAYER_CODE?: number
        BLAME: number
        BLAME_END_AT: dayjs.Dayjs
    }
    export interface Dto {
        seq: number
        nickname: string
        greet?: string
        date: {
            reg: dayjs.Dayjs
            udt: dayjs.Dayjs
        }
        icon: {
            type: number
            name: string
        }
        team?: string
        birth?: string
        playerCode?: number
        proStat?: Array<{ title: string; value: string | number }>
        userStat?: Array<{ title: string; value: string | number }>
        season?: Array<{ title: string; value: string | number }>
    }

    export const toDto = (dao: Dao): Dto => {
        const res = {
            seq: dao?.SEQ_NO,
            nickname: dao?.NICK,
            greet: dao?.HELLO,
            date: {
                reg: dayjs(dao.REG_AT),
                udt: dayjs(dao.UDT_AT),
            },
            icon: {
                type: dao?.ICON_TYPE,
                name: dao?.ICON_NAME,
            },
            team: dao?.TEAM,
            birth: dao?.BIRTH,
            playerCode: dao?.PLAYER_CODE,
            proStat: _proStat,
            userStat: _userStat,
            season: _season,
        }

        ObjectUtil.removeTrash(res)

        return res
    }
}

export namespace Asset {
    export interface Dao {
        TRAINING?: number
        BDST?: number
        TBORA?: number
    }
    export interface Dto {
        training?: number
        bdst?: number
        tbora?: number
    }
    export const toDto = (dao: Dao): Dto => {
        const res = {
            training: dao.TRAINING,
            bdst: dao.BDST,
            tbora: dao.TBORA,
        }
        ObjectUtil.removeTrash(res)

        return res
    }
}
export namespace UP {
    export interface Dao {
        SEASON_CODE: number
        SEASON_UP: number
        UP_SEQ: number
        TOTAL_UP: number
        USER_SEQ: number
    }
    export interface Dto {
        count: number
        isUp?: boolean
    }

    export const toDto = (dao: Dao): Dto => {
        dao.UP_SEQ
        const res: Dto = {
            count: dao.SEASON_UP,
        }
        if (dao.UP_SEQ === 0) res["isUp"] = false
        else if (dao.UP_SEQ === dao.USER_SEQ) res["isUp"] = true
        else res["isUp"] = false

        return res
    }
}

export namespace PageMeta {
    export interface ReqDto {
        order?: string
        page?: number
        take?: number
        filter?: boolean
        filterType?: string
    }

    export interface ResDao {
        page: number
        take: number
        itemCount: number
        pageCount: number
        hasPreviousPage: boolean
        hasNextPage: boolean
    }
    export interface ResDto {
        current: number
        count: number
        hasPrev: boolean
        hasNext: boolean
    }

    export const toResDto = (dao: ResDao): ResDto => {
        return {
            current: dao.page,
            count: dao.itemCount,
            hasPrev: dao.hasPreviousPage,
            hasNext: dao.hasNextPage,
        }
    }
    export const toReqDao = ({ order = "ASC", page = 1, take = 10, filterType }: ReqDto = {}): string => {
        return `order=${order}&page=${page}&take=${take}${filterType ? "&filterType=" + filterType : ""}`
    }
}

export namespace Nft {
    export interface Dao {
        NAME?: string
        GRADE?: number
        LEVEL: number
        TRAINING: number
        TRAINING_MAX: number
        ENERGY?: number
        EAGLE: number
        BIRDIE: number
        PAR: number
        BOGEY: number
        DOUBLE_BOGEY: number
        EARN_AMOUNT: number //
        PLAYER_CODE?: number
        SEASON_CODE?: number
        NEW?: number
        PROFILE?: number
        IS_LOCKED?: number
        NFT_PUBLISH_STATUS?: string
        USER_SEQ?: number
        NFT_SERIAL?: string
        SEQ_NO: number
        REG_AT?: string
        UDT_AT?: string
        WALLET_GRADE?: number
        WALLET_LEVEL?: number
        DELETE_ITEMS?: number[]
        IS_EQUIPPED: number
    }
    export interface Dto {
        seq: number
        playerCode?: number
        seasonCode?: number
        owner_seq?: number
        serial?: string
        regDate?: dayjs.Dayjs
        grade?: number
        level: number
        training: number
        energy?: number
        trainingMax: number
        golf: {
            eagle: number
            birdie: number
            par: number
            bogey: number
            doubleBogey: number
        }
        maxReward: number
        wallet?: {
            grade: number
            level: number
        }
        isNew: boolean
        isEquipped: number
    }

    export const toDto = (dao: Dao): Dto => {
        const res = {
            seq: dao.SEQ_NO,
            playerCode: dao.PLAYER_CODE,
            seasonCode: dao.SEASON_CODE,
            owner_seq: dao.USER_SEQ,
            serial: dao.NFT_SERIAL,
            regDate: dao.REG_AT ? dayjs(dao.REG_AT) : undefined,
            grade: dao.GRADE,
            level: dao.LEVEL,
            training: dao.TRAINING,
            trainingMax: dao.TRAINING_MAX,
            energy: dao.ENERGY,
            golf: {
                eagle: dao.EAGLE,
                birdie: dao.BIRDIE,
                par: dao.PAR,
                bogey: dao.BOGEY,
                doubleBogey: dao.DOUBLE_BOGEY,
            },
            maxReward: dao.EARN_AMOUNT,
            wallet:
                dao.WALLET_GRADE && dao.WALLET_LEVEL
                    ? {
                          grade: dao.WALLET_GRADE,
                          level: dao.WALLET_LEVEL,
                      }
                    : undefined,
            isNew: Boolean(dao.NEW),
            isEquipped: dao.IS_EQUIPPED,
        }
        ObjectUtil.removeTrash(res)
        return res
    }
}

export namespace Item {
    export interface Dao {
        SEQ_NO: number
        REG_AT: number
        ITEM_ID: number
        ITEM_COUNT: number
        PLAYER_CODE: number
        SEASON_CODE: number
        USER_SEQ: number
    }
    export interface Dto {
        seq: number
        regDate: dayjs.Dayjs
        id: number
        count: number
        playerCode: number
        seasonCode: number
        userSeq: number
    }

    export const toDto = (dao: Dao): Dto => {
        return {
            seq: dao.SEQ_NO,
            playerCode: dao.PLAYER_CODE,
            seasonCode: dao.SEASON_CODE,
            userSeq: dao.USER_SEQ,
            id: dao.ITEM_ID,
            count: dao.ITEM_COUNT,
            regDate: dayjs(dao.REG_AT),
        }
    }
}
