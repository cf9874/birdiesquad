import { useState } from "react"

export const useTab = (menu: IMenu[]) => {
    const [index, setIndex] = useState(0)
    const routes = menu.map((el, i) => ({ key: `${i}`, title: el.title }))

    return {
        index,
        navigationState: { index, routes },
        onIndexChange: setIndex,
        renderScene: ({ route }: { route: { key: string; title: string } }) => menu[Number(route.key)].component,
    }
}

interface IMenu {
    title: string
    component: JSX.Element
}
