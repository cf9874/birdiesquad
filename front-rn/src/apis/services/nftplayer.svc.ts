import API_CALLER from "apis"
import {
    detailsNft,
    doOpenNft,
    gameDetails,
    gameLeaderBoard,
    gameParticipent,
    gamePersonhole,
    homeFirst,
    pageMyItem,
    pageMyNft,
} from "apis/endpoints"
import { API_URL } from "utils/env"

export const NftPlayerApi = () => {}

export const callHomeFirst = async (token: string | null) => {
    return await API_CALLER.post(
        API_URL + homeFirst,
        {},
        {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then(response => {
            return response
        })
        .catch(error => {
            return error
        })
}

export const callGameParticipentApi = async (gameId: string | number, token: string | null) => {
    // return await API_CALLER.get(API_URL + gameParticipent + `?gameId=${gameId}`, {
    return await API_CALLER.get(API_URL + `/api/v1/season-n/games/${gameId}/participants`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response: any) => {
            return response?.data?.data
        })
        .catch(error => {
            return error
        })
}

export const callPageMyNftApi = async (token: string | null) => {
    return await API_CALLER.get(API_URL + pageMyNft + "?order=ASC&page=1&take=50", {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response: any) => {
            return response?.data?.data?.data
        })
        .catch(error => {
            return error
        })
}

export const callDetailsNftApi = async (seqNo: string | number, token: string | null) => {
    return await API_CALLER.get(API_URL + detailsNft + `?NFT_SEQ=${seqNo}`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response: any) => {
            return response?.data?.data
        })
        .catch(error => {
            return error
        })
}

export const callPageMyItemApi = async (token: string | null) => {
    return API_CALLER.get(API_URL + pageMyItem + `?order=ASC&page=1&take=10`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response: any) => {
            return response?.data?.data
        })
        .catch(error => {
            return error
        })
}

export const callDoOpenNftApi = async (token: string | null, itemSeq: number | string) => {
    return API_CALLER.post(
        API_URL + doOpenNft,
        {
            ITEM_SEQ: itemSeq,
        },
        {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((response: any) => {
            return response?.data?.data
        })
        .catch(error => {
            return error
        })
}

export const callGameLeaderBoardApi = async (
    token: string | null,
    gameId: number | undefined,
    round: string | number
) => {
    return API_CALLER.get(API_URL + `/api/v1/season-n/games/${gameId}/rounds/${round}/leaderboard`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response: any) => {
            return response?.data?.data
        })
        .catch(error => {
            return error
        })
}

export const callGamePersonholeApi = async (
    token: string | null,
    gameId: number | undefined,
    round: number | string,
    personId: number | string
) => {
    return API_CALLER.get(API_URL + `/api/v1/season-n/games/${gameId}/rounds/${round}/players/${personId}/hole`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response: any) => {
            return response?.data?.data
        })
        .catch(error => {
            return error
        })
}
export const callGameHoleApi = async (token: string | null, gameId: number | undefined, round: number | string) => {
    return API_CALLER.get(API_URL + `/api/v1/season-n/games/${gameId}/rounds/${round}/hole`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response: any) => {
            return response?.data?.data
        })
        .catch(error => {
            return error
        })
}

export const callGameDetailApi = async (token: string | null, gameId: number | string) => {
    return API_CALLER.get(API_URL + `/api/v1/season-n/games/${gameId}/detail`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response: any) => {
            return response?.data?.data
        })
        .catch(error => {
            return error
        })
}

export const callParApi = async (token: string | null, gameId: number | undefined, round: number | string) => {
    return API_CALLER.get(
        API_URL +
            `/api/v1/season-n/games/${gameId}/rounds/${round}/hole
    `,
        {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((response: any) => {
            return response?.data?.data
        })
        .catch(error => {
            return error
        })
}
// export default NftPlayerApi
