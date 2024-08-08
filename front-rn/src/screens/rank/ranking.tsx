import * as React from "react"
import { MainHeader, MyPageFooter } from "components/layouts"
import { PretendText, CustomButton } from "components/utils"
import { AnalyticsEventName, Screen, ScreenParams } from "const"
import { Modal, Button, Image, Text, View, TouchableOpacity, Platform, Pressable, BackHandler } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "const"
import { ConfigUtil, RatioUtil, navigate } from "utils"
import { rankStyle } from "styles/rank.style"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import { useEffect, useState } from "react"

import PAN from "./PanTab"
import PRO from "./ProTab"
import { LayoutStyle } from "styles/layout.style"
import { MainHeaderCompo } from "components/layouts/layout.compo"
import { FanRank, mainHeaderImg } from "assets/images"
import { useStyle } from "hooks/useStyle"
import { rankSvc, profileSvc, jsonSvc } from "apis/services"
import { useAsyncEffect, useQuery, useScreen, useToggle } from "hooks"
import moment from "moment"
import { IMyProfile } from "apis/data"
import { callSetGameApi } from "common/GlobalFunction"
import { RANK_SCREEN_TUTORIAL } from "const/wallet.const"
import { APP_USER_ID } from "utils/env"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import FastImage from "react-native-fast-image"
import { IntroImg } from "assets/images"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native"
import { Analytics } from "utils/analytics.util"

const renderScene = SceneMap({
    pan: PAN,
    pro: PRO,
})
const Ranking = () => {
    const [weekCode, setWeekCode] = useState<number>(
        parseInt(moment.unix(moment().startOf("isoWeek").unix() - 604800).format("YYYYMMDD"))
    )
    const [reRender, renderToggle] = useToggle()

    const { style: mainHeaderCss } = useStyle(LayoutStyle.genMainHeader)
    const [asset, setAsset] = useState<IAsset>({
        bdst: 0,
        tbora: 0,
        trainingPoint: 0,
    })
    const [showTutorial, setShowTutorial] = useState<boolean>(false)
    const { params } = useRoute<RouteProp<ScreenParams, Screen.RANK>>()
    const [index, setIndex] = React.useState(params?.index ?? 0)
    const [routes] = React.useState([
        { key: "pan", title: jsonSvc.findLocalById("150002") },
        { key: "pro", title: jsonSvc.findLocalById("2041") },
    ])

    const onSelect = async (data: React.SetStateAction<number>) => {
        if (data === 0)
            await Analytics.logEvent(AnalyticsEventName.click_fan_tab_155, {
                hasNewUserData: true,
                first_action: "FALSE",
            })
        setIndex(data)
    }

    const [isVisible, setIsVisible] = useState(false)
    const [isSettle, setIsSettle] = useState(false)
    const [dataReward, setDataReward] = useState<{
        rewardMost: number
        rewardDonation: number
        rewardSponsor: number
        rewardHeart: number
        rewardPopularity: number
        collectPoint: number
    }>()

    const settleDateRange = async () => {
        const settleRange = await callSetGameApi(false)
        setIsSettle(!settleRange)
    }
    const myData = async () => {
        await rankSvc.rewardShow({ weekcode: weekCode }).then(async data => {
            setDataReward(data)
        })
        rankSvc.checkReward({ weekcode: weekCode }).then(async data => {
            data ? setIsVisible(false) : setIsVisible(true)
        })
        rankSvc.rewardShow({ weekcode: weekCode }).then(async data => {
            setDataReward(data)
        })
    }
    const takeReward = async () => {
        if (!dataReward) return
        await Analytics.logEvent(AnalyticsEventName.click_getReward_150, {
            hasNewUserData: true,
            get_levelpoint: dataReward.collectPoint,
        })
        await rankSvc.takeReward({ weekcode: weekCode })
        renderToggle()
    }
    const [myProfile, setMyProfile] = useState<IMyProfile>()
    const dataInitailize = async () => {
        const profile = await profileSvc.getMyProfile()
        if (!profile) return <></>

        setMyProfile(profile)
    }
    const fetchHeaderInfo = async () => {
        const asset = await profileSvc.getAsset()
        if (!asset) return
        const { bdst, tbora, training } = asset?.asset
        setAsset({ bdst: bdst ?? 0, tbora: tbora ?? 0, trainingPoint: training ?? 0 })
    }
    useEffect(() => {
        const backAction = () => {
            navigate(params?.toNavigate ? params?.toNavigate : Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])
    useFocusEffect(
        React.useCallback(() => {
            myData()
            dataInitailize()
            fetchHeaderInfo()
        }, [reRender])
    )
    useScreen(() => {
        settleDateRange()
    }, [])

    useEffect(() => {
        ;(async () => {
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)

            const statusTutorial = await AsyncStorage.getItem(USER_ID + RANK_SCREEN_TUTORIAL)
            if (!statusTutorial || statusTutorial === "1") {
                setShowTutorial(true)
            }
        })()
    })
    useAsyncEffect(async () => {
        const result = await rankSvc.rewardShow({ weekcode: weekCode })
        if (isVisible && isSettle && result.collectPoint != 0 && result.collectPoint != null) {
            Analytics.logEvent(AnalyticsEventName.view_result_150, {
                hasNewUserData: true,
            })
        }
    }, [])
    const finishTutorial = async () => {
        setShowTutorial(false)

        const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
        await AsyncStorage.setItem(USER_ID + RANK_SCREEN_TUTORIAL, "2")
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            <MainHeader
                hideArrow={true}
                training={asset?.trainingPoint}
                bdst={asset?.bdst}
                tbora={asset?.tbora}
                toNavigate={params?.toNavigate}
            />
            <TabView
                lazy={({ route }) => route.key === "pro"}
                renderTabBar={props => (
                    <TabBar
                        style={{ height: RatioUtil.lengthFixedRatio(48), backgroundColor: Colors.WHITE }}
                        indicatorStyle={{ backgroundColor: Colors.BLACK }}
                        activeColor={Colors.BLACK}
                        inactiveColor={Colors.GRAY18}
                        labelStyle={{
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(14),
                        }}
                        {...props}
                    />
                )}
                style={{ backgroundColor: Colors.WHITE }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={onSelect}
            />

            <Modal
                animationType="slide"
                statusBarTranslucent
                transparent={true}
                style={{
                    flex: 1,
                    backgroundColor: "red",
                }}
                visible={isVisible && isSettle && dataReward?.collectPoint != 0 && dataReward?.collectPoint != null}
            >
                <View style={rankStyle.header.modalMainView}>
                    <View
                        style={{
                            width: RatioUtil.width(272),
                            ...RatioUtil.paddingFixedRatio(30, 20, 30, 20),
                            backgroundColor: Colors.WHITE,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: RatioUtil.width(20),
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(18),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK,
                                height: RatioUtil.lengthFixedRatio(23),
                            }}
                        >
                            {/* 시즌 랭크 결과 */}
                            {jsonSvc.findLocalById("150073")}
                        </PretendText>
                        <Image
                            source={{
                                uri: ConfigUtil.getProfile(myProfile?.ICON_NAME, myProfile?.ICON_TYPE).profile.uri,
                            }}
                            style={{
                                ...RatioUtil.sizeFixedRatio(90, 90),
                                ...RatioUtil.marginFixedRatio(15, 0, 15, 0),
                                borderRadius: 50,
                            }}
                            resizeMode="contain"
                        />
                        <View
                            style={{
                                width: RatioUtil.width(232),
                                backgroundColor: Colors.WHITE3,
                                justifyContent: "center",
                                borderRadius: 10,
                                ...RatioUtil.marginFixedRatio(5, 0, 10, 0),
                                ...RatioUtil.paddingFixedRatio(20, 20, 20, 20),
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.GRAY2,
                                        fontSize: RatioUtil.font(13),
                                    }}
                                >
                                    {/* 응원킹 순위 */}
                                    {jsonSvc.findLocalById("150069")}
                                </PretendText>
                                <PretendText
                                    style={{
                                        color: dataReward?.rewardMost == -1 ? Colors.GRAY3 : Colors.BLACK,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        fontSize: RatioUtil.font(13),
                                    }}
                                >
                                    {dataReward?.rewardMost != -1
                                        ? jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [
                                              formatNum(dataReward?.rewardMost ?? 0),
                                          ]) // formatNum(dataReward?.rewardMost ?? 0) + "위"
                                        : jsonSvc.findLocalById("150101")}
                                </PretendText>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    marginTop: RatioUtil.lengthFixedRatio(8),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.GRAY2,
                                        fontSize: RatioUtil.font(13),
                                    }}
                                >
                                    {/* 후원금 순위 */}
                                    {jsonSvc.findLocalById("130023")}
                                </PretendText>
                                <PretendText
                                    style={{
                                        color: dataReward?.rewardDonation == -1 ? Colors.GRAY3 : Colors.BLACK,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        fontSize: RatioUtil.font(13),
                                    }}
                                >
                                    {dataReward?.rewardDonation != -1
                                        ? jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [
                                              formatNum(dataReward?.rewardDonation ?? 0),
                                          ]) // formatNum(dataReward?.rewardDonation ?? 0) + "위"
                                        : jsonSvc.findLocalById("150101")}
                                </PretendText>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    marginTop: RatioUtil.lengthFixedRatio(8),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.GRAY2,
                                        fontSize: RatioUtil.font(13),
                                    }}
                                >
                                    {/* 후원 횟수 순위 */}
                                    {jsonSvc.findLocalById("130021")}
                                </PretendText>
                                <PretendText
                                    style={{
                                        color: dataReward?.rewardSponsor == -1 ? Colors.GRAY3 : Colors.BLACK,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        fontSize: RatioUtil.font(13),
                                    }}
                                >
                                    {dataReward?.rewardSponsor != -1
                                        ? jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [
                                              formatNum(dataReward?.rewardSponsor ?? 0),
                                          ]) // formatNum(dataReward?.rewardSponsor ?? 0) + "위"
                                        : jsonSvc.findLocalById("150101")}
                                </PretendText>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    marginTop: RatioUtil.lengthFixedRatio(8),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.GRAY2,
                                        fontSize: RatioUtil.font(13),
                                    }}
                                >
                                    {/* 하트 순위 */}
                                    {jsonSvc.findLocalById("130020")}
                                </PretendText>
                                <PretendText
                                    style={{
                                        color: dataReward?.rewardHeart == -1 ? Colors.GRAY3 : Colors.BLACK,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        fontSize: RatioUtil.font(13),
                                    }}
                                >
                                    {dataReward?.rewardHeart != -1
                                        ? jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [
                                              formatNum(dataReward?.rewardHeart ?? 0),
                                          ]) // formatNum(dataReward?.rewardHeart ?? 0) + "위"
                                        : jsonSvc.findLocalById("150101")}
                                </PretendText>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    marginTop: RatioUtil.lengthFixedRatio(8),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.GRAY2,
                                        fontSize: RatioUtil.font(13),
                                    }}
                                >
                                    {/* 프로필 인기 순위 */}
                                    {jsonSvc.findLocalById("150011")}
                                </PretendText>
                                <PretendText
                                    style={{
                                        color: dataReward?.rewardPopularity == -1 ? Colors.GRAY3 : Colors.BLACK,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        fontSize: RatioUtil.font(13),
                                    }}
                                >
                                    {dataReward?.rewardPopularity != -1
                                        ? jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [
                                              formatNum(dataReward?.rewardPopularity ?? 0),
                                          ]) //  formatNum(dataReward?.rewardPopularity ?? 0) + "위"
                                        : jsonSvc.findLocalById("150101")}
                                </PretendText>
                            </View>
                        </View>
                        <View
                            style={{
                                ...RatioUtil.sizeFixedRatio(232, 49),
                                backgroundColor: Colors.WHITE3,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderRadius: 10,
                                ...RatioUtil.paddingFixedRatio(0, 20, 0, 20),
                            }}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(13),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* 수령 포인트 */}
                                {jsonSvc.findLocalById("150074")}
                            </PretendText>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={FanRank.point_yellow}
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(14, 14),
                                        marginRight: RatioUtil.width(6),
                                        borderRadius: 50,
                                    }}
                                />
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(16),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {dataReward?.collectPoint}
                                </PretendText>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setIsVisible(false)
                                takeReward()
                            }}
                        >
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: RatioUtil.lengthFixedRatio(30),
                                    backgroundColor: Colors.BLACK,
                                    borderRadius: 50,
                                    ...RatioUtil.sizeFixedRatio(232, 48),
                                }}
                            >
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: Colors.WHITE,
                                    }}
                                >
                                    {/* 수령하기 */}
                                    {jsonSvc.findLocalById("110049")}
                                </PretendText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <MyPageFooter />

            {showTutorial ? (
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
                            style={{ flex: 1, justifyContent: "flex-end", bottom: 0, backgroundColor: "transparent" }}
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
                                            랭크 보상 받기
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
                                            응원과 후원 활동을 통해{"\n"}육성 포인트 보상을 획득할 수 있습니다.
                                        </PretendText>
                                        <FastImage
                                            source={IntroImg.rankcard0101}
                                            style={{
                                                ...RatioUtil.sizeFixedRatio(236, 375),
                                                marginTop: RatioUtil.lengthFixedRatio(38),
                                            }}
                                        />
                                        <FastImage
                                            source={IntroImg.rankcard0102}
                                            style={{
                                                ...RatioUtil.sizeFixedRatio(344, 96),
                                                position: "absolute",
                                                top: RatioUtil.lengthFixedRatio(417),
                                                left: RatioUtil.width(11),
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </BottomSheet>
                </CustomButton>
            ) : null}
        </SafeAreaView>
    )
}
const formatNum = (num: number) => {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
interface IAsset {
    bdst: number
    tbora: number
    trainingPoint: number
}
export default Ranking
