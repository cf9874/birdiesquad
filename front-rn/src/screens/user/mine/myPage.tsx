import { View, Image, Linking, ImageProps } from "react-native"
import React, { useState, useEffect, useCallback } from "react"
import { HomeHeader, MainHeader, MyPageFooter } from "components/layouts"
import { CustomButton, PretendText } from "components/utils"
import { mineGStyle, mineStyle } from "styles"
import { myPageImg, nftDetailImg } from "assets/images"
import { ProfileButton } from "./mine.compo"
import { ConfigUtil, navigate, RatioUtil } from "utils"
import { AnalyticsEventName, Colors, Screen } from "const"
import { useAsyncEffect, useQuery } from "hooks"
import { jsonSvc, profileSvc, signSvc } from "apis/services"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { scaleSize } from "styles/minixs"
import { IMyProfile, ProfileApiData } from "apis/data"
import { useFocusEffect } from "@react-navigation/native"
import { Modal } from "react-native"
import WebView from "react-native-webview"
import { ImageSourcePropType } from "react-native"
import { SvgIcon } from "components/Common/SvgIcon"
import { Analytics } from "utils/analytics.util"

const Mypage = () => {
    //const [data] = useQuery(profileSvc.getMyProfile, {loading: false})
    //const [asset] = useQuery(profileSvc.getAsset, {loading: false})

    const [data, setData] = useState<IMyProfile | null>(null)
    const [asset, setAsset] = useState<{
        bdst: number
        tbora: number
        trainingPoint: number
    }>({
        bdst: 0,
        tbora: 0,
        trainingPoint: 0,
    })

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                const data = await profileSvc.getMyProfile()
                if (data) setData(data)

                const asset = await profileSvc.getAsset()
                const {
                    asset: { bdst, tbora, training: trainingPoint },
                } = asset as IAsset

                if (asset) setAsset({ bdst, tbora, trainingPoint })
            }
            fetchData()
        }, [])
    )
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_myPage_400, {
            hasNewUserData: true,
        })
    }, [])
    return (
        <SafeAreaView style={mineGStyle.con}>
            {data && (
                <>
                    <MainHeader training={asset.trainingPoint} bdst={asset.bdst} tbora={asset.tbora} hideArrow={true} />
                    <View style={mineStyle.myPage.ProfileCon}>
                        <CustomButton
                            style={mineStyle.myPage.profileButtonCon}
                            onPress={async () => {
                                //본인의 userseq도 넘겨줘야함
                                await Analytics.logEvent(AnalyticsEventName.click_myProfile_400, {
                                    hasNewUserData: true,
                                })

                                navigate(Screen.USERPROFILE, { userSeq: data.USER_SEQ })
                            }}
                        >
                            <PretendText style={mineStyle.myPage.profileButtonText}>
                                {/* 프로필 보기 */}
                                {jsonSvc.findLocalById("170025")}
                            </PretendText>
                        </CustomButton>
                        <ProfileButton
                            // img={ConfigUtil.getProfile(data.ICON_NAME, data.ICON_TYPE)}
                            name={data.ICON_NAME}
                            type={data.ICON_TYPE}
                            onPress={() => navigate(Screen.MYEDIT, { data: data })}
                        />
                        <View>
                            <PretendText style={mineStyle.myPage.titleText}>{data.NICK}</PretendText>
                            <PretendText style={mineStyle.myPage.greetText}>{data.HELLO}</PretendText>
                        </View>
                    </View>
                    <View
                        style={{
                            width: RatioUtil.width(360),
                            height: RatioUtil.height(3),
                            backgroundColor: Colors.GRAY9,
                        }}
                    />
                    <View style={mineStyle.myPage.menuCon}>
                        <View
                            style={{
                                // width: RatioUtil.width(320),
                                // height: RatioUtil.height(192),
                                ...RatioUtil.size(320, 192),
                                justifyContent: "space-between",
                            }}
                        >
                            {menu.map(({ title, link }) => (
                                <CustomButton
                                    key={title}
                                    style={mineGStyle.menuBox.con}
                                    onPress={async () => {
                                        if (link === Screen.CONTESTRECORD) {
                                            await Analytics.logEvent(AnalyticsEventName.click_tour_record_400, {
                                                hasNewUserData: true,
                                                first_action: "FALSE",
                                            })
                                        }
                                        navigate(link)
                                    }}
                                >
                                    <PretendText style={mineStyle.myPage.menuText}>{title}</PretendText>
                                    <SvgIcon name="Next" style={{ ...RatioUtil.size(7, 12) }} />
                                </CustomButton>
                            ))}
                        </View>
                        <View style={mineStyle.myPage.linkCon}>
                            <PretendText style={mineStyle.myPage.linkTitleText}>
                                {/* 공식 링크 */}
                                {jsonSvc.findLocalById("170006")}
                            </PretendText>
                            <View
                                style={{
                                    flexDirection: "row",
                                    // width: RatioUtil.width(320),
                                    // height: RatioUtil.height(73),
                                    ...RatioUtil.size(320, 73),
                                    justifyContent: "space-between",
                                    marginTop: RatioUtil.height(11),
                                    //...RatioUtil.margin(11),
                                }}
                            >
                                {link.map(({ title, icon, link, event }) => {
                                    return (
                                        // <CustomButton
                                        //     key={title}
                                        //     style={mineStyle.myPage.linkButtonCon}
                                        //     // onPress={() => {
                                        //     //     typeof link === "string" && Linking.openURL(link)
                                        //     //     //링크 이동
                                        //     // }}
                                        // >

                                        <LinkWebView
                                            key={title}
                                            title={title}
                                            link={typeof link === "string" ? link : ""}
                                            icon={icon}
                                            event={event}
                                        />
                                        // </CustomButton>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </>
            )}
            <MyPageFooter />
        </SafeAreaView>
    )
}

export default Mypage

const LinkWebView = ({
    title,
    link,
    icon,
    event,
}: {
    title: string
    link: string
    icon: ImageSourcePropType
    event: string
}) => {
    const [openLink, setOpenLink] = useState(false)

    const inset = useSafeAreaInsets()
    return (
        <>
            <CustomButton
                onPress={async () => {
                    await Analytics.logEvent(AnalyticsEventName[event as AnalyticsEventName], {
                        hasNewUserData: true,
                        first_action: "FALSE",
                    })
                    setOpenLink(true)
                }}
            >
                <View style={mineStyle.myPage.linkIcon}>
                    <Image
                        source={icon}
                        resizeMode="contain"
                        // style={{ width: RatioUtil.width(24), height: RatioUtil.width(24) }}
                        style={{ ...RatioUtil.size(24, 24) }}
                    />
                </View>
                <PretendText style={mineStyle.myPage.linkText}>{title}</PretendText>
            </CustomButton>
            <Modal visible={openLink} statusBarTranslucent transparent onRequestClose={() => setOpenLink(false)}>
                <CustomButton
                    onPress={() => setOpenLink(false)}
                    style={{
                        height: RatioUtil.width(30 + inset.top),
                        width: "100%",
                        backgroundColor: Colors.WHITE,
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        ...RatioUtil.padding(0, 20, 5, 0),
                    }}
                >
                    <Image
                        source={nftDetailImg.close}
                        style={{
                            //position: "absolute",
                            width: RatioUtil.width(30),
                            height: RatioUtil.width(30),
                            //right: RatioUtil.width(20),
                        }}
                    />
                </CustomButton>
                <WebView
                    source={{
                        uri: link,
                    }}
                />
            </Modal>
        </>
    )
}

interface IAsset {
    asset: {
        training: number
        bdst: number
        tbora: number
    }
}

const menu = [
    { title: jsonSvc.findLocalById("170003"), link: Screen.PROCESSIN },
    { title: jsonSvc.findLocalById("170004"), link: Screen.CONTESTRECORD },
    { title: jsonSvc.findLocalById("170005"), link: Screen.MYSETTING },
]

const link = [
    {
        title: jsonSvc.findLocalById("170016"),
        icon: myPageImg.link.home,
        link: jsonSvc.findConstById(43000).sStrValue,
        event: "click_link_home_400",
    },
    {
        title: jsonSvc.findLocalById("170017"),
        icon: myPageImg.link.backseo,
        link: jsonSvc.findConstById(43001).sStrValue,
        event: "click_link_white_400",
    },
    {
        title: jsonSvc.findLocalById("170018"),
        icon: myPageImg.link.youtube,
        link: jsonSvc.findConstById(43005).sStrValue,
        event: "click_link_youtube_400",
    },
    {
        title: jsonSvc.findLocalById("170019"),
        icon: myPageImg.link.twitter,
        link: jsonSvc.findConstById(43003).sStrValue,
        event: "click_link_twitter_400",
    },
    {
        title: jsonSvc.findLocalById("170020"),
        icon: myPageImg.link.insta,
        link: jsonSvc.findConstById(43004).sStrValue,
        event: "click_link_insta_400",
    },
]
