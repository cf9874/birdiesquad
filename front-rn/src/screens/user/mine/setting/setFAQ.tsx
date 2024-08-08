import { View, Image, TextInput, Text, ScrollView, Linking, Modal, BackHandler, StatusBar } from "react-native"
import React, { useEffect, useState } from "react"
import { MyPageFooter, ProfileHeader } from "components/layouts"
import { CustomButton, PretendText } from "components/utils"
import { mineCompoStyle, mineGStyle, mineStyle } from "styles"
import { myPageImg } from "assets/images"
import { navigate, RatioUtil } from "utils"
import { Colors, Screen } from "const"
import { settingStyle } from "styles/setting.style"
import { SafeAreaView } from "react-native-safe-area-context"
import { jsonSvc, walletSvc } from "apis/services"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ID_TOKEN_KAKAO, LINK_BUY_PLAYER } from "const/wallet.const"
import WebView from "react-native-webview"
import { CLOSE_WEBVIEW_MESSAGE } from "apis/data"
const SetFAQ = () => {
    const [menu, setMenu] = useState(menuList)
    const [faq, setFaq] = useState(faqList)
    const [isVisible, setIsVisible] = useState(false)

    const [idToken, setIdToken] = useState<string | null>("")
    const getID = async () => {
        const idToken = await AsyncStorage.getItem(ID_TOKEN_KAKAO)
        setIdToken(idToken)
    }

    // setLinkUrl(mode == 0 ? LINK_BUY_PLAYER + id_token : LINK_SALE_PLAYER + id_token)

    const openOnchainMarket = async () => {
        await walletSvc.isWalletTokenLive().then(async response => {
            if (!response || response.expires_in < 600) {
                await walletSvc.getWalletRenwToken().then(data => {
                    if (data) {
                        setIdToken(data.id_token)
                        navigate(Screen.WEBVIEWTERM, {
                            url: LINK_BUY_PLAYER + data.id_token,
                            hideBack: true,
                        })
                    }
                })
            } else {
                navigate(Screen.WEBVIEWTERM, {
                    url: LINK_BUY_PLAYER + idToken,
                    hideBack: true,
                })
            }
        })
    }

    useEffect(() => {
        const backAction = () => {
            navigate(Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])
    useEffect(() => {
        getID()
    }, [])
    return (
        <SafeAreaView style={mineGStyle.con}>
            {/* <ProfileHeader title="자주 묻는 질문" /> */}
            <ProfileHeader title={jsonSvc.findLocalById("172003")} />
            <StatusBar barStyle={"dark-content"} backgroundColor={isVisible ? "black" : "white"} />
            <View style={{ ...mineGStyle.bgCon, alignItems: "center" }}>
                <View style={settingStyle.FAQ.con}>
                    {menu.map((v, i) => (
                        <CustomButton
                            key={v.title}
                            style={{
                                ...settingStyle.FAQ.menuCon,
                                backgroundColor: v.isClick ? Colors.BLACK5 : Colors.GRAY9,
                                marginTop: i > 2 ? RatioUtil.heightFixedRatio(10) : 0,
                            }}
                            onPress={() => {
                                setFaq(faqList)
                                if (i != 0) {
                                    setFaq(faqList.filter(value => value.id >= i * 100 && value.id < (i + 1) * 100))
                                }
                                setMenu(_menu =>
                                    _menu.map(value => ({ title: value.title, isClick: value.title === v.title }))
                                )
                            }}
                        >
                            <PretendText
                                style={{
                                    ...settingStyle.FAQ.menuText,
                                    color: v.isClick ? Colors.WHITE : Colors.BLACK2,
                                }}
                            >
                                {v.title}
                            </PretendText>
                        </CustomButton>
                    ))}
                </View>
                <View style={{ ...mineGStyle.grayBar, marginTop: RatioUtil.heightFixedRatio(18) }} />
                <ScrollView style={settingStyle.FAQ.contentCon}>
                    {faq.map(v => {
                        return (
                            <>
                                <CustomButton
                                    key={v.id}
                                    onPress={() => {
                                        setFaq(list =>
                                            list.map(value =>
                                                value.title === v.title ? { ...value, isOpen: !value.isOpen } : value
                                            )
                                        )
                                    }}
                                >
                                    <View style={settingStyle.FAQ.listCon}>
                                        <PretendText
                                            style={[settingStyle.FAQ.listTitleText, { width: RatioUtil.width(290) }]}
                                        >
                                            {v.title}
                                        </PretendText>
                                        <View
                                            style={{
                                                width: RatioUtil.width(24),
                                                height: RatioUtil.width(24),
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Image
                                                source={myPageImg.arrow}
                                                resizeMode="contain"
                                                style={{
                                                    width: RatioUtil.width(7),
                                                    height: RatioUtil.heightFixedRatio(12),
                                                    transform: [{ rotate: v.isOpen ? "-90deg" : "90deg" }],
                                                }}
                                            />
                                        </View>
                                    </View>
                                </CustomButton>
                                {v.isOpen ? (
                                    <View
                                        style={{
                                            width: RatioUtil.width(360),
                                            padding: RatioUtil.width(20),
                                            backgroundColor: Colors.GRAY9,
                                        }}
                                    >
                                        <PretendText style={settingStyle.FAQ.listSubText}>{v.desc}</PretendText>
                                        {v?.link ? (
                                            <CustomButton
                                                style={{
                                                    width: RatioUtil.width(150),
                                                    paddingRight: RatioUtil.width(10),
                                                    paddingVertical: RatioUtil.heightFixedRatio(5),
                                                }}
                                                //
                                                onPress={() => openOnchainMarket()}
                                            >
                                                <PretendText
                                                    style={{
                                                        textDecorationLine: "underline",
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    {/* NFT 거래소 바로가기 */}
                                                    {jsonSvc.findLocalById("QNA_NFT_BUY_PLAYER_ENV_LINK")}
                                                </PretendText>
                                            </CustomButton>
                                        ) : null}
                                    </View>
                                ) : null}
                            </>
                        )
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default SetFAQ

const menuList = [
    {
        title:
            // "전체",
            jsonSvc.findLocalById("2024"),
        isClick: true,
    },
    {
        title:
            // "계정/설정",
            jsonSvc.findLocalById("919000"),
        isClick: false,
    },
    {
        title:
            // "래플",
            jsonSvc.findLocalById("13107"),
        isClick: false,
    },
    {
        title:
            // "스펜딩/지갑",
            jsonSvc.findLocalById("919001"),
        isClick: false,
    },
    {
        title:
            // "NFT",
            jsonSvc.findLocalById("7074"),
        isClick: false,
    },
    {
        title:
            // "포인트",
            jsonSvc.findLocalById("919002"),
        isClick: false,
    },
    {
        title:
            // "응원/랭크",
            jsonSvc.findLocalById("919003"),
        isClick: false,
    },
    {
        title:
            // "환불/취소",
            jsonSvc.findLocalById("919004"),
        isClick: false,
    },
    {
        title:
            // "오류/기타",
            jsonSvc.findLocalById("919005"),
        isClick: false,
    },
]
const faqList = [
    {
        id: 100,
        title: jsonSvc.findLocalById("920100"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921100"),
    },
    {
        id: 101,
        title: jsonSvc.findLocalById("920101"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921101"),
    },
    {
        id: 102,
        title: jsonSvc.findLocalById("920102"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921102"),
    },
    {
        id: 103,
        title: jsonSvc.findLocalById("920103"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921103"),
    },
    {
        id: 104,
        title: jsonSvc.findLocalById("920104"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921104"),
    },
    {
        id: 105,
        title: jsonSvc.findLocalById("920105"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921105"),
    },
    {
        id: 106,
        title: jsonSvc.findLocalById("920106"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921106"),
    },
    {
        id: 107,
        title: jsonSvc.findLocalById("920107"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921107"),
    },
    {
        id: 108,
        title: jsonSvc.findLocalById("920108"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921108"),
    },
    {
        id: 109,
        title: jsonSvc.findLocalById("920109"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921109"),
    },
    {
        id: 200,
        title: jsonSvc.findLocalById("920110"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921110"),
    },
    {
        id: 201,
        title: jsonSvc.findLocalById("920111"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921111"),
    },
    {
        id: 202,
        title: jsonSvc.findLocalById("920112"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921112"),
    },
    {
        id: 203,
        title: jsonSvc.findLocalById("920113"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921113"),
    },
    {
        id: 204,
        title: jsonSvc.findLocalById("920114"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921114"),
    },
    {
        id: 205,
        title: jsonSvc.findLocalById("920115"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921115"),
    },
    {
        id: 206,
        title: jsonSvc.findLocalById("920116"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921116"),
    },
    {
        id: 207,
        title: jsonSvc.findLocalById("920117"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921117"),
    },
    {
        id: 208,
        title: jsonSvc.findLocalById("920118"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921118"),
    },
    {
        id: 209,
        title: jsonSvc.findLocalById("920119"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921119"),
    },
    {
        id: 210,
        title: jsonSvc.findLocalById("920120"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921120"),
    },
    {
        id: 211,
        title: jsonSvc.findLocalById("920121"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921121"),
    },
    {
        id: 212,
        title: jsonSvc.findLocalById("920122"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921122"),
    },
    {
        id: 213,
        title: jsonSvc.findLocalById("920123"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921123"),
    },
    {
        id: 214,
        title: jsonSvc.findLocalById("920124"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921124"),
    },
    {
        id: 300,
        title: jsonSvc.findLocalById("920125"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921125"),
    },
    {
        id: 301,
        title: jsonSvc.findLocalById("920126"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921126"),
    },
    {
        id: 302,
        title: jsonSvc.findLocalById("920127"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921127"),
    },
    {
        id: 303,
        title: jsonSvc.findLocalById("920128"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921128"),
    },
    {
        id: 304,
        title: jsonSvc.findLocalById("920129"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921129"),
    },
    {
        id: 305,
        title: jsonSvc.findLocalById("920130"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921130"),
    },
    {
        id: 306,
        title: jsonSvc.findLocalById("920131"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921131"),
    },
    {
        id: 307,
        title: jsonSvc.findLocalById("920132"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921132"),
    },
    {
        id: 308,
        title: jsonSvc.findLocalById("920133"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921133"),
    },
    {
        id: 309,
        title: jsonSvc.findLocalById("920134"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921134"),
    },
    {
        id: 310,
        title: jsonSvc.findLocalById("920135"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921135"),
    },
    {
        id: 400,
        title: jsonSvc.findLocalById("920136"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921136"),
    },
    {
        id: 401,
        title: jsonSvc.findLocalById("920137"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921137"),
    },
    {
        id: 402,
        title: jsonSvc.findLocalById("920138"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921138"),
    },
    {
        id: 403,
        title: jsonSvc.findLocalById("920139"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921139"),
    },
    {
        id: 404,
        title: jsonSvc.findLocalById("920140"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921140"),
    },
    {
        id: 405,
        title: jsonSvc.findLocalById("920141"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921141"),
    },
    {
        id: 406,
        title: jsonSvc.findLocalById("920142"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921142"),
    },
    {
        id: 407,
        title: jsonSvc.findLocalById("920143"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921143"),
    },
    {
        id: 408,
        title: jsonSvc.findLocalById("920144"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921144"),
    },
    {
        id: 409,
        title: jsonSvc.findLocalById("920145"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921145"),
    },
    {
        id: 410,
        title: jsonSvc.findLocalById("920146"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921146"),
    },
    {
        id: 411,
        title: jsonSvc.findLocalById("920147"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921147"),
    },
    {
        id: 412,
        title: jsonSvc.findLocalById("920148"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921148"),
    },
    {
        id: 413,
        title: jsonSvc.findLocalById("920149"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921149"),
    },
    {
        id: 414,
        title: jsonSvc.findLocalById("920150"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921150"),
    },
    {
        id: 415,
        title: jsonSvc.findLocalById("920151"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921151"),
    },
    {
        id: 416,
        title: jsonSvc.findLocalById("920152"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921152"),
    },
    {
        id: 417,
        title: jsonSvc.findLocalById("920153"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921153"),
    },
    {
        id: 418,
        title: jsonSvc.findLocalById("920154"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921154"),
    },
    {
        id: 419,
        title: jsonSvc.findLocalById("920155"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921155"),
    },
    {
        id: 420,
        title: jsonSvc.findLocalById("920156"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921156"),
    },
    {
        id: 421,
        title: jsonSvc.findLocalById("920157"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921157"),
    },
    {
        id: 422,
        title: jsonSvc.findLocalById("920159"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921159"),
        link: jsonSvc.findConstById(44000).sStrValue,
    },
    {
        id: 423,
        title: jsonSvc.findLocalById("920158"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921158"),
    },
    {
        id: 500,
        title: jsonSvc.findLocalById("920160"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921160"),
    },
    {
        id: 501,
        title: jsonSvc.findLocalById("920161"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921161"),
    },
    {
        id: 502,
        title: jsonSvc.findLocalById("920162"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921162"),
    },
    {
        id: 503,
        title: jsonSvc.findLocalById("920163"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921163"),
    },
    {
        id: 504,
        title: jsonSvc.findLocalById("920164"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921164"),
    },
    {
        id: 505,
        title: jsonSvc.findLocalById("920165"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921165"),
    },
    {
        id: 506,
        title: jsonSvc.findLocalById("920166"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921166"),
    },
    {
        id: 507,
        title: jsonSvc.findLocalById("920167"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921167"),
    },
    {
        id: 508,
        title: jsonSvc.findLocalById("920168"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921168"),
    },
    {
        id: 509,
        title: jsonSvc.findLocalById("920169"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921169"),
    },
    {
        id: 600,
        title: jsonSvc.findLocalById("920170"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921170"),
    },
    {
        id: 601,
        title: jsonSvc.findLocalById("920171"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921171"),
    },

    {
        id: 603,
        title: jsonSvc.findLocalById("920173"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921172"),
    },
    {
        id: 604,
        title: jsonSvc.findLocalById("920174"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921173"),
    },
    {
        id: 605,
        title: jsonSvc.findLocalById("920175"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921174"),
    },
    {
        id: 606,
        title: jsonSvc.findLocalById("920176"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921175"),
    },
    {
        id: 607,
        title: jsonSvc.findLocalById("920177"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921176"),
    },
    {
        id: 608,
        title: jsonSvc.findLocalById("920178"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921177"),
    },
    {
        id: 609,
        title: jsonSvc.findLocalById("920179"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921178"),
    },
    {
        id: 610,
        title: jsonSvc.findLocalById("920180"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921179"),
    },
    {
        id: 611,
        title: jsonSvc.findLocalById("920181"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921180"),
    },
    {
        id: 612,
        title: jsonSvc.findLocalById("920182"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921181"),
    },
    {
        id: 613,
        title: jsonSvc.findLocalById("920183"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921182"),
    },
    {
        id: 614,
        title: jsonSvc.findLocalById("920184"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921183"),
    },
    {
        id: 615,
        title: jsonSvc.findLocalById("920185"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921184"),
    },
    {
        id: 616,
        title: jsonSvc.findLocalById("920186"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921185"),
    },
    {
        id: 617,
        title: jsonSvc.findLocalById("920187"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921186"),
    },
    {
        id: 618,
        title: jsonSvc.findLocalById("920188"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921187"),
    },
    {
        id: 700,
        title: jsonSvc.findLocalById("920189"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921188"),
    },
    {
        id: 701,
        title: jsonSvc.findLocalById("920190"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921189"),
    },
    {
        id: 702,
        title: jsonSvc.findLocalById("920191"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921190"),
    },
    {
        id: 703,
        title: jsonSvc.findLocalById("920192"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921191"),
    },
    {
        id: 704,
        title: jsonSvc.findLocalById("920193"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921192"),
    },
    {
        id: 705,
        title: jsonSvc.findLocalById("920194"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921193"),
    },
    {
        id: 706,
        title: jsonSvc.findLocalById("920195"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921194"),
    },
    {
        id: 707,
        title: jsonSvc.findLocalById("920196"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921195"),
    },
    {
        id: 708,
        title: jsonSvc.findLocalById("920197"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921196"),
    },
    {
        id: 709,
        title: jsonSvc.findLocalById("920198"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921197"),
    },
    {
        id: 800,
        title: jsonSvc.findLocalById("920199"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921198"),
    },
    {
        id: 801,
        title: jsonSvc.findLocalById("920200"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921199"),
    },
    {
        id: 802,
        title: jsonSvc.findLocalById("920201"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921200"),
    },
    {
        id: 803,
        title: jsonSvc.findLocalById("920202"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921201"),
    },
    {
        id: 804,
        title: jsonSvc.findLocalById("920203"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921203"),
    },
    {
        id: 805,
        title: jsonSvc.findLocalById("920204"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921204"),
    },
    {
        id: 806,
        title: jsonSvc.findLocalById("920205"),
        isOpen: false,
        desc: jsonSvc.findLocalById("921205"),
    },
]
