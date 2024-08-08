import { jsonSvc, profileSvc } from "apis/services"
import { myPageImg } from "assets/images"
import { ProfileHeader } from "components/layouts"
import { CustomButton, PretendText } from "components/utils"
import { Colors, Screen, ScreenParams } from "const"
import { useDidMountEffect, useInputs, useKeyboardVisible, useWrapDispatch } from "hooks"
import React, { useState, useEffect } from "react"
import { Image, TextInput, View, Platform, Keyboard } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { SafeAreaView } from "react-native-safe-area-context"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { mineCompoStyle, mineGStyle, mineStyle } from "styles"
import { navigate, RatioUtil } from "utils"
import { UserValid } from "validators"
import { PhotoNftPopup, ProfileButton } from "./mine.compo"
import { BlurView } from "@react-native-community/blur"
import { useRoute, RouteProp } from "@react-navigation/native"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import { Modal } from "react-native"
import dayjs from "dayjs"
import { ErrorModal } from "components/Common"

//프로필 변경할 때 이미지, 닉네임, 인사말 받아와서 보여주고 수정하기
const Myedit = () => {
    // const [data] = useQuery(profileSvc.getMyProfile)
    // const nickInput = useInputs({
    //     validCheck: UserValid.nickname,
    //     value: "",
    // })

    // const greetInput = useInputs({
    //     validCheck: UserValid.greeting,
    //     value: "",
    // })
    const route = useRoute<RouteProp<ScreenParams, Screen.MYEDIT>>()
    const [data, setData] = useState(route.params.data)

    const [existErrMsg, setExistErrMsg] = useState("")
    const isVisible = useKeyboardVisible()
    const nickInput = useInputs({
        validCheck: UserValid.nickname,
        value: route.params.data.NICK,
    })

    const greetInput = useInputs({
        validCheck: UserValid.greeting,
        value: route.params.data.HELLO,
    })

    const previousGreet = route.params.data.HELLO
    const previousNick = route.params.data.NICK
    const [activeBorder, setActiveBorder] = useState({
        nickname: false,
        greet: false,
    })

    const previousIconName = data?.ICON_NAME
    const previousIconType = data?.ICON_TYPE

    const popUpDispatch = useWrapDispatch(setPopUp)
    const modalDispatch = useWrapDispatch(setModal)

    const createEditedImg = () => ({
        // ...ConfigUtil.getProfile(data?.ICON_NAME, data?.ICON_TYPE),
        name: data?.ICON_NAME,
        type: data?.ICON_TYPE,
        nftSeq: -1,
    })

    const [editedImg, setEditedImg] = useState(createEditedImg())

    useEffect(() => {
        setEditedImg(createEditedImg())
    }, [data?.ICON_NAME, data?.ICON_TYPE])

    useEffect(() => {
        if (!isVisible) Keyboard.dismiss()
    }, [isVisible])

    // console.error(editedImg)

    const [isChange, setIsChange] = useState(false)

    // useDidMountEffect(() => {
    //     if (greetInput.value.length) setIsChange(greetInput.isValid)
    //     else setIsChange(false)
    // }, [greetInput.value, greetInput.isValid])

    const checkExistNick = async (value: string, flag: boolean) => {
        if (flag) {
            const isexist = await profileSvc.checkNick(value)
            setExistErrMsg(isexist ? jsonSvc.findLocalById("160006") : "")
        }
    }

    useDidMountEffect(() => {
        // if (nickInput.value.length) setIsChange(nickInput.isValid)
        // else setIsChange(false)

        checkExistNick(nickInput.value, nickInput.isValid)
    }, [nickInput.value, nickInput.isValid])

    useDidMountEffect(() => {
        if (
            nickInput.value.length > 0 &&
            greetInput.value.length > 0 &&
            greetInput.isValid &&
            nickInput.isValid &&
            editedImg.nftSeq &&
            existErrMsg === "" &&
            (nickInput.value !== previousNick ||
                greetInput.value !== previousGreet ||
                editedImg.name !== previousIconName)
        ) {
            setIsChange(true)
        } else {
            setIsChange(false)
        }
    }, [editedImg.nftSeq, greetInput.value, greetInput.isValid, nickInput.value, nickInput.isValid, existErrMsg])

    const onSave = async () => {
        if (!data) return
        const banNick = dayjs(data.NICK_SANCTION_AT) > dayjs()
        const banGreet = dayjs(data.HELLO_SANCTION_AT) > dayjs()

        if (banNick && banGreet) {
            modalDispatch({
                open: true,
                children: (
                    <ErrorModal
                        msg="신고로 인해 3일간 닉네임 및 인사말 수정이 제한된 계정입니다."
                        onPress={() =>
                            modalDispatch({
                                open: false,
                            })
                        }
                    />
                ),
            })
            return
        } else if (greetInput.value === previousGreet && banNick) {
            modalDispatch({
                open: true,
                children: (
                    <ErrorModal
                        msg="신고로 인해 3일 간 닉네임을 변경할 수 없습니다."
                        onPress={() =>
                            modalDispatch({
                                open: false,
                            })
                        }
                    />
                ),
            })
            return
        } else if (nickInput.value === previousNick && banGreet) {
            modalDispatch({
                open: true,
                children: (
                    <ErrorModal
                        msg="신고로 인해 3일 간 인사말을 변경할 수 없습니다."
                        onPress={() =>
                            modalDispatch({
                                open: false,
                            })
                        }
                    />
                ),
            })
            return
        }

        const dto: {
            NICK?: string
            HELLO?: string
            ICON_TYPE?: number
            NFT_SEQ?: number
        } = {}

        if (nickInput.value.length > 0 && data.NICK !== nickInput.value) {
            dto.NICK = nickInput.value
        }
        if (greetInput.value.length > 0 && data.HELLO !== greetInput.value) {
            dto.HELLO = greetInput.value
        }
        if (editedImg.nftSeq !== -1) {
            dto.ICON_TYPE = editedImg.type
            dto.NFT_SEQ = editedImg.nftSeq
        }

        try {
            if (dto.NICK && banNick) {
                modalDispatch({
                    open: true,
                    children: (
                        <ErrorModal
                            msg="신고로 인해 3일 간 닉네임을 변경할 수 없습니다."
                            onPress={() =>
                                modalDispatch({
                                    open: false,
                                })
                            }
                        />
                    ),
                })
                return
            } else if (dto.HELLO && banGreet) {
                modalDispatch({
                    open: true,
                    children: (
                        <ErrorModal
                            msg="신고로 인해 3일 간 인사말을 변경할 수 없습니다."
                            onPress={() =>
                                modalDispatch({
                                    open: false,
                                })
                            }
                        />
                    ),
                })
                return
            }
            const newProfile = await profileSvc.editMyProfile(dto)
            if (!!newProfile.USER_PROFILE.USER_SEQ)
                modalDispatch({
                    open: true,
                    children: (
                        <CustomButton
                            style={{
                                width: "100%",
                                height: "100%",
                                justifyContent: "center",
                                alignContent: "center",
                            }}
                        >
                            <View
                                style={{
                                    overflow: "hidden",
                                    alignSelf: "center",
                                    borderRadius: RatioUtil.width(10),
                                    ...RatioUtil.size(144, 170),
                                }}
                            >
                                <BlurView style={{ ...RatioUtil.size(144, 170) }} blurType="dark" blurRadius={23} />
                                <View
                                    style={{
                                        position: "relative",
                                        alignItems: "center",
                                        bottom: RatioUtil.height(125),
                                    }}
                                >
                                    <AnimatedLottieView
                                        source={lotties.check}
                                        style={{ width: RatioUtil.font(48), height: RatioUtil.font(48) }}
                                        autoPlay
                                        loop={false}
                                    />
                                    <PretendText
                                        style={[
                                            mineCompoStyle.editCompleteModal.text,
                                            {
                                                textAlign: "center",
                                            },
                                        ]}
                                    >
                                        {/* 프로필 저장이 완료되었습니다. */}
                                        {jsonSvc.findLocalById("10000015")}
                                    </PretendText>
                                </View>
                            </View>
                        </CustomButton>
                    ),
                })
            navigate(Screen.MYPAGE)
            setTimeout(() => {
                modalDispatch({ open: false })
            }, 2000)
        } catch (error) {
            console.log(error)
        }
    }

    return data ? (
        <SafeAreaView style={mineGStyle.con}>
            {/* <ProfileHeader title="프로필 변경" /> */}
            <ProfileHeader title={jsonSvc.findLocalById("160004")} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <View style={mineStyle.edit.titleCon}>
                    <ProfileButton
                        // img={{ uri: editedImg.uri }}
                        conStyle={mineStyle.edit.profileButtonCon}
                        imgStyle={mineStyle.edit.profileButtonImg}
                        iconStyle={mineStyle.edit.profileButtonIcon}
                        name={editedImg.name}
                        type={editedImg.type}
                        onPress={() => {
                            //popUpDispatch({
                            modalDispatch({
                                open: true,
                                children: <PhotoNftPopup editedImg={editedImg} setEditedImg={setEditedImg} />,
                            })
                            // popUpDispatch({
                            //     open: true,
                            //     children: <EditImgPopup setEditedImg={setEditedImg} />,
                            // })
                        }}
                    />

                    <View
                        style={{
                            ...mineStyle.edit.inputCon,
                            height: RatioUtil.height(98),
                            marginTop: RatioUtil.height(16),
                        }}
                    >
                        <PretendText style={mineStyle.edit.inputTitle}>{jsonSvc.findLocalById("160005")}</PretendText>
                        <TextInput
                            value={nickInput.value}
                            onChange={nickInput.onValidChange}
                            onFocus={() => setActiveBorder(b => ({ ...b, nickname: true }))}
                            onBlur={() => setActiveBorder(b => ({ ...b, nickname: false }))}
                            style={{
                                ...mineStyle.edit.input,
                                borderWidth: activeBorder["nickname"] ? 2 : 1,
                                borderColor: nickInput.isValid ? Colors.GRAY7 : Colors.RED2,
                                height: RatioUtil.height(48),
                                textAlignVertical: "center",
                                color: Colors.BLACK,
                                fontSize: RatioUtil.font(14),
                                ...Platform.select({
                                    ios: {
                                        lineHeight: RatioUtil.height(28),
                                    },
                                    android: {},
                                }),
                            }}
                            maxLength={jsonSvc.findConstById(30000).nIntValue || undefined}
                            placeholder={data.NICK}
                            placeholderTextColor={Colors.GRAY3}
                            multiline={true}
                            // keyboardType={Platform.OS == "ios" ? "ascii-capable" : "visible-password"}
                        />
                        {!nickInput.isValid || existErrMsg !== "" ? (
                            <View style={mineStyle.edit.errCon}>
                                <Image source={myPageImg.error} />
                                <PretendText style={mineStyle.edit.errMsg}>
                                    {!nickInput.isValid ? nickInput.errorMsg : existErrMsg}
                                </PretendText>
                            </View>
                        ) : null}

                        <PretendText style={{ ...mineStyle.edit.inputLength, top: RatioUtil.height(39) }}>
                            {/* {nickInput.value.length}/{jsonSvc.findConstById(30000).nIntValue} */}
                            {jsonSvc.formatLocal(jsonSvc.findLocalById("7078"), [
                                nickInput.value.length.toString(),
                                jsonSvc.findConstById(30000).nIntValue.toString(),
                            ])}
                        </PretendText>
                    </View>

                    <View
                        style={{
                            ...mineStyle.edit.inputCon,
                            height: RatioUtil.height(144),
                            marginTop: RatioUtil.height(16),
                        }}
                    >
                        <PretendText style={mineStyle.edit.inputTitle}>
                            {/* 인사말 */}
                            {jsonSvc.findLocalById("160007")}
                        </PretendText>
                        <TextInput
                            value={greetInput.value}
                            onChange={greetInput.onValidChange}
                            onFocus={() => setActiveBorder(b => ({ ...b, greet: true }))}
                            onBlur={() => setActiveBorder(b => ({ ...b, greet: false }))}
                            style={{
                                ...mineStyle.edit.input,
                                borderWidth: activeBorder["greet"] ? 2 : 1,
                                borderColor: greetInput.isValid ? Colors.GRAY7 : Colors.RED2,
                                height: RatioUtil.height(94),
                                textAlignVertical: "top",
                                color: Colors.BLACK,
                                fontSize: RatioUtil.font(14),
                            }}
                            maxLength={jsonSvc.findConstById(30001).nIntValue || undefined}
                            placeholder={data.HELLO}
                            placeholderTextColor={Colors.GRAY3}
                            multiline={true}
                            // keyboardType={Platform.OS == "ios" ? "ascii-capable" : "visible-password"}
                        />
                        {greetInput.isValid || (
                            <View style={mineStyle.edit.errCon}>
                                <Image source={myPageImg.error} />
                                <PretendText style={mineStyle.edit.errMsg}>{greetInput.errorMsg}</PretendText>
                            </View>
                        )}
                        <PretendText style={{ ...mineStyle.edit.inputLength, top: RatioUtil.height(88) }}>
                            {jsonSvc.formatLocal(jsonSvc.findLocalById("7078"), [
                                greetInput.value.length.toString(),
                                jsonSvc.findConstById(30001).nIntValue.toString(),
                            ])}
                        </PretendText>
                    </View>

                    <CustomButton onPress={onSave} disabled={!isChange} style={{ marginTop: 5 }}>
                        <View
                            style={{
                                ...mineStyle.edit.saveButtonCon,
                                backgroundColor: isChange ? Colors.BLACK : Colors.GRAY,
                            }}
                        >
                            <PretendText
                                style={{
                                    ...mineStyle.edit.saveButtonTitle,
                                    color: isChange ? Colors.WHITE : Colors.BLACK + "33",
                                }}
                            >
                                {/* 저장 */}
                                {jsonSvc.findLocalById("160009")}
                            </PretendText>
                        </View>
                    </CustomButton>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    ) : (
        <></>
    )
}

export default Myedit
