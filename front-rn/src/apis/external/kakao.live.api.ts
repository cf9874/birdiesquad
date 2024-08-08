import axios from "axios"
import { IVod } from "../../screens/live/tab.live"
export class KakaoLiveApi {
    async getLinkData(gameId: number) {
        try {
            const {
                data: { result },
            } = await axios.get<{
                cacheTime: string
                result: {
                    contents: Array<{
                        _id: number
                        clusterFactor: { commonKey: number }
                        displayTitle: string
                        hasNext: boolean
                        subContent: IVod[]
                    }>
                    hasNext: boolean
                }
            }>(`https://dapi.kakao.com/golf-video/v1/query.json?commonKey=${gameId}`, {
                headers: {
                    Authorization: "KakaoAK e5d6a2766af27a98bc98f27f00580ce6",
                },
            })

            return result
        } catch (err) {
            console.error(err)
        }
    }
}
