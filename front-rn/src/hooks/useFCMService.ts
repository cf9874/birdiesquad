import messaging from "@react-native-firebase/messaging"
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import PushNotification, { Importance } from "react-native-push-notification"
import { useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { PushUtil } from "utils/push.util"
import notifee, { EventType } from "@notifee/react-native"
import { navigate } from "utils"
import { Screen } from "const"
import { REMOTE_EVENT_TYPE } from "const/remote.event.const"
import { liveSvc, profileSvc } from "apis/services"
import { GameStatus } from "const/live.const"

const DEFAULT_CHANNEL = "channel-id"

export const useFcmServices = () => {
    useEffect(() => {
        const saveTokenToServer = async () => {
            const token = await PushUtil.getToken()
            await AsyncStorage.setItem("FCM_TOKEN", token)
        }

        saveTokenToServer()

        setTimeout(() => {
            // register()
            PushUtil.requestApplicationPermission() // <--- request permission on android 13 or later.
        }, 4000)
    }, [])

    // const register = () => {
    //     requestPermission()
    // }

    // const requestPermission = async () => {
    //     await messaging().requestPermission()
    // }

    // const getToken = async () => {
    //     messaging()
    //         .getToken()
    //         .then(token => {
    //             if (token) {
    //                 saveTokenToServer(token)
    //             }
    //         })
    //         .catch(error => {
    //             console.log("[FCMService] getToken rejected ", error)
    //         })
    // }

    // const saveTokenToServer = async (token: string) => {
    //     console.log("token FCM", token)
    //     await AsyncStorage.setItem("FCM_TOKEN", token)
    // }
    /// HANDLE CLICK WHEN FOREGROUND
    useEffect(() => {
        const unsubscribe = () => {
            return notifee.onForegroundEvent(({ type, detail }) => {
                switch (type) {
                    case EventType.DISMISSED:
                        console.log("User dismissed notification :", detail.notification)
                        break
                    case EventType.PRESS:
                        console.log("User pressed notification FORE_GROUND: ", detail.notification)
                        console.error("Pressed FORE_GROUND !")
                        onOpenNotification(Number(detail.notification?.data?.event_type))
                        break
                }
            })
        }
        unsubscribe()
    }, [])

    // /// CREATE CHANNEL NOTIFICATION
    // PushNotification.channelExists(DEFAULT_CHANNEL, function (exists: boolean) {
    //     if (!exists) {
    //         PushNotification.createChannel(
    //             {
    //                 channelId: DEFAULT_CHANNEL,
    //                 channelName: "My channel",
    //                 channelDescription: "A channel to categorise your notifications",
    //                 playSound: false,
    //                 soundName: "default",
    //                 importance: Importance.HIGH,
    //                 vibrate: true,
    //             },
    //             (created: boolean) => console.log(`createChannel returned '${created}'`)
    //         )
    //     }
    // })

    useEffect(() => {
        // Foreground state messages
        // const unsubscribe = messaging().onMessage(async remoteMessage => {
        //     displayNotificationNotifee(remoteMessage)
        // })
        // return unsubscribe

        PushUtil.setUpForegroundMsg()
    }, [])
}
export const decreaseBadgeNotification = () => {
    PushNotification.getApplicationIconBadgeNumber((badge: any) => {
        PushNotificationIOS.setApplicationIconBadgeNumber(badge - 1)
    })
}
export const displayNotificationNotifee = async (remoteMessage: any) => {
    try {
        await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
                channelId: DEFAULT_CHANNEL,
                pressAction: { id: "default" },
            },
            data: {
                event_type: remoteMessage.data.EVENT_TYPE,
            },
        })
    } catch (e) {
        console.log("Error Display notification :", e)
    }
}
export const onOpenNotification = async (event_type: REMOTE_EVENT_TYPE) => {
    switch (event_type) {
        case 1:
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
        case 3:
            navigate(Screen.RAFFLETABSCENE, { tabIndex: 0 }) // Raffle
            break
        case 4:
            navigate(Screen.RAFFLETABSCENE, { tabIndex: 1 }) // Raffle
            break
        case 5:
            const user = await profileSvc.getMyProfile()
            navigate(Screen.USERPROFILE, { userSeq: user.USER_SEQ }) // User Profile
            break
        case 6:
            navigate(Screen.SETINQUIRY, { tabIndex: 1 }) // My Inquiry

            break
        case 101:
            const seasenSquad = await liveSvc.getSetSeason()
            const responseSquad = await liveSvc.getGameList(seasenSquad)
            const liveGameSquad = responseSquad.find(game => game.gameStatus === GameStatus.PLAY)
            if (!liveGameSquad) return
            navigate(Screen.MYSQUAD, {
                gameSeq: liveGameSquad.GAME_CODE,
                gameRound: liveGameSquad.roundSeq,
            }) //My Squad
            break
        case 103:
            navigate(Screen.NFTTABSCENE) // Market
            break
        case 104:
            navigate(Screen.RANK, { index: 0 }) // RANK
            break
        default:
    }
}
