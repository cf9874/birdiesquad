import dayjs from "dayjs"
import { PageMeta } from "./common.data"
export namespace LiveApiData {
    export namespace SetSeason {
        export interface ResDao {
            data: string
        }
        export interface ResDto {
            data: string
        }
    }
    export namespace GameList {
        export interface ReqDto {
            key: string
        }
        export interface ResDao {
            GAMEID: number
        }
    }
}
