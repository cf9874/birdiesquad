import { jsonSvc } from "apis/services"
import { PretendText } from "components/utils"
import { Colors } from "const"
import { useDimension } from "hooks"
import { ScrollView, View } from "react-native"
import { homeStyle, helpPopupStyle } from "styles"
import { RatioUtil } from "utils"
import { ResponseUpgradeNftInfo } from "./types"

const NftAdvancementHelp = ({ upgradeInfoData }: { upgradeInfoData: ResponseUpgradeNftInfo }) => {
    const [dimension, onLayout] = useDimension()

    return (
        <View style={{ flex: 1 }} onLayout={onLayout}>
            <ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            width: dimension.width,
                            paddingLeft: RatioUtil.width(25),
                            paddingRight: RatioUtil.width(50),
                        }}
                    >
                        <PretendText
                            style={[
                                homeStyle.home.headerText,
                                { marginTop: RatioUtil.height(25), marginBottom: RatioUtil.height(10) },
                            ]}
                        >
                            {/* 승급이란? */}
                            {jsonSvc.findLocalById("ELEVATE_HELP_1")}
                        </PretendText>
                        <View style={helpPopupStyle.helpPopup.toggleTextArea}>
                            <View>
                                <View style={helpPopupStyle.helpPopup.circleToggle} />
                            </View>
                            <PretendText style={homeStyle.home.desc}>
                                {/* 15 레벨을 달성한 NFT는 다음 등급으로 승급할 수 있으며, 등급에 따라 실패 확률이 존재합니다. */}
                                {jsonSvc.findLocalById("ELEVATE_HELP_2")}
                            </PretendText>
                        </View>
                        <View style={helpPopupStyle.helpPopup.toggleTextArea}>
                            <View>
                                <View style={helpPopupStyle.helpPopup.circleToggle} />
                            </View>
                            <PretendText style={homeStyle.home.desc}>
                                {/* 승급 시 재료로 사용되는 2개의 NFT가 필요합니다. */}
                                {jsonSvc.findLocalById("ELEVATE_HELP_3")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                ...helpPopupStyle.helpPopup.toggleTextArea,
                                marginBottom: RatioUtil.height(25),
                            }}
                        >
                            <View>
                                <View style={helpPopupStyle.helpPopup.circleToggle} />
                            </View>
                            <PretendText style={homeStyle.home.desc}>
                                {/* 승급 이후에도 토큰 ID와 발행연도는 기존과 동일합니다. */}
                                {jsonSvc.findLocalById("ELEVATE_HELP_4")}
                            </PretendText>
                        </View>
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
                            marginTop: RatioUtil.height(10),
                            backgroundColor: Colors.WHITE,
                            width: dimension.width,
                            paddingLeft: RatioUtil.width(25),
                            paddingRight: RatioUtil.width(50),
                            paddingTop: RatioUtil.height(10),
                        }}
                    >
                        <PretendText
                            style={[
                                homeStyle.home.headerText,
                                { marginTop: RatioUtil.height(15), marginBottom: RatioUtil.height(10) },
                            ]}
                        >
                            {/* 승급 재료란? */}
                            {jsonSvc.findLocalById("ELEVATE_HELP_MATERIAL_1")}
                        </PretendText>
                        <View style={helpPopupStyle.helpPopup.toggleTextArea}>
                            <View>
                                <View style={helpPopupStyle.helpPopup.circleToggle} />
                            </View>
                            <PretendText style={homeStyle.home.desc}>
                                {/* 승급 대상 NFT와 동일한 등급의 15 레벨 NFT만 재료로 사용될 수 있습니다. */}
                                {jsonSvc.findLocalById("ELEVATE_HELP_MATERIAL_2")}
                            </PretendText>
                        </View>
                        <View style={helpPopupStyle.helpPopup.toggleTextArea}>
                            <View>
                                <View style={helpPopupStyle.helpPopup.circleToggle} />
                            </View>
                            <PretendText style={homeStyle.home.desc}>
                                {/* 승급 시 2개의 재료가 필요하며, 사용된 NFT는 소멸합니다. */}
                                {jsonSvc.findLocalById("ELEVATE_HELP_MATERIAL_3")}
                            </PretendText>
                        </View>
                        <View style={helpPopupStyle.helpPopup.toggleTextArea}>
                            <View>
                                <View style={helpPopupStyle.helpPopup.circleToggle} />
                            </View>
                            <PretendText style={homeStyle.home.desc}>
                                {/* 승급 대상 NFT와 2개의 재료 모두 동일한 프로일 경우 더욱 높은 성공 확률이 적용됩니다. */}
                                {jsonSvc.findLocalById("ELEVATE_HELP_MATERIAL_4")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                ...helpPopupStyle.helpPopup.toggleTextArea,
                                marginBottom: RatioUtil.height(25),
                            }}
                        >
                            <View>
                                <View style={helpPopupStyle.helpPopup.circleToggle} />
                            </View>
                            <PretendText style={homeStyle.home.desc}>
                                {/* 마이 스쿼드에 배치한 프로는 승급 재료로 사용할 수 없습니다. */}
                                {jsonSvc.findLocalById("ELEVATE_HELP_MATERIAL_5")}
                            </PretendText>
                        </View>
                    </View>
                </View>
                
                {/* 승급 확률 */}
                <View style={{ backgroundColor: "white", marginTop: RatioUtil.height(10) }}>
                    <PretendText
                        style={[
                            homeStyle.home.headerText,
                            {
                                paddingLeft: RatioUtil.width(25),
                                marginTop: RatioUtil.height(30),
                                marginBottom: RatioUtil.height(10),
                            },
                        ]}
                    >
                        {/* 승급확률 */}
                        {jsonSvc.findLocalById("ELEVATE_HELP_RATE_1")}
                    </PretendText>

                    {/* 재료와 승급 대상이 모두 같은 프로일 경우 */}
                    <View
                        style={{
                            ...helpPopupStyle.helpPopup.toggleTextArea,
                            marginBottom: RatioUtil.height(10),
                            marginLeft: RatioUtil.width(20),
                        }}
                    >
                        <View>
                            <View style={helpPopupStyle.helpPopup.circleToggle} />
                        </View>
                        <PretendText style={homeStyle.home.desc}>
                            {/* 재료와 승급 대상이 모두 같은 프로일 경우 */}
                            {jsonSvc.findLocalById("ELEVATE_HELP_RATE_2")}
                        </PretendText>
                    </View>
                    
                    {/* 재료와 승급 대상이 모두 같은 프로일 경우 표*/}
                    <View
                        style={{backgroundColor: Colors.WHITE}}
                    >
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <View
                                style={{
                                    marginTop: RatioUtil.height(1),
                                    width: RatioUtil.width(320),
                                    borderColor: "#DADEE4",
                                    borderTopWidth: 1,
                                }}
                            >
                                <View style={homeStyle.home.halfLayoutBox}>
                                    <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                        <PretendText
                                            style={{
                                                fontSize: RatioUtil.font(14),
                                                textAlign: "center",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {/* 승급 기준 */}
                                            {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT")}
                                        </PretendText>
                                    </View>
                                    <View
                                        style={[
                                            homeStyle.home.grayLayout,
                                            {
                                                width: RatioUtil.width(160),
                                                height: RatioUtil.height(40),
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderBottomWidth: 1,
                                                borderColor: "#DADEE4",
                                                backgroundColor: Colors.WHITE,
                                            },
                                        ]}
                                    >
                                        <PretendText
                                            style={{ fontSize: RatioUtil.font(14), textAlign: "center", fontWeight: "700" }}
                                        >
                                            {/* 성공 확률(%) */}
                                            {jsonSvc.findLocalById("ELEVATE_HELP_RATE")}
                                        </PretendText>
                                    </View>
                                </View>
                                <View style={homeStyle.home.halfLayoutBox}>
                                    <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                        <PretendText style={{ fontSize: RatioUtil.font(12) }}>
                                            {/* COMMON > UNCOMMON */}
                                            {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT_1")}
                                        </PretendText>
                                    </View>
                                    <View style={{...helpPopupStyle.helpPopup.tableCell, backgroundColor: Colors.WHITE}}>
                                        <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                            {upgradeInfoData.successRate ? upgradeInfoData.successRate.common ?? 70 : 70}
                                        </PretendText>
                                    </View>
                                </View>
                                <View style={homeStyle.home.halfLayoutBox}>
                                    <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                        <PretendText style={{ fontSize: RatioUtil.font(12) }}>
                                            {/* UNCOMMON > RARE */}
                                            {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT_2")}
                                        </PretendText>
                                    </View>
                                    <View style={helpPopupStyle.helpPopup.tableCell}>
                                        <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                            {upgradeInfoData.successRate ? upgradeInfoData.successRate.uncommon ?? 50 : 50}
                                        </PretendText>
                                    </View>
                                </View>
                                <View style={homeStyle.home.halfLayoutBox}>
                                    <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                        <PretendText style={{ fontSize: RatioUtil.font(12) }}>
                                            {/* RARE > SUPER RARE */}
                                            {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT_3")}
                                        </PretendText>
                                    </View>
                                    <View style={helpPopupStyle.helpPopup.tableCell}>
                                        <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                            {upgradeInfoData.successRate ? upgradeInfoData.successRate.rare ?? 35 : 35}
                                        </PretendText>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* 재료와 승급 대상이 다른 프로일 경우 */}
                    <View
                        style={{
                            ...helpPopupStyle.helpPopup.toggleTextArea,
                            marginTop: RatioUtil.height(18),
                            marginBottom: RatioUtil.height(10),
                            marginLeft: RatioUtil.width(20),
                        }}
                    >
                        <View>
                            <View style={helpPopupStyle.helpPopup.circleToggle} />
                        </View>
                        <PretendText style={homeStyle.home.desc}>
                            {/* 재료와 승급 대상이 다른 프로일 경우 */}
                            {jsonSvc.findLocalById("ELEVATE_HELP_RATE_3")}
                        </PretendText>
                    </View>

                    {/* 재료와 승급 대상이 다른 프로일 경우 표*/}
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <View
                            style={{
                                marginTop: RatioUtil.height(1),
                                width: RatioUtil.width(320),
                                borderColor: "#DADEE4",
                                borderTopWidth: 1,
                            }}
                        >
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            textAlign: "center",
                                            fontWeight: "700",
                                        }}
                                    >
                                        {/* 승급 기준 */}
                                        {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        homeStyle.home.grayLayout,
                                        {
                                            width: RatioUtil.width(160),
                                            height: RatioUtil.height(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderBottomWidth: 1,
                                            borderColor: "#DADEE4",
                                            backgroundColor: Colors.WHITE,
                                        },
                                    ]}
                                >
                                    <PretendText
                                        style={{ fontSize: RatioUtil.font(14), textAlign: "center", fontWeight: "700" }}
                                    >
                                        {/* 성공 확률(%) */}
                                        {jsonSvc.findLocalById("ELEVATE_HELP_RATE")}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={{ fontSize: RatioUtil.font(12) }}>
                                        {/* COMMON > UNCOMMON */}
                                        {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT_1")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{...helpPopupStyle.helpPopup.tableCell, backgroundColor: Colors.WHITE}}
                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {upgradeInfoData.successRateOther
                                            ? upgradeInfoData.successRateOther.common ?? 35
                                            : 35}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={{ fontSize: RatioUtil.font(12) }}>
                                        {/* UNCOMMON > RARE */}
                                        {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT_2")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{...helpPopupStyle.helpPopup.tableCell, backgroundColor: Colors.WHITE}}

                                >
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {upgradeInfoData.successRateOther
                                            ? upgradeInfoData.successRateOther.uncommon ?? 20
                                            : 20}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={{ fontSize: RatioUtil.font(12) }}>
                                        {/* RARE > SUPER RARE */}
                                        {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT_3")}
                                    </PretendText>
                                </View>
                                <View style={{...helpPopupStyle.helpPopup.tableCell, backgroundColor: Colors.WHITE}}>
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {upgradeInfoData.successRateOther
                                            ? upgradeInfoData.successRateOther.rare ?? 15
                                            : 15}
                                    </PretendText>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* 표 */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginTop: RatioUtil.height(10),
                            width: RatioUtil.width(280),
                            marginLeft: RatioUtil.width(20),
                            marginBottom: RatioUtil.height(20),
                        }}
                    ></View>
                </View>

                <View style={{ backgroundColor: "white", marginTop: RatioUtil.height(10) }}>
                    <PretendText
                        style={[
                            homeStyle.home.headerText,
                            {
                                paddingLeft: RatioUtil.width(25),
                                marginTop: RatioUtil.height(30),
                            },
                        ]}
                    >
                        {/* 승급 가격 */}
                        {jsonSvc.findLocalById("ELEVATE_COST")}
                    </PretendText>
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginTop: RatioUtil.height(10),
                            marginBottom: RatioUtil.height(10),
                            width: RatioUtil.width(320),
                            marginLeft: RatioUtil.width(20),
                        }}
                    ></View>
                    {/* 표 */}
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <View
                            style={{
                                marginTop: RatioUtil.height(1),
                                marginBottom: RatioUtil.height(40),
                                width: RatioUtil.width(320),
                                borderColor: "#DADEE4",
                                borderTopWidth: 1,
                            }}
                        >
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            textAlign: "center",
                                            fontWeight: "700",
                                        }}
                                    >
                                        {/* 승급 기준 */}
                                        {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT")}
                                    </PretendText>
                                </View>
                                <View
                                    style={[
                                        homeStyle.home.grayLayout,
                                        {
                                            width: RatioUtil.width(160),
                                            height: RatioUtil.height(40),
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderBottomWidth: 1,
                                            borderColor: "#DADEE4",
                                            backgroundColor: Colors.WHITE,
                                        },
                                    ]}
                                >
                                    <PretendText
                                        style={{ fontSize: RatioUtil.font(14), textAlign: "center", fontWeight: "700" }}
                                    >
                                        {/* 승급 가격(BDP) */}
                                        {jsonSvc.findLocalById("ELEVATE_HELP_COST")}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={{ fontSize: RatioUtil.font(12) }}>
                                        {/* COMMON > UNCOMMON */}
                                        {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT_1")}
                                    </PretendText>
                                </View>
                                <View style={helpPopupStyle.helpPopup.tableCell}>
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {upgradeInfoData.upgradeCost ? upgradeInfoData.upgradeCost.common ?? 80 : 80}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={{ fontSize: RatioUtil.font(12) }}>
                                        {/* UNCOMMON > RARE */}
                                        {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT_2")}
                                    </PretendText>
                                </View>
                                <View style={helpPopupStyle.helpPopup.tableCell}>

                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {upgradeInfoData.upgradeCost
                                            ? upgradeInfoData.upgradeCost.uncommon ?? 800
                                            : 800}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={{ fontSize: RatioUtil.font(12) }}>
                                        {/* RARE > SUPER RARE */}
                                        {jsonSvc.findLocalById("ELEVATE_HELP_OBJECT_3")}
                                    </PretendText>
                                </View>
                                <View style={helpPopupStyle.helpPopup.tableCell}>
                                    <PretendText style={{ fontSize: RatioUtil.font(14), textAlign: "center" }}>
                                        {upgradeInfoData.upgradeCost ? upgradeInfoData.upgradeCost.rare ?? 5000 : 5000}
                                    </PretendText>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            width: RatioUtil.width(280),
                            marginLeft: RatioUtil.width(20),
                            marginBottom: RatioUtil.height(20),
                        }}
                    >
                        <View></View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default NftAdvancementHelp
