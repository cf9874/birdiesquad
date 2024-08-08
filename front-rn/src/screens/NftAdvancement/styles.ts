import { Colors } from "const"
import { Dimensions, StyleSheet } from "react-native"
import { scaleSize } from "styles/minixs"
import { RatioUtil } from "utils"
const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

export const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        position: "relative",
        alignItems: "center",
    },
    headerView: {
        height: scaleSize(30),
        justifyContent: "center",
        flexDirection: "row",
        alignSelf: "flex-end",
    },
    headerButtonView: {
        height: scaleSize(30),
        width: scaleSize(100),
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        fontSize: scaleSize(15),
        lineHeight: scaleSize(17),
        color: Colors.BLACK,
    },
    tabsMainView: {
        height: scaleSize(40),
        flexDirection: "row",
    },
    tabOuterView: {
        flex: 0.5,
        alignItems: "center",
        justifyContent: "center",
    },
    tabText: {
        fontSize: scaleSize(14),
        lineHeight: scaleSize(16),
        color: Colors.BLACK,
    },
    helpBox: {
        zIndex: 9999,
        marginLeft: RatioUtil.width(3),
        justifyContent: "center",
        alignItems: "center",
    },
    helpBtn: {
        width: RatioUtil.width(17),
        height: RatioUtil.width(17),
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
    },
    helpImg: {
        height: RatioUtil.height(17),
        width: RatioUtil.width(17),
    },
    helpBoxBorder: {
        overflow: "hidden",
        alignSelf: "center",
        borderRadius: RatioUtil.width(50),
        width: RatioUtil.width(17),
        height: RatioUtil.width(17),
        marginLeft: RatioUtil.width(2),
    },
    helpBoxBackGround: {
        width: RatioUtil.width(17),
        height: RatioUtil.width(17),
        backgroundColor: "#DFDFDF",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    helpBoxFlex: {
        flex: 1,
        ...RatioUtil.size(360),
    },
    helpHeaderCon: {
        height: RatioUtil.height(44),
        flexDirection: "row",
        backgroundColor: Colors.WHITE,
        alignItems: "center",
        justifyContent: "center",
    },
    helpHeaderText: {
        lineHeight: RatioUtil.font(18) * 1.4,
        color: Colors.BLACK,
        fontSize: RatioUtil.font(16),
        fontWeight: RatioUtil.fontWeightBold(),
    },
    helpHeaderModalMainView: {
        flex: 1,
        backgroundColor: `${Colors.BLACK}70`,
        alignItems: "center",
        justifyContent: "center",
    },
    helpBoxCloseCon: {
        right: RatioUtil.width(20),
        top: RatioUtil.height(-21),
        position: "absolute",
    },
    helpBoxCloseImg: {
        ...RatioUtil.margin(30, 0, 20, 0),
        width: RatioUtil.width(25),
        height: RatioUtil.height(25),
    },
    advancementExpectArea: {
        position: "absolute",
        left: 0,
        right: 0,
        top: RatioUtil.height(85),
    },
    advancementExpectCon: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        zIndex: 10000,
    },
    advancementNftCardABox: {
        marginRight: RatioUtil.width(18),
    },
    advancementNftCardImage: {
        width: RatioUtil.lengthFixedRatio(118),
        height: RatioUtil.lengthFixedRatio(169),
    },
    advancementNftCardBBox: {
        marginLeft: RatioUtil.width(18),
    },
    upgradedNftBgEffect: {
        position: "absolute",
        width: RatioUtil.width(120),
        height: RatioUtil.width(180),
        justifyContent: "center",
        alignItems: "center",
        transform: [{ scale: 2.2 }],
        left: RatioUtil.width(-3),
    },
    nftCardGrade: {
        textAlign: "center",
        color: Colors.WHITE,
        fontFamily: "Pretendard Variable",
        fontWeight: "700",
        fontSize: RatioUtil.lengthFixedRatio(13),
        lineHeight: RatioUtil.lengthFixedRatio(41),
        fontStyle: "normal",
    },
    advancementDirectArrow: {
        justifyContent: "center",
        height: RatioUtil.height(230),
    },
    selectNftBox: {
        borderTopLeftRadius: scaleSize(20),
        borderTopRightRadius: scaleSize(20),
        backgroundColor: Colors.WHITE,
        paddingHorizontal: scaleSize(20),
        alignItems: "center",
        height: RatioUtil.height(400),
        zIndex: 999999,
    },
    selectNftBoxBackgroundCon: {
        position: "absolute",
        bottom: 0,
        zIndex: 999999999,
        alignItems: "center",
        width: RatioUtil.lengthFixedRatio(360),
        height: RatioUtil.height(350),
    },
    selectNftBoxBackground: {
        // ...RatioUtil.size(360, 150),
        justifyContent: "center",
        display: "flex",
        flexDirection: "row",
    },
    selectNftBackground: {
        width: RatioUtil.lengthFixedRatio(91),
        height: RatioUtil.lengthFixedRatio(128),
        marginRight: RatioUtil.width(10),
        marginLeft: RatioUtil.width(10),
        justifyContent: "center",
        alignItems: "center",
        marginTop: RatioUtil.lengthFixedRatio(14),
    },
    selectedNft: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: RatioUtil.width(6),
        marginLeft: RatioUtil.width(6),
        borderRadius: scaleSize(15),
        width: RatioUtil.lengthFixedRatio(91),
        height: RatioUtil.lengthFixedRatio(128),
    },
    selectNftText: {
        fontSize: RatioUtil.font(12),
        lineHeight: scaleSize(15.6),
        color: "#C7C7C7",
        textAlign: "center",
    },
    selectedNftImage: {
        width: scaleSize(20),
        height: scaleSize(20),
        marginLeft: RatioUtil.lengthFixedRatio(6),
        marginRight: RatioUtil.lengthFixedRatio(6),
        marginTop: RatioUtil.lengthFixedRatio(65),
    },
    warningText: {
        fontSize: RatioUtil.font(11),
        color: Colors.GRAY16,
        marginTop: RatioUtil.height(7),
        marginBottom: RatioUtil.height(7),
    },
    successInfoCon: {
        position: "absolute",
        bottom: 0,
        zIndex: 999999999,
        alignItems: "center",
    },
    successInfoBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: RatioUtil.width(320),
        borderWidth: RatioUtil.width(1),
        paddingTop: RatioUtil.height(12),
        paddingBottom: RatioUtil.height(12),
        paddingLeft: RatioUtil.width(18),
        paddingRight: RatioUtil.width(18),
        borderRadius: RatioUtil.width(6),
        borderColor: "#EAEAEA",
    },
    successInfoTitleBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
    },
    successTitle: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
    },
    successTitleText: {
        fontWeight: "700",
        fontSize: RatioUtil.font(14),
        textAlign: "center",
        lineHeight: scaleSize(18.2),
    },
    successValue: {
        textAlign: "right",
        fontWeight: "700",
        fontSize: RatioUtil.font(16),
        color: "#5465FF",
        lineHeight: scaleSize(20.8),
    },
    successNullValue: {
        textAlign: "right",
        fontWeight: "700",
        fontSize: RatioUtil.font(16),
        color: Colors.BLACK,
        lineHeight: scaleSize(20.8),
    },
    priceInfoBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: RatioUtil.width(320),
        borderWidth: RatioUtil.width(1),
        paddingTop: RatioUtil.height(12),
        paddingBottom: RatioUtil.height(12),
        paddingLeft: RatioUtil.width(18),
        paddingRight: RatioUtil.width(18),
        borderRadius: RatioUtil.width(6),
        marginTop: RatioUtil.lengthFixedRatio(6.3),
        borderColor: "#EAEAEA",
    },
    priceTitleText: {
        textAlign: "right",
        fontWeight: "700",
        fontSize: RatioUtil.font(14),
        lineHeight: scaleSize(18.2),
    },
    priceValueBox: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    priceTypeImage: {
        ...RatioUtil.size(18, 18),
        marginRight: RatioUtil.lengthFixedRatio(10),
    },
    priceValue: {
        fontWeight: "700",
        fontSize: RatioUtil.font(16),
        lineHeight: scaleSize(20.8),
    },
    advancementButtonBox: {
        flexDirection: "row",
        width: RatioUtil.lengthFixedRatio(360),
        height: RatioUtil.height(80),
        alignItems: "center",
        justifyContent: "center",
    },
    advancementButton: {
        padding: scaleSize(20),
        borderRadius: RatioUtil.lengthFixedRatio(100),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.BLACK,
        width: RatioUtil.lengthFixedRatio(320),
        height: RatioUtil.lengthFixedRatio(60),
    },
    advancementButtonTitle: {
        textAlign: "center",
        fontSize: scaleSize(16),
        color: Colors.WHITE,
        lineHeight: scaleSize(20.8),
        fontWeight: "700",
    },
    selectedNftRemoveBox: {
        position: "relative",
        marginTop: RatioUtil.lengthFixedRatio(14),
        marginLeft: RatioUtil.lengthFixedRatio(10),
        marginRight: RatioUtil.lengthFixedRatio(10),
    },
    selectedNftRemoveButton: {
        position: "absolute",
        right: RatioUtil.width(-6),
        top: RatioUtil.height(-7),
        zIndex: 9999,
        borderRadius: RatioUtil.width(50),
    },
    selectedNftRemoveImg: {
        width: RatioUtil.width(28),
        height: RatioUtil.width(28),
    },
    selectedNftCardImage: {
        width: RatioUtil.lengthFixedRatio(91),
        height: RatioUtil.lengthFixedRatio(128),
    },
    selectedNftImgLevelText: {
        fontSize: RatioUtil.width(8),
        lineHeight: scaleSize(10.4),
    },
    selectedNftImgNameText: {
        fontSize: RatioUtil.width(10),
        lineHeight: scaleSize(13),
    },
    selectedNftImgSubText: {
        fontSize: RatioUtil.width(7),
        bottom: -3.6,
        width: RatioUtil.lengthFixedRatio(54),
    },
    /////////////////////
    tutorialFirstStepMainBox: {
        justifyContent: "center",
        alignItems: "center",
    },
    tutorialFirstStepAArrowBox: {
        justifyContent: "center",
        flexDirection: "row",
        marginBottom: RatioUtil.height(-1),
    },
    tutorialFirstStepTextBox: {
        width: RatioUtil.width(320),
        marginBottom: RatioUtil.height(55),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RatioUtil.height(100),
        backgroundColor: `${Colors.BLACK}80`,
        borderColor: Colors.WHITE,
        borderWidth: RatioUtil.width(2),
        padding: RatioUtil.height(14),
    },
    tutorialText: {
        color: Colors.WHITE,
        fontSize: RatioUtil.font(14),
        textAlign: "center",
        fontWeight: "600",
    },
    tutorialSecondStepAMainBox: {
        position: "absolute",
        bottom: RatioUtil.height(345),
    },
    tutorialSecondStepASvgBox: {
        justifyContent: "center",
        flexDirection: "row",
        position: "absolute",
        bottom: RatioUtil.lengthFixedRatio(-11),
        left: 0,
        right: 0,
    },
    tutorialSecondStepTextBox: {
        width: RatioUtil.width(320),
        padding: RatioUtil.height(10),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RatioUtil.height(100),
        backgroundColor: `${Colors.BLACK}80`,
        borderColor: Colors.WHITE,
        borderWidth: RatioUtil.width(2),
    },
    tutorialSecondStepBMainBox: {
        position: "absolute",
        bottom: RatioUtil.height(75),
    },
    tutorialSecondStepBSvgBox: {
        right: RatioUtil.width(29),
        position: "absolute",
        top: RatioUtil.lengthFixedRatio(-10),
    },
    cardEffectCon: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 0,
        left: 0,
        top: 0,
    },
    cardEffect: {
        width: width,
        height: height,
        backgroundColor: Colors.WHITE,
    },
    upgradeArrowbox: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        right: 0,
        left: 0,
        top: RatioUtil.lengthFixedRatio(176),
        zIndex: 999999,
    },
    upgradeArrow: {
        width: RatioUtil.lengthFixedRatio(16),
        height: scaleSize(30),
    },

    selectNftConShadow: {
        borderTopLeftRadius: scaleSize(20),
        borderTopRightRadius: scaleSize(20),
    },

    // nft 승급 재료 리스트
    nftUpgradeMaterialsMain: {
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "white",
        flex: 1,
    },

    // nft 승급 재료 리스트 설명
    nftUpgradeMaterialsMainDescription: {
        marginVertical: 20,
        textAlign: "center",
        fontSize: RatioUtil.font(14),
        color: "#87878D",
    },

    // nft 승급 재료 리스트 wrapper
    nftUpgradeMaterialsListWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },

    // nft detail vx 선택하기 버튼
    choiceNftMaterialWrapper: {
        display: "flex",
        alignItems: "center",
    },

    choiceNftMaterialDescription: {
        marginTop: scaleSize(30),
        marginBottom: scaleSize(30),
        textAlign: "center",
        color: "#66666B",
        fontSize: 16,
    },

    // nft 승급 리스트 데이터 없는 경우
    nftUpgradeMaterialListNoData: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    // nft 승급 리스트 데이터 없는 경우 텍스트
    nftUpgradeMaterialListNoDataInfo: {
        fontSize: 18,
        color: "#87878D",
        fontWeight: "600",
    },

    // nft 승급 리스트 데이터 없는 경우 조건 텍스트
    nftUpgradeMaterialListNoDataText: {
        fontSize: 14,
        color: "#66666B",
        fontWeight: "400",
    },

    choiceNftMaterialButton: {
        padding: scaleSize(15),
        width: "90%",
        borderRadius: scaleSize(50),
        justifyContent: "center",
        marginTop: RatioUtil.height(10),
        marginBottom: RatioUtil.height(14),
        backgroundColor: Colors.BLACK,
        height: RatioUtil.lengthFixedRatio(60),
    },
    choiceNftMaterialButtonTitle: {
        textAlign: "center",
        fontSize: scaleSize(15),
        color: Colors.WHITE,
    },
})
