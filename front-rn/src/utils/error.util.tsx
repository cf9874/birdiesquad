import { ErrorModal, ErrorTitleModal, ErrorTitleConfirmCancelModal } from "components/Common"
import { CustomButton, PretendText } from "components/utils"
import { Colors, Screen, ErrorType, SanctionCode } from "const"
import { Alert, Image, Pressable, TouchableOpacity, View } from "react-native"
import store from "store"
import { setModal, setToast } from "store/reducers/config.reducer"
import { navigateReset, RatioUtil } from "utils"

import { ErrorData } from "apis/data"
import { walletStyle } from "styles/wallet.style"
import { jsonSvc } from "apis/services"
import { FanRank, errorModalImg, nftDetailImg } from "assets/images"
import { WalletToast } from "screens/nft/components"
import { TermsModal } from "components/Common/TermsModal"

export const ErrorUtil = {
    genToast: (toastMessage: string) => {
        store.dispatch(
            setToast({
                open: true,
                children: <WalletToast message={toastMessage} image="NftDetailErrorSvg" />,
            })
        )
        setTimeout(() => {
            store.dispatch(setToast({ open: false }))
        }, 2000)
    },
    genModal: (msg?: string, onPress?: () => void, preventClose: boolean = false) => {
        store.dispatch(
            setModal({
                open: true,
                children: <ErrorModal msg={msg} onPress={onPress} />,
                preventClose,
            })
        )
    },
    genTitleModal: (title?: string, msg?: string, onPress?: () => void, preventClose: boolean = false) => {
        store.dispatch(
            setModal({
                open: true,
                children: <ErrorTitleModal title={title} msg={msg} onPress={onPress} />,
                preventClose,
            })
        )
    },
    genTitleConfirmCancelModal: (title?: string, msg?: string, onPress?: () => void|Promise<void>, preventClose: boolean = false) => {
        store.dispatch(
            setModal({
                open: true,
                children: <ErrorTitleConfirmCancelModal title={title} msg={msg} onPress={onPress} />,
                preventClose,
            })
        )
    },
    panUp: (data: ErrorData) => {
        if (data.data?.message === ErrorType.NOTALLOWSELF) {
            // Alert.alert(ErrorMsg[error.data?.message])
            store.dispatch(
                setModal({
                    open: true,
                    children: (
                        <View
                            style={{
                                backgroundColor: Colors.WHITE,
                                alignSelf: "center",
                                alignItems: "center",
                                ...RatioUtil.size(272, 163),
                                ...RatioUtil.borderRadius(16),
                            }}
                        >
                            <PretendText
                                style={{
                                    ...RatioUtil.margin(30, 34, 30, 34),
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "400",
                                    lineHeight: RatioUtil.font(16) * 1.4,
                                    textAlign: "center",
                                    color: Colors.BLACK3,
                                }}
                            >
                                {"본인의 인기점수는\n올릴 수 없습니다."}
                            </PretendText>
                            <CustomButton
                                onPress={() => {
                                    store.dispatch(setModal({ open: false }))
                                }}
                                style={{
                                    ...RatioUtil.size(232, 48),
                                    ...RatioUtil.borderRadius(24),
                                    backgroundColor: Colors.BLACK,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "600",
                                        lineHeight: RatioUtil.font(14) * 1.4,
                                    }}
                                >
                                    확인
                                </PretendText>
                            </CustomButton>
                        </View>
                    ),
                })
            )
        }
    },
    log: (code: number | string, message: string) => {
        if (code === 0) {
            Alert.alert("data is Not Implemented")
        } else {
            Alert.alert(`code: ${code}\nerror: ${message}`)
            // console.error(data.data?.stack)
            console.error(message)
        }
    },
    errorAlert: (message: string) => {
        Alert.alert(message)
    },
    signIn: async () => {
        store.dispatch(
            setModal({
                open: true,
                children: (
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            alignSelf: "center",
                            alignItems: "center",
                            ...RatioUtil.borderRadius(16),
                        }}
                    >
                        <PretendText
                            style={{
                                ...RatioUtil.marginFixedRatio(30, 20, 20, 20),
                                fontSize: RatioUtil.font(16),
                                fontWeight: RatioUtil.fontWeightBold(),
                                lineHeight: RatioUtil.font(16) * 1.4,
                                textAlign: "center",
                                color: Colors.BLACK3,
                            }}
                        >
                            {"로그아웃 되었습니다."}
                            {/* temporary */}
                        </PretendText>
                        <CustomButton
                            onPress={() => {
                                store.dispatch(setModal({ open: false }))
                                navigateReset(Screen.SIGNIN)
                            }}
                            style={{
                                ...RatioUtil.sizeFixedRatio(232, 48),
                                ...RatioUtil.borderRadius(24),
                                marginBottom: RatioUtil.lengthFixedRatio(20),
                                marginHorizontal: RatioUtil.lengthFixedRatio(20),
                                backgroundColor: Colors.BLACK,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    color: Colors.WHITE,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    lineHeight: RatioUtil.font(14) * 1.4,
                                }}
                            >
                                확인
                            </PretendText>
                        </CustomButton>
                    </View>
                ),
                preventClose: true,
            })
        )
    },
    PreventWithdrwal: (message: string) => {
        store.dispatch(
            setModal({
                open: true,
                children: (
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            alignSelf: "center",
                            alignItems: "center",
                            ...RatioUtil.borderRadius(16),
                            width: "80%",
                        }}
                    >
                        <PretendText
                            style={{
                                ...RatioUtil.margin(30, 34, 30, 34),
                                fontSize: RatioUtil.font(16),
                                fontWeight: "700",
                                lineHeight: RatioUtil.font(16) * 1.4,
                                textAlign: "center",
                                color: Colors.BLACK3,
                            }}
                        >
                            {message}
                        </PretendText>
                        <CustomButton
                            onPress={() => {
                                store.dispatch(setModal({ open: false }))
                                // navigateReset(Screen.SIGNIN)
                            }}
                            style={{
                                ...RatioUtil.size(142, 38),
                                ...RatioUtil.borderRadius(24),
                                marginBottom: RatioUtil.height(30),
                                backgroundColor: Colors.BLACK,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    color: Colors.WHITE,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "600",
                                    lineHeight: RatioUtil.font(14) * 1.4,
                                }}
                            >
                                확인
                            </PretendText>
                        </CustomButton>
                    </View>
                ),
            })
        )
    },
    Withdrawal: (data: ErrorData) => {
        store.dispatch(
            setModal({
                open: true,
                children: (
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            alignSelf: "center",
                            alignItems: "center",
                            ...RatioUtil.borderRadius(16),
                        }}
                    >
                        <PretendText
                            style={{
                                ...RatioUtil.margin(30, 34, 30, 34),
                                fontSize: RatioUtil.font(16),
                                fontWeight: "700",
                                lineHeight: RatioUtil.font(16) * 1.4,
                                textAlign: "center",
                                color: Colors.BLACK3,
                            }}
                        >
                            {"다른 통합서비스를 이용중인\n계정이어서 탈퇴할 수 없습니다."}
                        </PretendText>
                        <CustomButton
                            onPress={() => {
                                store.dispatch(setModal({ open: false }))
                                navigateReset(Screen.SIGNIN)
                            }}
                            style={{
                                ...RatioUtil.size(142, 28),
                                ...RatioUtil.borderRadius(24),
                                marginBottom: RatioUtil.height(30),
                                backgroundColor: Colors.BLACK,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    color: Colors.WHITE,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "600",
                                    lineHeight: RatioUtil.font(14) * 1.4,
                                }}
                            >
                                확인
                            </PretendText>
                        </CustomButton>
                    </View>
                ),
            })
        )
    },
    tourPeriod: (data: ErrorData) => {
        if (data.data?.message === ErrorType.WRONGPERIODREWARD) {
            store.dispatch(
                setModal({
                    open: true,
                    children: (
                        <View
                            style={{
                                backgroundColor: Colors.WHITE,
                                alignSelf: "center",
                                alignItems: "center",
                                ...RatioUtil.size(280, 163),
                                ...RatioUtil.borderRadius(16),
                            }}
                        >
                            <PretendText
                                style={{
                                    ...RatioUtil.margin(30, 34, 30, 34),
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "400",
                                    lineHeight: RatioUtil.font(16) * 1.4,
                                    textAlign: "center",
                                    color: Colors.BLACK3,
                                }}
                            >
                                현재 투어보상 기간이 아닙니다.
                            </PretendText>
                            <CustomButton
                                onPress={() => {
                                    store.dispatch(setModal({ open: false }))
                                }}
                                style={{
                                    ...RatioUtil.size(232, 48),
                                    ...RatioUtil.borderRadius(24),
                                    backgroundColor: Colors.BLACK,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "600",
                                        lineHeight: RatioUtil.font(14) * 1.4,
                                    }}
                                >
                                    확인
                                </PretendText>
                            </CustomButton>
                        </View>
                    ),
                })
            )
        }
    },
    notFoundUserModal: (data: ErrorData) => {
        if (data.data?.message === ErrorType.NOTFOUNDUSER) {
            store.dispatch(
                setModal({
                    open: true,
                    children: (
                        <View style={walletStyle.header.modalMainView}>
                            <View
                                style={{
                                    ...RatioUtil.size(270, 230),
                                    ...RatioUtil.borderRadius(15),
                                    alignItems: "center",
                                    justifyContent: "center",

                                    backgroundColor: Colors.WHITE,
                                }}
                            >
                                <Image
                                    source={FanRank.alert_rank}
                                    style={{ width: RatioUtil.font(50), height: RatioUtil.font(50) }}
                                />

                                <View style={{ height: 20 }} />
                                <PretendText
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(16),
                                        color: Colors.BLACK,
                                        fontWeight: "600",
                                    }}
                                >
                                    {"탈퇴한 회원입니다."}
                                </PretendText>

                                <View style={{ height: 35 }} />
                                <TouchableOpacity
                                    onPress={() => {
                                        store.dispatch(setModal({ open: false }))
                                    }}
                                    style={{
                                        ...RatioUtil.size(230, 50),
                                        ...RatioUtil.borderRadius(40),
                                        backgroundColor: Colors.BLACK,

                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            textAlign: "center",
                                            fontSize: RatioUtil.font(14),
                                            color: Colors.WHITE,
                                            fontWeight: "600",
                                        }}
                                    >
                                        {jsonSvc.findLocalById("10010000")}
                                    </PretendText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ),
                })
            )
        }
    },
    errorInquiryModal: (data: any, message: string) => {
        if (data) {
            store.dispatch(
                setModal({
                    open: true,
                    children: (
                        <Pressable
                            onPress={() => {
                                store.dispatch(setModal({ open: false }))
                            }}
                            style={walletStyle.header.modalMainView}
                        >
                            <View
                                style={{
                                    ...RatioUtil.size(270, 230),
                                    ...RatioUtil.borderRadius(15),
                                    alignItems: "center",
                                    justifyContent: "center",

                                    backgroundColor: Colors.WHITE,
                                }}
                            >
                                <Image
                                    source={FanRank.alert_rank}
                                    style={{ width: RatioUtil.font(50), height: RatioUtil.font(50) }}
                                />

                                <View style={{ height: 20 }} />
                                <PretendText
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(16),
                                        color: Colors.BLACK,
                                        fontWeight: "600",
                                        ...RatioUtil.padding(0, 5, 0, 5),
                                    }}
                                >
                                    {message}
                                </PretendText>

                                <View style={{ height: 35 }} />
                                <TouchableOpacity
                                    onPress={() => {
                                        store.dispatch(setModal({ open: false }))
                                    }}
                                    style={{
                                        ...RatioUtil.size(230, 50),
                                        ...RatioUtil.borderRadius(40),
                                        backgroundColor: Colors.BLACK,

                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            textAlign: "center",
                                            fontSize: RatioUtil.font(14),
                                            color: Colors.WHITE,
                                            fontWeight: "600",
                                        }}
                                    >
                                        {jsonSvc.findLocalById("10010000")}
                                    </PretendText>
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    ),
                })
            )
        }
    },
    alreadyTookReward: (data: ErrorData) => {
        if (data.data?.message === ErrorType.ALREADYTOOKREWARD) {
            store.dispatch(
                setModal({
                    open: true,
                    children: (
                        <View style={walletStyle.header.modalMainView}>
                            <View
                                style={{
                                    ...RatioUtil.size(270, 230),
                                    ...RatioUtil.borderRadius(15),
                                    alignItems: "center",
                                    justifyContent: "center",

                                    backgroundColor: Colors.WHITE,
                                }}
                            >
                                <Image
                                    source={FanRank.alert_rank}
                                    style={{ width: RatioUtil.font(50), height: RatioUtil.font(50) }}
                                />

                                <View style={{ height: 20 }} />
                                <PretendText
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(16),
                                        color: Colors.BLACK,
                                        fontWeight: "600",
                                    }}
                                >
                                    {"이미 보상을 수령하셨습니다."}
                                </PretendText>

                                <View style={{ height: 35 }} />
                                <TouchableOpacity
                                    onPress={() => {
                                        store.dispatch(setModal({ open: false }))
                                    }}
                                    style={{
                                        ...RatioUtil.size(230, 50),
                                        ...RatioUtil.borderRadius(40),
                                        backgroundColor: Colors.BLACK,

                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            textAlign: "center",
                                            fontSize: RatioUtil.font(14),
                                            color: Colors.WHITE,
                                            fontWeight: "600",
                                        }}
                                    >
                                        {jsonSvc.findLocalById("10010000")}
                                    </PretendText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ),
                })
            )
        } else if (data.data?.message === ErrorType.WRONG_PERIOD_REWARD) {
            store.dispatch(
                setModal({
                    open: true,
                    children: (
                        <View style={walletStyle.header.modalMainView}>
                            <View
                                style={{
                                    ...RatioUtil.size(270, 230),
                                    ...RatioUtil.borderRadius(15),
                                    alignItems: "center",
                                    justifyContent: "center",

                                    backgroundColor: Colors.WHITE,
                                }}
                            >
                                <Image
                                    source={FanRank.alert_rank}
                                    style={{ width: RatioUtil.font(50), height: RatioUtil.font(50) }}
                                />

                                <View style={{ height: 20 }} />
                                <PretendText
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(16),
                                        color: Colors.BLACK,
                                        fontWeight: "600",
                                    }}
                                >
                                    {"현재는 보상 수령 기간이 아닙니다."}
                                </PretendText>

                                <View style={{ height: 35 }} />
                                <TouchableOpacity
                                    onPress={() => {
                                        store.dispatch(setModal({ open: false }))
                                    }}
                                    style={{
                                        ...RatioUtil.size(230, 50),
                                        ...RatioUtil.borderRadius(40),
                                        backgroundColor: Colors.BLACK,

                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            textAlign: "center",
                                            fontSize: RatioUtil.font(14),
                                            color: Colors.WHITE,
                                            fontWeight: "600",
                                        }}
                                    >
                                        {jsonSvc.findLocalById("10010000")}
                                    </PretendText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ),
                })
            )
        }
    },
    heartSendCaution: () => {
        store.dispatch(
            setModal({
                open: true,
                children: (
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            alignSelf: "center",
                            alignItems: "center",
                            ...RatioUtil.borderRadius(16),
                        }}
                    >
                        <Image
                            source={errorModalImg.error}
                            style={{
                                ...RatioUtil.margin(30, 0, 20, 0),
                            }}
                        ></Image>
                        <PretendText
                            style={{
                                ...RatioUtil.margin(0, 34, 30, 34),
                                fontSize: RatioUtil.font(16),
                                fontWeight: "400",
                                lineHeight: RatioUtil.font(16) * 1.4,
                                textAlign: "center",
                                color: Colors.BLACK3,
                            }}
                        >
                            {jsonSvc.findLocalById("10000000")}
                        </PretendText>
                        <CustomButton
                            onPress={() => {
                                store.dispatch(setModal({ open: false }))
                            }}
                            style={{
                                ...RatioUtil.size(200, 48),
                                ...RatioUtil.borderRadius(24),
                                marginHorizontal: RatioUtil.width(20),
                                marginBottom: RatioUtil.height(10),
                                backgroundColor: Colors.BLACK,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    color: Colors.WHITE,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "600",
                                    lineHeight: RatioUtil.font(14) * 1.4,
                                }}
                            >
                                확인
                            </PretendText>
                        </CustomButton>
                    </View>
                ),
            })
        )
    },
    // 권한 동의 모달창
    termsModal: () => {
        store.dispatch(
            setModal({
                open: true,
                children: <TermsModal />,
            })
        )
    },
    //회원제재
    sanctionModal: (msg: string) => {
        store.dispatch(
            setModal({
                open: true,
                children: (
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            alignSelf: "center",
                            alignItems: "center",
                            ...RatioUtil.borderRadius(16),
                        }}
                    >
                        <PretendText
                            style={{
                                ...RatioUtil.marginFixedRatio(30, 20, 20, 20),
                                fontSize: RatioUtil.font(16),
                                fontWeight: RatioUtil.fontWeightBold(),
                                lineHeight: RatioUtil.font(16) * 1.4,
                                textAlign: "center",
                                color: Colors.BLACK3,
                            }}
                        >
                            {msg}
                            {/* temporary */}
                        </PretendText>
                        <CustomButton
                            onPress={() => {
                                store.dispatch(setModal({ open: false }))
                                navigateReset(Screen.SIGNIN)
                            }}
                            style={{
                                ...RatioUtil.sizeFixedRatio(232, 48),
                                ...RatioUtil.borderRadius(24),
                                marginBottom: RatioUtil.lengthFixedRatio(20),
                                marginHorizontal: RatioUtil.lengthFixedRatio(20),
                                backgroundColor: Colors.BLACK,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    color: Colors.WHITE,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    lineHeight: RatioUtil.font(14) * 1.4,
                                }}
                            >
                                확인
                            </PretendText>
                        </CustomButton>
                    </View>
                ),
                preventClose: true,
            })
        )
    },
}
