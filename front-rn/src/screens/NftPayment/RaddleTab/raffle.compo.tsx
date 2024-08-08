import { CustomButton, PretendText } from "components/utils"
import { styles } from "./styles"

import nftPlayerJson from "json/nft_player.json"
import { jsonSvc } from "apis/services"
import { Image, View, SafeAreaView, StatusBar } from "react-native"
import { scaleSize } from "styles/minixs"
import { Raffle, RaffleListApply } from "apis/data"
import { useCountdown } from "common/TimeCountDown"
import ActiveButton from "components/ActiveButton"
import { RatioUtil } from "utils"
import { FanRank, RaffleImg, liveImg, mainHeaderImg, nftDetailImg } from "assets/images"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useEffect, useState } from "react"
import { AnalyticsEventName, Colors } from "const"
import { useWrapDispatch } from "hooks"
import { setModal } from "store/reducers/config.reducer"
import WebView from "react-native-webview"
import { Shadow } from "react-native-shadow-2"
import { Analytics } from "utils/analytics.util"

interface IMainItemRaffle {
    onPress: () => void
    type: string
    index: number
    data: Raffle
    listDataApply: RaffleListApply[]
}
let hoursStr = ""
let minutesStr = ""
let secondsStr = ""

const timeToText = (targetDate: any) => {
    const [d, h, m, s] = useCountdown(targetDate)
    if (d > 0) {
        return jsonSvc.formatLocal(jsonSvc.findLocalById("13010"), [d.toString()])
    } else {
        const hours = Math.max(h, 0)
        const minutes = Math.max(m, 0)
        const seconds = Math.max(s, 0)

        hoursStr = hours > 9 ? hours.toString() : `0${hours}`
        minutesStr = minutes > 9 ? minutes.toString() : `0${minutes}`
        secondsStr = seconds > 9 ? seconds.toString() : `0${seconds}`

        if (hoursStr === "0" && minutesStr === "0" && secondsStr === "0") {
            hoursStr = "0"
            minutesStr = "0"
            secondsStr = "0"
        }

        return jsonSvc.formatLocal(jsonSvc.findLocalById("13011"), [hoursStr, minutesStr, secondsStr])
    }
}

export const ItemRaffle = (props: IMainItemRaffle) => {
    const timeText = timeToText(props.data.END_DT)
    const [display, setDisplay] = useState<"flex" | "none">("flex")
    useEffect(() => {
        if (props.type === "progress" && timeText === "00:00:00") {
            setDisplay("none")
        } else if (props.type === "end") {
            setDisplay("flex")
        }
    }, [timeText])

    const [isShow, setIsShow] = useState<number[]>([])
    const modalDispatch = useWrapDispatch(setModal)
    const showClose = (index: number) => {
        if (isShow.includes(index)) {
            isShow.splice(isShow.indexOf(index), 1)
        } else {
            isShow.push(index)
        }
        setIsShow([...isShow])
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={[styles.innerMainView, { display: display }]}>
                {/* <View style={[styles.innerMainView]}> */}
                {/* style={[styles.innerMainView]}> */}
                {props.type == "progress" && (
                    <View style={styles.productNameView}>
                        <PretendText style={styles.productName}>{timeToText(props.data.END_DT)}</PretendText>
                    </View>
                )}
                {props.type == "end" && (
                    <View style={styles.textEndItem}>
                        <PretendText style={styles.productName}>
                            {/* 래플 종료 */}
                            {jsonSvc.findLocalById("13012")}
                        </PretendText>
                    </View>
                )}
                <Image
                    borderRadius={RatioUtil.width(10)}
                    source={{ uri: props.data.ICON_NAME }}
                    style={styles.productImage}
                />
                <PretendText style={styles.title}>{props.data.RAFFLE_NAME}</PretendText>
                {checkRule(
                    props.data.RAFFLE_RULE.RANKING_LIMIT,
                    props.data.RAFFLE_RULE.USERS_LIMIT,
                    props.data.RAFFLE_RULE.QUANTITY_LIMIT
                )}
                {props.type == "progress" &&
                    (props.data.CHECK_MATCH_RULE ? (
                        props.listDataApply.find(d => d.RAFFLE_SEQ == props.data.SEQ_NO)?.TOTAL_APPLIED !==
                        props.data.NUMBER_OF_APPLICATIONS.toString() ? (
                            <View
                                style={{
                                    width: RatioUtil.width(280),
                                    height: RatioUtil.lengthFixedRatio(48),
                                    marginTop: RatioUtil.lengthFixedRatio(18),
                                    marginBottom: RatioUtil.lengthFixedRatio(30),
                                    alignItems: "center",
                                }}
                            >
                                <ActiveButton
                                    onPress={async () => {
                                        props.onPress()
                                        await Analytics.logEvent(AnalyticsEventName.click_check_entry_365, {
                                            hasNewUserData: true,
                                            first_action: "FALSE",
                                            raffle_name: props.data.RAFFLE_NAME,
                                        })
                                    }}
                                    active={true}
                                    // title="응모하기"
                                    title={jsonSvc.findLocalById("13018")}
                                    style={{
                                        width: RatioUtil.width(280),
                                        height: RatioUtil.lengthFixedRatio(48),
                                        marginTop: 0,
                                        paddingHorizontal: 0,
                                    }}
                                />
                                {isShow.includes(props.index) ? null : (
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: RatioUtil.lengthFixedRatio(42),
                                            height: RatioUtil.heightFixedRatio(36),
                                            alignItems: "center",
                                            zIndex: 1000,
                                        }}
                                    >
                                        <Image style={RatioUtil.sizeFixedRatio(10, 6)} source={RaffleImg.arrow_white} />
                                        <Shadow
                                            distance={2}
                                            style={{
                                                flexDirection: "row",
                                                height: RatioUtil.heightFixedRatio(30),
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <View style={styles.cardLimit}>
                                                <PretendText
                                                    style={{ color: Colors.BLACK, fontSize: RatioUtil.font(12) }}
                                                >
                                                    {/* 응모 가능 횟수{" "} */}
                                                    {jsonSvc.findLocalById("13023")}
                                                </PretendText>
                                                <PretendText
                                                    style={{
                                                        color: Colors.BLACK,
                                                        fontSize: RatioUtil.font(12),
                                                        marginLeft: RatioUtil.width(3),
                                                    }}
                                                >
                                                    {(props.data.NUMBER_OF_APPLICATIONS ?? 0) -
                                                        Number(
                                                            props.listDataApply.find(
                                                                d => d.RAFFLE_SEQ == props.data.SEQ_NO
                                                            )?.TOTAL_APPLIED ?? 0
                                                        )}
                                                </PretendText>
                                                <PretendText
                                                    style={{ color: Colors.BLACK, fontSize: RatioUtil.font(12) }}
                                                >
                                                    {/* 회 */}
                                                    {jsonSvc.findLocalById("13025")}
                                                </PretendText>
                                                <View
                                                    style={{
                                                        backgroundColor: Colors.GRAY13,
                                                        width: RatioUtil.width(1),
                                                        height: RatioUtil.heightFixedRatio(12),
                                                        marginHorizontal: RatioUtil.width(8),
                                                    }}
                                                />
                                                <PretendText
                                                    style={{ color: Colors.BLACK, fontSize: RatioUtil.font(12) }}
                                                >
                                                    {/* 총{" "} */}
                                                    {jsonSvc.findLocalById("13026")}
                                                </PretendText>
                                                <PretendText
                                                    style={{
                                                        color: Colors.BLACK,
                                                        fontSize: RatioUtil.font(12),
                                                        marginLeft: RatioUtil.width(3),
                                                    }}
                                                >
                                                    {props.data.NUMBER_OF_APPLICATIONS}
                                                </PretendText>
                                                <PretendText
                                                    style={{ color: Colors.BLACK, fontSize: RatioUtil.font(12) }}
                                                >
                                                    {/* 회 */}
                                                    {jsonSvc.findLocalById("13025")}
                                                </PretendText>
                                                <TouchableOpacity onPress={() => showClose(props.index)}>
                                                    <Image
                                                        style={{
                                                            ...RatioUtil.sizeFixedRatio(14, 14),
                                                            marginLeft: RatioUtil.width(7),
                                                        }}
                                                        source={RaffleImg.circle_close}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </Shadow>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View
                                style={{
                                    width: RatioUtil.width(280),
                                    height: RatioUtil.lengthFixedRatio(48),
                                    marginTop: RatioUtil.lengthFixedRatio(18),
                                    marginBottom: RatioUtil.lengthFixedRatio(30),
                                    alignItems: "center",
                                }}
                            >
                                <ActiveButton
                                    onPress={() => props.onPress()}
                                    active={false}
                                    // title={"응모 완료"}
                                    title={jsonSvc.findLocalById("13020")}
                                    style={{
                                        width: RatioUtil.width(280),
                                        height: RatioUtil.lengthFixedRatio(48),
                                        marginTop: 0,
                                        paddingHorizontal: 0,
                                    }}
                                />
                            </View>
                        )
                    ) : (
                        <View
                            style={{
                                width: RatioUtil.width(280),
                                height: RatioUtil.lengthFixedRatio(48),
                                marginTop: RatioUtil.lengthFixedRatio(18),
                                marginBottom: RatioUtil.lengthFixedRatio(30),
                                alignItems: "center",
                            }}
                        >
                            <ActiveButton
                                onPress={() => props.onPress()}
                                active={true}
                                // title={"응모 조건 확인하기"}
                                title={jsonSvc.findLocalById("13019")}
                                style={{
                                    width: RatioUtil.width(280),
                                    height: RatioUtil.lengthFixedRatio(48),
                                    marginTop: 0,
                                    paddingHorizontal: 0,
                                }}
                            />
                        </View>
                    ))}
                {props.type == "end" && (
                    <View
                        style={{
                            width: RatioUtil.width(280),
                            height: RatioUtil.lengthFixedRatio(48),
                            marginTop: RatioUtil.lengthFixedRatio(18),
                            marginBottom: RatioUtil.lengthFixedRatio(30),
                            alignItems: "center",
                        }}
                    >
                        <ActiveButton
                            onPress={async () => {
                                await Analytics.logEvent(AnalyticsEventName.click_raffle_result_370, {
                                    hasNewUserData: true,
                                })
                                modalDispatch({
                                    open: true,
                                    children: (
                                        <SafeAreaView style={{ flex: 1 }}>
                                            <View
                                                style={{
                                                    height: RatioUtil.height(20),
                                                    backgroundColor: Colors.WHITE,
                                                }}
                                            />
                                            <CustomButton
                                                onPress={() =>
                                                    modalDispatch({
                                                        open: false,
                                                    })
                                                }
                                                style={{
                                                    backgroundColor: Colors.WHITE,
                                                    alignItems: "flex-end",
                                                }}
                                            >
                                                <Image
                                                    source={nftDetailImg.close}
                                                    style={{
                                                        width: RatioUtil.width(30),
                                                        height: RatioUtil.width(30),
                                                        marginRight: RatioUtil.width(20),
                                                    }}
                                                />
                                            </CustomButton>
                                            <WebView
                                                source={{ uri: props.data.LANDING_URL ?? "" }}
                                                javaScriptEnabled={true}
                                            />
                                        </SafeAreaView>
                                    ),
                                })
                            }}
                            active={props.data.LANDING_URL == null ? false : true}
                            // title={props.data.LANDING_URL == null ? "결과 대기중" : "당첨 결과 조회하기"}
                            title={
                                props.data.LANDING_URL == null
                                    ? jsonSvc.findLocalById("13021")
                                    : jsonSvc.findLocalById("13022")
                            }
                            style={{
                                width: RatioUtil.width(280),
                                height: RatioUtil.lengthFixedRatio(48),
                                marginTop: 0,
                                paddingHorizontal: 0,
                            }}
                        />
                    </View>
                )}
                <View style={styles.innerBottomView}>
                    <View style={styles.bottomInfoView1}>
                        <Image
                            source={
                                props.data.RAFFLE_AMOUNT_UNIT.toLowerCase() === "bdst"
                                    ? FanRank.point_blue
                                    : props.data.RAFFLE_AMOUNT_UNIT.toLowerCase() === "training"
                                    ? FanRank.point_yellow
                                    : mainHeaderImg.tbora
                            }
                            style={styles.priceTag}
                        />
                        <PretendText style={styles.priceText}>
                            {(
                                props.data.RAFFLE_AMOUNT +
                                    Number(
                                        props.listDataApply.find(d => d.RAFFLE_SEQ == props.data.SEQ_NO)
                                            ?.TOTAL_APPLIED ?? 0
                                    ) *
                                        props.data.RAFFLE_AMOUNT_INCREASEMENT ?? 0
                            )
                                .toFixed(0)
                                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                        </PretendText>
                    </View>
                    <View style={styles.bottomInfoView2}>
                        <PretendText style={styles.drawsText}>
                            {/* 총 {props.data.NUMBER_OF_DRAWS}명 추첨 */}
                            {jsonSvc.formatLocal(jsonSvc.findLocalById("13016"), [
                                props.data.NUMBER_OF_DRAWS.toString(),
                            ])}
                        </PretendText>
                        <View style={styles.dotView} />
                        <PretendText style={styles.participantText}>
                            {/* {parseInt(props.data.TOTAL_APPLIED)
                            .toFixed(0)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                        참여 */}
                            {jsonSvc.formatLocal(jsonSvc.findLocalById("13017"), [
                                parseInt(props.data.TOTAL_APPLIED)
                                    .toFixed(0)
                                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                            ])}
                        </PretendText>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
export const messageRule = (RANKING_LIMIT: number, USER_LIMIT: number, QUANTITY_LIMIT: number) => {
    if (RANKING_LIMIT == 0 && USER_LIMIT == 0 && QUANTITY_LIMIT == 0) {
        return (
            <PretendText numberOfLines={2} style={{ ...styles.desc }}>
                <PretendText style={{ ...styles.desc, color: Colors.GRAY2 }}>
                    {/* UNCOMMON */}
                    {jsonSvc.findLocalById("1")}
                </PretendText>{" "}
                {jsonSvc.findLocalById("10000047")}
            </PretendText>
        )
    } else if (RANKING_LIMIT != 0 && USER_LIMIT == 0 && QUANTITY_LIMIT == 0) {
        return RANKING_LIMIT == 1 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc }}>
                <PretendText style={{ ...styles.desc, color: Colors.GRAY2 }}>
                    {/* COMMON */}
                    {jsonSvc.findLocalById("1")}
                </PretendText>{" "}
                {jsonSvc.findLocalById("10000047")}
            </PretendText>
        ) : RANKING_LIMIT == 2 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc }}>
                <PretendText style={{ ...styles.desc, color: Colors.GREEN4 }}>
                    {/* UNCOMMON */}
                    {jsonSvc.findLocalById("2")}
                </PretendText>{" "}
                {jsonSvc.findLocalById("10000047")}
            </PretendText>
        ) : RANKING_LIMIT == 3 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc }}>
                <PretendText style={{ ...styles.desc, color: Colors.YELLOW17 }}>
                    {/* RARE */}
                    {jsonSvc.findLocalById("3")}
                </PretendText>{" "}
                {jsonSvc.findLocalById("10000047")}
            </PretendText>
        ) : RANKING_LIMIT == 4 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc }}>
                <PretendText style={{ ...styles.desc, color: Colors.BLUE7 }}>
                    {/* SUPER_RARE */}
                    {jsonSvc.findLocalById("4")}
                </PretendText>{" "}
                {jsonSvc.findLocalById("10000047")}
            </PretendText>
        ) : RANKING_LIMIT == 5 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc }}>
                <PretendText style={{ ...styles.desc, color: Colors.PURPLE7 }}>
                    {/* EPIC */}
                    {jsonSvc.findLocalById("5")}
                </PretendText>{" "}
                {jsonSvc.findLocalById("10000047")}
            </PretendText>
        ) : RANKING_LIMIT == 6 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc }}>
                <PretendText style={{ ...styles.desc, color: Colors.RED5 }}>
                    {/* LEGENDARY */}
                    {jsonSvc.findLocalById("6")}
                </PretendText>{" "}
                {jsonSvc.findLocalById("10000048")}
            </PretendText>
        ) : null
    } else if (RANKING_LIMIT != 0 && USER_LIMIT != 0 && QUANTITY_LIMIT == 0) {
        return RANKING_LIMIT == 1 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* COMMON */}
                    {jsonSvc.findLocalById("1")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000049"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 2 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.GREEN4 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* UNCOMMON */}
                    {jsonSvc.findLocalById("2")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000049"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 3 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.YELLOW17 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* RARE */}
                    {jsonSvc.findLocalById("3")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000049"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 4 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.BLUE7 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* SUPER_RARE */}
                    {jsonSvc.findLocalById("4")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000049"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 5 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.PURPLE7 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* EPIC */}
                    {jsonSvc.findLocalById("5")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000049"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 6 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.RED5 }}>
                <PretendText style={{ ...styles.desc, color: Colors.RED5 }}>
                    {/* LEGENDARY */}
                    {jsonSvc.findLocalById("6")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000049"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : null
    } else if (RANKING_LIMIT != 0 && USER_LIMIT != 0 && QUANTITY_LIMIT != 0) {
        return RANKING_LIMIT == 1 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* COMMON */}
                    {jsonSvc.findLocalById("1")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000050"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000050"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 2 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.GREEN4 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* UNCOMMON */}
                    {jsonSvc.findLocalById("2")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000050"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 3 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.YELLOW17 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* RARE */}
                    {jsonSvc.findLocalById("3")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000050"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 4 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.BLUE7 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* SUPER_RARE */}
                    {jsonSvc.findLocalById("4")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000050"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 5 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.PURPLE7 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* EPIC */}
                    {jsonSvc.findLocalById("5")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000050"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 6 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.RED5 }}>
                <PretendText style={{ ...styles.desc, color: Colors.RED5 }}>
                    {/* LEGENDARY */}
                    {jsonSvc.findLocalById("6")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000050"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : null
    } else if (RANKING_LIMIT != 0 && USER_LIMIT == 0 && QUANTITY_LIMIT != 0) {
        return RANKING_LIMIT == 1 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* COMMON */}
                    {jsonSvc.findLocalById("1")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000051"), [QUANTITY_LIMIT.toString()])}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000051"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : RANKING_LIMIT == 2 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.GREEN4 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* UNCOMMON */}
                    {jsonSvc.findLocalById("2")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000051"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : RANKING_LIMIT == 3 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.YELLOW17 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* RARE */}
                    {jsonSvc.findLocalById("3")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000051"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : RANKING_LIMIT == 4 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.BLUE7 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* SUPER_RARE */}
                    {jsonSvc.findLocalById("4")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000051"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : RANKING_LIMIT == 5 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.PURPLE7 }}>
                <PretendText style={{ ...styles.desc }}>
                    {/* EPIC */}
                    {jsonSvc.findLocalById("5")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000051"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : RANKING_LIMIT == 6 ? (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.RED5 }}>
                <PretendText style={{ ...styles.desc, color: Colors.RED5 }}>
                    {/* LEGENDARY */}
                    {jsonSvc.findLocalById("6")}
                </PretendText>{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000051"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : null
    } else if (RANKING_LIMIT == 0 && USER_LIMIT != 0 && QUANTITY_LIMIT == 0) {
        return (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000049"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
                {/* {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 보유 */}
            </PretendText>
        )
    } else if (RANKING_LIMIT == 0 && USER_LIMIT != 0 && QUANTITY_LIMIT != 0) {
        return (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000051"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
                {/* {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 {QUANTITY_LIMIT}개 이상 보유 NFT{" "}
                {0}개 이상 보유 */}
            </PretendText>
        )
    } else if (RANKING_LIMIT == 0 && USER_LIMIT == 0 && QUANTITY_LIMIT != 0) {
        return (
            <PretendText numberOfLines={2} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {/* NFT {QUANTITY_LIMIT}개 이상 보유 */}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000054"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        )
    }
}

export const checkRule = (RANKING_LIMIT: number, USER_LIMIT: number, QUANTITY_LIMIT: number) => {
    if (RANKING_LIMIT == 0 && USER_LIMIT == 0 && QUANTITY_LIMIT == 0) {
        return (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {/* 누구나 응모 가능! */}
                {jsonSvc.findLocalById("13013")}
            </PretendText>
        )
    } else if (RANKING_LIMIT != 0 && USER_LIMIT == 0 && QUANTITY_LIMIT == 0) {
        return RANKING_LIMIT == 1 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {/* COMMON 이상 보유 */}
                {jsonSvc.findLocalById("1")} {jsonSvc.findLocalById("13000")}
            </PretendText>
        ) : RANKING_LIMIT == 2 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GREEN4 }}>
                {/* UNCOMMON 이상 보유 */}
                {jsonSvc.findLocalById("13050")} {jsonSvc.findLocalById("13000")}
            </PretendText>
        ) : RANKING_LIMIT == 3 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.YELLOW17 }}>
                {/* RARE 이상 보유 */}
                {jsonSvc.findLocalById("13051")} {jsonSvc.findLocalById("13000")}
            </PretendText>
        ) : RANKING_LIMIT == 4 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.BLUE7 }}>
                {/* SUPER_RARE 이상 보유 */}
                {jsonSvc.findLocalById("13052")} {jsonSvc.findLocalById("13000")}
            </PretendText>
        ) : RANKING_LIMIT == 5 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.PURPLE7 }}>
                {/* EPIC 이상 보유 */}
                {jsonSvc.findLocalById("13053")} {jsonSvc.findLocalById("13000")}
            </PretendText>
        ) : RANKING_LIMIT == 6 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.RED5 }}>
                {/* LEGENDARY 보유 */}
                {jsonSvc.findLocalById("13054")} {jsonSvc.findLocalById("13001")}
            </PretendText>
        ) : null
    } else if (RANKING_LIMIT != 0 && USER_LIMIT != 0 && QUANTITY_LIMIT == 0) {
        return RANKING_LIMIT == 1 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {/* COMMON {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 보유 */}
                {jsonSvc.findLocalById("1")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13002"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 2 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GREEN4 }}>
                {/* UNCOMMON {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 보유 */}
                {jsonSvc.findLocalById("13050")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13002"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 3 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.YELLOW17 }}>
                {/* RARE {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 보유 */}
                {jsonSvc.findLocalById("13051")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13002"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 4 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.BLUE7 }}>
                {/* SUPER_RARE {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 보유 */}
                {jsonSvc.findLocalById("13052")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13002"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 5 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.PURPLE7 }}>
                {/* EPIC {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 보유 */}
                {jsonSvc.findLocalById("13053")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13002"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 6 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.RED3 }}>
                {/* LEGENDARY {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 보유 */}
                {jsonSvc.findLocalById("13054")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13002"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        ) : null
    } else if (RANKING_LIMIT != 0 && USER_LIMIT != 0 && QUANTITY_LIMIT != 0) {
        return RANKING_LIMIT == 1 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {/* COMMON {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 {QUANTITY_LIMIT}개 이상
                보유 */}
                {jsonSvc.findLocalById("1")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13003"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 2 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GREEN4 }}>
                {/* UNCOMMON {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 {QUANTITY_LIMIT}개 이상
                보유 */}
                {jsonSvc.findLocalById("13050")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13003"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 3 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.YELLOW17 }}>
                {/* RARE {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 {QUANTITY_LIMIT}개 이상
                보유 */}
                {jsonSvc.findLocalById("13051")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13003"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 4 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.BLUE7 }}>
                {/* SUPER_RARE {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 {QUANTITY_LIMIT}개
                이상 보유 */}
                {jsonSvc.findLocalById("13052")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13003"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 5 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.PURPLE7 }}>
                {/* EPIC {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 {QUANTITY_LIMIT}개 이상
                보유 */}
                {jsonSvc.findLocalById("13053")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13003"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : RANKING_LIMIT == 6 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.RED3 }}>
                {/* LEGENDARY {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 {QUANTITY_LIMIT}개
                이상 보유 */}
                {jsonSvc.findLocalById("13054")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13003"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        ) : null
    } else if (RANKING_LIMIT != 0 && USER_LIMIT == 0 && QUANTITY_LIMIT != 0) {
        return RANKING_LIMIT == 1 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {/* COMMON {QUANTITY_LIMIT}개 이상 보유 */}
                {jsonSvc.findLocalById("1")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13004"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : RANKING_LIMIT == 2 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GREEN4 }}>
                {/* UNCOMMON {QUANTITY_LIMIT}개 이상 보유 */}
                {jsonSvc.findLocalById("13050")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13004"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : RANKING_LIMIT == 3 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.YELLOW17 }}>
                {/* RARE {QUANTITY_LIMIT}개 이상 보유 */}
                {jsonSvc.findLocalById("13051")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13004"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : RANKING_LIMIT == 4 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.BLUE7 }}>
                {/* SUPER_RARE {QUANTITY_LIMIT}개 이상 보유 */}
                {jsonSvc.findLocalById("13052")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13004"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : RANKING_LIMIT == 5 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.PURPLE7 }}>
                {/* EPIC {QUANTITY_LIMIT}개 이상 보유 */}
                {jsonSvc.findLocalById("13053")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13004"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : RANKING_LIMIT == 6 ? (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.RED3 }}>
                {/* LEGENDARY {QUANTITY_LIMIT}개 이상 보유 */}
                {jsonSvc.findLocalById("13054")}{" "}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13004"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        ) : null
    } else if (RANKING_LIMIT == 0 && USER_LIMIT != 0 && QUANTITY_LIMIT == 0) {
        return (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {/* {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 보유 */}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13002"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                ])}
            </PretendText>
        )
    } else if (RANKING_LIMIT == 0 && USER_LIMIT != 0 && QUANTITY_LIMIT != 0) {
        return (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {/* {nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName} 선수 {QUANTITY_LIMIT}개 이상 보유 NFT{" "}
                {0}개 이상 보유 */}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13003"), [
                    nftPlayerJson.find(d => d.nPersonID === USER_LIMIT)?.sPlayerName ?? "",
                    QUANTITY_LIMIT.toString(),
                ])}
            </PretendText>
        )
    } else if (RANKING_LIMIT == 0 && USER_LIMIT == 0 && QUANTITY_LIMIT != 0) {
        return (
            <PretendText numberOfLines={1} style={{ ...styles.desc, color: Colors.GRAY2 }}>
                {/* NFT {QUANTITY_LIMIT}개 이상 보유 */}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("13007"), [QUANTITY_LIMIT.toString()])}
            </PretendText>
        )
    }
}
export const RaffleHelp = () => {
    return (
        <View
            style={{
                marginTop: RatioUtil.height(30),
                backgroundColor: Colors.GRAY9,
                width: RatioUtil.width(360),
                flexDirection: "row",
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    marginTop: RatioUtil.height(20),
                    width: RatioUtil.width(320),
                }}
            >
                <PretendText
                    style={[
                        styles.descTitle,
                        {
                            fontWeight: "700",
                        },
                    ]}
                >
                    {jsonSvc.findLocalById("13200")}
                </PretendText>
                <PretendText style={styles.descTitle}>{jsonSvc.findLocalById("13201")}</PretendText>
            </View>
        </View>
    )
}
