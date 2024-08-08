import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { EventType, Event } from "@notifee/react-native"
import PushNotification, { Importance } from "react-native-push-notification"
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import { Platform, PermissionsAndroid } from "react-native"

export class PushUtil {

    private static readonly DEFAULT_CHANNEL = "channel-id"

    static setUpBackground() {

        PushUtil.checkDefaultChannel();

        messaging().setBackgroundMessageHandler(PushUtil.onBackgroundMsg);
        notifee.onBackgroundEvent(PushUtil.onBackgroundEvent);
    }

    static async requestApplicationPermission() {

        await messaging().requestPermission();

        if (Platform.OS === "android") {
            try {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then(value => {})
            } catch (error) {
                console.log("ERROR:", error)
            }
        }
    }

    static async getToken(): Promise<string> {

        return await messaging().getToken();
    }

    static setUpForegroundMsg(): () => void {

        messaging().onNotificationOpenedApp(remoteMessage => {

            console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>> openApp`);

        });

        messaging().getInitialNotification().then(remoteMessage => {

            console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>> initApp`, remoteMessage);
        })

        return messaging().onMessage(this.onForegroundMsg);

    }

    static setUpForegroundEvent(): () => void {

        return notifee.onForegroundEvent(PushUtil.onForegroundEvent);
    }

    private static checkDefaultChannel() {

        /// CREATE CHANNEL NOTIFICATION
        PushNotification.channelExists(PushUtil.DEFAULT_CHANNEL, function (exists: boolean) {

            if (!exists) {
                PushNotification.createChannel(
                    {
                        channelId: PushUtil.DEFAULT_CHANNEL,
                        channelName: "My channel",
                        channelDescription: "A channel to categorise your notifications",
                        playSound: false,
                        soundName: "default",
                        importance: Importance.HIGH,
                        vibrate: true,
                    },
                    (created: boolean) => console.log(`createChannel returned '${created}'`)
                )
            }

        });
    }

    private static onForegroundMsg(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {

        console.log(remoteMessage);
        PushUtil.displayNotificationNotifee(remoteMessage);
    }

    private static onForegroundEvent(event: Event) {

        const { type, detail } = event;

        switch (type) {
            case EventType.DISMISSED:
                console.log("User dismissed notification :", detail.notification)
                break
            case EventType.PRESS:
                console.log("User pressed notification FORE_GROUND: ", detail.notification)
                console.error("Pressed FORE_GROUND !")
                // onOpenNotification(detail)
                break
        }

    }

    private static async onBackgroundMsg(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {

        console.log(remoteMessage);
        // PushUtil.displayNotificationNotifee(remoteMessage);

    }

    private static async onBackgroundEvent(event: Event) {

        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>> Background`);
        console.log(event);

        const { type, detail } = event;

        PushUtil.decreaseBadgeNotification();

        const { notification } = detail;
        switch (type) {
            case EventType.DISMISSED:
                break;
            case EventType.PRESS:
                console.log("User pressed notification BACK_GROUND: ", detail.notification)
                console.error("Pressed BACK_GROUND !")
                await notifee.cancelNotification(notification?.id ?? "")
                break;
            default:
                break;
        }
    }

    private static decreaseBadgeNotification() {

        PushNotification.getApplicationIconBadgeNumber((badge: any) => {
            PushNotificationIOS.setApplicationIconBadgeNumber(badge - 1);
        })
    }

    private static async displayNotificationNotifee(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {

        if (remoteMessage.notification) {

            try {
                await notifee.displayNotification({
                    title: remoteMessage.notification.title,
                    body: remoteMessage.notification.body,
                    android: {
                        channelId: PushUtil.DEFAULT_CHANNEL,
                        pressAction: { id: "default" },
                    },
                })
            } catch (e) {
                console.log("Error Display notification :", e)
            }
        }
    }
    
}
