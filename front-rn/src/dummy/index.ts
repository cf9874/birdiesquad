export default {
    mainHeaderInfo: () => ({
        point: 1500,
        coin: 300,
    }),
    bdst: () => ({
        time: "7월 7일 00시 00분",
        max: 500,
        current: 50,
    }),
    playerList: () => [
        {
            uuid: "1",
            time: "2020-23",
            level: 1,
            name: "한진선",
            rank: "L",
            price: 14.5,
        },
        {
            uuid: "2",
            time: "2020-23",
            level: 1,
            name: "박민지",
            rank: "L",
            price: 14.5,
        },
    ],
    player: () => ({
        uuid: "2",
        time: "2020-23",
        level: 1,
        name: "박민지",
        rank: "L",
        requierPoint: 5000,
        currentPoint: 1350,
        maxReward: 420,
        eagle: 350,
        birdie: 6.32,
        par: 11,
        bogey: -29,
        doubleBogey: -57,
        maxEnergy: 500,
        currentEnergy: 100,
        price: 14.5,
        info: {
            birth: "1월 1일",
            stature: "160cm",
            belong: "NH투자증권 프로골프단",
            debut: "2020",
            Awards: ["대상", "~상"],
        },
    }),
    allChargeEnergy: (playerList: string[], price: number) => {
        return [{ current: 12 }, { current: 13 }, { current: 17 }]
    },
    chargeEnergy: (energy: number, price: number, uuid: string) => {
        return {
            current: 10,
        }
    },
    levelUp: (point: number) => {
        return {
            level: 2,
        }
    },
}
export * from "./profile"
