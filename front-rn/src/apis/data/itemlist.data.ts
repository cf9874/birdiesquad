import dayjs from "dayjs"
import { PageMeta } from "./common.data"

export namespace ItemApiData {
    export namespace ItemList {
        export interface ReqDto extends PageMeta.ReqDto {}

        export interface ResDao {
            data: {
                SEQ_NO: number
                REG_AT: number
                USER_SEQ: number
                ITEM_ID: number
            }[]
            meta: PageMeta.ResDao
        }
        export interface ResDto {
            data: {
                seq: number
                regDate: dayjs.Dayjs
                userSeq: number
                itemId: number
                sIcon?:string
            }[]
            meta: PageMeta.ResDto
        }
        export const toResDto = (dao: ResDao): ResDto => {
            return {
                data: dao.data.map(nft => ({
                    seq: nft.SEQ_NO,
                    regDate: dayjs(nft.REG_AT),
                    userSeq: nft.USER_SEQ,
                    itemId: nft.ITEM_ID,
                })),
                meta: PageMeta.toResDto(dao.meta),
            }
        }
    }
}
