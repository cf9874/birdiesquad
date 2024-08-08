import { nftDetailImg } from "assets/images"
import React, { useCallback, useEffect, useState } from "react"
import { Image, Pressable, View, BackHandler, Modal, TouchableOpacity, Text, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ConfigUtil, navigate, RatioUtil } from "utils"
import { NftEnergyChage, NftTraining, NftLevelUp, NftCard, NftCircle } from "../nft/components"
import { useQuery, useScreen, useToggle, useWrapDispatch } from "hooks"
import { setModal, setToast } from "store/reducers/config.reducer"
import { nftStyle } from "styles/nft.style"
import { Colors, NFT_MAX_GRADE, NFT_MAX_LEVEL, Grade, GradeName, Screen } from "const"
import LinearGradient from "react-native-linear-gradient"
import { CircularProgress, CustomButton, PretendText } from "components/utils"
import { nftSvc } from "apis/services/nft.svc"
import { Nft, ProfileApiData } from "apis/data"
import { useRoute } from "@react-navigation/native"
import { MainHeader, MyPageFooter } from "components/layouts"
import { WalletToast } from "../nft/components/popup/walletToast"
import { jsonSvc, profileSvc } from "apis/services"
import dayjs from "dayjs"
import { ReadyModal } from "components/Common"
import { useDispatch, useSelector } from "react-redux"
import store from "store"
import { setGameLoader, setSetGameModalData } from "store/reducers/getGame.reducer"
import { callSetGameApi } from "common/GlobalFunction"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NFT_DETAIL_SCREEN_TUTORIAL } from "const/wallet.const"
import Svg, { Polygon } from "react-native-svg"
import {
    addSelectedUpgradeMaterialNft,
    removeAllSelectedUpgradeMaterialNft,
} from "store/reducers/nftUpgradeMaterials.reducer"
import { setSelectedUpgradeNft } from "store/reducers/upgradeNft.reducer"
import { MainHeaderVx } from "components/layouts/MainHeaderVx"
import { styles } from "./styles"
import AnimatedLottieView from "lottie-react-native"
import nftGradeJson from "json/nft_grade.json"
import { SvgIcon } from "components/Common/SvgIcon"

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
}

const NftDetailVx = () => {
    const route = useRoute()
    const params = route.params as {
        nftseq: number
        nftChoiceBtn?: boolean
        navigationParams: { selectedNftIndex: number }
    }
    const modalDispatch = useWrapDispatch(setModal)
    const toastDispatch = useWrapDispatch(setToast)
    const [showTutorialDetail, setShowTutorialDetail] = useState<boolean>(false)
    const [reRender, renderToggle] = useToggle()
    const [step, setStep] = useState<number>(1)
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
        } = nftResponse

        if (!assetResponse.asset) return
        if (!nftResponse) return
        setAsset({ bdst, tbora, trainigPoint })
        setNftDetail({
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

    const autoClose = () => {
        setTimeout(() => {
            toastDispatch({ open: false })
        }, 2000)
    }

    useEffect(() => {
        initInfoData()
        ;(async () => {
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
            const statusDetailNFTTutorial = await AsyncStorage.getItem(USER_ID + NFT_DETAIL_SCREEN_TUTORIAL)
            if (statusDetailNFTTutorial === "1") {
                setShowTutorialDetail(true)
            }
        })()
    }, [reRender, params.nftseq])

    useEffect(() => {
        const backAction = () => {
            navigate(Screen.NFTLIST)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])
    const finishTutorial = async () => {
        if (step === 1) {
            setStep(2)
        } else {
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
            await AsyncStorage.setItem(USER_ID + NFT_DETAIL_SCREEN_TUTORIAL, "2")
            setShowTutorialDetail(false)
        }
    }

    const gradeLimit = (grade: number, level: number) => {
        let gradeLimit = 0
        let gradeName = ""
        switch (grade) {
            case Grade.COMMON:
                gradeName = GradeName.COMMON
                gradeLimit = 999
                break
            case Grade.UNCOMMON:
                gradeName = GradeName.UNCOMMON
                gradeLimit = 5
                break
            case Grade.RARE:
                gradeName = GradeName.UNCOMMON
                gradeLimit = 3
                break

            default:
                break
        }
        return { gradeName, gradeLimit }
    }

    // 선택된 nft 상태 관리를 위해 추가
    const dispatch = useDispatch()

    // 승급 버튼 클릭
    const handleUpgradePress = () => {
        if (!nftDetail) return
        if (nftDetail.grade >= NFT_MAX_GRADE && nftDetail.level === NFT_MAX_LEVEL) {
            modalDispatch({
                open: true,
                children: <ReadyModal />,
            })
        } else if (nftDetail.level === NFT_MAX_LEVEL) {
            dispatch(setSelectedUpgradeNft(nftDetail))
            dispatch(removeAllSelectedUpgradeMaterialNft())
            navigate(Screen.NFTADVANCEMENT, { nftDetail: nftDetail })
        } else {
            modalDispatch({
                open: true,
                children: (
                    <NftLevelUp
                        level={nftDetail.level}
                        nftseq={params.nftseq}
                        bdst={asset.bdst}
                        // training={asset.trainigPoint}
                        grade={nftDetail.grade}
                        renderToggle={renderToggle}
                        playerCode={nftDetail.playerCode}
                        birdie={nftDetail.golf.birdie}
                    />
                ),
            })
        }
    }

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
                    backHome={params.nftChoiceBtn ? Screen.NFT_ADVANCEMENT_MATERIALS : Screen.NFTLIST}
                    navigationParams={params.navigationParams}
                />
            </View>
            {energyCaution ? (
                <CustomButton
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.width(58),
                        position: "absolute",
                        top: 50,
                        zIndex: 20,
                    }}
                >
                    <View style={{ alignItems: "center" }}>
                        <View
                            style={{
                                flexDirection: "row",
                                width: RatioUtil.width(340),
                                height: RatioUtil.width(58),
                                borderRadius: RatioUtil.width(10),
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                source={nftDetailImg.error2}
                                style={{
                                    width: RatioUtil.width(22),
                                    height: RatioUtil.width(22),
                                    left: RatioUtil.width(20),
                                    position: "absolute",
                                }}
                                resizeMode="contain"
                            />
                            <View
                                style={{
                                    width: RatioUtil.width(300),
                                    position: "absolute",
                                    left: RatioUtil.width(57),
                                    padding: 0,
                                    paddingRight: RatioUtil.width(20),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(12.5),
                                        paddingTop: RatioUtil.width(0),
                                        paddingBottom: RatioUtil.width(0),
                                        lineHeight: RatioUtil.width(18),
                                        fontWeight: "400",
                                    }}
                                >
                                    {/* 에너지가 부족하여 지갑으로 전송이 불가합니다. */}
                                    {jsonSvc.findLocalById("9900004")}
                                </PretendText>
                            </View>
                        </View>
                    </View>
                </CustomButton>
            ) : null}
            {commonCaution ? (
                <CustomButton
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.width(58),
                        position: "absolute",
                        top: 50,
                        zIndex: 20,
                    }}
                >
                    <View style={{ alignItems: "center" }}>
                        <View
                            style={{
                                flexDirection: "row",
                                width: RatioUtil.width(340),
                                height: RatioUtil.width(58),
                                borderRadius: RatioUtil.width(10),
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                alignItems: "center",
                            }}
                        >
                            {/* <WithLocalSvg
                                asset={nftDetailImg.error}
                                style={{
                                    width: RatioUtil.width(22),
                                    height: RatioUtil.width(22),
                                    left: RatioUtil.width(20),
                                    position: "absolute",
                                }}
                            /> */}
                            <SvgIcon name="NftDetailErrorSvg" style={{
                                    width: RatioUtil.width(22),
                                    height: RatioUtil.width(22),
                                    left: RatioUtil.width(20),
                                    position: "absolute",
                                }} />
                            <View
                                style={{
                                    width: RatioUtil.width(300),
                                    position: "absolute",
                                    left: RatioUtil.width(57),
                                    padding: 0,
                                    paddingRight: RatioUtil.width(20),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(12.5),
                                        paddingTop: RatioUtil.width(0),
                                        paddingBottom: RatioUtil.width(0),
                                        lineHeight: RatioUtil.width(18),
                                        fontWeight: "400",
                                    }}
                                >
                                    {/* Common 등급은 지갑으로 전송이 불가합니다. */}
                                    {jsonSvc.findLocalById("10000030")}
                                </PretendText>
                            </View>
                        </View>
                    </View>
                </CustomButton>
            ) : null}
            {gradeCautuion ? (
                <CustomButton
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.width(58),
                        position: "absolute",
                        top: 50,
                        zIndex: 20,
                    }}
                >
                    <View style={{ alignItems: "center" }}>
                        <View
                            style={{
                                flexDirection: "row",
                                width: RatioUtil.width(340),
                                height: RatioUtil.width(58),
                                borderRadius: RatioUtil.width(10),
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                alignItems: "center",
                            }}
                        >
                            {/* <WithLocalSvg
                                asset={nftDetailImg.error}
                                style={{
                                    width: RatioUtil.width(22),
                                    height: RatioUtil.width(22),
                                    left: RatioUtil.width(20),
                                    position: "absolute",
                                }}
                            /> */}
                            <SvgIcon name="NftDetailErrorSvg" style={{
                                    width: RatioUtil.width(22),
                                    height: RatioUtil.width(22),
                                    left: RatioUtil.width(20),
                                    position: "absolute",
                                }} />
                            <View
                                style={{
                                    width: RatioUtil.width(300),
                                    position: "absolute",
                                    left: RatioUtil.width(57),
                                    padding: 0,
                                    paddingRight: RatioUtil.width(20),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(12.5),
                                        paddingTop: RatioUtil.width(0),
                                        paddingBottom: RatioUtil.width(0),
                                        lineHeight: RatioUtil.width(18),
                                        fontWeight: "400",
                                    }}
                                >
                                    {`${gradeLimit(nftDetail.grade, nftDetail.level).gradeName} 등급은 LV. ${
                                        gradeLimit(nftDetail.grade, nftDetail.level).gradeLimit
                                    } 이상부터 지갑으로 전송이 가능합니다.`}
                                </PretendText>
                            </View>
                        </View>
                    </View>
                </CustomButton>
            ) : null}
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
                                        store.dispatch(setGameLoader(true))
                                        const showModal = await callSetGameApi(true)
                                        if (!showModal) {
                                            store.dispatch(setGameLoader(false))
                                            modalDispatch({
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
                                            store.dispatch(setGameLoader(true))
                                            const showModal = await callSetGameApi(true)
                                            if (!showModal) {
                                                store.dispatch(setGameLoader(false))
                                                modalDispatch({
                                                    open: true,
                                                    children: (
                                                        <NftTraining
                                                            levelPoint={nftDetail.training}
                                                            training={asset.trainigPoint}
                                                            max={nftDetail.trainingMax}
                                                            nftseq={nftDetail.seq}
                                                            level={nftDetail.level}
                                                            renderToggle={renderToggle}
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
                                    {nftDetail.level === 15 ? (
                                        <AnimatedLottieView
                                            source={{ uri: upgradeBtn }}
                                            autoPlay
                                            loop={true}
                                            style={{
                                                width: RatioUtil.width(74),
                                                height: RatioUtil.height(74),
                                            }}
                                        />
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
                                            if (nftDetail.grade === Grade.COMMON) {
                                                setCommonCautuon(true)
                                                setTimeout(() => {
                                                    setCommonCautuon(false)
                                                }, 2000)
                                                return
                                            } else if (nftDetail.energy < 100) {
                                                setEnergyCaution(true)
                                                setTimeout(() => {
                                                    setEnergyCaution(false)
                                                }, 2000)
                                                return
                                            }
                                            if (nftDetail.grade === 1) {
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

                <Modal statusBarTranslucent visible={showTutorialDetail} transparent>
                    <TouchableOpacity
                        onPress={() => finishTutorial()}
                        style={{
                            flex: 1,
                            backgroundColor: `${Colors.BLACK}60`,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {step === 1 && (
                            <View
                                style={
                                    {
                                        // position: "absolute",
                                        // top: RatioUtil.height(40),
                                        // right: RatioUtil.width(10)
                                    }
                                }
                            >
                                <View
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
                                        {/* 능력치는 실제 투어에서 선수의 성적과 연동되어 보상으로 받을 수 있어요! */}
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
                                </View>
                            </View>
                        )}
                        {step === 2 && (
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: RatioUtil.height(120),
                                    left: RatioUtil.width(10),
                                }}
                            >
                                <View
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
                                        }}
                                    >
                                        {/* 선수의 에너지를 충전하고 레벨업을 시켜보세요! */}
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
                                </View>
                            </View>
                        )}
                        {step === 2 && (
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: RatioUtil.height(120),
                                    right: RatioUtil.width(10),
                                }}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(148),
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
                                        }}
                                    >
                                        {/* 선수를 지갑으로 이동시킬 수 있어요! */}
                                        {jsonSvc.findLocalById("6024")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        justifyContent: "flex-end",
                                        flexDirection: "row",
                                        right: RatioUtil.width(55),
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
                                </View>
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

export default NftDetailVx
