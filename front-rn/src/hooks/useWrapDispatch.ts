import { useAppDispatch } from "hooks"
import { useCallback } from "react"
import { PayloadActionCreator } from "typesafe-actions"

export const useWrapDispatch = <T extends (...args: any) => any, P extends any[] = Parameters<T>>(
    func: T extends PayloadActionCreator<string, any> ? T : (...args: any) => any
) => {
    const dispatch = useAppDispatch()

    const wrapper = useCallback(
        (...args: P) => {
            dispatch(func(...args))
        },
        [dispatch]
    )

    return wrapper
}

// export const useDisWrapper = (func: ActionType<PayloadAction<string, any>>) => {
//   const dispatch = useAppDispatch()

//   const wrapper = useCallback(
//     (...args: any) => {
//       dispatch(func(...args))
//     },
//     [dispatch]
//   )

//   return wrapper
// }
