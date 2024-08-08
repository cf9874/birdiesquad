import { liveSvc } from "apis/services/live.svc"
import { useScreen } from "./useScreen"
import { useEffect, useState } from "react"
import { ISeasonDetail } from "apis/data/season.data"
import { useToggle } from "hooks"
import { GameStatus } from "const"

export const useGame = (
    params: {
        gameId: number
        gameStatus: GameStatus,
        liveGameId: number
    },
    reloadTime = 1000 * 60 * 5
) => {
    const [gameData, setGameData] = useState<ISeasonDetail | undefined>()
    let intervalId: NodeJS.Timeout

    const [isEnd, , setIsEnd] = useToggle()

    const getData = async () => {
        let data = await liveSvc.getGameDetail(params.gameId)
        if (params.gameStatus === GameStatus.LIVE) data.gameStatus = GameStatus.LIVE
        setGameData(data)
    }

    useEffect(() => {
        if (gameData && gameData.gameStatus === GameStatus.END) {
            setIsEnd(true)
        }
        // setIsEnd(true)
    }, [gameData, setIsEnd])

    useScreen(() => {
        getData()

        intervalId = setInterval(getData, reloadTime)

        return () => clearInterval(intervalId)
    }, [])

    const liveGameId = params.liveGameId

    return {
        gameData,
        isEnd,
        liveGameId,
        setIsEnd,
    }
}
