import { View, Image, Button, Pressable } from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { mainHeaderImg } from "assets/images"
import { LayoutStyle } from "styles/layout.style"
import { SafeAreaView } from "react-native-safe-area-context"
import { useQuery, useStyle } from "hooks"
import { MainHeaderCompo } from "./layout.compo"
import { navigate, RatioUtil } from "utils"
import { Screen } from "const"
import { CustomButton } from "components/utils"
import { Text } from "react-native-svg"
import { useRoute } from "@react-navigation/native"
import { profileSvc } from "apis/services"
import { SvgIcon } from "components/Common/SvgIcon"
export interface IPointHeader {
    training: number | null
    bdst: number | null
}

export const PointHeader = (props: IPointHeader) => {
    const { style: pointHeaderCss } = useStyle(LayoutStyle.genMainHeader)
    const route = useRoute()

    return (
        <View style={pointHeaderCss.con}>
            {route.name !== Screen.RANK && (
                <CustomButton
                    style={{
                        ...RatioUtil.size(8, 16),
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
                    <SvgIcon name="BackSvg"/>
                </CustomButton>
            )}
            <View
                style={{
                    flexDirection: "row",
                    height: RatioUtil.height(30),
                    alignItems: "center",
                    right: RatioUtil.width(20),
                    position: "absolute",
                }}
            >
                <MainHeaderCompo.Menu img={mainHeaderImg.point} text={String(props.bdst)} />

                <MainHeaderCompo.Menu img={mainHeaderImg.coin} text={String(props.training)} />

                <MainHeaderCompo.Menu
                    img={mainHeaderImg.tbora}
                    // text={String(props.tbora)}
                    text={String(0)}
                    // superscript={bdstSuperscript}
                />
            </View>
        </View>
    )
}
