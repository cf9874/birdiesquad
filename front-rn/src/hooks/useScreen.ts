import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"

export const useScreen = (effect: React.EffectCallback, deps: React.DependencyList) => {
    useFocusEffect(useCallback(effect, [...deps]))
}
