export interface MySquadResponse {
    code: number | string
    message: string
    data: MySquadList
}

export interface MySquadList {
    mySquadSeq: number
    gameSeq: number
    reward: number
    isLocked: boolean
    isFirst: boolean
    players: {
        mySquadPlayerSeq: number
        mySquadSeq: number
        userNftSeq: number
        name: string
        playerCode: number
        seasonCode: number
        gradeImagePath: string
        gradeThumbnailImagePath: string
        tumbnailImagePath: string
        level: number
        reward: number
    }[]
}

export interface MySquadPlayer {
    mySquadPlayerSeq: number
    mySquadSeq: number
    userNftSeq: number
    name: string
    playerCode: number
    seasonCode: number
    gradeImagePath: string
    gradeThumbnailImagePath: string
    tumbnailImagePath: string
    level: number
    reward: number
}

export interface MySquadNftsList {
    nfts: [
        {
            userNftSeq: number
            nftGrade: number
            nftLevel: number
            training: number
            energy: number
            eagle: number
            birdie: number
            par: number
            bogey: number
            doubleBogey: number
            maxReward: number
            playerCode: number
            seasonCode: number
            tumbnailImagePath: string
            gradeThumbnailImagePath: string
            isParticipating: boolean
            isEquipped: boolean
        }
    ]
}

export interface MySquadInsert {
    gameSeq: number
    reward: number
    players: {
        userNftSeq: number
        reward: number
    }[]
}

export interface MySquadUpdate {
    gameSeq: number
    reward: number
    players: {
        mySquadPlayerSeq: number
        userNftSeq: number
        reward: number
    }[]
}

//hazel - 추가
export interface RewardPlayer {
    expectReward: {
        bdst: number
        commission: number
    }
    currentDate: string
}
