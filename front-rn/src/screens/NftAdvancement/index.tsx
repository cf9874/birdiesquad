import React, { useState, useEffect, useRef } from "react"
import { BackHandler, Image, ImageBackground, Modal, Platform, StatusBar, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { mainHeaderImg, nftAdvancementImg, nftDetailImg, playerCardImg } from "assets/images"
import { styles } from "./styles"
import { CustomButton, PretendText } from "components/utils"
import { MainHeaderVx } from "components/layouts/MainHeaderVx"
import { jsonSvc, profileSvc, walletSvc } from "apis/services"
import { BlurView } from "@react-native-community/blur"
import NftImage from "components/utils/NFTImageVx"
import { useAppSelector, useWrapDispatch } from "hooks"
import { setPopUp } from "store/reducers/config.reducer"
import { NftGradeUp } from "screens/nft/components/popup/nftGradeUp.popup"
import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import { ConfigUtil, navigate, RatioUtil } from "utils"
import { Colors, Screen } from "const"
import { useDispatch, useSelector } from "react-redux"
import NftUpgradeEffectPlayer from "./nftUpgradeEffectPlayer"
import { removeSelectedUpgradeMaterialNft } from "store/reducers/nftUpgradeMaterials.reducer"
import localJson from "json/local.json"
import { IAsset, NftType, ResponseUpgradeNftInfo, Route } from "./types"
import { WalletToast } from "screens/nft/components"
import { setToast } from "store/reducers/config.reducer"
import SlidingUpPanel from "rn-sliding-up-panel"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NFT_ADVANCEMENT_SCREEN_TUTORIAL } from "const/wallet.const"
import { useFocusEffect } from "@react-navigation/native"
import NftAdvancementTutorial from "./tutorial"
import Help from "./help"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import nftGradeJson from "json/nft_grade.json"
import { NftGrade } from "const"
import FastImage from "react-native-fast-image"
import { APP_USER_ID } from "utils/env"
import { Shadow } from "react-native-shadow-2"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export interface tab {
    title: string
    component: () => void
}

const NftAdvancement = () => {
    const initGradeValue = { common: 0, rare: 0, uncommon: 0 }
    const popUpDispatch = useWrapDispatch(setPopUp)
    const [index, setIndexAdvancementHelp] = useState(0)
    const [routes] = useState([{ key: "help", title: "" }])
    const selectedNft = useSelector((state: any) => state.nftUpgradeMaterialsReducer)
    const onSelectAdvancementHelp = (data: React.SetStateAction<number>) => setIndexAdvancementHelp(data)
    const [asset, setAsset] = useState<{
        bdst: number
        tbora: number
        trainingPoint: number
    }>({
        bdst: 0,
        tbora: 0,
        trainingPoint: 0,
    })

    // 투어 게임 정산 결과
    const tourGameCalculate = useSelector((state: any) => state.tourGameCalculateReducer)

    // 승급 대상 NFT
    const upgradeTargetNft = useSelector((state: any) => state.upgradeNftReducer)
    const [isVisibleAdvancementHelp, setIsVisibleAdvancementHelp] = useState<boolean>(false)
    const [targetedGradeId, setTargetedGradeId] = useState<keyof typeof localJson>("1")
    const [upgradedGradeId, setUpgradedGradeId] = useState<keyof typeof localJson>("1")
    const [upgradeInfoData, setUpgradeInfoData] = useState<ResponseUpgradeNftInfo>({
        subNftCount: 2,
        successRate: initGradeValue,
        successRateOther: initGradeValue,
        upgradeCost: initGradeValue,
        upgradeLevel: 15,
    })
    const [successRate, setSuccessRate] = useState<number>(0)
    const [upgradeCost, setUpgradeCost] = useState<number>(0)
    const [showAdvancementScreenTutorial, setShowAdvancementScreenTutorial] = useState<boolean>(false)
    const [step, setStep] = useState<number>(1)
    const isAllSelectedNft = selectedNft.every((nft: NftType) => Object.keys(nft).length > 0)
    const refSlidingUpPanel = useRef<SlidingUpPanel | null>(null)

    const insets = useSafeAreaInsets()

    const _Help = () => {
        return (
            <View style={{ flex: 1 }}>
                <Help upgradeInfoData={upgradeInfoData} />
            </View>
        )
    }
    const renderScene = SceneMap({
        help: _Help,
    })

    //튜토리얼 완료 처리
    const finishTutorial = async () => {
        if (step === 1) {
            refSlidingUpPanel?.current?.show()
            setStep(2)
        } else {
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
            await AsyncStorage.setItem(USER_ID + NFT_ADVANCEMENT_SCREEN_TUTORIAL, "2")
            refSlidingUpPanel?.current?.hide()
            setShowAdvancementScreenTutorial(false)
        }
    }

    const fetchAssetData = async () => {
        const asset = await profileSvc.getAsset()
        const {
            asset: { bdst, tbora, training: trainingPoint },
        } = asset as IAsset
        if (asset) setAsset({ bdst, tbora, trainingPoint })
    }

    // 승급 관련 정보 조회 및 비용 계산
    const calcSuccessRate = async (): Promise<void> => {
        await walletSvc
            .getUpgradeNftInfo()
            .then(data => {
                setUpgradeInfoData(data)
                const targetedGradeId = upgradeTargetNft.grade as unknown as keyof typeof localJson
                setTargetedGradeId(targetedGradeId)
                const grade = jsonSvc.findLocalById(targetedGradeId).toLowerCase()
                setUpgradeCost(data.upgradeCost[grade])
                const upgradedGradeId = (upgradeTargetNft.grade + 1) as unknown as keyof typeof localJson
                setUpgradedGradeId(upgradedGradeId)
                if (isAllSelectedNft) {
                    if (
                        upgradeTargetNft.playerCode === selectedNft[0].playerCode &&
                        upgradeTargetNft.playerCode === selectedNft[1].playerCode
                    ) {
                        setSuccessRate(data.successRate[grade])
                    } else if (
                        upgradeTargetNft.playerCode !== selectedNft[0].playerCode ||
                        upgradeTargetNft.playerCode !== selectedNft[1].playerCode
                    ) {
                        setSuccessRate(data.successRateOther[grade])
                    }
                } else {
                    setSuccessRate(0)
                }
            })
            .catch(error => {
                console.log("FAIL:", error)
            })
    }

    useEffect(() => {
        fetchAssetData()
        calcSuccessRate()
    }, [isAllSelectedNft])

    useEffect(() => {
        const backAction = () => {
            navigate(Screen.NFTDETAIL, { nftseq: upgradeTargetNft.seq, toNavigate: Screen.NFTLIST })
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            ;(async () => {
                const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
                const status = await AsyncStorage.getItem(USER_ID + NFT_ADVANCEMENT_SCREEN_TUTORIAL)
                if (status === "1") {
                    setShowAdvancementScreenTutorial(true)
                }
            })()
        }, [upgradeTargetNft.seq])
    )

    // 승급 결과 effect video 모달창
    const [modalVisible, setModalVisible] = useState(false)
    const dispatch = useDispatch()

    // 토스타 팝업
    const toastDispatch = useWrapDispatch(setToast)

    // 승급 조건 검사 및 에러 메시지, 이미지 설정
    const checkUpgradeCondition = () => {
        // 정산 여부
        const isCalculateTime = tourGameCalculate.isClculate

        if (isCalculateTime) {
            return ["대회 보상 정산 중에는 승급이 불가능합니다.", "NftDetailErrorSvg"]
        }
        if (asset.bdst < upgradeCost) {
            return ["BDP가 부족합니다.", "NftDetailErrorSvg"]
        }
        if (!isAllSelectedNft) {
            return ["재료 NFT를 선택해주세요.", "NftDetailErrorSvg"]
        }
        return [null, null]
    }

    // 승급하기 버튼 클릭
    const handleUpgradePress = () => {
        const [toastMessage, toastImage] = checkUpgradeCondition()

        if (toastMessage && toastImage) {
            toastDispatch({
                open: true,
                children: <WalletToast message={toastMessage} image={toastImage} />,
            })
            setTimeout(() => {
                toastDispatch({ open: false })
            }, 2000)
            return // 조건에 부합하면 여기서 함수를 종료합니다.
        }

        // 모든 조건을 만족 했을 때,
        popUpDispatch({
            open: true,
            children: (
                <NftGradeUp
                    targetNftId={upgradeTargetNft.seq}
                    setModalVisible={setModalVisible}
                    successRate={successRate}
                    upgradeCost={upgradeCost}
                />
            ),
        })
    }

    // NFT 승급 결과 상태
    const effectBackground = ConfigUtil.getPlayerImage(
        nftGradeJson.find(v => v.nID === upgradeTargetNft.grade)?.sUpgradeEffectBackgroundPath
    )
    const nftUpgradeResultReducer = useSelector((state: any) => state.nftUpgradeResultReducer)
    const nftGrade: string = NftGrade[upgradeTargetNft.grade].toLowerCase()

    return (
        <SafeAreaView style={styles.mainView}>
            {/* 승급 예상 결과 백그라운드 이펙트 화면 */}
            <View style={styles.cardEffectCon}>
                {isVisibleAdvancementHelp ? (
                    <View style={styles.cardEffect}></View>
                ) : (
                    <FastImage source={{ uri: effectBackground }} style={styles.cardEffect} />
                )}
                <View style={styles.advancementExpectArea}>
                    <View style={styles.advancementExpectCon}>
                        {/* 승급할 선수 */}
                        <View style={styles.advancementNftCardABox}>
                            <NftImage
                                grade={upgradeTargetNft.grade}
                                birdie={upgradeTargetNft.golf.birdie}
                                energy={upgradeTargetNft.energy}
                                level={upgradeTargetNft.level}
                                playerCode={upgradeTargetNft.playerCode}
                                style={styles.advancementNftCardImage}
                            />
                            <PretendText style={styles.nftCardGrade}>
                                {jsonSvc.findLocalById(targetedGradeId)}
                            </PretendText>
                        </View>
                        {/* 승급 예상 결과 선수 */}
                        <View style={styles.advancementNftCardBBox}>
                            <View>
                                <FastImage
                                    source={nftAdvancementImg.nftBgEffect}
                                    style={styles.upgradedNftBgEffect}
                                ></FastImage>
                                <NftImage
                                    grade={upgradeTargetNft.grade + 1}
                                    level={1}
                                    playerCode={upgradeTargetNft.playerCode}
                                    style={styles.advancementNftCardImage}
                                />
                            </View>
                            <PretendText style={styles.nftCardGrade}>
                                {upgradedGradeId === "1" ? "" : jsonSvc.findLocalById(upgradedGradeId)}
                            </PretendText>
                        </View>
                    </View>
                    {/* 변환 방향 화살표 */}
                    <View style={styles.upgradeArrowbox}>
                        <AnimatedLottieView source={lotties.arrow} style={styles.upgradeArrow} autoPlay loop={true} />
                    </View>
                    <Shadow
                        stretch={true}
                        paintInside={true}
                        offset={[0, 0]}
                        style={styles.selectNftConShadow}
                        distance={20}
                        startColor={"#00000015"}
                        endColor={"#00000000"}
                    >
                        <View style={styles.selectNftBox}>
                            {/* 승급 도움말 모달창 */}
                            <Modal
                                animationType="fade"
                                statusBarTranslucent
                                transparent={true}
                                style={{
                                    flex: 1,
                                }}
                                visible={isVisibleAdvancementHelp}
                            >
                                <View
                                    style={{
                                        ...styles.helpHeaderModalMainView,
                                        marginTop: Platform.OS === "ios" ? insets.top : StatusBar.currentHeight,
                                        backgroundColor: Colors.BLACK,
                                    }}
                                >
                                    <View style={styles.helpBoxFlex}>
                                        <View style={styles.helpHeaderCon}>
                                            <PretendText style={[styles.helpHeaderText]}>
                                                {/* NFT 도움말 */}
                                                {jsonSvc.findLocalById("ELEVATE_HELP_TITLE")}
                                            </PretendText>
                                            <View style={styles.helpBoxCloseCon}>
                                                <TouchableOpacity onPress={() => setIsVisibleAdvancementHelp(false)}>
                                                    <Image source={nftDetailImg.close} style={styles.helpBoxCloseImg} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <TabView
                                            renderTabBar={props => {
                                                return (
                                                    <TabBar
                                                        style={{ height: 0 }}
                                                        indicatorStyle={{ opacity: 0 }}
                                                        {...props}
                                                    />
                                                )
                                            }}
                                            style={{ backgroundColor: "#F7F9FC" }}
                                            navigationState={{ index, routes }}
                                            renderScene={renderScene}
                                            onIndexChange={onSelectAdvancementHelp}
                                        />
                                    </View>
                                </View>
                            </Modal>
                            {/* 승급 진행 이펙트 모달 */}
                            <NftUpgradeEffectPlayer
                                nftData={upgradeTargetNft}
                                isNftUpgrade={nftUpgradeResultReducer.isUpgrade}
                                videoUrl={
                                    nftDetailImg[`${nftGrade}${nftUpgradeResultReducer.isUpgrade ? "Pass" : "Fail"}`]
                                }
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                            />
                        </View>
                    </Shadow>
                </View>
            </View>
            {/* 승급 재료 선택 영역 */}
            <View style={styles.selectNftBoxBackgroundCon}>
                <View style={styles.selectNftBoxBackground}>
                    {Object.keys(selectedNft[0]).length === 0 ? (
                        <View>
                            <FastImage
                                source={nftAdvancementImg.nftMaterialsDashbox}
                                resizeMode={FastImage.resizeMode.stretch}
                                style={styles.selectNftBackground}
                            >
                                <TouchableOpacity
                                    style={styles.selectedNft}
                                    onPress={() =>
                                        navigate(Screen.NFT_ADVANCEMENT_MATERIALS, {
                                            navigationParams: { selectedNftIndex: 0 },
                                        })
                                    }
                                >
                                    {/* 승급 재료를 선택해주세요 */}
                                    <PretendText style={styles.selectNftText}>
                                        {jsonSvc.findLocalById("ELEVATE_MATERIAL_CHOICE_MAIN")}
                                    </PretendText>
                                </TouchableOpacity>
                            </FastImage>
                        </View>
                    ) : (
                        <View style={styles.selectedNftRemoveBox}>
                            {/* 재료 카드 1 선택 취소 버튼 */}
                            <CustomButton
                                style={styles.selectedNftRemoveButton}
                                onPress={() => dispatch(removeSelectedUpgradeMaterialNft(0))}
                            >
                                <FastImage
                                    source={nftAdvancementImg.nftMaterialsCancel}
                                    style={styles.selectedNftRemoveImg}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </CustomButton>
                            {/* 선택된  재료카드1 */}
                            <NftImage
                                grade={selectedNft[0].grade}
                                birdie={selectedNft[0].golf.birdie}
                                energy={selectedNft[0].energy}
                                level={selectedNft[0].level}
                                playerCode={selectedNft[0].playerCode}
                                levelTextStyle={styles.selectedNftImgLevelText}
                                nameTextStyle={styles.selectedNftImgNameText}
                                subTextStyle={styles.selectedNftImgSubText}
                                style={styles.selectedNftCardImage}
                            />
                        </View>
                    )}
                    <Image source={playerCardImg.nftAdd} style={styles.selectedNftImage} resizeMode="contain" />
                    {Object.keys(selectedNft[1]).length === 0 ? (
                        <FastImage
                            source={nftAdvancementImg.nftMaterialsDashbox}
                            resizeMode={FastImage.resizeMode.stretch}
                            style={styles.selectNftBackground}
                        >
                            <TouchableOpacity
                                style={styles.selectedNft}
                                onPress={() =>
                                    navigate(Screen.NFT_ADVANCEMENT_MATERIALS, {
                                        navigationParams: { selectedNftIndex: 1 },
                                    })
                                }
                            >
                                {/* 승급 재료를 선택해주세요 */}
                                <PretendText style={styles.selectNftText}>
                                    {jsonSvc.findLocalById("ELEVATE_MATERIAL_CHOICE_MAIN")}
                                </PretendText>
                            </TouchableOpacity>
                        </FastImage>
                    ) : (
                        <View style={styles.selectedNftRemoveBox}>
                            {/* 재료카드 2 선택 취소 버튼 */}
                            <CustomButton
                                style={styles.selectedNftRemoveButton}
                                onPress={() => dispatch(removeSelectedUpgradeMaterialNft(1))}
                            >
                                <FastImage
                                    source={nftAdvancementImg.nftMaterialsCancel}
                                    style={styles.selectedNftRemoveImg}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </CustomButton>
                            {/* 선택된 재료카드 2 */}
                            <NftImage
                                grade={selectedNft[1].grade}
                                birdie={selectedNft[1].golf.birdie}
                                energy={selectedNft[1].energy}
                                level={selectedNft[1].level}
                                playerCode={selectedNft[1].playerCode}
                                levelTextStyle={styles.selectedNftImgLevelText}
                                nameTextStyle={styles.selectedNftImgNameText}
                                subTextStyle={styles.selectedNftImgSubText}
                                style={styles.selectedNftCardImage}
                            />
                        </View>
                    )}
                </View>
                {/* 승급 관련 정보 영역 */}
                <View style={styles.successInfoCon}>
                    <View style={styles.successInfoBox}>
                        <View style={styles.successInfoTitleBox}>
                            <View style={styles.successTitle}>
                                <PretendText style={styles.successTitleText}>
                                    {/* 성공 확률 */}
                                    {jsonSvc.findLocalById("ELEVATE_RATE")}
                                </PretendText>
                                {/* 승급 도움말 */}
                                <View style={styles.helpBox}>
                                    <View style={styles.helpBoxBorder}>
                                        <BlurView
                                            style={styles.helpBoxBackGround}
                                            overlayColor=""
                                            blurRadius={25}
                                            blurType="dark"
                                        />
                                        <CustomButton
                                            style={styles.helpBtn}
                                            onPress={() => setIsVisibleAdvancementHelp(true)}
                                        >
                                            <Image
                                                source={nftAdvancementImg.help}
                                                resizeMode="contain"
                                                style={styles.helpImg}
                                            />
                                        </CustomButton>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {isAllSelectedNft ? (
                            <PretendText style={styles.successValue}>{`${successRate}%`}</PretendText>
                        ) : (
                            <PretendText style={styles.successNullValue}>0%</PretendText>
                        )}
                    </View>
                    <View style={styles.priceInfoBox}>
                        <PretendText style={styles.priceTitleText}>
                            {/* 승급 가격 */}
                            {jsonSvc.findLocalById("ELEVATE_COST")}
                        </PretendText>
                        <View style={styles.priceValueBox}>
                            <ImageBackground
                                source={mainHeaderImg.point}
                                resizeMode="contain"
                                style={styles.priceTypeImage}
                            />
                            <PretendText style={styles.priceValue}>{upgradeCost}</PretendText>
                        </View>
                    </View>
                    {/* 승급하기 버튼 */}
                    <View style={styles.advancementButtonBox}>
                        <CustomButton onPress={handleUpgradePress} style={[styles.advancementButton]}>
                            <PretendText style={[styles.advancementButtonTitle]}>
                                {/* 승급하기 */}
                                {jsonSvc.findLocalById("ELEVATE_BUTTON")}
                            </PretendText>
                        </CustomButton>
                    </View>
                </View>
            </View>
            <View>
                {/* 보유 자산 헤더바 */}
                <MainHeaderVx
                    training={asset.trainingPoint}
                    bdst={asset.bdst}
                    tbora={asset.tbora}
                    hideArrow={false}
                    backHome={Screen.NFTDETAIL}
                    nftSeq={upgradeTargetNft.seq}
                    toNavigate={Screen.NFTDETAIL}
                />
            </View>
            {/* TUTORIAL */}
            <NftAdvancementTutorial
                showAdvancementScreenTutorial={showAdvancementScreenTutorial}
                finishTutorial={finishTutorial}
                step={step}
            />
        </SafeAreaView>
    )
}

export default NftAdvancement
