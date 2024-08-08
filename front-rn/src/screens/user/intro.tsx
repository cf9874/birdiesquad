import React, { useRef, useState } from "react"
import { Image, ImageBackground, Text, View } from "react-native"
import { IntroImg } from "assets/images"
import { userStyle, userGStyle } from "styles/user.style"
import { CustomButton, PretendText } from "components/utils"
import { ConfigUtil, navigateReset, RatioUtil } from "utils"
import { Colors, Screen, ThirdPartyAnalyticsEventName } from "const"
import { useQuery, useStyle, useDimension } from "hooks"
import { SafeAreaView } from "react-native-safe-area-context"
import { jsonSvc, profileSvc } from "apis/services"
import { Carousel, useCarousel } from "components/Carousel"
import IntroCompo from "./intro.compo"
import SnapCarousel from "./SnapCarousel"
import { useRoute } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
    HOME_SCREEN_TUTORIAL,
    LOGIN_SCREEN_TUTORIAL,
    NFT_ADVANCEMENT_SCREEN_TUTORIAL,
    NFT_DETAIL_SCREEN_TUTORIAL,
    NFT_SPENDING_SCREEN_TUTORIAL,
    RELAY_SCREEN_BEFORE_TUTORIAL,
    RELAY_SCREEN_ENDED_TUTORIAL,
    RELAY_SCREEN_LIVE_TUTORIAL,
    RELAY_SCREEN_POPUP_TUTORIAL,
    SIGNUP_REWARD,
    TutorialId,
} from "const/wallet.const"
import { APP_USER_ID } from "utils/env"
import { Analytics } from "utils/analytics.util"
interface introType {
    id: number
    title: string
    description: string
    image: React.ReactNode
}
const Intro = () => {
    const [dimension, onLayout] = useDimension()
    const route = useRoute()
    const params = route?.params as { nickname: string }
    const carousel = useRef(null)
    const [introData] = useState<introType[]>([
        // {
        //     id: 0,
        //     title: `${params?.nickname || ""}님 반가워요,시작할 준비가 되었나요?`,
        //     description: "",
        //     image: <ImageBackground
        //         source={IntroImg.intro0}
        //         style={{ width: RatioUtil.width(400), height: RatioUtil.height(316) }}
        //         resizeMode="stretch"
        //     >
        //         <Image
        //             source={IntroImg.intro1}
        //             style={{ width: RatioUtil.width(400), height: "100%" }}
        //             resizeMode="contain"
        //         />
        //     </ImageBackground>
        // },
        {
            id: 1,
            // title: "선수 응원하기",
            title: jsonSvc.findLocalById("6003"),
            // description: "다양한 팬들과 함께 선수에게 후원하고 응원해보세요",
            description: jsonSvc.findLocalById("6004"),
            image: (
                <Image
                    source={IntroImg.intro2}
                    style={{ width: RatioUtil.width(400), height: "100%" }}
                    resizeMode="contain"
                />
            ),
        },
        {
            id: 2,
            // title: "선수 육성하기",
            title: jsonSvc.findLocalById("6005"),
            // description: "응원하는 선수의 NFT를 육성해보세요",
            description: jsonSvc.findLocalById("6006"),
            image: (
                <Image
                    source={IntroImg.intro3}
                    style={{ width: RatioUtil.width(400), height: "100%" }}
                    resizeMode="contain"
                />
            ),
        },
        {
            id: 3,
            // title: "랭크 보상",
            title: jsonSvc.findLocalById("6007"),
            // description: "시즌마다 내순위에 따른 보상을 받을 수 있어요!",
            description: jsonSvc.findLocalById("6008"),
            image: (
                <Image
                    source={IntroImg.intro4}
                    style={{ width: RatioUtil.width(400), height: "100%" }}
                    resizeMode="contain"
                />
            ),
        },
        {
            id: 4,
            // title: "래플 응모하기",
            title: jsonSvc.findLocalById("6009"),
            // description: "스페셜 상품을 획득해보세요!",
            description: jsonSvc.findLocalById("6010"),
            image: (
                <Image
                    source={IntroImg.intro5}
                    style={{ width: RatioUtil.width(400), height: "100%" }}
                    resizeMode="contain"
                />
            ),
        },
    ])
    const { style: introCss } = useStyle(userStyle.genTerm)

    const [data] = useQuery(profileSvc.getMyProfile, {
        loading: false,
    })
    if (!data) return <></>

    const onComplete = async () => {
        const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
        await AsyncStorage.setItem(USER_ID + HOME_SCREEN_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_ENDED_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_LIVE_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_BEFORE_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_POPUP_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + NFT_DETAIL_SCREEN_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + NFT_SPENDING_SCREEN_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + NFT_ADVANCEMENT_SCREEN_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + LOGIN_SCREEN_TUTORIAL, "2").then(() => {
            Analytics.thirdPartyLogEvent(ThirdPartyAnalyticsEventName.af_tutorial_completion, {
                af_success: "TRUE",
                af_tutorial_id: TutorialId[LOGIN_SCREEN_TUTORIAL],
            })
        })

        Analytics.thirdPartyLogEvent(ThirdPartyAnalyticsEventName.af_complete_registration)

        navigateReset(Screen.NFTLIST)
    }
    const renderWallet = (item: any, index: any) => {
        return <IntroCompo id={item.id} title={item.title} description={item.description} image={item.image} />
    }
    return (
        <SafeAreaView style={introCss.con}>
            <SnapCarousel
                data={introData}
                style={{
                    flex: 0.8,
                    overflow: "hidden",
                    marginTop: 30,
                }}
                ref={carousel}
                spacing={3}
                renderItem={renderWallet}
                showIndicator={true}
                indicatorSpacing={15}
                onItemSnapped={() => {}}
                itemSize={RatioUtil.width(400) * 0.9}
                dotSize={7}
                indicatorLastItem={false}
                scaleEffect={true}
                dotSelectedColor={Colors.PURPLE}
                dotUnSelectedColor={Colors.GRAY13}
                horizontalScroll={true}
            />
            <View style={userGStyle.userbtn.conIntro}>
                <CustomButton
                    style={{ ...userGStyle.userbtn.box, backgroundColor: Colors.PURPLE }}
                    onPress={onComplete}
                >
                    <PretendText
                        style={{ ...userGStyle.userbtn.text, color: Colors.WHITE, fontSize: RatioUtil.font(16) }}
                    >
                        {/* 시작하기 */}
                        {jsonSvc.findLocalById("6011")}
                    </PretendText>
                </CustomButton>
            </View>
        </SafeAreaView>
    )
}

export default Intro
