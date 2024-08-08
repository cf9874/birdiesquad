import { DAPP_API_KEYS, LINK_BUY_PLAYER_ENV, LINK_SALE_PLAYER_ENV } from "utils/env"

export const MAX_NUM_FOR_POINT = 9999999999
export const MAX_NUM_FOR_NFT = 999999999
export const WALLET_ADDRESS = "wallet_address"
export const DO_HAVE_WALLET = "DO_HAVE_WALLET"
export const ACCESS_TOKEN_KAKAO = "access_token_kakao"
export const HOME_SCREEN_TUTORIAL = "home_screen_tutorial"
export const LOGIN_SCREEN_TUTORIAL = "login_screen_tutorial"
export const RELAY_SCREEN_ENDED_TUTORIAL = "relay_screen_ended_tutorial"
export const RELAY_SCREEN_LIVE_TUTORIAL = "relay_screen_live_tutorial"
export const RELAY_SCREEN_BEFORE_TUTORIAL = "relay_screen_before_tutorial"
export const RELAY_SCREEN_POPUP_TUTORIAL = "relay_screen_popup_tutorial"
export const NFT_DETAIL_SCREEN_TUTORIAL = "nft_detail_screen_tutorial"
export const NFT_SPENDING_SCREEN_TUTORIAL = "nft_spending_screen_tutorial"
export const NFT_ADVANCEMENT_SCREEN_TUTORIAL = "nft_advancement_screen_tutorial"
export const RANK_SCREEN_TUTORIAL = "rank_screen_tutorial"
export const ID_TOKEN_KAKAO = "id_token_kakao"
export const REFRESH_TOKEN_KAKAO = "refresh_token_kakao"
export const LINK_BUY_PLAYER = LINK_BUY_PLAYER_ENV
export const LINK_SALE_PLAYER = LINK_SALE_PLAYER_ENV
export const LINK_CHECK_EXPIRE = "https://kapi.kakao.com/v1/user/access_token_info"
export const LINK_RENEW_TOKEN = "https://kauth.kakao.com/oauth/token"
export const DAPP_API_KEY = DAPP_API_KEYS
export const SIGNUP_REWARD = "signup_reward"

export const enum FLAG {
    POINT = "point",
    NFT = "nft",
}

export const TutorialId = {
    [HOME_SCREEN_TUTORIAL]: 0,
    [LOGIN_SCREEN_TUTORIAL]: 1,
    [RELAY_SCREEN_ENDED_TUTORIAL]: 2,
    [RELAY_SCREEN_LIVE_TUTORIAL]: 3,
    [RELAY_SCREEN_BEFORE_TUTORIAL]: 4,
    [RELAY_SCREEN_POPUP_TUTORIAL]: 5,
    [NFT_DETAIL_SCREEN_TUTORIAL]: 6,
    [NFT_SPENDING_SCREEN_TUTORIAL]: 7,
    [NFT_ADVANCEMENT_SCREEN_TUTORIAL]: 8,
    [RANK_SCREEN_TUTORIAL]: 9,
}
