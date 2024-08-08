import { useEffect, useCallback, useState } from "react"
import { useScreen } from "./useScreen"

interface IParams {
    begin?: number
    interval?: number
}

//단위는 sec
export const useTimer = ({ begin = 60, interval = 1 }: IParams = {}) => {
    const [time, setTime] = useState(begin)

    useScreen(() => {
        const countdown = setInterval(() => {
            if (!time || time <= 0) clearInterval(countdown)
            else setTime(time => time - interval)
        }, interval )
        return () => clearInterval(countdown)
    }, [time])

    const onReset = useCallback(() => setTime(begin), [time])

    return [time, onReset, setTime] as const
}
