import dayjs from "dayjs"

// nft 승급 재료 리스트 요청값
export type RequestUpgradeNftMaterial = {
    grade: number
    level: number
    playerCode: number
    page: number
    limit?: number
}

// nft 승급 재료 리스트 응답값
export type ResponseUpgradeNftMaterials = {
    seqNo: number
    name: string // 선수 이름
    grade: number
    level: number
    playerCode: number
    seasonCode: number
    birdie: number
}

// nft 승급 및 결과 조회 요청 값
export type RequestUpgradeNft = {
    gameCode: number
    targetNftId: number
    subNftIds: [number, number]
}

// nft 승급 및 결과 조회 응답 값
export type ResponseUpgradeNft = {
    isUpgrade: boolean
    upgradedNft: UpgradedNft
}

type UpgradedNft = {
    seqNo: number
    name: string
    grade: number
    level: number
    energy: number
    eagle: number
    birdie: number
    par: number
    bogey: number
    doubleBogey: number
    earnAmount: number
    playerCode: number
    seasonCode: number
}

// nft 승급 조건 정보 조회 응답 값
export type ResponseUpgradeNftInfo = {
    subNftCount: number
    upgradeLevel: number
    successRate: UpgradeNftGradeData
    successRateOther: UpgradeNftGradeData
    upgradeCost: UpgradeNftGradeData
}

type UpgradeNftGradeData = {
    [index: string]: number
    common: number
    uncommon: number
    rare: number
}

export interface NftType {
    golf: {
        eagle: number
        birdie: number
        par: number
        bogey: number
        doubleBogey: number
    }
    seq: number
    playerCode: number
    seasonCode?: number
    owner_seq?: number
    serial?: string
    regDate?: dayjs.Dayjs
    grade: number
    level: number
    training: number
    energy: number
    trainingMax: number
    maxReward: number
    wallet?: {
        grade: number
        level: number
    }
    isNew: boolean
}

export interface Route {
    route: {
        key: string
        name: string
        params: {
            nftDetail: {
                golf: {
                    eagle: number
                    birdie: number
                    par: number
                    bogey: number
                    doubleBogey: number
                }
                seq: number
                playerCode: number
                seasonCode?: number
                owner_seq?: number
                serial?: string
                regDate?: dayjs.Dayjs
                grade: number
                level: number
                training: number
                energy: number
                trainingMax: number
                maxReward: number
                wallet?: {
                    grade: number
                    level: number
                }
                isNew: boolean
            }
        }
    }
}

// asset 타입
export interface IAsset {
    asset: {
        training: number
        bdst: number
        tbora: number
    }
}