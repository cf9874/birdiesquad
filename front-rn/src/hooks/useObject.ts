import { useCallback, useState } from "react"

export const useObject = <T extends { [key: string]: any }>(initialObj: T) => {
    const [state, setState] = useState(initialObj)

    const onUpdate = (data: ((state: T) => T) | Partial<T>) => {
        const result = typeof data === "function" ? data(state) : data

        setState(state => ({
            ...state,
            ...result,
        }))
    }

    const onReset = useCallback(
        (state: T = initialObj) => {
            setState(state)
        },
        [state]
    )

    return [state, onUpdate, onReset] as const
}
// export const useObjState = <T , P =  T[keyof T]>(object: Iparams<T[keyof T]> = {}) => {
//   const [state, setState] = useState<Iparams<T[keyof T]>>(object)

//   const onUpdate = <F>(get: F) => {
//     const data: F extends (...args: any) => any ? ReturnType<F> : Iparams<T[keyof T]> =
//       typeof get === "function" ? get(state) : get

//     setState(prev => ({
//       ...prev,
//       ...data,
//     }))
//   }

//   const onReset = useCallback(
//     (resetObj: Iparams<T[keyof T]> = object) => {
//       setState(resetObj)
//     },
//     [state]
//   )

//   return [state, onUpdate, onReset] as const
// }
