import { Colors } from "const"
import { Platform, Dimensions, StyleSheet } from "react-native"
import { globalStyle } from "styles"
import { scaleSize } from "styles/minixs"
import { RatioUtil } from "utils"
const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
    mainView: {
        height: RatioUtil.lengthFixedRatio(80),
        width: RatioUtil.lengthFixedRatio(360),
        // backgroundColor: 'pink',
        // marginTop: RatioUtil.width(10),
        alignItems: "center",
        padding: RatioUtil.lengthFixedRatio(10),
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: RatioUtil.width(0.8),
    },
    playerRankMainView: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: RatioUtil.width(4),
    },
    playerRank: {
        fontSize: RatioUtil.font(14),
        color: Colors.BLACK,
        lineHeight: RatioUtil.font(14) * 1.3,
        fontWeight: "bold",
        width: RatioUtil.width(28),
        textAlign: "center",
        textAlignVertical: "center",
    },
    playerImage: {
        height: RatioUtil.lengthFixedRatio(50),
        width: RatioUtil.lengthFixedRatio(50),
        borderRadius: RatioUtil.lengthFixedRatio(50),
        marginLeft: RatioUtil.lengthFixedRatio(10),
        marginRight: RatioUtil.lengthFixedRatio(20),
        borderWidth: RatioUtil.width(1),
        borderColor: Colors.GRAY13,
    },
    playerInfoView: {
        height: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    playerGradeTitle: {
        fontSize: RatioUtil.font(14),
        color: Colors.GRAY12,
        fontWeight: RatioUtil.fontWeightBold(),
    },
    playerName: {
        fontSize: RatioUtil.font(16),
        color: Colors.BLACK,
        fontWeight: RatioUtil.fontWeightBold(),
        marginTop: RatioUtil.lengthFixedRatio(6)
    },
    playerDataView: {
        height: "100%",
        flexDirection: "column",
        // backgroundColor: "pink",
        // justifyContent: 'space-around',
        alignItems: "center",
    },
    playerDataTitle: {
        fontSize: RatioUtil.font(14),
        color: Colors.GRAY10,
        // marginBottom: RatioUtil.width(12),
        lineHeight: RatioUtil.font(14) * 1.3,
        fontWeight: "400",
    },
    playerDataRank: {
        fontSize: RatioUtil.font(16),
        color: Colors.BLACK,
        lineHeight: RatioUtil.font(16) * 1.3,
        fontWeight: RatioUtil.fontWeightBold(),
        marginTop: RatioUtil.lengthFixedRatio(6)
    },
    detailsView: {
        // height: RatioUtil.height(100),
        // backgroundColor: 'pink'
    },
    detailsAnimatedView: {
        flex: 1,
        // height: RatioUtil.height(100),
        width: width,
        backgroundColor: Colors.GRAY9,
    },
    detailsTopView: {
        // backgroundColor: 'pink',
        padding: RatioUtil.lengthFixedRatio(20),
        flexDirection: "row",
    },
    imageView: {
        height: RatioUtil.width(90),
        width: RatioUtil.width(70),
        borderRadius: RatioUtil.height(5),
    },
    detailsInnerView: {
        alignItems: "center",
        justifyContent: "flex-start",
        marginLeft: RatioUtil.lengthFixedRatio(20),
        flex: 1,
    },
    detailsMainInnerView: {
        flexDirection: "row",
        alignSelf: "flex-start",
        height: RatioUtil.lengthFixedRatio(21),
        marginTop: RatioUtil.lengthFixedRatio(9),
    },
    atBatsTitle: {
        fontSize: RatioUtil.font(16),
        color: Colors.BLACK,
        lineHeight: RatioUtil.font(16) * 1.3,
    },
    atBatsStrokes: {
        fontSize: RatioUtil.font(16),
        color: Colors.BLACK,
        lineHeight: RatioUtil.font(16) * 1.3,
        fontWeight: RatioUtil.fontWeightBold(),
        marginLeft: RatioUtil.lengthFixedRatio(8),
    },
    strokesDataRow: {
        flexDirection: "row",
        width: "50%",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: RatioUtil.lengthFixedRatio(12),
    },
    strokesDataView: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
        marginTop: RatioUtil.lengthFixedRatio(16)
    },
    strokesDataIndex: {
        color: Colors.WHITE,
        fontSize: RatioUtil.font(12),
        fontWeight: RatioUtil.fontWeightBold(),
    },
    strokesDataTitle: {
        fontSize: RatioUtil.font(14),
        color: Colors.BLACK,
        lineHeight: RatioUtil.font(14) * 1.3,
    },
    graphMainView: {
        // backgroundColor: 'pink',
        // flexDirection: 'row',
    },
    graphTitleView: {
        flexDirection: "row",
        marginLeft: RatioUtil.width(10),
        zIndex: 1,
        elevation: 1,
    },
    graphTitleMapView: {
        // backgroundColor: 'pink',
        height: RatioUtil.lengthFixedRatio(29),
        borderBottomWidth: RatioUtil.lengthFixedRatio(2),
    },
    graphTitleMapText: {
        fontSize: RatioUtil.width(13),
        color: Colors.BLACK,
        lineHeight: RatioUtil.width(17),
        fontWeight: "800",
        fontFamily: globalStyle.defaultFontText.fontFamily,
    },
    graphColumnView: {
        height: RatioUtil.lengthFixedRatio(36),
        width: RatioUtil.lengthFixedRatio(60),
        backgroundColor: Colors.GRAY9,
        alignItems: "center",
        justifyContent: "center",
        borderTopWidth: RatioUtil.width(1),
        borderRightWidth: RatioUtil.width(1),
        borderColor: Colors.GRAY13,
    },
    graphColumnText: {
        fontSize: RatioUtil.font(12),
        color: Colors.BLACK,
    },
    graphInnerView: {
        flexDirection: "row",
        zIndex: -1,
        elevation: -1,
    },
    graphColumn: {
        width: RatioUtil.lengthFixedRatio(60),
        height: RatioUtil.lengthFixedRatio(180),
        backgroundColor: Colors.WHITE,
    },
    graphInner: {
        height: RatioUtil.width(34.8),
        width: RatioUtil.width(35),
        // backgroundColor: 'pink',
        alignItems: "center",
        justifyContent: "center",
        borderTopWidth: RatioUtil.width(1),
        borderColor: Colors.GRAY13,
    },
    graphInnerText: {
        fontSize: RatioUtil.font(12),
        color: Colors.BLACK,
        // lineHeight: RatioUtil.width(15),
        fontWeight: "600",
        fontFamily: globalStyle.defaultFontText.fontFamily,
    },
    infoMainView: {
        flexDirection: "row",
        height: RatioUtil.width(35),
        justifyContent: "center",
    },
    infoInnerView: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: RatioUtil.width(10),
    },
    infoDotView: {
        height: RatioUtil.width(10),
        width: RatioUtil.width(10),
        borderRadius: RatioUtil.width(50),
        marginRight: RatioUtil.width(5),
    },
    infoText: {
        fontSize: RatioUtil.width(11),
        color: Colors.GRAY10,
        lineHeight: RatioUtil.width(15),
        fontWeight: "600",
        fontFamily: globalStyle.defaultFontText.fontFamily,
    },
    emptyView: {
        flex: 1,
        ...RatioUtil.size(300, 150),
        alignItems: "center",
        // justifyContent: "center",
    },
    emptyText: {
        fontSize: RatioUtil.width(11),
        color: Colors.GRAY10,
        lineHeight: RatioUtil.width(15),
        fontWeight: "600",
        fontFamily: globalStyle.defaultFontText.fontFamily,
    },
})
