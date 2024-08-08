import { seasonKey } from "apis/endpoints"


import { createAction } from "typesafe-actions"
import API_CALLER from "apis"
import { API_URL } from "utils/env"

export const FETCH_SEASON_REQUEST = "FETCH_SEASON_REQUEST"
export const FETCH_SEASON_SUCCESS = "FETCH_SEASON_SUCCESS"
export const FETCH_SEASON_FAILURE = "FETCH_SEASON_FAILURE"

export const fetchPosts = () => {
    return (dispatch: any) => {
        console.warn("---->")
        dispatch(getSeasonRequest())
        return API_CALLER.get(API_URL + seasonKey)
            .then(response => response.json())
            .then(json => {
                dispatch(getSeasonSuccess(json))
            })
            .catch(error => {
                dispatch(getSeasonFailure(error))
            })
    }
}

export const getSeasonRequest = () => {
    // console.warn('1234567890');
    return {
        type: FETCH_SEASON_REQUEST,
    }
}

export const getSeasonSuccess = posts => {
    return {
        type: FETCH_SEASON_FAILURE,
        payload: posts,
    }
}

export const getSeasonFailure = error => {
    return {
        type: FETCH_SEASON_FAILURE,
        payload: error,
    }
}

// export const getSeasonRequest = createAction(FETCH_SEASON_REQUEST)()
// export const getSeasonSuccess = createAction(FETCH_SEASON_SUCCESS)()
// export const getSeasonFailure = createAction(FETCH_SEASON_FAILURE)()
