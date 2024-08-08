import { Image, ImageBackground, View, ScrollView, StatusBar } from "react-native"
import { ConfigUtil, NumberUtil, RatioUtil } from "utils"
import { homeImg, mainHeaderImg, nftDetailImg, playerCardImg } from "assets/images"
import { nftStyle } from "styles/nft.style"
import { CustomButton, PretendText } from "components/utils"
import { useDimension, useQuery, useWrapDispatch } from "hooks"
import { setModal, setToast } from "store/reducers/config.reducer"
import React, { useEffect, useState } from "react"
import { Nft } from "apis/data"
import nftPlayer from "json/nft_player.json"
import nftGrade from "json/nft_grade.json"
import { Shadow } from "react-native-shadow-2"
import { AnalyticsEventName, Colors, Grade } from "const"
import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import { TouchableOpacity } from "react-native"
import { homeStyle, rankStyle } from "styles"
import { Modal } from "react-native"
import { BlurView } from "@react-native-community/blur"
import { jsonSvc } from "apis/services"
import { SafeAreaView } from "react-native-safe-area-context"
import FastImage from "react-native-fast-image"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Analytics } from "utils/analytics.util"

interface INftCard {
    detail?: Nft.Dto
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const NftCard = ({ detail }: INftCard) => {
    const modalDispatch = useWrapDispatch(setModal)
    if (!detail) null

    const [index, setIndexRankHelp] = useState(0)
    const [routes] = useState([{ key: "help", title: "" }])
    const [isVisibleRankHelp, setIsVisibleRankHelp] = useState(false)
    const onSelectRankHelp = (data: React.SetStateAction<number>) => {
        setIndexRankHelp(data)
    }
    const renderScene = SceneMap({
        help: Help,
    })
    const onHelpBox = () => {
        setIsVisibleRankHelp(true)
    }
    const getGradeLabel = () => {
        switch (detail?.grade) {
            case Grade.COMMON:
                // return "Common"
                return jsonSvc.findLocalById("1")
            case Grade.UNCOMMON:
                // return "Uncommon"
                return jsonSvc.findLocalById("2")
            case Grade.RARE:
                // return "Rare"
                return jsonSvc.findLocalById("3")
            case Grade.SUPERRARE:
                // return "SuperRare"
                return jsonSvc.findLocalById("4")
            case Grade.EPIC:
                // return "Epic"
                return jsonSvc.findLocalById("5")
            case Grade.LEGENDARY:
                // return "Legendary"
                return jsonSvc.findLocalById("6")
            default:
                return ""
        }
    } //카드 등급

    const gradeLabel = getGradeLabel()
    const player = nftPlayer.find(e => e.nPersonID === detail?.playerCode)

    const nftBackGround = nftGrade.find(e => e.nID === detail?.grade)
    const playerImage = ConfigUtil.getPlayerImage(player?.sPlayerFullImagePath).replace("“", "").replace("“", "")

    const insets = useSafeAreaInsets()
    console.log("insets: " + JSON.stringify(insets))

    return (
        <View style={nftStyle.nftCard.con}>
            <FastImage
                source={{ uri: ConfigUtil.getPlayerImage(nftBackGround?.sFullBackgroundPath) }}
                style={{
                    height: RatioUtil.heightSafeArea(450),
                    width: RatioUtil.width(360),
                    justifyContent: "center",
                    alignItems: "center",
                    // borderBottomLeftRadius: RatioUtil.lengthFixedRatio(20),
                    // borderBottomRightRadius: RatioUtil.lengthFixedRatio(20),
                }}
                resizeMode={FastImage.resizeMode.stretch}
            />
            <FastImage
                source={{ uri: playerImage }}
                style={{
                    width: RatioUtil.width(327),
                    height: RatioUtil.heightSafeArea(310),
                    marginLeft: RatioUtil.width(90),
                    position: "absolute",
                    bottom: RatioUtil.lengthFixedRatio(51),
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
            <FastImage
                source={{ uri: ConfigUtil.getPlayerImage(nftBackGround?.sFullBackgroundGradationPath) }}
                style={{
                    height: RatioUtil.heightSafeArea(450),
                    width: RatioUtil.width(360),
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    // borderBottomLeftRadius: RatioUtil.lengthFixedRatio(20),
                    // borderBottomRightRadius: RatioUtil.lengthFixedRatio(20),
                    position: "absolute",
                }}
                resizeMode={FastImage.resizeMode.stretch}
            >
                <View style={nftStyle.nftCard.TopBox}>
                    <View style={nftStyle.nftCard.seasonBox}>
                        <PretendText style={nftStyle.nftCard.gradeText}>{gradeLabel}</PretendText>
                        <PretendText style={nftStyle.nftCard.seasonText}>{detail?.seasonCode}</PretendText>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View
                            style={{
                                flexDirection: "row",
                                borderRadius: RatioUtil.lengthFixedRatio(50),
                                //overflow: "hidden",
                                alignSelf: "center",
                                justifyContent: "flex-end",
                                width: RatioUtil.lengthFixedRatio(144),
                                height: RatioUtil.lengthFixedRatio(28),
                                elevation: 5,
                            }}
                        >
                            <Shadow
                                distance={5}
                                startColor="#00000010"
                                style={{
                                    elevation: 5,
                                    width: RatioUtil.lengthFixedRatio(144),
                                    height: RatioUtil.lengthFixedRatio(28),
                                    borderRadius: RatioUtil.lengthFixedRatio(50),
                                    overflow: "hidden",
                                }}
                            >
                                <BlurView
                                    style={[nftStyle.nftCard.earnBox]}
                                    overlayColor=""
                                    blurRadius={25}
                                    blurType="light"
                                />
                            </Shadow>
                            <View
                                style={{
                                    width: RatioUtil.lengthFixedRatio(144),
                                    height: RatioUtil.lengthFixedRatio(28),
                                    borderRadius: RatioUtil.lengthFixedRatio(50),
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    overflow: "hidden",
                                    alignSelf: "center",
                                    position: "absolute",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        height: RatioUtil.lengthFixedRatio(28),
                                        marginLeft: RatioUtil.lengthFixedRatio(10),
                                    }}
                                >
                                    <Image
                                        source={mainHeaderImg.point}
                                        resizeMode="contain"
                                        style={nftStyle.nftCard.earnImg}
                                    />
                                    <PretendText style={nftStyle.nftCard.earnText}>
                                        {/* 최대보상량 */}
                                        {jsonSvc.findLocalById("1019")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        height: RatioUtil.lengthFixedRatio(28),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <PretendText style={nftStyle.nftCard.earnPointText}>
                                        {NumberUtil.denoteComma(Number(detail?.maxReward))}
                                    </PretendText>
                                </View>
                            </View>
                        </View>

                        <View
                            style={{
                                alignSelf: "center",
                                borderRadius: RatioUtil.lengthFixedRatio(28),
                                width: RatioUtil.lengthFixedRatio(28),
                                height: RatioUtil.lengthFixedRatio(28),
                                marginLeft: RatioUtil.lengthFixedRatio(6),
                                elevation: 5,
                            }}
                        >
                            <Shadow
                                distance={5}
                                startColor="#00000010"
                                style={{
                                    elevation: 5,
                                    borderRadius: RatioUtil.lengthFixedRatio(50),
                                    overflow: "hidden",
                                }}
                            >
                                <BlurView
                                    style={nftStyle.nftCard.nftView}
                                    overlayColor=""
                                    blurRadius={25}
                                    blurType="light"
                                />
                            </Shadow>
                            <CustomButton
                                style={nftStyle.nftCard.helfbtn}
                                onPress={async () => {
                                    await Analytics.logEvent(AnalyticsEventName.click_help_70, {
                                        hasNewUserData: true,
                                        first_action: "FALSE",
                                    })
                                    // click_help_70
                                    setIsVisibleRankHelp(true)
                                }}
                            >
                                <Image
                                    source={nftDetailImg.help}
                                    resizeMode="contain"
                                    style={nftStyle.nftCard.helpbtnImg}
                                />
                            </CustomButton>
                        </View>
                    </View>
                </View>
                <View style={nftStyle.nftCard.BottomBox}>
                    <View style={nftStyle.nftCard.showNameBox}>
                        <View
                            style={{
                                height: RatioUtil.lengthFixedRatio(42),
                            }}
                        >
                            <PretendText style={nftStyle.nftCard.nameText}>{player?.sPlayerName}</PretendText>
                        </View>
                        <View
                            style={{
                                height: RatioUtil.lengthFixedRatio(23),
                                marginTop: RatioUtil.lengthFixedRatio(6),
                            }}
                        >
                            <PretendText style={[nftStyle.nftCard.codeText]}>#{detail?.serial}</PretendText>
                        </View>
                    </View>

                    <View
                        style={{
                            //overflow: "hidden",
                            alignSelf: "center",
                            borderRadius: RatioUtil.lengthFixedRatio(10),
                            ...RatioUtil.sizeFixedRatio(320, 80),
                            elevation: 5,
                            //marginTop: RatioUtil.lengthFixedRatio(20),
                            // marginTop: RatioUtil.height(20),
                        }}
                    >
                        <Shadow
                            distance={4}
                            startColor="#00000010"
                            style={{
                                elevation: 5,
                                borderRadius: RatioUtil.lengthFixedRatio(10),
                                overflow: "hidden",
                            }}
                        >
                            <BlurView style={nftStyle.nftCard.nftDataView} blurAmount={25} blurType="light" />
                        </Shadow>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                height: RatioUtil.lengthFixedRatio(80 - 33),
                                position: "absolute",
                                ...RatioUtil.marginFixedRatio(17, 20, 16, 20),
                            }}
                        >
                            <View style={nftStyle.nftCard.pointTextBox}>
                                <PretendText style={[nftStyle.nftCard.pointTitleText]}>
                                    {jsonSvc.findLocalById("10")}
                                </PretendText>
                                <PretendText style={nftStyle.nftCard.pointText}>{detail?.golf?.eagle}</PretendText>
                            </View>
                            <View style={[nftStyle.nftCard.pointTextBox]}>
                                <PretendText style={[nftStyle.nftCard.pointTitleText]}>
                                    {jsonSvc.findLocalById("11")}
                                </PretendText>
                                <PretendText style={nftStyle.nftCard.pointText}>{detail?.golf?.birdie}</PretendText>
                            </View>
                            <View style={[nftStyle.nftCard.pointTextBox]}>
                                <PretendText style={[nftStyle.nftCard.pointTitleText, { width: RatioUtil.width(30) }]}>
                                    {jsonSvc.findLocalById("12")}
                                </PretendText>
                                <PretendText style={nftStyle.nftCard.pointText}>{detail?.golf?.par}</PretendText>
                            </View>
                            <View style={[nftStyle.nftCard.pointTextBox]}>
                                <PretendText style={[nftStyle.nftCard.pointTitleText, { width: RatioUtil.width(30) }]}>
                                    {jsonSvc.findLocalById("13")}
                                </PretendText>
                                <PretendText style={nftStyle.nftCard.pointText}>{detail?.golf?.bogey}</PretendText>
                            </View>
                            <View style={[nftStyle.nftCard.pointTextBox]}>
                                <PretendText style={[nftStyle.nftCard.pointTitleText, { width: RatioUtil.width(60) }]}>
                                    {jsonSvc.findLocalById("14")}
                                </PretendText>
                                <PretendText style={nftStyle.nftCard.pointText}>
                                    {detail?.golf?.doubleBogey}
                                </PretendText>
                            </View>
                        </View>
                    </View>
                </View>
            </FastImage>
            <Modal
                animationType="fade"
                statusBarTranslucent
                //transparent={true}
                style={{
                    flex: 1,
                }}
                // visible={true}
                visible={isVisibleRankHelp}
            >
                <SafeAreaView
                    style={{
                        flex: 1,
                        position: "relative",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            ...rankStyle.header.modalMainView,
                            marginTop: insets.top,
                        }}
                    >
                        <View style={{ flex: 1, width: RatioUtil.width(360) }}>
                            <View style={rankStyle.header.con}>
                                <PretendText
                                    style={[
                                        rankStyle.header.text,
                                        { fontSize: RatioUtil.font(16), fontWeight: RatioUtil.fontWeightBold() },
                                    ]}
                                >
                                    {/* NFT 도움말 */}
                                    {jsonSvc.findLocalById("900100")}
                                </PretendText>
                                <View
                                    style={{
                                        top: RatioUtil.lengthFixedRatio(7),
                                        right: RatioUtil.width(15),
                                        position: "absolute",
                                    }}
                                >
                                    <TouchableOpacity onPress={() => setIsVisibleRankHelp(false)}>
                                        <Image
                                            source={nftDetailImg.close}
                                            style={{
                                                width: RatioUtil.lengthFixedRatio(30),
                                                height: RatioUtil.lengthFixedRatio(30),
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TabView
                                renderTabBar={props => {
                                    return <TabBar style={{ height: 0 }} indicatorStyle={{ opacity: 0 }} {...props} />
                                }}
                                style={{ backgroundColor: "#F7F9FC" }}
                                navigationState={{ index, routes }}
                                renderScene={renderScene}
                                onIndexChange={onSelectRankHelp}
                                //   initialLayout={{ width: layout.width }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    )
}
export const Help = () => {
    const [dimension, onLayout] = useDimension()

    return (
        <View style={{ flex: 1 }} onLayout={onLayout}>
            <ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        // justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            width: dimension.width,
                            paddingLeft: RatioUtil.width(20),
                            paddingRight: RatioUtil.width(20),
                            paddingTop: RatioUtil.lengthFixedRatio(30),
                            paddingBottom: RatioUtil.lengthFixedRatio(30),
                            justifyContent: "center",
                        }}
                    >
                        <PretendText style={[homeStyle.home.headerText, { fontWeight: RatioUtil.fontWeightBold() }]}>
                            {/* 선수 NFT란? */}
                            {jsonSvc.findLocalById("900101")}
                        </PretendText>
                        <PretendText
                            style={[
                                homeStyle.home.desc,
                                {
                                    marginTop: RatioUtil.lengthFixedRatio(20),
                                    fontSize: RatioUtil.font(16),
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                },
                            ]}
                        >
                            {/* 선수 NFT를 스펜딩에 보유만하고 있어도 투어에서 NFT의 능력치에 따라 보상을 획득할 수
                            있습니다. 등급이 높을 수록 더 많은 보상을 획득할 수 있습니다. (단, 출전 선수에 한함) */}
                            {jsonSvc.findLocalById("900102")}
                        </PretendText>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            marginTop: RatioUtil.lengthFixedRatio(10),
                            backgroundColor: Colors.WHITE,
                            width: dimension.width,
                            paddingLeft: RatioUtil.width(20),
                            paddingRight: RatioUtil.width(20),
                            paddingTop: RatioUtil.lengthFixedRatio(30),
                            paddingBottom: RatioUtil.lengthFixedRatio(30),
                        }}
                    >
                        <PretendText style={[homeStyle.home.headerText, { fontWeight: RatioUtil.fontWeightBold() }]}>
                            {/* NFT 능력치란? */}
                            {jsonSvc.findLocalById("900103")}
                        </PretendText>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(20),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: Colors.GRAY12,
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {/* 능력치는 NFT를 획득할 때 일정 범위 내에서 랜덤으로 설정되며, 등급이 높아질 수록 능력치
                                또한 상승합니다. */}
                                {jsonSvc.findLocalById("900104")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(14),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: Colors.GRAY12,
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {/* 능력치에는 이글, 버디, 파, 보기, 더블보기 등이 있으며 선수의 실제 투어 성적과 연계되어
                                보상을 계산하는데 사용되는 수치입니다. */}
                                {jsonSvc.findLocalById("900105")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(14),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: Colors.GRAY12,
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {/* NFT는 하나의 투어마다 최대 보상량 수치만큼 보상을 획득할 수 있습니다. */}
                                {jsonSvc.findLocalById("900106")}
                            </PretendText>
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: "white",
                        marginTop: RatioUtil.lengthFixedRatio(10),
                        width: dimension.width,
                        paddingLeft: RatioUtil.width(20),
                        paddingRight: RatioUtil.width(20),
                        paddingTop: RatioUtil.lengthFixedRatio(30),
                        // paddingBottom: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    <PretendText style={[[homeStyle.home.headerText, { fontWeight: RatioUtil.fontWeightBold() }]]}>
                        {/* 에너지란? */}
                        {jsonSvc.findLocalById("900107")}
                    </PretendText>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginTop: RatioUtil.lengthFixedRatio(20),
                            // marginBottom: RatioUtil.lengthFixedRatio(20),
                            width: RatioUtil.width(320),
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    width: RatioUtil.lengthFixedRatio(6),
                                    height: RatioUtil.lengthFixedRatio(6),
                                    marginTop: RatioUtil.lengthFixedRatio(6),
                                    marginRight: RatioUtil.lengthFixedRatio(10),
                                    backgroundColor: Colors.GRAY12,
                                    borderRadius: RatioUtil.lengthFixedRatio(10),
                                }}
                            ></View>
                        </View>
                        <PretendText
                            style={{
                                ...homeStyle.home.desc,
                                paddingRight: 0,
                                lineHeight: RatioUtil.font(16) * 1.3,
                                width: RatioUtil.width(304),
                            }}
                        >
                            {/* NFT의 에너지는 아래 표에서 해당 선수가 완료한 라운드에 해당하는 수치만큼 소모되며, NFT
                            등급에 따라 소모되는 수치가 상이합니다. 소모 시점은 정산된 투어 보상을 획득하는 시점에
                            소모됩니다. */}
                            {jsonSvc.findLocalById("900108")}
                        </PretendText>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginTop: RatioUtil.lengthFixedRatio(20),
                            marginBottom: RatioUtil.lengthFixedRatio(20),
                            width: RatioUtil.width(320),
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    width: RatioUtil.lengthFixedRatio(6),
                                    height: RatioUtil.lengthFixedRatio(6),
                                    marginTop: RatioUtil.lengthFixedRatio(6),
                                    marginRight: RatioUtil.lengthFixedRatio(10),
                                    backgroundColor: Colors.GRAY12,
                                    borderRadius: RatioUtil.lengthFixedRatio(10),
                                }}
                            ></View>
                        </View>
                        <PretendText
                            style={{
                                ...homeStyle.home.desc,
                                paddingRight: 0,
                                lineHeight: RatioUtil.font(16) * 1.3,
                                width: RatioUtil.width(304),
                            }}
                        >
                            {/* NFT의 에너지는 아래 표에서 해당 선수가 완료한 라운드에 해당하는 수치만큼 소모되며, NFT
                            등급에 따라 소모되는 수치가 상이합니다. 소모 시점은 정산된 투어 보상을 획득하는 시점에
                            소모됩니다. */}
                            {jsonSvc.findLocalById("900137")}
                        </PretendText>
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: Colors.WHITE,
                    }}
                >
                    {/* 표 */}
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <View
                            style={{
                                // marginTop: RatioUtil.lengthFixedRatio(20),
                                width: RatioUtil.width(320),
                                borderColor: "#DADEE4",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                            }}
                        >
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(14) }}
                                    >
                                        {/* 에너지 상태 */}
                                        {jsonSvc.findLocalById("900138")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(180),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(14) }}
                                    >
                                        {/* 보상 패널티 */}
                                        {jsonSvc.findLocalById("900139")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* 81 ~ 100% */}
                                        {jsonSvc.findLocalById("900140")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(180),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* 0 */}
                                        {jsonSvc.findLocalById("900145")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* 61 ~ 80% */}
                                        {jsonSvc.findLocalById("900141")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(180),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* -30% */}
                                        {jsonSvc.findLocalById("900146")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* 31 ~ 60% */}
                                        {jsonSvc.findLocalById("900142")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(180),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* -50% */}
                                        {jsonSvc.findLocalById("900147")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* 1 ~ 30% */}
                                        {jsonSvc.findLocalById("900143")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(180),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* -70% */}
                                        {jsonSvc.findLocalById("900148")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* 0% */}
                                        {jsonSvc.findLocalById("900145")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(180),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* -90% */}
                                        {jsonSvc.findLocalById("900149")}
                                    </PretendText>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginTop: RatioUtil.lengthFixedRatio(10),
                            width: RatioUtil.width(320),
                            marginLeft: RatioUtil.width(20),
                            marginRight: RatioUtil.width(20),
                            marginBottom: RatioUtil.lengthFixedRatio(30),
                        }}
                    >
                        <PretendText
                            style={(homeStyle.home.desc, { color: Colors.GRAY3, fontSize: RatioUtil.font(13) })}
                        >
                            {/* {"*상세 계산 공식은 마이페이지 > 백서를 통해 확인"} */}
                            {jsonSvc.findLocalById("900150")}
                        </PretendText>
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: "white",
                        marginTop: RatioUtil.lengthFixedRatio(10),
                        paddingTop: RatioUtil.lengthFixedRatio(30),
                        paddingBottom: RatioUtil.lengthFixedRatio(30),
                        paddingHorizontal: RatioUtil.width(20),
                    }}
                >
                    <PretendText
                        style={[
                            homeStyle.home.headerText,
                            {
                                fontWeight: RatioUtil.fontWeightBold(),
                            },
                        ]}
                    >
                        {/* 발행년도란? */}
                        {jsonSvc.findLocalById("900151")}
                    </PretendText>
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginTop: RatioUtil.lengthFixedRatio(20),
                            marginBottom: RatioUtil.lengthFixedRatio(20),
                            width: RatioUtil.width(320),
                        }}
                    >
                        <PretendText
                            style={[
                                homeStyle.home.desc,
                                {
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                },
                            ]}
                        >
                            {/* NFT 패키지를 구매하거나 획득한 시점을 토대로 발행년도가 지정됩니다. 발행이 오래된 NFT일 경우
                            발행년도 페널티를 받게되며, 등급이 높을수록 페널티가 감소합니다. */}
                            {jsonSvc.findLocalById("900152")}
                        </PretendText>
                    </View>
                    {/* 표 */}
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <View
                            style={{
                                marginTop: RatioUtil.lengthFixedRatio(20),
                                width: RatioUtil.width(320),
                                borderColor: "#DADEE4",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                            }}
                        >
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(14) }}
                                    >
                                        {/* 등급 */}
                                        {jsonSvc.findLocalById("0")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(60),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(14) }}
                                    >
                                        {/* +1년(%) */}
                                        {jsonSvc.findLocalById("900153")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(60),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(14) }}
                                    >
                                        {/* +2년 */}
                                        {jsonSvc.findLocalById("900154")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(60),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(14) }}
                                    >
                                        {/* +3년~ */}
                                        {jsonSvc.findLocalById("900155")}
                                    </PretendText>
                                </View>
                            </View>

                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* COMMON */}
                                        {jsonSvc.findLocalById("1")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -30 */}
                                        {jsonSvc.findLocalById("900156")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -50 */}
                                        {jsonSvc.findLocalById("900157")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -75 */}
                                        {jsonSvc.findLocalById("900158")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* UNCOMMON */}
                                        {jsonSvc.findLocalById("2")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -20 */}
                                        {jsonSvc.findLocalById("900159")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -40 */}
                                        {jsonSvc.findLocalById("900160")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -60 */}
                                        {jsonSvc.findLocalById("900161")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* RARE */}
                                        {jsonSvc.findLocalById("3")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -15 */}
                                        {jsonSvc.findLocalById("900162")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -30 */}
                                        {jsonSvc.findLocalById("900163")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -45 */}
                                        {jsonSvc.findLocalById("900164")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* SUPRE RARE */}
                                        {jsonSvc.findLocalById("4")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -10 */}
                                        {jsonSvc.findLocalById("900165")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -20 */}
                                        {jsonSvc.findLocalById("900166")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -30 */}
                                        {jsonSvc.findLocalById("900167")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* EPIC */}
                                        {jsonSvc.findLocalById("5")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -5 */}
                                        {jsonSvc.findLocalById("900168")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -10 */}
                                        {jsonSvc.findLocalById("900169")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* -15 */}
                                        {jsonSvc.findLocalById("900170")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* LEGENDARY */}
                                        {jsonSvc.findLocalById("6")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* 0 */}
                                        {jsonSvc.findLocalById("900171")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* 0 */}
                                        {jsonSvc.findLocalById("900172")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: RatioUtil.width(60),
                                            height: RatioUtil.lengthFixedRatio(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {/* 0 */}
                                        {jsonSvc.findLocalById("900173")}
                                    </PretendText>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            width: RatioUtil.width(320),
                            marginTop: RatioUtil.lengthFixedRatio(10),
                        }}
                    >
                        <PretendText
                            style={
                                (homeStyle.home.desc,
                                { color: Colors.GRAY3, fontSize: RatioUtil.font(13), paddingRight: 0 })
                            }
                        >
                            {/* {"*상세 계산 공식은 마이페이지 > 백서를 통해 확인"} */}
                            {jsonSvc.findLocalById("900150")}
                        </PretendText>
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: "white",
                        marginTop: RatioUtil.height(10),
                        paddingTop: RatioUtil.lengthFixedRatio(30),
                        paddingBottom: RatioUtil.lengthFixedRatio(30),
                        paddingHorizontal: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    <PretendText
                        style={[
                            homeStyle.home.headerText,
                            {
                                fontWeight: RatioUtil.fontWeightBold(),
                                marginBottom: RatioUtil.lengthFixedRatio(20),
                            },
                        ]}
                    >
                        {/* 레벨이란? */}
                        {jsonSvc.findLocalById("900174")}
                    </PretendText>
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: RatioUtil.width(320),
                        }}
                    >
                        <PretendText
                            style={[
                                homeStyle.home.desc,
                                {
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                },
                            ]}
                        >
                            {/* NFT에 육성 포인트를 채워 레벨업을 위한 준비를 할 수 있습니다. 육성 포인트가 가득 찰 경우
                            레벨업이 가능하며 레벨업을 위해서는 일정 BDST가 필요합니다. NFT 레벨업 시 능력치가 상승하며,
                            최대 레벨은 15 입니다. */}
                            {jsonSvc.findLocalById("900175")}
                        </PretendText>
                        <PretendText
                            style={[
                                homeStyle.home.desc,
                                {
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    marginTop: RatioUtil.lengthFixedRatio(20),
                                },
                            ]}
                        >
                            {/* COMMON ~ RARE 등급의 NFT는 특정 레벨을 달성해야지만 지갑으로 전송 가능하며, SUPER RARE 등급
                            이상부터는 자유롭게 전송 가능합니다. */}
                            {jsonSvc.findLocalById("900176")}
                        </PretendText>
                    </View>
                    {/* 표 */}
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: RatioUtil.lengthFixedRatio(20),
                        }}
                    >
                        <View
                            style={{
                                width: RatioUtil.width(320),
                                borderColor: "#DADEE4",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                            }}
                        >
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(14) }}
                                    >
                                        {/* 등급 */}
                                        {jsonSvc.findLocalById("0")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(180),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(14) }}
                                    >
                                        {/* 지갑 전송 가능 레벨 */}
                                        {jsonSvc.findLocalById("900177")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* COMMON */}
                                        {jsonSvc.findLocalById("1")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(180),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* 15 */}
                                        {jsonSvc.findLocalById("900178")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* UNCOMMON */}
                                        {jsonSvc.findLocalById("2")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(180),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* 10 */}
                                        {jsonSvc.findLocalById("900179")}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={[
                                    homeStyle.home.halfLayoutBox,
                                    {
                                        borderBottomWidth: 1,
                                        borderColor: "#DADEE4",
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(140),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EEF1F5",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* RARE */}
                                        {jsonSvc.findLocalById("3")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(180),
                                        height: RatioUtil.lengthFixedRatio(40),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14) }}>
                                        {/* 5 */}
                                        {jsonSvc.findLocalById("900180")}
                                    </PretendText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: "white",
                        marginTop: RatioUtil.lengthFixedRatio(10),
                        paddingTop: RatioUtil.lengthFixedRatio(30),
                        paddingBottom: RatioUtil.lengthFixedRatio(30),
                        paddingHorizontal: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    <PretendText
                        style={[
                            homeStyle.home.headerText,
                            {
                                fontWeight: RatioUtil.fontWeightBold(),
                            },
                        ]}
                    >
                        {/* 승급이란? */}
                        {jsonSvc.findLocalById("ELEVATE_HELP_1")}
                    </PretendText>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            marginTop: RatioUtil.lengthFixedRatio(20),
                            width: RatioUtil.width(320),
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    width: RatioUtil.lengthFixedRatio(6),
                                    height: RatioUtil.lengthFixedRatio(6),
                                    marginTop: RatioUtil.lengthFixedRatio(7),
                                    marginRight: RatioUtil.lengthFixedRatio(10),
                                    backgroundColor: Colors.GRAY12,
                                    borderRadius: RatioUtil.lengthFixedRatio(10),
                                }}
                            ></View>
                        </View>
                        <PretendText
                            style={[
                                homeStyle.home.desc,
                                {
                                    width: RatioUtil.width(304),
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                },
                            ]}
                        >
                            {/* 15 레벨을 달성한 NFT는 다음 등급으로 승급할 수 있으며, 등급에 따라 실패 확률이 존재합니다. */}
                            {jsonSvc.findLocalById("ELEVATE_HELP_2")}
                        </PretendText>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            marginTop: RatioUtil.lengthFixedRatio(14),
                            width: RatioUtil.width(320),
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    width: RatioUtil.lengthFixedRatio(6),
                                    height: RatioUtil.lengthFixedRatio(6),
                                    marginTop: RatioUtil.lengthFixedRatio(7),
                                    marginRight: RatioUtil.lengthFixedRatio(10),
                                    backgroundColor: Colors.GRAY12,
                                    borderRadius: RatioUtil.lengthFixedRatio(10),
                                }}
                            ></View>
                        </View>
                        <PretendText
                            style={[
                                homeStyle.home.desc,
                                {
                                    width: RatioUtil.width(304),
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                },
                            ]}
                        >
                            {/* 승급 시 재료로 사용되는 2개의 NFT가 필요합니다. */}
                            {jsonSvc.findLocalById("ELEVATE_HELP_3")}
                        </PretendText>
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: "white",
                        marginTop: RatioUtil.lengthFixedRatio(10),
                        paddingTop: RatioUtil.lengthFixedRatio(30),
                        paddingBottom: RatioUtil.lengthFixedRatio(30),
                        paddingHorizontal: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    <PretendText
                        style={[
                            homeStyle.home.headerText,
                            {
                                fontWeight: RatioUtil.fontWeightBold(),
                            },
                        ]}
                    >
                        {/* 지갑 전송이란? */}
                        {jsonSvc.findLocalById("900181")}
                    </PretendText>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginTop: RatioUtil.lengthFixedRatio(20),
                            marginBottom: RatioUtil.lengthFixedRatio(20),
                        }}
                    >
                        <PretendText
                            style={[
                                homeStyle.home.desc,
                                {
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                },
                            ]}
                        >
                            {/* NFT를 지갑으로 전송하여 사용자간 거래가 가능합니다. 지갑 전송 시 일정 수수료가 지불됩니다. */}
                            {jsonSvc.findLocalById("900182")}
                        </PretendText>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
