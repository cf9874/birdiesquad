import { ISeasonDetail } from "apis/data/season.data"
import { GameStatus } from "const"
import { PeriodType, RoundType } from "const/live.const"

export const GameUtil = {
    checkRound: (gameData?: ISeasonDetail) => {
        const { periodType, gameStatus, roundSeq } = gameData ?? {}

        const currentRound = periodType==PeriodType.SUSPENDED?roundSeq:RoundType[periodType as PeriodType]

        let prevRound: number | undefined = 0
        let finalRound = gameData?.roundSeq

        if (currentRound === null || currentRound === 0 || currentRound === undefined) {
            prevRound = 0
        } else if (currentRound === 99) {
            prevRound = finalRound
        } else {
            prevRound = currentRound - 1
        }

        const round = {
            current: currentRound,
            prev: prevRound,
            isEnd:
                gameStatus === GameStatus.CONTINUE ||
                gameStatus === GameStatus.END 
        }

        return { data: { round } }
    },
}
