import React, { useEffect, useState } from "react"
import { Image, ImageBackground, Modal, TouchableOpacity, View } from "react-native"
import { AnalyticsEventName, Colors, ITEM_NID, ITEM_TYPE, Screen } from "const"
import { ConfigUtil, NumberUtil, RatioUtil, checkStopNFT, navigate } from "utils"
import { styles } from "./styles"
import { PretendText } from "components/utils"
import { scaleSize } from "styles/minixs"
import { setGameLoader } from "store/reducers/getGame.reducer"
import { MarketImg, NFTCardImages, nftDetailImg } from "assets/images"
import PriceButton from "components/PriceButton"
import store from "store"
import { useAsyncEffect, useWrapDispatch } from "hooks"
import { setModal } from "store/reducers/config.reducer"
import { jsonSvc, shopSvc } from "apis/services"
import dayjs from "dayjs"
import { useCountdown } from "common/TimeCountDown"
import { Analytics } from "utils/analytics.util"
export const ItemShop = (props: any) => {
    const modalDispatch = useWrapDispatch(setModal)
    const { item } = props
    const [styleItem, setStyleItem] = useState<any>({})
    const [visible, setvisible] = useState(false)
    const [currentPurchase, setCurrentPurchase] = useState<Number>(0)
    const [percentCurrentPurchase, setPercentCurrentPurchase] = useState<boolean>(false)

    const getProduct = (item: any) => {
        switch (item.nID) {
            case ITEM_NID.CHOICE:
                return {
                    name: jsonSvc.findLocalById("7079"),
                    backgrountColor: "#edf1f5",
                    icon: "smapleChoice",
                    // sSkus: "choice_card_2023_sale30",
                    sSkus: item.sSkus,
                    // title: "NFT 초이스 카드",
                    title: jsonSvc.findLocalById(item.nProductName),
                }
                break
            case ITEM_NID.PREMIUM:
                return {
                    name: jsonSvc.findLocalById("7081"),
                    backgrountColor: "#fff6ef",
                    icon: "smaplePremium",
                    sSkus: item.sSkus,
                    // title: "고급 럭키드로우",
                    title: jsonSvc.findLocalById(item.nProductName),
                }
                break
            case ITEM_NID.NORMAL:
                return {
                    name: jsonSvc.findLocalById("7080"),
                    backgrountColor: "#eef0ff",
                    icon: "smapleNormal",
                    sSkus: item.sSkus,
                    // title: "일반 럭키드로우",
                    title: jsonSvc.findLocalById(item.nProductName),
                }
                break
            case ITEM_NID.NORMALMULTIPAK:
                return {
                    name: jsonSvc.findLocalById("7080"),
                    backgrountColor: "#eef0ff",
                    icon: "smapleNormal",
                    sSkus: item.sSkus,
                    // title: "일반 럭키드로우 10개묶음",
                    title: jsonSvc.findLocalById(item.nProductName),
                }
                break
            default:
                break
        }
    }

    const endTime = dayjs(item.sEndTime)
    const [date, hour, minute] = useCountdown(endTime)

    useEffect(() => {
        setStyleItem(getProduct(item))
        getPurchaseCount()
    }, [item])

    const getPurchaseCount = async () => {
        const { BUY_GOODS } = await shopSvc.getPurchaseCount()
        const check: any = BUY_GOODS?.find((i: any) => i?.SHOP_CODE == item?.nID)
        if (check) {
            const currentPurchase = item.nBuyLimit - check.BUY_COUNT
            const percentCurrentPurchase = 100 - (check.BUY_COUNT / item.nBuyLimit) * 100
            if (percentCurrentPurchase < 10) {
                setPercentCurrentPurchase(true)
            } else {
                setPercentCurrentPurchase(false)
            }
            if (currentPurchase && currentPurchase > 0) {
                setCurrentPurchase(currentPurchase)
            } else {
                setCurrentPurchase(0)
            }
        }
    }
    const handleClick = async () => {
        if (item.nID === 101) {
            // 초이스 상품 버튼
            await Analytics.logEvent(AnalyticsEventName.click_product_choice_300, {
                hasNewUserData: true,
            })
        } else if (item.nID === 201) {
            // 프리미엄 상품 버튼
            await Analytics.logEvent(AnalyticsEventName.click_product_premium_300, {
                hasNewUserData: true,
            })
        } else if (item.nID === 202) {
            // 노멀 상품 버튼
            await Analytics.logEvent(AnalyticsEventName.click_product_normal_300, {
                hasNewUserData: true,
            })
        }
        //  else if (item.nID === 401) {
        //     // 노멀 멀티플 상품 버튼
        //     await Analytics.logEvent(AnalyticsEventName.click_product_normal_300, {
        //         hasNewUserData: true,
        //     })
        // }

        store.dispatch(setGameLoader(false))
        navigate(Screen.PLAYERSELECTION, {
            active: false,
            image: NFTCardImages[styleItem?.icon],
            selection: true,
            title: styleItem.title,
            price: item.dCostValue === item.dSaleCostValue ? item.dCostValue : item.dSaleCostValue,
            shopCode: item.nID,
            sSkus: item.sSkus,
            name: styleItem.name,
            sProductCodeIos: item.sProductCodeIos,
            nSale: item.nSale,
        })
    }

    return (
        <TouchableOpacity
            onPress={() => handleClick()}
            disabled={item.nBuyLimit === -1 ? false : currentPurchase === 0}
            style={[styles.bottomCardView, { backgroundColor: styleItem?.backgrountColor || null }]}
        >
            <View style={{ flexDirection: "row" }}>
                <View style={styles.cardBottomMainView}>
                    <ImageBackground
                        resizeMode="contain"
                        source={NFTCardImages[styleItem?.icon]}
                        style={[styles.bottomCardMainView]}
                    >
                        {item.dCostValue !== item.dSaleCostValue ? (
                            <Image
                                source={MarketImg.sale_icon}
                                style={{
                                    width: RatioUtil.width(30),
                                    height: RatioUtil.width(30),
                                    position: "absolute",
                                    top: RatioUtil.lengthFixedRatio(-5),
                                    right: 0,
                                }}
                            />
                        ) : null}
                        {item.dCostValue !== item.dSaleCostValue ? (
                            <View
                                style={[
                                    styles.bottomCardMainView,
                                    {
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                    },
                                ]}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        width: RatioUtil.width(30),
                                        fontSize: RatioUtil.font(12),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                    }}
                                >
                                    {item.nSale}%
                                </PretendText>
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        width: RatioUtil.width(30),
                                        fontSize: RatioUtil.font(10),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        marginBottom: RatioUtil.lengthFixedRatio(4),
                                    }}
                                >
                                    SALE
                                </PretendText>
                            </View>
                        ) : null}
                    </ImageBackground>
                </View>
                <View
                    style={{
                        height: RatioUtil.lengthFixedRatio(80),
                        justifyContent: "center",
                        marginLeft: RatioUtil.width(20),
                    }}
                >
                    <View>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                lineHeight: RatioUtil.font(16) * 1.3,
                                fontWeight: "700",
                                color: Colors.BLACK,
                            }}
                        >
                            {styleItem.name + (item.listItemID.length > 1 ? " x" + item.listItemID.length : "")}
                        </PretendText>
                        <PretendText
                            style={{
                                marginTop: RatioUtil.lengthFixedRatio(4),
                                fontSize: RatioUtil.font(12),
                                color: "#87878D",
                                fontWeight: "400",
                                lineHeight: RatioUtil.font(12) * 1.3,
                            }}
                        >
                            {/* {item.nBuyLimit === -1 ? "상시 구매 가능" : `${currentPurchase}개 남음`} */}
                            {item.nBuyLimit !== -1
                                ? jsonSvc.formatLocal(jsonSvc.findLocalById("13103"), [currentPurchase.toString()])
                                : item.sStartTime.length === 0 && item.sEndTime.length === 0
                                ? jsonSvc.findLocalById("13104")
                                : ""}
                        </PretendText>
                    </View>
                </View>
            </View>
            <View
                style={[
                    styles.cardBottomMainView,
                    {
                        width: RatioUtil.width(110),
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}
            >
                {/*  item.dCostValue === item.dSaleCostValue ? item.dCostValue : item.dSaleCostValue,*/}
                <PriceButton
                    price={
                        currentPurchase !== 0 || item.nBuyLimit === -1
                            ? NumberUtil.koreanFormatter(
                                  item.dCostValue === item.dSaleCostValue ? item.dCostValue : item.dSaleCostValue
                              ) ?? 0
                            : jsonSvc.findLocalById("1114")
                    }
                    disabled={item.nBuyLimit === -1 ? false : currentPurchase === 0}
                    showHurry={percentCurrentPurchase && item.nBuyLimit !== -1 && currentPurchase !== 0}
                    // showHurry={true}
                    onPress={() => handleClick()}
                />
                {item.sEndTime !== "" ? (
                    <View
                        style={{
                            position: "absolute",
                            width: RatioUtil.width(110),
                            bottom: RatioUtil.lengthFixedRatio(3),
                            justifyContent: "center",
                            alignContent: "center",
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(12),
                                textAlign: "center",
                                color: "#87878D",
                            }}
                        >
                            {date}일 {hour}시간 {minute}분
                        </PretendText>
                    </View>
                ) : null}
            </View>
            <Modal visible={visible} statusBarTranslucent transparent>
                <View style={styles.modalMainView}>
                    <View style={styles.modalInnerView}>
                        <PretendText style={styles.modalTitle}>
                            {/* 현재 투어 정산시간입니다. */}
                            {jsonSvc.findLocalById("10000061")}
                        </PretendText>
                        <PretendText style={styles.modalDesc}>
                            {/* 정산 중일 때는 정확한 정산을 위해 NFT를 구매할 수 없습니다. 완료될 때까지 잠시만 기다려
                            주세요. */}
                            {jsonSvc.findLocalById("10000062")}
                        </PretendText>
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
    )
}
