import dayjs from "dayjs"
import { Item, Nft, PageMeta } from "./common.data"
import NftPlayer from "json/nft_player.json"
import { Image } from "react-native"
import { myPageImg } from "assets/images"
import { ConfigUtil } from "utils"
export namespace NftApiData {
    export namespace NftList {
        export interface ReqDto extends PageMeta.ReqDto {
            seq: number
        }

        export interface ResDao {
            data: {
                BOGEY: number
                DOUBLE_BOGEY: number
                EAGLE: number
                EARN_AMOUNT: number
                ENERGY: number
                GRADE: number
                LEVEL: number
                NAME: string
                NEW: number
                NFT_SERIAL: string
                PAR: number
                PLAYER_CODE: number
                REG_AT: number
                IS_LOCKED: number
                IS_EQUIPPED: number
                SEASON_CODE: number
                SEQ_NO: number
                TRAINING: number
                TRAINING_MAX: number
                USER_SEQ: number
                WALLET_GRADE: number
                WALLET_LEVEL: number
                BIRDIE: number
            }[]
            meta: PageMeta.ResDao
        }
        export interface ResDto {
            data: NftData[]
            meta: PageMeta.ResDto
        }

        export const toResDto = (dao: ResDao): ResDto => {
            const data = dao.data.map(nft => {
                const jsonData = NftPlayer.find(v => v.nPersonID === nft.PLAYER_CODE)
                return {
                    seq: nft.SEQ_NO,
                    regDate: dayjs(nft.REG_AT),
                    userSeq: nft.USER_SEQ,
                    seiral: nft.NFT_SERIAL,
                    level: nft.LEVEL,
                    energy: nft.ENERGY,
                    season: nft.SEASON_CODE,
                    training: nft.TRAINING,
                    trainingMax: nft.TRAINING_MAX,
                    is_locked: nft.IS_LOCKED,
                    is_equipped: nft.IS_EQUIPPED,
                    grade: nft.GRADE,
                    isNew: Boolean(nft.NEW),
                    name: nft.NAME,
                    amount: nft.EARN_AMOUNT,
                    playerCode: nft.PLAYER_CODE,
                    golf: {
                        birdie: nft.BIRDIE,
                        par: nft.PAR,
                        bogey: nft.BOGEY,
                        doubleBogey: nft.DOUBLE_BOGEY,
                        eagle: nft.EAGLE,
                    },
                    birdie: nft.BIRDIE,
                    wallet: {
                        grade: nft.WALLET_GRADE,
                        level: nft.WALLET_LEVEL,
                    },
                    json: jsonData,
                    imgUri: ConfigUtil.getPlayerImage(jsonData?.sPlayerImagePath) ?? "",
                }
            })
            return {
                data: data,
                meta: PageMeta.toResDto(dao.meta),
            }
        }
    }

    export namespace Open {
        export interface ResDao {
            NFT: Nft.Dao
            DELETE_ITEMS: number[]
            // ITEM: Item.Dao
        }
        export interface ResDto {
            nft: Nft.Dto
            // item: Item.Dto
            usedItems: number[]
        }

        export const toResDto = (dao: ResDao): ResDto => {
            return {
                nft: Nft.toDto(dao.NFT),
                // item: Item.toDto(dao.ITEM),
                usedItems: dao.DELETE_ITEMS,
            }
        }
        export const toReqDao = (seq: number) => {
            return {
                ITEM_SEQ: seq,
            }
        }
    }

    export namespace ChargeEnergy {
        export interface ReqDto {
            seq: number
            amount: number
        }
        export interface ReqDao {
            NFT_SEQ: number
            GAUGE: number
        }
        export interface ResDao {
            USER_NFT: {
                SEQ_NO: number
                TRAINING: number
                USER_SEQ: number
            }
            USER_ASSET: {
                BDST: number
                USER_SEQ: number
            }
        }
        export interface ResDto {
            asset: {
                bdst: number
                userSeq: number
            }
            nft: {
                seq: number
                gauge: number
                userSeq: number
            }
        }
        export const toResDto = (dao: ResDao): ResDto => {
            return {
                asset: {
                    bdst: dao.USER_ASSET.BDST,
                    userSeq: dao.USER_ASSET.USER_SEQ,
                },
                nft: {
                    seq: dao.USER_NFT.SEQ_NO,
                    gauge: dao.USER_NFT.TRAINING,
                    userSeq: dao.USER_NFT.USER_SEQ,
                },
            }
        }
        export const toReqDao = (dto: ReqDto): ReqDao => {
            return {
                NFT_SEQ: Number(dto.seq),
                GAUGE: Number(dto.amount),
            }
        }
    }
    export namespace ChargeAllEnergy {
        export interface ReqDao {
            CHARGE_NFTS: number[]
        }
        export interface ResDao {
            USER_NFTS: {
                SEQ_NO: number
                ENERGY: number
                USER_SEQ: number
            }[]
            USER_ASSET: {
                BDST: number
                USER_SEQ: number
            }
        }
        export interface ResDto {
            asset: {
                bdst: number
                userSeq: number
            }
            nft: {
                seq: number
                gauge: number
                userSeq: number
            }[]
        }
        export const toResDto = (dao: ResDao): ResDto => {
            const nft = dao.USER_NFTS.map(v => {
                return {
                    seq: v.SEQ_NO,
                    gauge: v.ENERGY,
                    userSeq: v.USER_SEQ,
                }
            })
            return {
                asset: {
                    bdst: dao.USER_ASSET.BDST,
                    userSeq: dao.USER_ASSET.USER_SEQ,
                },
                nft,
            }
        }
        export const toReqDao = (dto: number[]): ReqDao => {
            return {
                CHARGE_NFTS: dto,
            }
        }
    }
    export namespace ChargeTraning {
        export interface ReqDto {
            seq: number
            amount: number
        }
        export interface ReqDao {
            NFT_SEQ: number
            GAUGE: number
        }

        export interface ResDao {
            USER_ASSET: {
                TRAINING: number
                USER_SEQ: number
            }
            USER_NFT: {
                SEQ_NO: number
                TRAINING: number
                USER_SEQ: number
            }
        }
        export interface ResDto {
            asset: {
                training: number
                userSeq: number
            }
            nft: {
                seq: number
                gauge: number
                userSeq: number
            }
        }

        export const toResDto = (dao: ResDao): ResDto => {
            return {
                asset: {
                    training: dao.USER_ASSET.TRAINING,
                    userSeq: dao.USER_ASSET.USER_SEQ,
                },
                nft: {
                    seq: dao.USER_NFT.SEQ_NO,
                    gauge: dao.USER_NFT.TRAINING,
                    userSeq: dao.USER_NFT.USER_SEQ,
                },
            }
        }
        export const toReqDao = (dto: ReqDto): ReqDao => {
            return {
                GAUGE: dto.amount,
                NFT_SEQ: dto.seq,
            }
        }
    }

    export namespace LevelUp {
        export interface ReqDao {
            NFT_SEQ: number
        }

        export interface ResDao {
            USER_ASSET: {
                BDST: number
                USER_SEQ: number
            }
            USER_NFT: {
                SEQ_NO: number
                GRADE: number
                LEVEL: number
                TRAINING: number
                TRAINING_MAX: number
                EAGLE: number
                BIRDIE: number
                PAR: number
                BOGEY: number
                DOUBLE_BOGEY: number
                EARN_AMOUNT: number
                USER_SEQ: number
                UDP_AT: string
            }
        }
        export interface ResDto {
            useSeq: number
            bdst: number
            nft: Nft.Dto
        }

        export const toResDto = (dao: ResDao): ResDto => {
            return {
                useSeq: dao.USER_ASSET.USER_SEQ,
                bdst: dao.USER_ASSET.BDST,
                nft: Nft.toDto(dao.USER_NFT),
            }
        }
        export const toReqDao = (seq: number): ReqDao => {
            return {
                NFT_SEQ: seq,
            }
        }
    }

    export interface IDoOpenChoice {
        ITEM_SEQ: number
        PLAYER_CODE?: number
    }
    export interface NftData {
        amount: number
        energy: number
        golf: {
            birdie: number
            bogey: number
            doubleBogey: number
            eagle: number
            par: number
        }
        birdie: number
        grade: number
        isNew: boolean
        level: number
        name: string
        playerCode: number
        regDate: dayjs.Dayjs
        season: number
        seiral: string
        seq: number
        training: number
        trainingMax: number
        userSeq: number
        is_locked: number
        is_equipped: number
        wallet: {
            grade: number
            level: number
        }
        imgUri: string
        json?: {
            nChoiceSalesAmount: number
            nID: number
            nPersonID: number
            nSeasonKey: number
            sBirth: string
            sDebut: string
            sPlayerFullImagePath: string
            sPlayerImagePath: string
            sPlayerName: string
            sPlayerthumbnailImagePath: string
            sPublishYear: string
            sTeam: string
        }
    }
}
