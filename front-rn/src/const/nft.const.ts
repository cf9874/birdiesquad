import { jsonSvc } from "apis/services"

export type NftFilterKey = 1 | 2 // 전체 , 성장가능
export type NftFilterMenu = Array<{ key: NftFilterKey; title: string }> // 전체 , 성장가능
export type NftSortKey = 1 | 2 | 3 | 4 | 5 //최신순, 에너지순, 등급 , 레벨 , 버디 ,
export type NftSortMenu = Array<{ key: NftSortKey; title: string; desc: NftSortList }> //에너지순, 등급 , 레벨 , 버디 ,
export type NftSortList = "energy" | "birdie" | "grade" | "level" | "seq"

export const nftFilterMenu: NftFilterMenu = [
    { key: 1, title: jsonSvc.findLocalById("2024") },
    { key: 2, title: jsonSvc.findLocalById("2051") },
]
export const nftSortMenu: NftSortMenu = [
    { key: 1, title: jsonSvc.findLocalById("2052"), desc: "seq" },
    { key: 2, title: jsonSvc.findLocalById("2053"), desc: "grade" },
    { key: 3, title: jsonSvc.findLocalById("2054"), desc: "level" },
    { key: 4, title: jsonSvc.findLocalById("2055"), desc: "birdie" },
    { key: 5, title: jsonSvc.findLocalById("2056"), desc: "energy" },
    { key: 6, title: "이름 순", desc: "name" },
]

export const enum Grade {
    COMMON = 1,
    UNCOMMON,
    RARE,
    SUPERRARE,
    EPIC,
    LEGENDARY,
}

// 객체에 접근하기 위하여 const 제거
export enum NftGrade {
    COMMON = 1,
    UNCOMMON,
    RARE,
    SUPERRARE,
    EPIC,
    LEGENDARY,
}

export const enum GradeName {
    COMMON = "Common",
    UNCOMMON = "Uncommon",
    RARE = "Rare",
    SUPERRARE = "Super Rare",
    EPIC = "Epic",
    LEGENDARY = "Legendary",
}
export const enum NftFilterType {
    PROFILE = "profile",
    SPENDING = "spending",
    COMMON = "common",
    SQUAD = "squad",
}

export const enum Category {
    FREENORMAL = 202301,
    SHOPNORMAL,
    SHOPPREMIUM,
    SHOPCHOICE,
    FREEPREMIUM,
    FREECHOICE,
}

// nft 최고 레벨
export const NFT_MAX_LEVEL = 15

// 현 오픈스펙 nft 최고 등급 SUPER_RARE
export const NFT_MAX_GRADE = 4
