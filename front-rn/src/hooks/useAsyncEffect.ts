import { useEffect, DependencyList } from "react"

export const useAsyncEffect = (asyncEffect: () => Promise<void>, deps?: DependencyList) => {
    useEffect(() => {
        const asyncEffectWrapper = async () => {
            await asyncEffect()
        }
        asyncEffectWrapper()
    }, deps)
}
