import { jsonSvc } from "apis/services"
import { NumberUtil } from "utils"

const proStatTitleList = [
    "응원 팬 수",
    "1위 열혈팬",
    "NFT 최고 금액",
    "현재 수익 순위",
    "누적 수익 금액",
    "현재 응원챗 순위",
    "현재 하트 순위",
    "현재 프로필 UP 순위",
    "NFT 판매 수",
    "프로 피드 언급 수",
]
const proStatInfo = {
    fans: 13000,
    bigFan: "김프로오빠",
    NFTBestPrice: 1000,
    curRevenueRank: 1,
    accRevenue: 500000,
    curChatRank: 2,
    curHeartRank: 1,
    curUpRank: 4,
    NFTsells: 3200,
    proFeeds: 3087,
}
//mapping
const _proStatInfo = {
    fans: NumberUtil.addUnit(proStatInfo.fans),
    bigFan: proStatInfo.bigFan,
    NFTBestPrice: proStatInfo.NFTBestPrice,
    curRevenueRank: proStatInfo.curRevenueRank,
    accRevenue: NumberUtil.addUnit(proStatInfo.accRevenue),
    curChatRank: proStatInfo.curChatRank,
    curHeartRank: proStatInfo.curHeartRank,
    curUpRank: proStatInfo.curUpRank,
    NFTsells: proStatInfo.NFTsells,
    proFeeds: proStatInfo.proFeeds,
}
//mapping
export const _proStat = Object.entries(_proStatInfo).map(([_, _value], i) => {
    return { title: proStatTitleList[i], value: _value }
})
const SEASON = {
    season: {
        seasonKey: 2022,
    },
    list: [
        {
            stat: {
                rank: 1,
                strokeAvg: "70.4638",
                earnings: "791320324",
                drivingDist: "288.2625",
                drivingAcc: "62.4722",
                greensInReg: "72.2222",
                puttAvg: "1.7625",
            },
            name: "김영수",
        },
    ],
}
const seasonTitleList = [
    "시즌 기록",
    "상금",
    "순위",
    "평균 타수",
    "최장 드리아브 비거리",
    "페어웨이 안착률",
    "그린 적중률",
    "평균 퍼팅횟수",
]
//mapping
const _seasonInfo = {
    year: SEASON.season.seasonKey,
    reward: new Intl.NumberFormat().format(Number(SEASON.list[0].stat.earnings)),
    rank: SEASON.list[0].stat.rank,
    strokeAvg: SEASON.list[0].stat.strokeAvg,
    drivingDist: SEASON.list[0].stat.drivingDist,
    drivingAcc: SEASON.list[0].stat.drivingAcc,
    greensInReg: SEASON.list[0].stat.greensInReg,
    puttAvg: SEASON.list[0].stat.puttAvg,
}
//mapping
export const _season = Object.entries(_seasonInfo).map(([_, _value], i) => {
    return { title: seasonTitleList[i], value: _value }
})
const userStatTitleList = [
    "NFT 보유 수",
    "보유 최고 등급",
    "열혈 응원 선수",
    "이전 시즌 BDST 획득 순위",
    "이전 시즌 육성 포인트 획득 순위",
    "누적 후원 금액",
    "프로 소통 수",
    "응원챗 누적 발송 횟수",
    "하트 누적 발송 횟수",
    "누적 승급 횟수",
    "누적 레벨업 횟수",
    "획득 배지 수",
]
const userStatInfo = {
    nftCount: 38,
    maxRank: "Legendary",
    cheerPlayer: "한진선",
    bdstRank: 48,
    levelupPointRank: 21,
    accDonation: 4187,
    proCommentCount: 0,
    chatAccCount: 6,
    heartAccCount: 14000,
    accPromotionCount: 10,
    accLevelupCount: 50,
    badgeCount: 10,
}
const _userStatInfo = {
    nftCount: userStatInfo.nftCount,
    maxRank: userStatInfo.maxRank,
    cheerPlayer: userStatInfo.cheerPlayer,
    bdstRank: userStatInfo.bdstRank,
    levelupPointRank: userStatInfo.levelupPointRank,
    accDonation: userStatInfo.accDonation,
    proCommentCount: userStatInfo.proCommentCount,
    chatAccCount: userStatInfo.chatAccCount,
    heartAccCount: NumberUtil.addUnit(userStatInfo.heartAccCount),
    accPromotionCount: userStatInfo.accPromotionCount,
    accLevelupCount: userStatInfo.accLevelupCount,
    badgeCount: userStatInfo.badgeCount,
}
export const _userStat = Object.entries(_userStatInfo).map(([_, _value], i) => {
    return { title: userStatTitleList[i], value: _value }
})
//기록/통계 도움말
export const RECORDHELPER = {
    user: [
        {
            // title: "누적 후원 금액",
            title: jsonSvc.findLocalById("171004"),
            // content: "프로에게 후원한 BDST 총합 수치가 출력됩니다. (수수료 포함)",
            content: jsonSvc.findLocalById("911002"),
        },
        {
            // title: "열혈 응원 선수",
            title: jsonSvc.findLocalById("171005"),
            // content: "자신이 가장 많이 응원한 프로의 이름이 출력됩니다.",
            content: jsonSvc.findLocalById("911004"),
        },
        // {
        //     // title: "프로 소통 수",
        //     title: jsonSvc.findLocalById("171006"),
        //     // content: "자신이 남긴 게시글에 프로가 댓글을 남겨준 횟수를 책정합니다. (업데이트 예정)",
        //     content: jsonSvc.findLocalById("911006"),
        // },
        {
            // title: "응원챗 누적 발송 횟수",
            title: jsonSvc.findLocalById("171007"),
            // content: "라이브 중계에서 선수들에게 응원챗을 발송한 누적 횟수와 금액을 책정합니다.",
            content: jsonSvc.findLocalById("911008"),
        },
        {
            // title: "하트 누적 발송 횟수",
            title: jsonSvc.findLocalById("171008"),
            // content: "라이브 중계에서 선수들에게 하트를 발송한 누적 횟수를 책정합니다.",
            content: jsonSvc.findLocalById("911010"),
        },
        {
            // title: "누적 승급 횟수",
            title: jsonSvc.findLocalById("171009"),
            // content: "현재 보유 여부와 상관없이 NFT를 승급시킨 횟수를 책정합니다. (업데이트 예정)",
            content: jsonSvc.findLocalById("911012"),
        },
        {
            // title: "누적 레벨업 횟수",
            title: jsonSvc.findLocalById("171010"),
            // content: "현재 보유 여부와 상관없이 NFT를 레벨업한 횟수를 책정합니다.",
            content: jsonSvc.findLocalById("911014"),
        },
    ],
    //pro 도움말 업데이트 필요
    pro: [
        {
            // title: "현재 수익 순위",
            title: jsonSvc.findLocalById("171026"),
            // content: "주간 랭크에서 팬들이 응원으로 보내준 후원 금액에 따른 순위를 책정합니다.",
            content: jsonSvc.findLocalById("911050"),
        },
        {
            // title: "누적 수익 금액",
            title: jsonSvc.findLocalById("171027"),
            // content: "팬들이 응원으로 보내준 누적 후원 금액입니다.",
            content: jsonSvc.findLocalById("911051"),
        },
        // {
        //     // title: "프로 소통 수",
        //     title: jsonSvc.findLocalById("171006"),
        //     // content: "자신이 남긴 게시글에 프로가 댓글을 남겨준 횟수를 책정합니다. (업데이트 예정)",
        //     content: jsonSvc.findLocalById("911006"),
        // },
        {
            // title: "현재 후원 횟수 순위",
            title: jsonSvc.findLocalById("171028"),
            // content: "주간 랭크에서 후원을 받은 횟수에 따른 순위를 책정합니다.",
            content: jsonSvc.findLocalById("911052"),
        },
        {
            // title: "현재 하트 순위",
            title: jsonSvc.findLocalById("171029"),
            // content: "주간 랭크에서 하트를 받은 횟수에 따른 순위를 책정합니다. ",
            content: jsonSvc.findLocalById("911053"),
        },
        {
            // title: "현재 프로필 UP 순위",
            title: jsonSvc.findLocalById("171030"),
            // content: "주간 랭크에서 프로 프로필의 UP 횟수에 따른 순위를 책정합니다.",
            content: jsonSvc.findLocalById("911054"),
        },
        {
            // title: "NFT 판매 수",
            title: jsonSvc.findLocalById("171031"),
            // content: "해당 프로의 NFT가 판매된 누적 거래 수량입니다.",
            content: jsonSvc.findLocalById("911055"),
        },
        {
            // title: "NFT 최고 금액",
            title: jsonSvc.findLocalById("171025"),
            // content: "해당 프로의 NFT가 가장 고가로 판매된 금액입니다. (업데이트 예정)",
            content: jsonSvc.findLocalById("911056"),
        },
    ],
}
