import { ReadyModal } from "components/Common"
import { CustomButton, PretendText } from "components/utils"
import { AnalyticsEventName, Colors, Screen } from "const"
import { useWrapDispatch } from "hooks"
import { View } from "react-native"
import { setModal } from "store/reducers/config.reducer"
import { settingCompoStyle } from "styles/setting.style"
import { ErrorUtil, RatioUtil, navigate, navigateReset } from "utils"
import { jsonSvc, signSvc } from "apis/services"
import { Analytics } from "utils/analytics.util"

const MoveSpandingModal = ({ reason }: { reason: string }) => {
    const Withdrawal = async (reason: string) => {
        // const preventReason = await signSvc.WithdrawalCheck()
        // if (!preventReason.status) {
        //     modalDispatch({ open: false })
        //     ErrorUtil.PreventWithdrwal(preventReason.message)
        //     return
        // }
        const isDelete = await signSvc.Withdrawal(reason)
        if (isDelete) {
            modalDispatch({
                open: false,
            })
            navigateReset(Screen.SIGNIN)
        }
    }

    const modalDispatch = useWrapDispatch(setModal)
    return (
        <View style={settingCompoStyle.moveSpandingModal.con}>
            <View
                style={{
                    padding: RatioUtil.width(10),
                }}
            >
                <PretendText
                    style={[
                        settingCompoStyle.moveSpandingModal.titleText,
                        {
                            fontWeight: "700",
                        },
                    ]}
                >
                    {/* 정말 탈퇴하시겠습니까? */}
                    {jsonSvc.findLocalById("10000034")}
                </PretendText>
            </View>
            <PretendText style={settingCompoStyle.moveSpandingModal.text}>
                {/* {"스펜딩에 보유한 NFT 및 재화는\n모두 삭제되며 다시 복수할 수 없습니다."} */}
                {jsonSvc.findLocalById("10000035")}
            </PretendText>
            <View
                style={{
                    flexDirection: "row",
                    marginTop: RatioUtil.height(20),
                    width: RatioUtil.width(232),
                    justifyContent: "space-between",
                }}
            >
                <CustomButton
                    style={{ ...settingCompoStyle.moveSpandingModal.buttonCon, backgroundColor: Colors.GRAY7 }}
                    onPress={() => modalDispatch({ open: false })}
                >
                    <PretendText style={{ ...settingCompoStyle.moveSpandingModal.buttonText, color: Colors.BLACK2 }}>
                        {/* 취소 */}
                        {jsonSvc.findLocalById("10010001")}
                    </PretendText>
                </CustomButton>
                <CustomButton
                    style={{ ...settingCompoStyle.moveSpandingModal.buttonCon, backgroundColor: Colors.BLACK }}
                    onPress={async () => {
                        await Analytics.logEvent(AnalyticsEventName.click_exit_fail_410, {
                            hasNewUserData: true,
                        })
                        Withdrawal(reason)
                    }}
                >
                    <PretendText style={{ ...settingCompoStyle.moveSpandingModal.buttonText, color: Colors.WHITE }}>
                        {/* 확인 */}
                        {jsonSvc.findLocalById("10010000")}
                    </PretendText>
                </CustomButton>
            </View>
        </View>
    )
}

export const WithdrawCompo = { MoveSpandingModal }
