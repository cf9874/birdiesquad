import appsFlyer from "react-native-appsflyer"

import { firebase, FirebaseDynamicLinksTypes } from "@react-native-firebase/dynamic-links"
import Config from "react-native-config"
import { REMOTE_EVENT_TYPE } from "const/remote.event.const"
import { navigate, navigateReset } from "./navigate.util"
import { Screen } from "const"
import { liveSvc, profileSvc } from "apis/services"
import { GameStatus } from "const/live.const"
import { EventNavigate } from "./eventNavigate.util"

export class DeepLinks {
    private static readonly EVENT_TYPE = "EVENT_TYPE"

    private static parseEventType(url: string): string | null {
        const include = url.includes(DeepLinks.EVENT_TYPE)
        if (!include) return null

        const params = url.split(/([&,?,=])/)
        const index = params.indexOf(DeepLinks.EVENT_TYPE)
        const value = params[index + 2]
        return value
    }
    static process(url: string, isRunnung: boolean) {
        const a = (e: REMOTE_EVENT_TYPE) => {
            console.log(`REMOTE_EVENT_TYPE: ${e}`)
        }

        const eventType = DeepLinks.parseEventType(url)
        if (eventType) {
            if (eventType in REMOTE_EVENT_TYPE) {
                isRunnung
                    ? EventNavigate.navigateNormal(parseInt(eventType))
                    : EventNavigate.navigateQuit(parseInt(eventType))
            }
        }
    }
    static emitEvent(eventType: REMOTE_EVENT_TYPE) {
        console.log(`REMOTE_EVENT_TYPE: ${eventType}`)
        DeepLinks.navigateEvent(eventType)
    }

    private static async setUpDynamicLink() {
        firebase.dynamicLinks().onLink(link => {
            // foregounrd 링크 로직
            console.log(`foreground dynamic links`)
            console.log(link)
            DeepLinks.process(link.url, true)
        })
    }

    private static async setUpOneLink() {
        if (!Config.APPS_FLYER_DEV_KEY || !Config.APPS_FLYER_APP_ID) {
            console.error("INVALID APPS FLYER!!!!")
            return
        }

        appsFlyer.onInstallConversionData(res => {
            console.log(`>>> onInstallConversionData`)

            if (res.data.is_first_launch) {
                if (JSON.parse(res.data.is_first_launch) == true) {
                    if (res.data.af_status === "Non-organic") {
                        var media_source = res.data.media_source
                        var campaign = res.data.campaign
                        console.log(
                            "This is first launch and a Non-Organic install. Media source: " +
                                media_source +
                                " Campaign: " +
                                campaign
                        )
                    } else if (res.data.af_status === "Organic") {
                        console.log("This is first launch and a Organic Install")
                    }
                } else {
                    console.log("This is not first launch")
                }

                console.log(res.data)
            } else {
                console.log(res)
            }
        })

        appsFlyer.onAppOpenAttribution(res => {
            console.log(res)
            DeepLinks.process(res.data.link, true)
        })

        const appsFlyerOptions = {
            devKey: Config.APPS_FLYER_DEV_KEY,
            appId: Config.APPS_FLYER_APP_ID,
            isDebug: Config.NODE_ENV === "dev",
        }

        appsFlyer.initSdk(
            appsFlyerOptions,
            result => {
                console.log("AppsFlyer initialization succeeded:", result)
            },
            error => {
                console.error("AppsFlyer initialization failed:", error)
            }
        )

        //appId 확인
        appsFlyer.getAppsFlyerUID((error, appsFlyerUID) => {
            console.log("AppsFlyer ID:", appsFlyerUID)
        })
    }

    static setUp() {
        DeepLinks.setUpOneLink()
        DeepLinks.setUpDynamicLink()
    }

    private static async navigateEvent(event_type: REMOTE_EVENT_TYPE) {
        switch (event_type) {
            case REMOTE_EVENT_TYPE.LIVE:
                const seasen = await liveSvc.getSetSeason()
                const response = await liveSvc.getGameList(seasen)
                const liveGame = response.find(game => game.gameStatus === GameStatus.PLAY)
                if (!liveGame) return
                // LIVE
                navigate(Screen.LIVE, {
                    gameId: liveGame.GAME_CODE,
                    gameStatus: liveGame.gameStatus,
                    liveLink: "",
                })
                break
            case REMOTE_EVENT_TYPE.RAFFLE_START:
                navigate(Screen.RAFFLETABSCENE, { tabIndex: 0 }) // Raffle
                break
            case REMOTE_EVENT_TYPE.RAFFLE_REWARD:
                navigate(Screen.RAFFLETABSCENE, { tabIndex: 1 }) // Raffle
                break
            case REMOTE_EVENT_TYPE.PROFILE_UP:
                const user = await profileSvc.getMyProfile()
                navigate(Screen.USERPROFILE, { userSeq: user.USER_SEQ }) // User Profile
                break
            case REMOTE_EVENT_TYPE.ANSWER_INQUIRY:
                navigate(Screen.SETINQUIRY, { tabIndex: 1 }) // My Inquiry
                break
            case REMOTE_EVENT_TYPE.MY_SQUAD:
                const seasenSquad = await liveSvc.getSetSeason()
                const responseSquad = await liveSvc.getGameList(seasenSquad)
                const liveGameSquad = responseSquad.find(game => game.gameStatus === GameStatus.PLAY)
                if (!liveGameSquad) return
                navigate(Screen.MYSQUAD, {
                    gameSeq: liveGameSquad.GAME_CODE,
                    gameRound: liveGameSquad.roundSeq,
                }) //My Squad
                break
            case REMOTE_EVENT_TYPE.MARKET_NFT:
                navigate(Screen.NFTTABSCENE) // Market
                break
            case REMOTE_EVENT_TYPE.RANK_FAN:
                navigate(Screen.RANK, { index: 0 }) // RANK
                break
        }
    }
}
