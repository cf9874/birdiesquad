/**
 * @format
 */
import "react-native-gesture-handler"
import { AppRegistry } from "react-native"
import App from "./App"
import { name as appName } from "./app.json"
import messaging from "@react-native-firebase/messaging"
import notifee, { EventType } from "@notifee/react-native"
import { displayNotificationNotifee, decreaseBadgeNotification, onOpenNotification } from "hooks"
import AsyncStorage from "@react-native-async-storage/async-storage"

// HANDLE CLICK WHEN BACKGROUND
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("-------------------------->>>>APP QUIT STATE!", remoteMessage)
    onOpenNotification(Number(remoteMessage.data?.EVENT_TYPE))
    await AsyncStorage.setItem("PUSH_EVENT_TYPE", remoteMessage.data?.EVENT_TYPE)
})

notifee.onBackgroundEvent(async ({ type, detail }) => {
    decreaseBadgeNotification()
    const { notification } = detail
    switch (type) {
        case EventType.DISMISSED:
            break
        case EventType.PRESS:
            console.log("User pressed notification BACK_GROUND: ", detail.notification)
            console.error("Pressed BACK_GROUND !")
            onOpenNotification(Number(detail.notification.data.EVENT_TYPE))
            await notifee.cancelNotification(notification?.id ?? "")
            break
        default:
            break
    }
})
/// HANDLE CLICK WHEN BACKGROUND
// notifee.onBackgroundEvent(async ({ type, detail }) => {
//     decreaseBadgeNotification()
//     const { notification } = detail
//     switch (type) {
//         case EventType.DISMISSED:
//             break;
//         case EventType.PRESS:
//             console.log("User pressed notification BACK_GROUND: ", detail.notification)
//             console.error("Pressed BACK_GROUND !")
//             await notifee.cancelNotification(notification?.id ?? "")
//             break;
//         default:
//             break;
//     }

// })

AppRegistry.registerComponent(appName, () => App)
