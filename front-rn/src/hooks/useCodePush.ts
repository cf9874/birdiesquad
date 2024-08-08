import CodePush from "react-native-code-push"
import { Alert } from "react-native"
import { useEffect } from "react"

export const useCodePush = () => {
    interface Progress {
        receivedBytes: number
        totalBytes: number
    }

    const codePushAlert = () =>
        Alert.alert(
            "업데이트가 완료 되었습니다.", // 첫번째 text: 타이틀 제목
            "확인 버튼을 누르면 앱이 재시작됩니다.", // 두번째 text: 그 밑에 작은 제목
            [
                {
                    text: "확인",
                    onPress: () => {
                        CodePush.allowRestart()
                        CodePush.restartApp()
                    },
                },
            ],
            { cancelable: false }
        )

    const codePushOptions = {
        installMode: CodePush.InstallMode.IMMEDIATE,
        mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESUME,
        rollbackRetryOptions: {
            delayInHours: 0,
            maxRetryAttempts: 0,
        },
        updateDialog: {
            title: "업데이트",
            mandatoryUpdateMessage: "새로운 기능 제공을 위해 앱이 업데이트 됩니다.",
            mandatoryContinueButtonLabel: "업데이트 하기",
            optionalUpdateMessage: "새로운 기능 제공을 위해 업데이트가 필요합니다.",
            optionalInstallButtonLabel: "업데이트 하기",
            optionalIgnoreButtonLabel: "다음에 하기",
        },
    }

    const codePushSyncStatus = (status: number) => {
        switch (status) {
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                CodePush.disallowRestart()
                Alert.alert("업데이트", "업데이트 파일을 다운로드 받고 있습니다.", [], { cancelable: false })
                break
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                break
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                CodePush.notifyAppReady()
                codePushAlert()
                break
        }
    }

    const codePushProgress = (progress: Progress) => {
        // console.log("Downloading " + progress.receivedBytes + " of " + progress.totalBytes)
    }

    const updateCheckCodePush = CodePush.checkForUpdate().then(
        async update => {
            if (update) {
                await CodePush.sync(codePushOptions, codePushSyncStatus, codePushProgress, err => {
                    console.error("codepushsync error", err)
                })
            }
        },
        err => {
            console.error("codepushcheck error", err)
        }
    )

    useEffect(() => {
        updateCheckCodePush
    })
}
