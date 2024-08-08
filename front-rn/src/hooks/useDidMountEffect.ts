import { useEffect, useRef } from "react"

export const useDidMountEffect = <F extends (...arg: any) => any, D extends any[]>(func: F, deps?: D) => {
    const isFirst = useRef(false)
    useEffect(() => {
        if (isFirst.current) func()
        else isFirst.current = true
    }, deps)
}
