import { View, Image, TextInput, Text, BackHandler, TouchableOpacity } from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { ProfileHeader } from "components/layouts"
import { CustomButton, PretendText } from "components/utils"
import { mineGStyle } from "styles"
import { ConfigUtil, DateUtil, navigate, RatioUtil } from "utils"
import { Screen } from "const"
import { useQuery, useWrapDispatch } from "hooks"
import { jsonSvc, profileSvc } from "apis/services"
import { settingGStyle, settingStyle } from "styles/setting.style"
import { SafeAreaView } from "react-native-safe-area-context"
import { APP_USER_ID } from "utils/env"
import Clipboard from "@react-native-clipboard/clipboard"
import { WalletToast } from "screens/nft/components"
import { setToast } from "store/reducers/config.reducer"
const SetMyInfo = () => {
    const [kakaoId, setKakaoId] = useState("")
    const toastDispatch = useWrapDispatch(setToast)

    useEffect(() => {
        (async () => {
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
            setKakaoId(USER_ID?USER_ID:'');
        })()

    }, [])
    useEffect(() => {
        const backAction = () => {
            navigate(Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])

    const [profile] = useQuery(
        {
            mine: profileSvc.getMyProfileDetail,
            kakao: profileSvc.getKakaoProfile,
        },
        { loading: false }
    )

    const date = DateUtil.format(profile?.mine.PROFILE_USER.REG_AT)
    // if (!profile) return
    
    const toastPopup = (msg: string): any => {
        toastDispatch({
            open: true,
            children: <WalletToast message={msg} image="NftDetailErrorSvg" />,
        })
        setTimeout(() => {
            toastDispatch({ open: false })
        }, 2000)
    }

    const handleCopyClipBoard = (text: string) => {
        try{
            Clipboard.setString(text.toString())
            toastPopup(`클립보드에 복사되었습니다.`)
        } catch (error){
            toastPopup(`클립보드에 복사가 실패되었습니다.`)
        }
        return
      };
    
    return (
        <SafeAreaView style={mineGStyle.con}>
            {/* <ProfileHeader title="내 정보" /> */}
            <ProfileHeader title={jsonSvc.findLocalById("172000")} />
            {!profile ? null : (
                <View
                    style={{
                        ...mineGStyle.bgCon,
                        alignItems: "center",
                        paddingHorizontal: RatioUtil.width(20),
                        paddingBottom: RatioUtil.height(20),
                        paddingTop: RatioUtil.height(40),
                    }}
                >
                    <View style={settingStyle.myInfo.textCon}>
                        <PretendText style={settingStyle.myInfo.text}>
                            {/* 이메일 */}
                            {jsonSvc.findLocalById("172010")}
                        </PretendText>
                        <PretendText style={settingStyle.myInfo.text}>
                            {profile.kakao.email === "null" || profile.kakao.email === null
                                ? jsonSvc.findLocalById("172027")
                                : profile.kakao.email}
                        </PretendText>
                    </View>
                    <View style={{ ...settingStyle.myInfo.textCon, marginTop: RatioUtil.height(30) }}>
                        <PretendText style={settingStyle.myInfo.text}>
                            {/* 가입일 */}
                            {jsonSvc.findLocalById("170039")}
                        </PretendText>
                        <PretendText style={settingStyle.myInfo.text}>
                            {/* {date ? `${date.month}월 ${date.day}일 ${date.amPm} ${date.hour}시` : ""} 가입 */}
                            {jsonSvc.formatLocal(jsonSvc.findLocalById("170040"), [
                                (date.year ?? "0").toString(),
                                (date.month ?? "0").toString(),
                                (date.day ?? "0").toString(),
                            ])}
                        </PretendText>
                    </View>
                    <View style={{ ...settingStyle.myInfo.textCon, marginTop: RatioUtil.height(30) }}>
                        <PretendText style={settingStyle.myInfo.text}>
                            {/* 카카오 ID */}
                            {/* {jsonSvc.findLocalById("170039")} */}
                            카카오 ID
                        </PretendText>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleCopyClipBoard(kakaoId)}
                        >
                            <PretendText style={settingStyle.myInfo.text}>
                                {kakaoId}
                            </PretendText>
                        </TouchableOpacity>
                    </View>
                    <CustomButton
                        style={settingGStyle.grayButton.con}
                        onPress={() => {
                            navigate(Screen.SETWITHDRAW)
                        }}
                    >
                        <PretendText style={settingGStyle.grayButton.text}>
                            {/* 회원탈퇴 */}
                            {jsonSvc.findLocalById("170041")}
                        </PretendText>
                    </CustomButton>
                </View>
            )}
        </SafeAreaView>
    )
}

export default SetMyInfo


