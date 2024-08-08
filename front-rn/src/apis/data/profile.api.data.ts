import { Profile, UP, Asset } from "./common.data"
import { IconType } from "const"
import { ObjectUtil } from "utils"
import nftPlayer from "json/nft_player.json"
import dayjs from "dayjs"
export namespace ProfileApiData {
    export namespace Info {
        export interface ResDao {
            USER_SEQ?: number
            PLAYER_CODE?: number
            PROFILE: Profile.Dao
            UP: UP.Dao
        }

        export interface ResDto {
            userSeq?: number
            proCode?: number
            profile: Profile.Dto
            up: UP.Dto

            blameType: number
            blameEndAt: dayjs.Dayjs
        }

        export const toResDto = (dao: ResDao): ResDto => {
            const res: ResDto = {
                profile: Profile.toDto(dao.PROFILE),
                up: UP.toDto(dao.UP),
                blameType: dao.PROFILE.BLAME,
                blameEndAt: dao.PROFILE.BLAME_END_AT,
            }
            res["userSeq"] = dao?.USER_SEQ
            res["proCode"] = dao?.PLAYER_CODE

            if (dao?.PLAYER_CODE) {
                const data = nftPlayer.find(v => v.nPersonID === dao.PLAYER_CODE)
                res.profile.icon.name = data?.sPlayerImagePath ?? ""
                res.profile.nickname = data?.sPlayerName ?? ""
                res.profile.team = data?.sTeam ?? ""
                res.profile.birth = data?.sBirth ?? ""
            }

            return res
        }
    }

    export namespace MyAsset {
        export interface ResDao {
            USER_SEQ: number
            ASSET: Asset.Dao
        }

        export interface ResDto {
            userSeq: number
            asset: Asset.Dto
        }
        export const toResDto = (dao: ResDao): ResDto => {
            return {
                userSeq: dao.USER_SEQ,
                asset: Asset.toDto(dao.ASSET),
            }
        }
    }

    export namespace Edit {
        export interface ReqDao {
            NICK?: string
            HELLO?: string
            ICON_TYPE?: IconType
            ICON_NAME?: string
        }
        export interface ReqDto {
            nickname?: string
            greet?: string
            icon?: {
                type: IconType
                name: string
            }
        }

        export interface ResDao {
            USER_SEQ: number
            PROFILE: Profile.Dao
        }
        export interface ResDto {
            userSeq: number
            profile: Profile.Dto
        }
        export const toResDto = (dao: ResDao): ResDto => {
            return {
                userSeq: dao.USER_SEQ,
                profile: Profile.toDto(dao.PROFILE),
            }
        }
        export const toReqDao = (dto: ReqDto): FormData => {
            const data: ReqDao = {}

            if (dto.nickname) data["NICK"] = dto.nickname
            if (dto.greet) data["HELLO"] = dto.greet
            if (dto.icon?.name && dto.icon?.type) {
                data["ICON_TYPE"] = dto.icon.type
                data["ICON_NAME"] = dto.icon.name
            }

            const formData = ObjectUtil.setFormData(data)

            return formData
        }
        export namespace CheckNick {
            export interface ResDao {
                exist: boolean
            }
            export interface ResDto {
                exist?: boolean
            }
            export const toResDto = (dao: ResDao): ResDto => {
                return dao
            }
        }
    }
    export namespace SeasonUp {
        export interface ReqDao {
            PLAYER_CODE?: number
            USER_SEQ?: number
        }
        export interface ReqDto {
            userSeq?: number
            proCode?: number
        }

        export interface ResDao {
            PLAYER_CODE?: number
            USER_SEQ?: number
            UP: UP.Dao
        }
        export interface ResDto {
            userSeq?: number
            proCode?: number
            up: UP.Dto
        }
        export const toResDto = (dao: ResDao): ResDto => {
            const res: ResDto = {
                up: UP.toDto(dao.UP),
            }

            if (dao?.USER_SEQ) res["userSeq"] = dao?.USER_SEQ
            if (dao?.PLAYER_CODE) res["proCode"] = dao?.PLAYER_CODE

            return res
        }
        export const toReqDao = (dto: ReqDto): ReqDao => {
            const req: ReqDao = {}

            if (dto?.userSeq) req["USER_SEQ"] = dto.userSeq
            if (dto?.proCode) req["PLAYER_CODE"] = dto.proCode

            return req
        }
    }
    export namespace Blame {
        export interface ReqDao {
            BLAMED_USER_SEQ: number
        }
        export interface ResDao {
            SEQ_NO: number
            REG_AT: number
            UDT_AT: number
            BLAME_USER_SEQ: number
            BLAME_COUNT: number
            USER_SEQ: number
        }
        export interface ResDto {
            blameUserSeq: number
            userSeq: number
            blameCount: number
        }
        export interface ReqDto {
            userSeq: number
        }
        export const toResDto = (dao: ResDao): ResDto => {
            const res: ResDto = {
                blameUserSeq: dao.BLAME_USER_SEQ,
                userSeq: dao.USER_SEQ,
                blameCount: dao.BLAME_COUNT,
            }
            return res
        }
        export const toReqDao = (dao: ReqDto): ReqDao => {
            const req: ReqDao = {
                BLAMED_USER_SEQ: dao.userSeq,
            }
            return req
        }
    }
    export namespace BlameCheck {
        export interface ReqDao {
            BLAMED_USER_SEQ: number
        }
        export interface ResDao {
            BLAMES: {
                SEQ_NO: number
                REG_AT: number
                UDT_AT: number
                BLAME_USER_SEQ: number
                BLAME_COUNT: number
                USER_SEQ: number
            }[]
        }
        export interface ResDto {
            blameUserSeq: number
            userSeq: number
            blameCount: number
        }

        export interface ReqDto {
            userSeq: number
        }
        export const toResDto = (dao: ResDao): ResDto[] => {
            const res = dao.BLAMES.map(e => {
                return {
                    blameUserSeq: e.BLAME_USER_SEQ,
                    userSeq: e.USER_SEQ,
                    blameCount: e.BLAME_COUNT,
                }
            })
            return res
        }
        export const toReqDao = (dao: ReqDto): ReqDao => {
            const req: ReqDao = {
                BLAMED_USER_SEQ: dao.userSeq,
            }
            return req
        }
    }
}
