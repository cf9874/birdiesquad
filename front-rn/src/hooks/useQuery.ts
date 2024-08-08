import { useEffect, useRef, useState } from "react"
import { setLoading } from "store/reducers/config.reducer"
import { FuncUtil, navigationRef } from "utils"
import { useScreen, useWrapDispatch } from "hooks"
import { useIsFocused } from "@react-navigation/native"

type ReturnDataType<T> = T extends (...args: any) => any
    ? FunctionReturnType<T>
    : T extends Array<any>
    ? ArrayReturnType<T>
    : T extends { [key: string]: any }
    ? ObjectReturnType<T>
    : any

// type FunctionReturnType<T> = ReturnType<T extends (...args: any) => any ? T : () => never>
type FunctionReturnType<T> = Awaited<ReturnType<T extends (...args: any) => Promise<any> ? T : () => Promise<never>>>
type ArrayReturnType<T> = T extends Array<infer P> ? FunctionReturnType<P>[] : any
type ObjectReturnType<T> = { [K in keyof T]: FunctionReturnType<T[K]> }
//
interface IOption {
    deps?: Array<any>
    debounceTime?: number
    enabled?: boolean
    loading?: boolean
    onClear?: any
    isMount?: boolean
    preventTime?: number
}

const getResultData = async <T>(funcSet: T) => {
    if (Array.isArray(funcSet)) {
        const result = await Promise.all(funcSet.map(async func => await func()))
        return result
    } else if (typeof funcSet === "function") {
        const result = await funcSet()
        return result
    } else {
        const funcSetData = funcSet as { [key: string]: (...args: any) => Promise<any> }
        let result = {} as ObjectReturnType<T>
        await Promise.all(
            Object.keys(funcSetData).map(async key => {
                result[key as keyof T] = await funcSetData[key]()
            })
        )
        return result
    }
}

export const useQuery = <T>(funcSet: T, option: IOption = {}) => {
    const {
        deps = [],
        debounceTime = 500,
        enabled = true,
        loading = true,
        onClear = null,
        isMount = true,
        preventTime = 0,
    } = option
    //
    //
    const loadingDispatch = useWrapDispatch(setLoading)

    const [data, setData] = useState<ReturnDataType<T> | null>(null)
    const isMountRef = useRef(isMount)
    const isPreventRef = useRef(false)
    let preventId: NodeJS.Timeout | null = null

    const asyncFunc = FuncUtil.debounce(async () => {
        loading && loadingDispatch({ isloading: true })
        isPreventRef.current = true

        const data = await getResultData(funcSet)
        setData(data)

        if (preventTime === 0) {
            isPreventRef.current = false
        } else {
            preventId = setTimeout(() => {
                isPreventRef.current = false
            }, preventTime)
        }

        loading && loadingDispatch({ isloading: false })
    }, debounceTime)

    const effect = () => {
        if (enabled && !isPreventRef.current) {
            if (isMountRef.current) asyncFunc()
            else isMountRef.current = true
        }
        return () => {
            // asyncFunc.cancel()
            preventId !== null && clearTimeout(preventId)
            onClear !== null && onClear()
        }
    }

    try {
        useScreen(effect, [...deps, enabled])
    } catch (error) {
        useEffect(effect, [...deps, enabled])
    }

    return [data, setData] as const
}
