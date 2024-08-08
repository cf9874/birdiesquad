import { AnalyticsEventName, Colors, Screen } from "const"
import { useRoute } from "@react-navigation/native"
import { useEffect, useState, useRef } from "react"
import { ImageBackground, View, BackHandler, Alert, StyleSheet } from "react-native"
import { INftList } from "./mynftlist"
import { CustomButton, PretendText } from "components/utils"
import NftImageScale from "components/utils/NFTImageScale"
import { jsonSvc, nftSvc } from "apis/services"
import { ConfigUtil, NumberUtil, RatioUtil, navigate } from "utils"
import { nftStyle } from "styles"
import { playerCardImg } from "assets/images"
import { Shadow } from "react-native-shadow-2"
import nftGradeJson from "json/nft_grade.json"
import { useDispatch } from "react-redux"
import { NftFilterType } from "const"
import { setNumNfts, setIsNeedNftUpdate, setNfts } from "store/reducers/myNft.reducer"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import FastImage from "react-native-fast-image"
import { Analytics } from "utils/analytics.util"
import { useAsyncEffect } from "hooks"

const OpenNftScreen = () => {
    const [drawNft, setDrawNft] = useState<INftList>()
    const route = useRoute()
    const params = route.params as {
        nftseq: number
        playerCode: number
        isFirst: boolean
        toNavigate?: string
        isReward: boolean
        rewardCount: number
    }

    const dispatch = useDispatch()

    const [isShowShadow, setShowShadow] = useState<boolean>(false)
    const refShowShadow = useRef(isShowShadow)
    refShowShadow.current = isShowShadow
    useEffect(() => {
        const backAction = () => {
            navigate(Screen.NFTLIST)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

        const timeoutId = setTimeout(() => {
            refShowShadow.current = true
        }, 300)

        getMyNft()

        return () => {
            backHandler.remove()
        }
    }, [])

    const getMyNft = async () => {
        const allNft = await nftSvc.getMyNftListSpending({
            order: "ASC",
            take: 0,
            page: 1,
            filterType: NftFilterType.PROFILE,
        })
        if (!allNft) {
            return
        }

        dispatch(setIsNeedNftUpdate(false))
        dispatch(setNfts(allNft.data))
        dispatch(setNumNfts(allNft.data.length))

        const draw = allNft.data.find(e => e.seq === params.nftseq)
        setDrawNft(draw)
    }

    //const player = nftSvc.getNftPlayer(params.playerCode)
    const getGradeLabel = () => {
        switch (drawNft?.grade) {
            case 1:
                // Common
                return { grade: jsonSvc.findLocalById("1"), background: playerCardImg.draw.commonBackGround }
            case 2:
                // Uncommon
                return { grade: jsonSvc.findLocalById("2"), background: playerCardImg.draw.unCommonBackGround }
            case 3:
                // Rare
                return { grade: jsonSvc.findLocalById("3"), background: playerCardImg.draw.rareBackGround }
            case 4:
                // Super Rare
                return { grade: jsonSvc.findLocalById("4"), background: "" }
            case 5:
                // Epic
                return { grade: jsonSvc.findLocalById("5"), background: playerCardImg.draw.epicBackGround }
            case 6:
                // Legendary
                return { grade: jsonSvc.findLocalById("6"), background: "" }
            default:
                return { grade: "", background: "" }
        }
    } //카드 등급

    const styles = StyleSheet.create({
        pointTextBox: {
            height: RatioUtil.heightSafeArea(47),
            width: RatioUtil.width(64),
            justifyContent: "center",
            alignItems: "center",
        },
        pointTitleText: {
            height: RatioUtil.heightSafeArea(16),
            width: RatioUtil.width(64),
            fontSize: RatioUtil.font(12),
            fontWeight: RatioUtil.fontWeightBold(),
            color: Colors.WHITE,
            textAlign: "center",
        },
        pointText: {
            width: RatioUtil.width(64),
            fontSize: RatioUtil.font(16),
            marginTop: RatioUtil.heightSafeArea(10),
            fontWeight: RatioUtil.fontWeightBold(),
            color: Colors.WHITE,
            textAlign: "center",
        },
    })

    const insets = useSafeAreaInsets()
    useAsyncEffect(async () => {
        const allNft = await nftSvc.getMyNftListSpending({
            order: "ASC",
            take: 0,
            page: 1,
            filterType: NftFilterType.PROFILE,
        })
        if (!allNft) return
        const draw = allNft.data.find(e => e.seq === params.nftseq)
        if (params.isReward) {
            await Analytics.logEvent(AnalyticsEventName.view_nft_result_21, {
                hasNewUserData: false,
                attendanceNum: params.rewardCount,
                player_code: params.playerCode,
                player_name: draw?.name,
                player_season: draw?.season,
                max_earn: draw?.amount,
                eagle: draw?.golf.eagle,
                birdie: draw?.golf.birdie,
                par: draw?.golf.par,
                bogey: draw?.golf.bogey,
                double_bogey: draw?.golf.doubleBogey,
            })
        }
    }, [])
    return (
        <View style={{ flex: 1 }}>
            <FastImage
                style={{
                    // ...RatioUtil.size(360, 800),
                    width: RatioUtil.width(360),
                    height: "100%",
                    alignItems: "center",
                }}
                source={{
                    uri: ConfigUtil.getPlayerImage(
                        nftGradeJson.find(v => v.nID === drawNft?.grade)?.sResultBackgroundPath
                    ),
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",

                        marginTop: RatioUtil.heightSafeArea(72),
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(44),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.WHITE,
                            marginLeft: RatioUtil.width(20),
                        }}
                    >
                        {getGradeLabel().grade}
                    </PretendText>
                    <View
                        style={{
                            marginRight: RatioUtil.width(20),
                        }}
                    >
                        <PretendText
                            style={{
                                textAlign: "right",
                                color: Colors.WHITE,
                                fontWeight: RatioUtil.fontWeightBold(),
                                fontSize: RatioUtil.font(14),
                            }}
                        >
                            {/* 최대보상량 */}
                            {jsonSvc.findLocalById("1019")}
                        </PretendText>
                        <PretendText
                            style={{
                                textAlign: "right",
                                color: Colors.WHITE,
                                fontWeight: RatioUtil.fontWeightBold(),
                                fontSize: RatioUtil.font(14),
                            }}
                        >
                            {NumberUtil.denoteComma(Number(drawNft?.amount))}
                        </PretendText>
                    </View>
                </View>
                <View
                    style={{
                        position: "absolute",
                        top: RatioUtil.heightSafeArea(172),
                        bottom: RatioUtil.heightSafeArea(221),
                    }}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                        }}
                    >
                        {isShowShadow ? (
                            <Shadow
                                stretch={false}
                                paintInside={true}
                                offset={[0, 5]}
                                style={{
                                    borderRadius: RatioUtil.lengthFixedRatio(30),
                                }}
                                containerStyle={{
                                    width: RatioUtil.lengthFixedRatio(210),
                                    height: RatioUtil.lengthFixedRatio(300),
                                }}
                            >
                                <NftImageScale
                                    playerCode={params.playerCode}
                                    grade={drawNft?.grade}
                                    level={drawNft?.level}
                                    birdie={drawNft?.golf.birdie}
                                    width={RatioUtil.width(210)}
                                />
                            </Shadow>
                        ) : (
                            <NftImageScale
                                playerCode={params.playerCode}
                                grade={drawNft?.grade}
                                level={drawNft?.level}
                                birdie={drawNft?.golf.birdie}
                                width={RatioUtil.width(210)}
                            />
                        )}
                    </View>
                </View>

                <View
                    style={{
                        width: RatioUtil.width(280),
                        height: RatioUtil.heightSafeArea(47),
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: RatioUtil.heightSafeArea(380),
                        flex: 1,
                    }}
                >
                    {/* <LinearGradient
                    colors={["rgba(55, 55, 55, 0.8)", "rgba(55, 55, 55, 0.9)"]}
                    angle={90}
                    useAngle={true}
                    style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 10 }}
                /> */}

                    <View style={styles.pointTextBox}>
                        <PretendText style={styles.pointTitleText}>
                            {/* 이글 */}
                            {jsonSvc.findLocalById("10")}
                        </PretendText>
                        <PretendText style={styles.pointText}>{drawNft?.golf?.eagle}</PretendText>
                    </View>
                    <View style={styles.pointTextBox}>
                        <PretendText style={styles.pointTitleText}>
                            {/* 버디 */}
                            {jsonSvc.findLocalById("11")}
                        </PretendText>
                        <PretendText style={styles.pointText}>{drawNft?.golf?.birdie}</PretendText>
                    </View>
                    <View style={styles.pointTextBox}>
                        <PretendText style={styles.pointTitleText}>
                            {/* 파 */}
                            {jsonSvc.findLocalById("12")}
                        </PretendText>
                        <PretendText style={styles.pointText}>{drawNft?.golf?.par}</PretendText>
                    </View>
                    <View style={styles.pointTextBox}>
                        <PretendText style={styles.pointTitleText}>
                            {/* 보기 */}
                            {jsonSvc.findLocalById("13")}
                        </PretendText>
                        <PretendText style={styles.pointText}>{drawNft?.golf?.bogey}</PretendText>
                    </View>
                    <View style={styles.pointTextBox}>
                        <PretendText style={styles.pointTitleText}>
                            {/* 더블보기 */}
                            {jsonSvc.findLocalById("14")}
                        </PretendText>
                        <PretendText style={styles.pointText}>{drawNft?.golf?.doubleBogey}</PretendText>
                    </View>
                </View>

                <CustomButton
                    style={{
                        width: RatioUtil.width(320),
                        height: RatioUtil.heightSafeArea(60),
                        borderRadius: 100,
                        marginTop:
                            RatioUtil.heightSafeArea(56) +
                            (RatioUtil.heightSafeArea(20) - Math.max(RatioUtil.heightSafeArea(20), insets.bottom)),
                        marginBottom: Math.max(RatioUtil.heightSafeArea(20), insets.bottom),
                        backgroundColor: "rgba(255,255,255,0.2)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={async () => {
                        await Analytics.logEvent(AnalyticsEventName.click_get_21, {
                            hasNewUserData: false,
                        })
                        if (params.isFirst) {
                            navigate(Screen.NFTLIST)
                        } else {
                            navigate(Screen.NFTDETAIL, { nftseq: params.nftseq, toNavigate: params.toNavigate })
                        }
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(16),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.WHITE,
                        }}
                    >
                        {jsonSvc.findLocalById("1012")}
                    </PretendText>
                </CustomButton>
            </FastImage>
        </View>
    )
}
export default OpenNftScreen
