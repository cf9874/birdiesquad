import { View, Image, Button, Pressable, StatusBar, Platform } from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { homeImg, mainHeaderImg } from "assets/images"
import { LayoutStyle } from "styles/layout.style"

import { useQuery, useStyle } from "hooks"
import { MainHeaderCompo } from "./layout.compo"
import { navigate, RatioUtil } from "utils"
import { AnalyticsEventName, Dimension, Screen } from "const"
import { CustomButton } from "components/utils"
import { useRoute } from "@react-navigation/native"
import { SvgIcon } from "components/Common/SvgIcon"
import { Analytics } from "utils/analytics.util"
export interface IHomeHeader {
    training: number | undefined
    bdst: number | undefined
    tbora: number | undefined
    renderToggel?: () => void
}
export const HomeHeader = (props: IHomeHeader) => {
    // console.log("mainHeader is rendered")
    const { style: mainHeaderCss } = useStyle(LayoutStyle.genMainHeader)

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
            style={{
                height: RatioUtil.lengthFixedRatio(44),
                width: RatioUtil.width(360),
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                ...RatioUtil.padding(0, Dimension.NFT.DETAIL.PADDING, 0, Dimension.NFT.DETAIL.PADDING),
            }}
        >
            <StatusBar barStyle="light-content" backgroundColor={"transparent"} translucent={true} />
            <Image
                source={Platform.OS === "android" ? homeImg.logoB : homeImg.logo}
                style={{ marginLeft: RatioUtil.width(10), width: RatioUtil.width(24), height: RatioUtil.width(24) }}
                resizeMode="contain"
            />
            {route.name !== Screen.NFTLIST && (
                <CustomButton
                    style={{
                        ...RatioUtil.sizeFixedRatio(8, 16),
                        alignItems: "center",
                        justifyContent: "center",
                        left: RatioUtil.width(32),
                        margin: 0,
                        padding: 0,
                        position: "absolute",
                    }}
                    onPress={() => navigate(Screen.BACK)}
                >
                    {/* <Image source={mainHeaderImg.back["1x"]} /> */}
                    <SvgIcon name="BackSvg" />
                </CustomButton>
            )}
            <Pressable
                style={mainHeaderCss.menuCon}
                onPress={async () => {
                    await Analytics.logEvent(AnalyticsEventName.click_wallet_45, {
                        hasNewUserData: true,
                        first_action: "FALSE",
                    })
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
