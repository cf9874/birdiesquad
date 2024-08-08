import { View, Image, Button, Pressable, TouchableOpacity, StatusBar } from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { mainHeaderImg } from "assets/images"
import { LayoutStyle } from "styles/layout.style"
import { SafeAreaView } from "react-native-safe-area-context"
import { useQuery, useStyle } from "hooks"
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
    hideArrow?: boolean
}
export const MainHeader = (props: IMainHeader) => {
    const { style: mainHeaderCss } = useStyle(LayoutStyle.genMainHeader)
    // const [training, setTraining] = useState()
    // const [bdst, setBdst] = useState()

    const route = useRoute()
    const formattedTraining =
        props.training != null && Number(props.training) >= 9999
            ? "9,999.99"
            : props.training != null
            ? String(
                  props.training
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                      .replace(/\.0+$/, "")
              )
            : ""
    const formattedBDST =
        props.bdst != null && Number(props.bdst) >= 9999.99
            ? "9,999.99"
            : props.bdst != null
            ? String(
                  props.bdst
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                      .replace(/\.0+$/, "")
              )
            : ""
    // const trainingSuperscript = props.training != null && Number(props.training) >= 9999.99 ? "+" : ""
    // const bdstSuperscript = props.bdst != null && Number(props.bdst) >= 9999.99 ? "+" : ""

    return (
        <View
            style={[
                mainHeaderCss.con,
                { backgroundColor: route.name !== Screen.NFTADVANCEMENT ? Colors.WHITE : "transparent" },
            ]}
        >
            <StatusBar barStyle="dark-content" backgroundColor={"transparent"} translucent={true} />
            {!props.hideArrow && route.name !== Screen.NFTLIST ? (
                <CustomButton
                    style={{
                        ...RatioUtil.sizeFixedRatio(45, 45),
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        navigate(
                            props.toNavigate === Screen.PROCESSIN
                                ? Screen.PROCESSIN
                                : props.toNavigate === Screen.NFTLIST
                                ? Screen.NFTLIST
                                : Screen.BACK
                        )
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
                    switch (route.name) {
                        case Screen.NFTLIST:
                            console.log(999)
                            await Analytics.logEvent(AnalyticsEventName.click_wallet_45, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            break
                        case Screen.RANK:
                            console.log(106)
                            await Analytics.logEvent(AnalyticsEventName.click_wallet_150, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            break
                        case Screen.NFTTABSCENE:
                            console.log(113)
                            await Analytics.logEvent(AnalyticsEventName.click_wallet_300, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            break
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
