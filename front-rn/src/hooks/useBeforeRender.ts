import { useEffect, useState } from "react"

export const useBeforeRender = (effect: React.EffectCallback, deps?: React.DependencyList) => {
    const [isRender, setIsRender] = useState(false)

    if (!isRender) {
        effect()
        setIsRender(true)
    }

    useEffect(() => () => setIsRender(false), deps)
}
