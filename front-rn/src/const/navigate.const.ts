import { GameStatus } from "./game.const"
import { NftApiData } from "apis/data"

export const enum Screen {
    TEST = "test",
    SIGNIN = "user-signin",
    TERM = "user-term",
    NFTDETAIL = "nft-detail",
    NFTLIST = "nft-list",
    // nibble
    NFTADVANCEMENT = "nft-advancement",
    NFT_ADVANCEMENT_MATERIALS = "nft-advancement-materials",
    // NFT_DETAIL_VX = "nft-detail-vx",
    INTRO = "user-intro",
    INTROTUTORIAL = "intro-tutorial",
    BACK = "back",
    TRANSWALLET = "trans-wallet",
    SLIDER = "slider",
    PROPROFILE = "pro-profile",
    USERPROFILE = "user-profile",
    MYPAGE = "user-mypage",
    MYEDIT = "user-mypage-edit",
    CONTESTRECORD = "user-mypage-contestrecord",
    MYSETTING = "user-mypage-setting",
    SETMYINFO = "user-setting-myinfo",
    SETALARM = "user-setting-alarm",
    SETFAQ = "user-setting-faq",
    SETINQUIRY = "user-setting-inquiry",
    SETWITHDRAW = "user-setting-withdraw",
    WITHDRAWSUBMIT = "withdraw-submit",
    RANK = "user-ranking",
    RANKDETAIL = "user-ranking-detail",
    PASSIONATEFANS = "passionate-Fans",
    PROCESSIN = "user-setting-procession",
    LIVE = "live-main",
    NFTPAYMENT = "NftPayment",
    NFTTABSCENE = "NftTabScene",
    RAFFLETABSCENE = "RaffleTabScene",
    WALLETS = "wallets",
    SPENDINGTABDETAIL = "Spending-tab-detail",
    WEBVIEWWALLET = "webview-wallet",
    WALLETTRANSFER = "wallet-transfer",
    SELECTPLAYERNFT = "select-player-nft",
    CONFIRMPLAYERNFT = "confirm-player-nft",
    WEBVIEWTERM = "WebViewTerm",
    UNBOXINGVIDEO = "UnboxingVideo",
    OPENNFTSCREEN = "open-nft-screen",
    PLAYERSELECTION = "PlayerSelection",
    SPLASH = "SplashScreenView",
    MYSQUAD = "MySquad",
    MYSQUADSELECT = "MySquadSelect",
    MYSQUADNFTDETAIL = "MySquadDetail",
}

export type ScreenParams = {
    [Screen.SELECTPLAYERNFT]: {
        mode: number
    }
    [Screen.USERPROFILE]: {
        userSeq: number
        toNavigate?: Screen
    }
    [Screen.PROPROFILE]: {
        player_code: number
    }
    [Screen.RANKDETAIL]: {
        tabIndex: number
        subTabIndex: number
    }
    [Screen.PASSIONATEFANS]: {
        info_player: {
            nID: number
            nPersonID: number
            sPlayerName: string
            sBirth: string
            sTeam: string
            sDebut: string
            sPlayerImagePath: string
            sPlayerthumbnailImagePath: string
        }
    }
    [Screen.RANK]: {
        index: number
        toNavigate?: Screen
    }
    [Screen.TERM]: {
        term: string
    }

    [Screen.LIVE]: {
        gameId: number
        gameStatus: GameStatus
        toNavigate?: Screen
    }
    [Screen.WITHDRAWSUBMIT]: {
        reason: string
    }
    [Screen.WEBVIEWWALLET]: {
        url: string
    }
    [Screen.WALLETTRANSFER]: {
        swapMode: number
    }
    [Screen.CONFIRMPLAYERNFT]: {
        mode: number
        itemWallet: {
            seq: number
            level: number
            grade: number
            playerCode: number
            birdie: number
            imgUri: string
        }
        itemSpending: {
            seq: number
            level: number
            grade: number
            playerCode: number
            birdie: number
            imgUri: string
        }
    }
    [Screen.WEBVIEWTERM]: {
        url: string
        hideBack?: boolean
    }
    [Screen.TRANSWALLET]: {
        playerCode: number
        grade: number
        nftSeq: number
        season: number
        level: number
        name: string
        golf: {
            birdie: number
        }
    }
    [Screen.MYEDIT]: {
        data: {
            REG_AT: string
            ICON_TYPE?: number
            ICON_NAME?: string
            NICK: string
            NICK_SANCTION_AT: string
            HELLO: string
            HELLO_SANCTION_AT: string
            BLAME: number
            BLAME_END_AT: string
            USER_SEQ: number
        }
    }
    [Screen.NFTDETAIL]: {
        nftseq: number
        toNavigate?: Screen
    }
    [Screen.RAFFLETABSCENE]: {
        tabIndex: number
        toNavigate?: Screen
    }
    [Screen.NFTTABSCENE]: {
        tabIndex: number
        toNavigate?: Screen
    }
    [Screen.SETINQUIRY]: {
        tabIndex: number
        toNavigate?: Screen
    }
}
