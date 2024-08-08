import { TutorialBox, nftDetailImg } from "assets/images"
import React, { useCallback, useEffect, useState } from "react"
import {
    Image,
    Pressable,
    View,
    BackHandler,
    Modal,
    TouchableOpacity,
    Text,
    Platform,
    ImageBackground,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ConfigUtil, navigate, RatioUtil } from "utils"
import { NftEnergyChage, NftTraining, NftLevelUp, NftCard, NftCircle } from "./components"
import { useAsyncEffect, useToggle, useWrapDispatch } from "hooks"
import { setModal, setPopUp, setToast } from "store/reducers/config.reducer"
import { nftStyle } from "styles/nft.style"
import {
    Colors,
    NFT_MAX_GRADE,
    NFT_MAX_LEVEL,
    Grade,
    Screen,
    AnalyticsEventName,
    ThirdPartyAnalyticsEventName,
} from "const"
import LinearGradient from "react-native-linear-gradient"
import { CircularProgress, CustomButton, PretendText } from "components/utils"
import { nftSvc } from "apis/services/nft.svc"
import { useFocusEffect, useRoute } from "@react-navigation/native"
import { WalletToast } from "./components/popup/walletToast"
import { jsonSvc, profileSvc } from "apis/services"
import dayjs from "dayjs"
import { ReadyModal } from "components/Common"
import { useDispatch } from "react-redux"
import store from "store"
import { setGameLoader, setSetGameModalData } from "store/reducers/getGame.reducer"
import { callSetGameApi } from "common/GlobalFunction"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { HOME_SCREEN_TUTORIAL, NFT_DETAIL_SCREEN_TUTORIAL, TutorialId } from "const/wallet.const"
import Svg, { Polygon } from "react-native-svg"
import {
    addSelectedUpgradeMaterialNft,
    removeAllSelectedUpgradeMaterialNft,
} from "store/reducers/nftUpgradeMaterials.reducer"
import { setSelectedUpgradeNft } from "store/reducers/upgradeNft.reducer"
import { MainHeaderVx } from "components/layouts/MainHeaderVx"
import { styles } from "../NftAdvancement/styles"
import AnimatedLottieView from "lottie-react-native"
import nftGradeJson from "json/nft_grade.json"
import { APP_USER_ID } from "utils/env"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import FastImage from "react-native-fast-image"
import { IntroImg } from "assets/images"
import Animated, {
    withTiming,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    cancelAnimation,
    withRepeat,
    Easing,
} from "react-native-reanimated"
import { ArrowDownBlack } from "assets/images/index-svg"
import { SvgIcon } from "components/Common/SvgIcon"
import { Analytics } from "utils/analytics.util"
import nftPlayer from "json/nft_player.json"

interface IAsset {
    asset: {
        training: number
        bdst: number
        tbora: number
    }
}
export interface INft {
    golf: {
        eagle: number
        birdie: number
        par: number
        bogey: number
        doubleBogey: number
    }
    seq: number
    playerCode: number
    seasonCode?: number
    owner_seq?: number
    serial?: string
    regDate?: dayjs.Dayjs
    grade: number
    level: number
    training: number
    energy: number
    trainingMax: number
    maxReward: number
    wallet?: {
        grade: number
        level: number
    }
    isNew: boolean
    isEquipped: number
}
const NftDetail = () => {
    const route = useRoute()
    const params = route.params as {
        nftseq: number
        nftChoiceBtn?: boolean
        toNavigate: string
        navigationParams: { selectedNftIndex: number }
    }
    const modalDispatch = useWrapDispatch(setModal)
    const popupDispatch = useWrapDispatch(setPopUp)
    const toastDispatch = useWrapDispatch(setToast)
    const [showTutorialDetail, setShowTutorialDetail] = useState<boolean>(false)
    const [reRender, renderToggle] = useToggle()
    const [step, setStep] = useState<number>(1)
    const [modalStatus, setModalStatus] = useState<boolean>(false)
    const [asset, setAsset] = useState<{
        bdst: number
        tbora: number
        trainigPoint: number
    }>({
        bdst: 0,
        tbora: 0,
        trainigPoint: 0,
    })
    const [nftDetail, setNftDetail] = useState<INft>()

    // 육성 성공 여부
    const [trainingSuccess, setTrainingSuccess] = useState(false)

    const initInfoData = async () => {
        const assetResponse = await profileSvc.getAsset()
        const nftResponse = await nftSvc.getDetail(params.nftseq)
        const {
            asset: { bdst, tbora, training: trainigPoint },
        } = assetResponse as IAsset

        const {
            golf,
            level,
            seq,
            training,
            trainingMax,
            energy,
            grade,
            serial,
            seasonCode,
            wallet,
            maxReward,
            playerCode,
            isNew,
            isEquipped,
        } = nftResponse
        if (!assetResponse.asset) return
        if (!nftResponse) return
        setAsset({ bdst, tbora, trainigPoint })
        setNftDetail({
            isEquipped,
            isNew,
            golf,
            level,
            seq,
            training,
            trainingMax,
            grade: grade ?? 1,
            seasonCode,
            serial,
            maxReward,
            wallet,
            energy: energy ?? 0,
            playerCode: playerCode ?? 0,
        })
    }
    const [energyCaution, setEnergyCaution] = useState(false)
    const [commonCaution, setCommonCautuon] = useState(false)
    const [gradeCautuion, setGradeCautuon] = useState(false)
    const [isEquippedCautuion, setIsEquippedCautuion] = useState(0)

    const [visibleTrainingTooltip, showTrainingTooltip] = useState(false)
    const [visibleLevelupTooltip, showLevelupTooltip] = useState(false)
    const [visibleGradeupTooltip, showGradeupTooltip] = useState(false)

    const tooltipAnimIndex = useSharedValue(0)

    const tooltipAnimate = () => {
        tooltipAnimIndex.value = 0
        tooltipAnimIndex.value = withRepeat(
            withTiming(1, {
                duration: 2500,
                easing: Easing.quad,
            }),
            -1
        )
    }
    const stopTooltipAnimate = () => {
        cancelAnimation(tooltipAnimIndex)
    }
    const tooltipAnimStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(tooltipAnimIndex.value, [0, 0.05, 0.09, 0.12, 1], [0, 0, 6, 0, 0]),
                },
            ],
            //opacity: interpolate(tooltipAnimIndex.value, [0, 1], [1, 0.5, 1])
        }
    })

    const autoClose = () => {
        setTimeout(() => {
            toastDispatch({ open: false })
        }, 2000)
    }

    useEffect(() => {
        const backAction = () => {
            if (params.nftChoiceBtn) {
                navigate(Screen.NFT_ADVANCEMENT_MATERIALS, { navigationParams: params.navigationParams })
            } else {
                navigate(params.toNavigate === Screen.PROCESSIN ? Screen.PROCESSIN : Screen.NFTLIST)
            }
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [params])

    useEffect(() => {
        initInfoData()
        ;(async () => {
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)

            const statusDetailNFTTutorial = await AsyncStorage.getItem(USER_ID + NFT_DETAIL_SCREEN_TUTORIAL)
            if (statusDetailNFTTutorial !== "4") {
                setShowTutorialDetail(true)
            }
        })()
    }, [reRender])

    // NFT 육성 성공 후 NFT 레벨업 팝업창 띄움
    useAsyncEffect(async () => {
        if (!nftDetail) return
        await Analytics.logEvent(AnalyticsEventName.click_levelup_start_85, {
            hasNewUserData: true,
            first_action: "FALSE",
            player_grade: nftDetail.grade,
            player_level: nftDetail.level,
        })
        if (trainingSuccess) {
            await Analytics.logEvent(AnalyticsEventName.view_levelup_85, {
                hasNewUserData: true,
                first_action: "FALSE",
            })
            popupDispatch({
                open: true,
                children: (
                    <NftLevelUp
                        level={nftDetail.level}
                        nftseq={params.nftseq}
                        bdst={asset.bdst}
                        grade={nftDetail.grade}
                        renderToggle={renderToggle}
                        playerCode={nftDetail.playerCode}
                        birdie={nftDetail.golf.birdie}
                        setModalStatus={setModalStatus}
                    />
                ),
            })
            setTrainingSuccess(false)
        }
    }, [trainingSuccess])

    useEffect(() => {
        if (!nftDetail) return

        if (nftDetail.training !== nftDetail.trainingMax) {
            showGradeupTooltip(false)
            showLevelupTooltip(false)

            if (asset.trainigPoint >= nftDetail.trainingMax) {
                // 육성 가능
                showTrainingTooltip(true)
                tooltipAnimate()
            } else {
                // 라이브 대회를 통해 육성포인트를 획득하세요
                showTrainingTooltip(false)
                stopTooltipAnimate()
            }
        } else {
            showTrainingTooltip(false)

            if (nftDetail.level === NFT_MAX_LEVEL) {
                // 승급 가능
                showGradeupTooltip(true)
                showLevelupTooltip(false)
                tooltipAnimate()
            } else {
                try {
                    const upgradeInfo = jsonSvc.findUpgradeByLevelAndGrade(nftDetail.level + 1, nftDetail.grade)
                    if (!upgradeInfo) return

                    showGradeupTooltip(false)
                    if (asset.bdst >= upgradeInfo.nRequiredToken) {
                        // 레벨업 가능
                        showLevelupTooltip(true)
                        tooltipAnimate()
                    } else {
                        // 대회에 선수를 출전시켜 BDP를 획득하세요
                        showLevelupTooltip(false)
                        stopTooltipAnimate()
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        }

        return () => {
            stopTooltipAnimate()
        }
    }, [nftDetail, asset])

    useFocusEffect(
        useCallback(() => {
            initInfoData()

            return () => {
                // Add your cleanup code here
                // For example, you might want to reset the NFT detail state:
                setNftDetail(undefined)
            }
        }, [params.nftseq])
    )
    useAsyncEffect(async () => {
        const nftResponse = await nftSvc.getDetail(params.nftseq)
        const player = nftPlayer.find(e => e.nPersonID === nftResponse?.playerCode)
        await Analytics.logEvent(AnalyticsEventName.view_nft_70, {
            hasNewUserData: true,
            player_code: nftResponse?.playerCode,
            player_name: player?.sPlayerName,
            player_season: nftResponse?.seasonCode,
        })
    }, [])
    const finishTutorial = async () => {
        if (step === 1) {
            setStep(2)
        } else if (step === 2) {
            setStep(3)
        } else if (step === 3) {
            setStep(4)
        } else {
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
            await AsyncStorage.setItem(USER_ID + NFT_DETAIL_SCREEN_TUTORIAL, "4").then(() => {
                Analytics.thirdPartyLogEvent(ThirdPartyAnalyticsEventName.af_tutorial_completion, {
                    af_success: "TRUE",
                    af_tutorial_id: TutorialId[NFT_DETAIL_SCREEN_TUTORIAL],
                })
            })
            setShowTutorialDetail(false)
        }
    }
    const gradeLimit = (grade: number, level: number) => {
        let gradeLimit = 0
        let gradeName = ""
        switch (grade) {
            case Grade.COMMON:
                gradeName = jsonSvc.findLocalById("1")
                gradeLimit = jsonSvc.findGradeById(Grade.COMMON).nWalletNFTLevel
                break
            case Grade.UNCOMMON:
                gradeName = jsonSvc.findLocalById("2")
                gradeLimit = jsonSvc.findGradeById(Grade.UNCOMMON).nWalletNFTLevel
                break
            case Grade.RARE:
                gradeName = jsonSvc.findLocalById("3")
                gradeLimit = jsonSvc.findGradeById(Grade.RARE).nWalletNFTLevel
                break
            case Grade.SUPERRARE:
                gradeName = jsonSvc.findLocalById("4")
                gradeLimit = jsonSvc.findGradeById(Grade.SUPERRARE).nWalletNFTLevel
                break
            // case Grade.EPIC:
            //     gradeName = jsonSvc.findLocalById("5")
            //     gradeLimit = jsonSvc.findGradeById(Grade.EPIC).nWalletNFTLevel
            //     break
            // case Grade.LEGENDARY:
            //     gradeName = jsonSvc.findLocalById("6")
            //     gradeLimit = jsonSvc.findGradeById(Grade.LEGENDARY).nWalletNFTLevel
            //     break

            default:
                break
        }
        return { gradeName, gradeLimit }
    }

    // 선택된 nft 상태 관리를 위해 추가
    const dispatch = useDispatch()

    // 승급 버튼 클릭
    const handleUpgradePress = async () => {
        if (!nftDetail) return
        await Analytics.logEvent(AnalyticsEventName.click_elevate_70, {
            hasNewUserData: true,
            first_action: "FALSE",
            player_grade: nftDetail.grade,
        })
        const showModal = await callSetGameApi(true)
        if (!showModal) {
            if (nftDetail.grade >= NFT_MAX_GRADE && nftDetail.level === NFT_MAX_LEVEL) {
                modalDispatch({
                    open: true,
                    children: <ReadyModal />,
                })
            } else if (nftDetail.level === NFT_MAX_LEVEL) {
                if (!modalStatus) {
                    dispatch(setSelectedUpgradeNft(nftDetail))
                    dispatch(removeAllSelectedUpgradeMaterialNft())
                    navigate(Screen.NFTADVANCEMENT, { nftDetail: nftDetail })
                }
            } else {
                if (!modalStatus) {
                    popupDispatch({
                        open: true,
                        children: (
                            <NftLevelUp
                                level={nftDetail.level}
                                nftseq={params.nftseq}
                                bdst={asset.bdst}
                                grade={nftDetail.grade}
                                renderToggle={renderToggle}
                                playerCode={nftDetail.playerCode}
                                birdie={nftDetail.golf.birdie}
                                setModalStatus={setModalStatus}
                            />
                        ),
                    })
                }
            }
        } else {
            store.dispatch(
                setSetGameModalData({
                    title: jsonSvc.findLocalById("10000025"),
                    // desc1: "NFT 레벨 업그레이드는",
                    // desc2: "잠시 후 다시 진행 해 주세요.",
                    desc1: jsonSvc.findLocalById("10000065"),
                })
            )
        }
    }

    const toastPopup = (msg: string): any => {
        toastDispatch({
            open: true,
            children: <WalletToast message={msg} image="NftDetailErrorSvg" />,
        })
        setTimeout(() => {
            toastDispatch({ open: false })
        }, 2000)
    }

    const MyBackdrop = () => (
        <BottomSheetBackdrop
            style={{
                backgroundColor: "transparent",
            }}
            animatedIndex={{
                value: 0,
            }}
            animatedPosition={{
                value: 0,
            }}
        />
    )

    const upgradeBtn = ConfigUtil.getPlayerImage(nftGradeJson.find(v => v.nID === nftDetail?.grade)?.sUpgradeButtonPath)
    return nftDetail && asset ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            <View
                style={{
                    zIndex: 20,
                }}
            >
                <MainHeaderVx
                    training={asset.trainigPoint}
                    bdst={asset.bdst}
                    tbora={asset.tbora}
                    backHome={
                        params.nftChoiceBtn
                            ? Screen.NFT_ADVANCEMENT_MATERIALS
                            : params.toNavigate === Screen.NFTLIST
                            ? Screen.NFTLIST
                            : Screen.PROCESSIN
                    }
                    navigationParams={params.navigationParams}
                    toNavigate={params.nftChoiceBtn ? Screen.NFT_ADVANCEMENT_MATERIALS : params.toNavigate}
                />
            </View>
            {energyCaution ? toastPopup(jsonSvc.findLocalById("9900004")) : null}
            {commonCaution ? toastPopup(jsonSvc.findLocalById("10000030")) : null}
            {gradeCautuion
                ? toastPopup(
                      `${gradeLimit(nftDetail.grade, nftDetail.level).gradeName} 등급은 Lv.${
                          gradeLimit(nftDetail.grade, nftDetail.level).gradeLimit
                      } 이상부터 지갑으로 전송이 가능합니다.`
                  )
                : null}
            {/* hazel - 마이스쿼드 장착시 지갑 전송 불가 예외처리 */}
            {isEquippedCautuion ? toastPopup(`스쿼드에 배치된 NFT는 지갑 전송이 불가합니다.`) : null}
            <NftCard detail={nftDetail} />
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                }}
            >
                {params.nftChoiceBtn ? (
                    <View style={styles.choiceNftMaterialWrapper}>
                        <Text style={styles.choiceNftMaterialDescription}>
                            승급 진행 시 재료로 사용된 NFT는 소멸됩니다.
                        </Text>
                        <CustomButton
                            style={styles.choiceNftMaterialButton}
                            onPress={() => {
                                dispatch(
                                    addSelectedUpgradeMaterialNft({
                                        nft: nftDetail,
                                        index: params.navigationParams.selectedNftIndex,
                                    })
                                )
                                navigate(Screen.NFTADVANCEMENT, { nftDetail: nftDetail })
                            }}
                        >
                            <Text style={styles.choiceNftMaterialButtonTitle}>선택하기</Text>
                        </CustomButton>
                    </View>
                ) : (
                    <View style={nftStyle.nftButton.con}>
                        <View style={nftStyle.nftButton.btnCon}>
                            {nftDetail.energy !== null ? (
                                <Pressable
                                    style={nftStyle.nftButton.btnBox}
                                    onPress={async () => {
                                        await Analytics.logEvent(AnalyticsEventName.click_energy_70, {
                                            hasNewUserData: true,
                                            first_action: "FALSE",
                                        })
                                        store.dispatch(setGameLoader(true))
                                        const showModal = await callSetGameApi(true)
                                        if (!showModal) {
                                            store.dispatch(setGameLoader(false))
                                            await Analytics.logEvent(AnalyticsEventName.view_energy_75, {
                                                hasNewUserData: true,
                                            })
                                            popupDispatch({
                                                open: true,
                                                children: (
                                                    <NftEnergyChage
                                                        energy={nftDetail.energy}
                                                        nftseq={nftDetail.seq}
                                                        bdst={asset.bdst}
                                                        grade={nftDetail.grade}
                                                        renderToggle={renderToggle}
                                                    />
                                                ),
                                            })
                                        } else {
                                            store.dispatch(
                                                setSetGameModalData({
                                                    // title: "지금은 투어 보상 정산 중입니다.",
                                                    title: jsonSvc.findLocalById("10000025"),
                                                    // desc1: "NFT 에너지 충전은",
                                                    // desc2: "잠시 후 다시 진행 해 주세요",
                                                    desc1: jsonSvc.findLocalById("10000064"),
                                                })
                                            )
                                            store.dispatch(setGameLoader(false))
                                        }
                                    }}
                                >
                                    <CircularProgress
                                        progress={nftDetail.energy}
                                        size={RatioUtil.width(74)}
                                        strokeWidth={RatioUtil.width(10)}
                                        text={`${nftDetail.energy}%`}
                                        fontSize={RatioUtil.width(16)}
                                        linearGradient={[
                                            { offset: "0%", color: "#5567FF" }, // 에너지
                                            { offset: "100%", color: "#A1EF7A" },
                                        ]}
                                    />
                                    {/* <NftCircle value={nftDetail.energy} max={100} suffix={"%"} title={nftDetail.energy} /> */}
                                </Pressable>
                            ) : null}
                            <PretendText style={nftStyle.nftButton.btnBoxName}>
                                {jsonSvc.findLocalById("1007")}
                            </PretendText>
                        </View>

                        {nftDetail.training !== nftDetail.trainingMax ? (
                            <View style={nftStyle.nftButton.btnCon}>
                                {nftDetail.training !== null ? (
                                    <Pressable
                                        style={nftStyle.nftButton.btnBox}
                                        onPress={async () => {
                                            await Analytics.logEvent(AnalyticsEventName.click_level_70, {
                                                hasNewUserData: true,
                                                first_action: "FALSE",
                                                player_level: nftDetail.level,
                                            })
                                            if (!modalStatus) {
                                                store.dispatch(setGameLoader(true))
                                                const showModal = await callSetGameApi(true)
                                                if (!showModal) {
                                                    store.dispatch(setGameLoader(false))
                                                    await Analytics.logEvent(AnalyticsEventName.view_grow_80, {
                                                        hasNewUserData: true,
                                                    })
                                                    popupDispatch({
                                                        open: true,
                                                        children: (
                                                            <NftTraining
                                                                levelPoint={nftDetail.training}
                                                                training={asset.trainigPoint}
                                                                max={nftDetail.trainingMax}
                                                                nftseq={nftDetail.seq}
                                                                level={nftDetail.level}
                                                                renderToggle={renderToggle}
                                                                setTrainingSuccess={setTrainingSuccess}
                                                            />
                                                        ),
                                                    })
                                                } else {
                                                    store.dispatch(
                                                        setSetGameModalData({
                                                            title: jsonSvc.findLocalById("10000025"),
                                                            // desc1: "NFT 레벨 업그레이드는",
                                                            // desc2: "잠시 후 다시 진행 해 주세요.",
                                                            desc1: jsonSvc.findLocalById("10000065"),
                                                        })
                                                    )
                                                    store.dispatch(setGameLoader(false))
                                                }
                                                //nibble 승급 시 로딩 끄기
                                                store.dispatch(setGameLoader(false))
                                            }
                                        }}
                                    >
                                        <CircularProgress
                                            progress={(nftDetail.training / nftDetail.trainingMax) * 100}
                                            size={RatioUtil.lengthFixedRatio(74)}
                                            strokeWidth={RatioUtil.lengthFixedRatio(10)}
                                            text={`${nftDetail.level}`}
                                            fontSize={RatioUtil.width(16)}
                                            linearGradient={[
                                                { offset: "0%", color: "#FDD95C" }, // 레벨
                                                { offset: "100%", color: "#FFAD69" },
                                            ]}
                                        />

                                        {visibleTrainingTooltip && (
                                            <Animated.View
                                                style={[
                                                    {
                                                        flexDirection: "column",
                                                        position: "absolute",
                                                        top: RatioUtil.heightFixedRatio(-47),
                                                        alignItems: "center",
                                                    },
                                                    tooltipAnimStyle,
                                                ]}
                                            >
                                                <View
                                                    style={{
                                                        backgroundColor: Colors.BLACK,
                                                        borderRadius: RatioUtil.width(5),
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        height: RatioUtil.heightFixedRatio(36),
                                                        paddingVertical: RatioUtil.heightFixedRatio(7),
                                                        paddingHorizontal: RatioUtil.width(10),
                                                    }}
                                                >
                                                    <PretendText
                                                        style={{
                                                            color: Colors.WHITE,
                                                            fontSize: RatioUtil.font(14),
                                                            fontWeight: RatioUtil.fontWeightBold(),
                                                            textAlign: "center",
                                                            minWidth: RatioUtil.width(66),
                                                        }}
                                                        numberOfLines={1}
                                                    >
                                                        육성 가능!
                                                    </PretendText>
                                                </View>
                                                <SvgIcon
                                                    name={"ArrowDownBlack"}
                                                    width={RatioUtil.width(12)}
                                                    height={RatioUtil.heightFixedRatio(7)}
                                                    style={{
                                                        marginTop: RatioUtil.heightFixedRatio(-1),
                                                    }}
                                                />
                                            </Animated.View>
                                        )}
                                    </Pressable>
                                ) : null}
                                <PretendText style={nftStyle.nftButton.btnBoxName}>
                                    {jsonSvc.findLocalById("1001")}
                                </PretendText>
                            </View>
                        ) : (
                            <View style={nftStyle.nftButton.btnCon}>
                                {/* 승급 버튼 */}
                                <Pressable style={nftStyle.nftButton.btnBox} onPress={handleUpgradePress}>
                                    {nftDetail.level === NFT_MAX_LEVEL ? (
                                        <>
                                            <AnimatedLottieView
                                                source={{ uri: upgradeBtn }}
                                                autoPlay
                                                loop={true}
                                                resizeMode={"cover"}
                                                style={{
                                                    width: RatioUtil.width(74),
                                                    // height: RatioUtil.height(74),
                                                }}
                                            />
                                            {visibleGradeupTooltip && (
                                                <Animated.View
                                                    style={[
                                                        {
                                                            flexDirection: "column",
                                                            position: "absolute",
                                                            top: RatioUtil.heightFixedRatio(-47),
                                                            alignItems: "center",
                                                        },
                                                        tooltipAnimStyle,
                                                    ]}
                                                >
                                                    <View
                                                        style={{
                                                            backgroundColor: Colors.BLACK,
                                                            borderRadius: RatioUtil.width(5),
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            height: RatioUtil.heightFixedRatio(36),
                                                            paddingVertical: RatioUtil.heightFixedRatio(7),
                                                            paddingHorizontal: RatioUtil.width(10),
                                                        }}
                                                    >
                                                        <PretendText
                                                            style={{
                                                                color: Colors.WHITE,
                                                                fontSize: RatioUtil.font(14),
                                                                fontWeight: RatioUtil.fontWeightBold(),
                                                                textAlign: "center",
                                                                minWidth: RatioUtil.width(66),
                                                            }}
                                                            numberOfLines={1}
                                                        >
                                                            승급 가능!
                                                        </PretendText>
                                                    </View>
                                                    <SvgIcon
                                                        name={"ArrowDownBlack"}
                                                        width={RatioUtil.width(12)}
                                                        height={RatioUtil.heightFixedRatio(7)}
                                                        style={{
                                                            marginTop: RatioUtil.heightFixedRatio(-1),
                                                        }}
                                                    />
                                                </Animated.View>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <LinearGradient
                                                colors={["#FDD858", "#FFB668"]}
                                                style={nftStyle.nftButton.levelUpbtn}
                                            >
                                                <PretendText style={nftStyle.nftButton.levelUpText}>
                                                    {/* UP */}
                                                    {jsonSvc.findLocalById("160003")}
                                                </PretendText>
                                            </LinearGradient>
                                            <NftCircle
                                                value={(nftDetail.training / nftDetail.trainingMax) * 100}
                                                max={nftDetail.trainingMax}
                                                title={nftDetail.level}
                                            />
                                            {visibleLevelupTooltip && (
                                                <Animated.View
                                                    style={[
                                                        {
                                                            flexDirection: "column",
                                                            position: "absolute",
                                                            top: RatioUtil.heightFixedRatio(-47),
                                                            alignItems: "center",
                                                        },
                                                        tooltipAnimStyle,
                                                    ]}
                                                >
                                                    <View
                                                        style={{
                                                            backgroundColor: Colors.BLACK,
                                                            borderRadius: RatioUtil.width(5),
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            height: RatioUtil.heightFixedRatio(36),
                                                            paddingVertical: RatioUtil.heightFixedRatio(7),
                                                            paddingHorizontal: RatioUtil.width(10),
                                                        }}
                                                    >
                                                        <PretendText
                                                            style={{
                                                                color: Colors.WHITE,
                                                                fontSize: RatioUtil.font(14),
                                                                fontWeight: RatioUtil.fontWeightBold(),
                                                                textAlign: "center",
                                                                minWidth: RatioUtil.width(76),
                                                            }}
                                                            numberOfLines={1}
                                                        >
                                                            레벨업 가능!
                                                        </PretendText>
                                                    </View>
                                                    <SvgIcon
                                                        name={"ArrowDownBlack"}
                                                        width={RatioUtil.width(12)}
                                                        height={RatioUtil.heightFixedRatio(7)}
                                                        style={{
                                                            marginTop: RatioUtil.heightFixedRatio(-1),
                                                        }}
                                                    />
                                                </Animated.View>
                                            )}
                                        </>
                                    )}
                                </Pressable>

                                <PretendText style={nftStyle.nftButton.btnBoxName}>
                                    {nftDetail.level === NFT_MAX_LEVEL
                                        ? jsonSvc.findLocalById("1028")
                                        : jsonSvc.findLocalById("1001")}
                                </PretendText>
                            </View>
                        )}
                        <View style={nftStyle.nftButton.btnCon}>
                            <Pressable
                                style={nftStyle.nftButton.btnBox}
                                onPress={async () => {
                                    await Analytics.logEvent(AnalyticsEventName.click_wallet_send_70, {
                                        hasNewUserData: true,
                                        first_action: "FALSE",
                                    })
                                    store.dispatch(setGameLoader(true))
                                    const showModal = await callSetGameApi(true)
                                    if (!showModal) {
                                        store.dispatch(setGameLoader(false))

                                        if (nftDetail) {
                                            let grade: string = ""
                                            let minLevel: number = 0
                                            switch (nftDetail.grade) {
                                                case 1:
                                                    // grade = "Common"
                                                    grade = jsonSvc.findLocalById("1")
                                                    minLevel = 15
                                                    break
                                                case 2:
                                                    // grade = "Uncommon"
                                                    grade = jsonSvc.findLocalById("2")
                                                    minLevel = 5
                                                    break
                                                case 3:
                                                    // grade = "Rare"
                                                    grade = jsonSvc.findLocalById("3")
                                                    minLevel = 3
                                                    break
                                                default:
                                                    break
                                            }
                                            //hazel - 장착한 마이스쿼드 지갑으로 전송시 toast 출력
                                            if (nftDetail.isEquipped === 1) {
                                                await Analytics.logEvent(AnalyticsEventName.view_squad_warning_70, {
                                                    hasNewUserData: true,
                                                    player_level: nftDetail.level,
                                                })
                                                setIsEquippedCautuion(1)
                                                setTimeout(() => {
                                                    setIsEquippedCautuion(0)
                                                }, 2000)
                                                return
                                            }
                                            if (nftDetail.grade === Grade.COMMON) {
                                                setCommonCautuon(true)
                                                setTimeout(() => {
                                                    setCommonCautuon(false)
                                                }, 2000)
                                                return
                                            } else if (nftDetail.energy < 100) {
                                                await Analytics.logEvent(AnalyticsEventName.click_navi_market_45, {
                                                    hasNewUserData: true,
                                                    player_energy: nftDetail.energy,
                                                })
                                                setEnergyCaution(true)
                                                setTimeout(() => {
                                                    setEnergyCaution(false)
                                                }, 2000)
                                                return
                                            }
                                            if (nftDetail.grade === 1) {
                                                await Analytics.logEvent(AnalyticsEventName.view_common_warning_70, {
                                                    hasNewUserData: true,
                                                })
                                                toastDispatch({
                                                    open: true,
                                                    children: (
                                                        <WalletToast
                                                            message={`${grade} 등급은 지갑으로 전송이 불가합니다.`}
                                                            // image={nftDetailImg.error}
                                                            image="NftDetailErrorSvg"
                                                        />
                                                    ),
                                                })
                                            } else if (nftDetail.level < minLevel) {
                                                await Analytics.logEvent(
                                                    AnalyticsEventName[
                                                        `view_${grade.toLocaleLowerCase()}_warning_70` as AnalyticsEventName
                                                    ],
                                                    {
                                                        hasNewUserData: true,
                                                        player_level: nftDetail.level,
                                                    }
                                                )
                                                setGradeCautuon(true)
                                                setTimeout(() => {
                                                    setGradeCautuon(false)
                                                }, 2000)
                                                return
                                            } else {
                                                navigate(Screen.TRANSWALLET, {
                                                    level: nftDetail.level,
                                                    playerCode: nftDetail?.playerCode,
                                                    grade: nftDetail.grade,
                                                    golf: nftDetail.golf,
                                                    nftSeq: nftDetail.seq,
                                                })
                                            }
                                        }
                                    } else {
                                        store.dispatch(
                                            setSetGameModalData({
                                                // title: "지금은 투어 보상 정산 중입니다.",
                                                title: jsonSvc.findLocalById("10000025"),

                                                desc1: jsonSvc.findLocalById("10000063"),
                                            })
                                        )
                                        store.dispatch(setGameLoader(false))
                                    }
                                }}
                            >
                                <Image
                                    resizeMode="stretch"
                                    source={nftDetailImg.walletSend}
                                    style={nftStyle.nftButton.walletbtn}
                                />
                            </Pressable>
                            <PretendText style={nftStyle.nftButton.btnBoxName}>
                                {/* 지갑전송 */}
                                {jsonSvc.findLocalById("1018")}
                            </PretendText>
                        </View>
                    </View>
                )}

                {showTutorialDetail && step === 1 ? (
                    <CustomButton
                        onPress={() => {
                            finishTutorial()
                        }}
                        style={{
                            ...RatioUtil.size(360, Platform.OS == "ios" ? 660 : 680),
                            position: "absolute",
                            bottom: 0,
                            backgroundColor: `${Colors.BLACK}60`,
                            zIndex: 10001,
                        }}
                    >
                        <BottomSheet
                            index={1}
                            backgroundComponent={MyBackdrop}
                            snapPoints={[RatioUtil.lengthFixedRatio(552), RatioUtil.lengthFixedRatio(552)]}
                            // onChange={handleSheetChanges}
                            handleComponent={null}
                            containerStyle={{ backgroundColor: "transparent" }}
                            style={{ backgroundColor: "transparent" }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    bottom: 0,
                                    backgroundColor: "transparent",
                                }}
                            >
                                <View style={{ ...RatioUtil.sizeFixedRatio(360, 552), backgroundColor: "transparent" }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <Pressable
                                            style={{
                                                marginRight: RatioUtil.lengthFixedRatio(20),
                                                marginBottom: RatioUtil.lengthFixedRatio(15),
                                            }}
                                            onPress={() => {
                                                finishTutorial()
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    fontWeight: "500",
                                                    color: Colors.WHITE,
                                                    fontSize: RatioUtil.font(14),
                                                    textShadowColor: "#00000030",
                                                }}
                                            >
                                                닫기
                                            </PretendText>
                                        </Pressable>
                                    </View>
                                    <View
                                        style={{
                                            ...RatioUtil.sizeFixedRatio(360, 522),
                                            overflow: "hidden",
                                            borderTopLeftRadius: RatioUtil.width(15),
                                            borderTopRightRadius: RatioUtil.width(15),
                                            alignItems: "center",
                                            backgroundColor: Colors.WHITE,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: RatioUtil.width(360),
                                                height: RatioUtil.lengthFixedRatio(522),
                                                alignItems: "center",
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(24),
                                                    fontWeight: RatioUtil.fontWeightBold(),
                                                    color: Colors.BLACK,
                                                    height: RatioUtil.lengthFixedRatio(31),
                                                    marginTop: RatioUtil.lengthFixedRatio(50),
                                                    textAlign: "center",
                                                }}
                                            >
                                                프로 육성하기
                                            </PretendText>
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(16),
                                                    color: "#8787BD",
                                                    lineHeight: RatioUtil.font(16) * 1.3,
                                                    height: RatioUtil.lengthFixedRatio(42),
                                                    marginTop: RatioUtil.lengthFixedRatio(10),
                                                    textAlign: "center",
                                                }}
                                            >
                                                육성 포인트를 모아 NFT 레벨, 등급 UP!{"\n"}더 큰 보상을 위해 NFT를
                                                육성해보세요.
                                            </PretendText>
                                            <FastImage
                                                source={IntroImg.nftcard01}
                                                style={{
                                                    ...RatioUtil.sizeFixedRatio(236, 375),
                                                    marginTop: RatioUtil.lengthFixedRatio(38),
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </BottomSheet>
                    </CustomButton>
                ) : null}

                <Modal
                    visible={showTutorialDetail && step !== 1}
                    // visible={true}
                    statusBarTranslucent
                    transparent
                >
                    <TouchableOpacity
                        onPress={() => finishTutorial()}
                        style={{
                            flex: 1,
                            backgroundColor: `${Colors.BLACK}60`,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {step === 2 && (
                            <View
                                style={
                                    {
                                        // position: "absolute",
                                        // top: RatioUtil.height(40),
                                        // right: RatioUtil.width(10)
                                    }
                                }
                            >
                                <FastImage
                                    source={TutorialBox.tutorial_3_1}
                                    style={{
                                        width: RatioUtil.width(320),
                                        height: RatioUtil.heightFixedRatio(65),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    resizeMode="contain"
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "600",
                                            textAlign: "center",
                                            marginTop: RatioUtil.heightFixedRatio(-9),
                                        }}
                                    >
                                        {/* 능력치는 실제 투어에서 선수의 성적과 연동되어 보상으로 받을 수 있어요! */}
                                        아래 보이는 NFT의 능력치를 토대로{"\n"}라이브 대회 성적과 연동되어 보상이 결정됩니다.
                                    </PretendText>
                                </FastImage>
                                {/* <View
                                    style={{
                                        width: RatioUtil.width(320),
                                        padding: RatioUtil.height(10),
                                        // height: RatioUtil.height(56),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: RatioUtil.height(100),
                                        backgroundColor: `${Colors.BLACK}80`,
                                        borderColor: Colors.WHITE,
                                        borderWidth: 2,
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "600",
                                            textAlign: "center",
                                        }}
                                    >
                                        {jsonSvc.findLocalById("6022")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        justifyContent: "center",
                                        flexDirection: "row",
                                        marginTop: -2,
                                    }}
                                >
                                    <Svg height={RatioUtil.width(12)} width={RatioUtil.width(12)} viewBox="0 0 12 12">
                                        <Polygon
                                            points="0,0 12,0 6,12"
                                            fill={`${Colors.BLACK}80`}
                                            stroke={Colors.WHITE}
                                            strokeWidth={2}
                                        />
                                    </Svg>
                                </View> */}
                            </View>
                        )}
                        {step === 3 && (
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: RatioUtil.height(120),
                                    left: RatioUtil.width(10),
                                }}
                            >
                                <ImageBackground
                                    source={TutorialBox.tutorial_3_2}
                                    style={{
                                        width: RatioUtil.width(215),
                                        marginBottom: RatioUtil.height(10),
                                        height: RatioUtil.heightFixedRatio(65),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    resizeMode="contain"
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "600",
                                            textAlign: "center",
                                            marginTop: RatioUtil.heightFixedRatio(-9),
                                        }}
                                    >
                                        {/* 선수의 에너지를 충전하고 레벨업을 시켜보세요! */}
                                        에너지가 낮아지면{"\n"}보상을 받을 때 패널티가 있어요!
                                    </PretendText>
                                </ImageBackground>
                                {/* <View
                                    style={{
                                        width: RatioUtil.width(181),
                                        padding: RatioUtil.height(10),
                                        marginTop: RatioUtil.height(10),
                                        // height: RatioUtil.height(56),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: RatioUtil.height(100),
                                        backgroundColor: `${Colors.BLACK}80`,
                                        borderColor: Colors.WHITE,
                                        borderWidth: 2,
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "600",
                                            textAlign: "center",
                                        }}
                                    >
                                        {jsonSvc.findLocalById("6023")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        justifyContent: "flex-start",
                                        flexDirection: "row",
                                        left: RatioUtil.width(55),
                                        marginTop: -2,
                                    }}
                                >
                                    <Svg height={RatioUtil.width(12)} width={RatioUtil.width(12)} viewBox="0 0 12 12">
                                        <Polygon
                                            points="0,0 12,0 6,12"
                                            fill={`${Colors.BLACK}80`}
                                            stroke={Colors.WHITE}
                                            strokeWidth={2}
                                        />
                                    </Svg>
                                </View> */}
                            </View>
                        )}
                        {step === 4 && (
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: RatioUtil.height(120),
                                    left: 0,
                                    right: 0,
                                }}
                            >
                                <FastImage
                                    source={TutorialBox.tutorial_3_3}
                                    style={{
                                        width: RatioUtil.width(264),
                                        marginBottom: RatioUtil.height(10),
                                        marginLeft: RatioUtil.width(47),
                                        height: RatioUtil.heightFixedRatio(65),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    resizeMode="contain"
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "600",
                                            textAlign: "center",
                                            marginTop: RatioUtil.heightFixedRatio(-9),
                                        }}
                                    >
                                        레벨을 올릴수록 능력치가 함께 올라가요.{"\n"}15 레벨까지 올리면 승급할 수 있습니다.
                                    </PretendText>
                                </FastImage>
                                {/* <View
                                    style={{
                                        width: RatioUtil.width(320),
                                        padding: RatioUtil.height(10),
                                        marginTop: RatioUtil.height(10),
                                        marginLeft: RatioUtil.width(20),
                                        // height: RatioUtil.height(56),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: RatioUtil.height(100),
                                        backgroundColor: `${Colors.BLACK}80`,
                                        borderColor: Colors.WHITE,
                                        borderWidth: 2,
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "600",
                                            textAlign: "center",
                                        }}
                                    >
                                        레벨을 올릴수록 능력치가 함께 올라가요.{"\n"}15 레벨까지 올리면 승급할 수
                                        있습니다.
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        justifyContent: "center",
                                        flexDirection: "row",
                                        marginTop: -2,
                                    }}
                                >
                                    <Svg height={RatioUtil.width(12)} width={RatioUtil.width(12)} viewBox="0 0 12 12">
                                        <Polygon
                                            points="0,0 12,0 6,12"
                                            fill={`${Colors.BLACK}80`}
                                            stroke={Colors.WHITE}
                                            strokeWidth={2}
                                        />
                                    </Svg>
                                </View> */}
                            </View>
                        )}
                    </TouchableOpacity>
                </Modal>
            </View>
        </SafeAreaView>
    ) : (
        <></>
    )
}

export default NftDetail
