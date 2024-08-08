import { View, Image, Pressable, StatusBar } from "react-native"
import { mainHeaderImg } from "assets/images"
import { LayoutStyle } from "styles/layoutVx.style"
import { useStyle } from "hooks"
import { MainHeaderCompo } from "./layout.compo"
import { navigate, RatioUtil } from "utils"
import { AnalyticsEventName, Colors, Screen } from "const"
import { CustomButton } from "components/utils"
import { useRoute } from "@react-navigation/native"
import { SvgIcon } from "components/Common/SvgIcon"
import { Analytics } from "utils/analytics.util"
export interface IMainHeader {
    training: number | undefined
    bdst: number | undefined
    tbora: number | undefined
    renderToggel?: () => void
    toNavigate?: string
    backHome?: typeof Screen[keyof typeof Screen] | undefined
    navigationParams?: { selectedNftIndex?: number }
    nftSeq?: number
    hideArrow?: boolean
}
export const MainHeaderVx = (props: IMainHeader) => {
    const { style: mainHeaderCss } = useStyle(LayoutStyle.genMainHeader)
    const route = useRoute()

    return (
        <View
            style={[
                mainHeaderCss.con,
                {
                    height: RatioUtil.lengthFixedRatio(44),
                    backgroundColor: route.name !== Screen.NFTADVANCEMENT ? Colors.WHITE : "transparent",
                    zIndex: route.name !== Screen.NFTADVANCEMENT ? 0 : 10000,
                },
            ]}
        >
            <StatusBar barStyle="dark-content" backgroundColor={"transparent"} translucent={true} />
            {!props.hideArrow && route.name !== Screen.NFTLIST ? (
                <CustomButton
                    style={{
                        ...RatioUtil.sizeFixedRatio(44, 44),
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        // hazel - 비정상적인 back버튼 수정
                        // navigateTo 변수를 이 전 화면으로 설정
                        // updatedNavigationParams를 navigation path에서 받아온 값으로 초기화

                        let navigateTo = Screen.BACK
                        let updatedNavigationParams = props.navigationParams
                        // backHome : true일 때만 navigateTo, updatedNavigationParams 업데이트
                        // backHome : false 일 때는 Screen.BACK
                        if (props.backHome) {
                            navigateTo =
                                props.toNavigate === Screen.PROCESSIN
                                    ? Screen.PROCESSIN
                                    : props.toNavigate === Screen.NFTLIST
                                    ? Screen.NFTLIST
                                    : props.backHome === Screen.NFT_ADVANCEMENT_MATERIALS
                                    ? Screen.NFT_ADVANCEMENT_MATERIALS
                                    : props.backHome === Screen.NFTDETAIL
                                    ? Screen.NFTDETAIL
                                    : Screen.BACK

                            if (props.toNavigate === Screen.NFTLIST) {
                                updatedNavigationParams = { selectedNftIndex: 0 }
                            }
                        }
                        route.name === Screen.NFTADVANCEMENT
                            ? navigate(navigateTo, {
                                  navigationParams: updatedNavigationParams,
                                  nftseq: props.nftSeq,
                                  toNavigate: Screen.NFTLIST,
                              })
                            : navigate(navigateTo, { navigationParams: updatedNavigationParams, nftseq: props.nftSeq })
                    }}
                >
                    {/* <Image
                        source={mainHeaderImg.back["1x"]}
                        style={{
                            width: RatioUtil.width(10),
                            height: RatioUtil.width(15),
                        }}
                        resizeMode="contain"
                    /> */}
                    <SvgIcon name="BackSvg" />
                </CustomButton>
            ) : (
                <View />
            )}
            <Pressable
                style={[
                    mainHeaderCss.menuCon,
                    { backgroundColor: route.name !== Screen.NFTLIST ? Colors.WHITE : Colors.GRAY7 },
                ]}
                onPress={async () => {
                    if (route.name === Screen.NFTDETAIL) {
                        await Analytics.logEvent(AnalyticsEventName.click_wallet_70, {
                            hasNewUserData: true,
                            first_action: "FALSE",
                        })
                    } else {
                        await Analytics.logEvent(AnalyticsEventName.click_wallet_45, {
                            hasNewUserData: true,
                            first_action: "FALSE",
                        })
                    }
                    navigate(Screen.WALLETS)
                }}
            >
                <MainHeaderCompo.Menu
                    img={mainHeaderImg.point}
                    text={String(props.bdst)}
                    // superscript={trainingSuperscript}
                />
                <MainHeaderCompo.Menu
                    img={mainHeaderImg.coin}
                    text={String(props.training)}
                    // superscript={bdstSuperscript}
                />
                <MainHeaderCompo.Menu
                    img={mainHeaderImg.tbora}
                    text={String(props.tbora)}
                    // superscript={bdstSuperscript}
                />
            </Pressable>
        </View>
    )
}
