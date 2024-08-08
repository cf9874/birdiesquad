import { useCallback, useState, Dispatch, SetStateAction } from "react"

export const useToggle = (flag: boolean = false) => {
    const [state, setState] = useState(flag)

    const toggle = useCallback(() => setState(s => !s), [])

    return [state, toggle, setState] as const
}
