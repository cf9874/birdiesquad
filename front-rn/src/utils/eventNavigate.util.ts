import { liveSvc, profileSvc } from "apis/services"
import { Screen } from "const"
import { GameStatus } from "const/live.const"
import { navigate, navigateReset } from "./navigate.util"
import { REMOTE_EVENT_TYPE } from "const/remote.event.const"

export const EventNavigate = {
    parslink: (url: string) => {
        const include = url.includes("EVENT_TYPE")
        if (!include) return null

        const params = url.split(/([&,?,=])/)
        const index = params.indexOf("EVENT_TYPE")
        const value = params[index + 2]
        return parseInt(value)
    },
    navigateNormal: async (event_type: REMOTE_EVENT_TYPE) => {
        switch (event_type) {
            case 1:
                const seasen = await liveSvc.getSetSeason()
                const response = await liveSvc.getGameList(seasen)
                const liveGame = response.find(game => game.gameStatus === GameStatus.PLAY)
                if (!liveGame) return
                // LIVE
                navigate(Screen.LIVE, {
                    gameId: liveGame.GAME_CODE,
                    gameStatus: liveGame.gameStatus,
                    liveLink: "",
                })
                break
            case 3:
                navigate(Screen.RAFFLETABSCENE, { tabIndex: 0 }) // Raffle
                break
            case 4:
                navigate(Screen.RAFFLETABSCENE, { tabIndex: 1 }) // Raffle
                break
            case 5:
                const user = await profileSvc.getMyProfile()
                navigate(Screen.USERPROFILE, { userSeq: user.USER_SEQ }) // User Profile
                break
            case 6:
                navigate(Screen.SETINQUIRY, { tabIndex: 1 }) // My Inquiry

                break
            case 101:
                const seasenSquad = await liveSvc.getSetSeason()
                const responseSquad = await liveSvc.getGameList(seasenSquad)
                const liveGameSquad = responseSquad.find(game => game.gameStatus === GameStatus.PLAY)
                if (!liveGameSquad) return
                navigate(Screen.MYSQUAD, {
                    gameSeq: liveGameSquad.GAME_CODE,
                    gameRound: liveGameSquad.roundSeq,
                }) //My Squad
                break
            case 103:
                navigate(Screen.NFTTABSCENE) // Market
                break
            case 104:
                navigate(Screen.RANK, { index: 0 }) // RANK
                break
            default:
        }
    },
    navigateQuit: async (event_type: REMOTE_EVENT_TYPE) => {
        switch (event_type) {
            case 1:
                const seasen = await liveSvc.getSetSeason()
                const response = await liveSvc.getGameList(seasen)
                const liveGame = response.find(game => game.gameStatus === GameStatus.PLAY)
                if (!liveGame) return
                // LIVE
                navigateReset(Screen.LIVE, {
                    gameId: liveGame.GAME_CODE,
                    gameStatus: liveGame.gameStatus,
                    liveLink: "",
                    toNavigate: Screen.NFTLIST,
                })
                break
            case 3:
                navigateReset(Screen.RAFFLETABSCENE, { tabIndex: 0, toNavigate: Screen.NFTLIST }) // Raffle
                break
            case 4:
                navigateReset(Screen.RAFFLETABSCENE, { tabIndex: 1, toNavigate: Screen.NFTLIST }) // Raffle
                break
            case 5:
                const user = await profileSvc.getMyProfile()
                navigateReset(Screen.USERPROFILE, { userSeq: user.USER_SEQ, toNavigate: Screen.NFTLIST }) // User Profile
                break
            case 6:
                navigateReset(Screen.SETINQUIRY, { tabIndex: 1, toNavigate: Screen.NFTLIST }) // My Inquiry

                break
            case 101:
                const seasenSquad = await liveSvc.getSetSeason()
                const responseSquad = await liveSvc.getGameList(seasenSquad)
                const liveGameSquad = responseSquad.find(game => game.gameStatus === GameStatus.PLAY)
                if (!liveGameSquad) return
                navigateReset(Screen.MYSQUAD, {
                    gameSeq: liveGameSquad.GAME_CODE,
                    gameRound: liveGameSquad.roundSeq,
                    toNavigate: Screen.NFTLIST,
                }) //My Squad
                break
            case 103:
                navigateReset(Screen.NFTTABSCENE, { toNavigate: Screen.NFTLIST }) // Market
                break
            case 104:
                navigateReset(Screen.RANK, { index: 0, toNavigate: Screen.NFTLIST }) // RANK
                break
            default:
        }
    },
}
