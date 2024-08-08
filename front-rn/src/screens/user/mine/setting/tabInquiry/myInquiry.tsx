import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RatioUtil } from "utils"
import { Colors } from "const"
import { WalletImg, liveImg } from "assets/images"
import { PretendText } from "components/utils"
import { jsonSvc } from "apis/services"
import { AnswerInquiry, MyListInquiry } from "apis/data"
import { inquirySvc } from "apis/services/inquiry.svc"
import moment from "moment"
import { SvgIcon } from "components/Common/SvgIcon"
const MyInquiry = ({ reRender }: { reRender: any }) => {
    const [listInquiry, setListInquiry] = useState<MyListInquiry[]>([])
    const [AllInquiry, setAllInquiry] = useState<MyListInquiry[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const getMyInquiry = async () => {
        listInquiry.length == 0 ? setLoading(true) : null
        const response = await inquirySvc.getMyInquiry()

        if (!response) return

        setAllInquiry(response.sort((a, b) => (a.INQUIRE_AT < b.INQUIRE_AT ? 1 : -1)))
        setListInquiry(response.sort((a, b) => (a.INQUIRE_AT < b.INQUIRE_AT ? 1 : -1)).slice(0, 10))
        setLoading(false)
        setIsRefreshing(false)
    }
    const onAddMoreItem = () => {
        listInquiry.length < AllInquiry.length
            ? setListInquiry(listInquiry.concat(AllInquiry.slice(listInquiry.length, listInquiry.length + 10)))
            : null
    }
    const [isRefreshing, setIsRefreshing] = useState(false)
    const onRefresh = () => {
        setIsRefreshing(true)
        getMyInquiry()
    }
    useEffect(() => {
        getMyInquiry()
    }, [reRender])

    const [isShow, setIsShow] = useState<number[]>([])

    const show = (index: number) => {
        if (isShow.includes(index)) {
            isShow.splice(isShow.indexOf(index), 1)
        } else {
            isShow.push(index)
        }
        setIsShow([...isShow])
    }

    const renderItemInquiry = (item: MyListInquiry, index: any) => {
        return (
            <View style={{ flexDirection: "row" }}>
                <View
                    style={{
                        ...RatioUtil.size(25, 25),
                        ...RatioUtil.margin(0, 10, 0, 0),
                        ...RatioUtil.borderRadius(50),
                        backgroundColor: Colors.BLACK,
                        top: -3,
                        justifyContent: "center",
                    }}
                >
                    <PretendText
                        style={{
                            textAlign: "center",
                            fontSize: RatioUtil.font(14),
                            fontWeight: "700",

                            color: Colors.WHITE,
                        }}
                    >
                        Q
                    </PretendText>
                </View>
                <View style={{ justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => show(index)}>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: "700",
                                color: item.STATUS == 0 ? Colors.GRAY8 : Colors.PURPLE,
                            }}
                        >
                            {item.STATUS == 0 ? jsonSvc.findLocalById("173135") : jsonSvc.findLocalById("173130")}
                            {"  "}
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "500",
                                    color: Colors.GRAY14,
                                }}
                            >
                                {moment(item.INQUIRE_AT).format("YYYY.MM.DD HH:mm")}
                            </PretendText>
                        </PretendText>
                        <View
                            style={{
                                flexDirection: "row",
                                width: RatioUtil.width(285),
                                paddingTop: 4,
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "700",
                                    color: Colors.BLACK,
                                }}
                            >
                                {item.TITLE}
                            </PretendText>
                            <Image
                                source={WalletImg.arrow_down}
                                style={{
                                    ...RatioUtil.size(12, 12),
                                    transform: [{ rotate: isShow.includes(index) ? "180deg" : "0deg" }],
                                }}
                                resizeMode={"contain"}
                            />
                        </View>
                    </TouchableOpacity>
                    {isShow.includes(index) ? (
                        <>
                            <View style={{ height: 25 }} />
                            <PretendText
                                style={{
                                    width: RatioUtil.width(285),
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "500",
                                    color: "#555555",
                                }}
                            >
                                {item.CONTENT}
                            </PretendText>
                        </>
                    ) : null}
                </View>
            </View>
        )
    }
    const renderItemReply = (item: MyListInquiry, index: number) => {
        return (
            <>
                {item.answers.map((element: AnswerInquiry) => (
                    <View>
                        <View
                            style={{
                                height: 1.5,
                                ...RatioUtil.margin(25, 0, 25, 0),
                                backgroundColor: Colors.GRAY7,
                            }}
                        />

                        {/* REPLY INQUIRY */}

                        <View style={{ flexDirection: "row" }}>
                            <View
                                style={{
                                    ...RatioUtil.size(25, 25),
                                    ...RatioUtil.margin(0, 10, 0, 0),
                                    ...RatioUtil.borderRadius(50),
                                    backgroundColor: Colors.BLACK,
                                    top: -3,
                                    justifyContent: "center",
                                }}
                            >
                                <PretendText
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "700",

                                        color: Colors.WHITE,
                                    }}
                                >
                                    A
                                </PretendText>
                            </View>
                            <View style={{ justifyContent: "center" }}>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "700",
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {jsonSvc.findLocalById("173137")}
                                    {"  "}
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "500",
                                            color: Colors.GRAY14,
                                        }}
                                    >
                                        {moment(element.ANSWER_AT).format("YYYY.MM.DD HH:mm")}
                                    </PretendText>
                                </PretendText>
                                {/* <View
                                    style={{
                                        flexDirection: "row",
                                        width: RatioUtil.width(285),
                                        paddingTop: 4,
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(16),
                                            fontWeight: "700",
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {`안녕하세요. 버디스쿼드 상담사 ${element.VX_ID}입니다.`}
                                    </PretendText>
                                </View> */}
                                <View style={{ height: 25 }} />
                                <PretendText
                                    style={{
                                        width: RatioUtil.width(285),
                                        fontSize: RatioUtil.font(16),
                                        fontWeight: "500",
                                        color: "#555555",
                                    }}
                                >
                                    {element.CONTENT}
                                </PretendText>
                            </View>
                        </View>
                    </View>
                ))}
            </>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <ActivityIndicator size={"large"} color={Colors.GRAY10} />
                </View>
            ) : (
                <View style={{ flex: 1, alignItems: "center" }}>
                    {listInquiry.length > 0 ? (
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colors.GRAY9,
                                alignItems: "center",
                                top: -20,
                            }}
                        >
                            <View
                                style={{
                                    ...RatioUtil.size(360, 30),
                                    justifyContent: "center",
                                }}
                            >
                                <PretendText
                                    style={{
                                        textAlign: "center",
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "500",
                                        color: Colors.GRAY2,
                                    }}
                                >
                                    {/* 최근 1년간 문의내역만 조회 가능합니다. */}
                                    {jsonSvc.findLocalById("173134")}
                                </PretendText>
                            </View>
                            <FlatList
                                data={listInquiry}
                                onRefresh={onRefresh}
                                refreshing={isRefreshing}
                                onEndReached={onAddMoreItem}
                                keyExtractor={(item: MyListInquiry) => item.INQUIRE_AT}
                                renderItem={({ item, index }) => (
                                    <View
                                        style={{
                                            width: RatioUtil.width(360),
                                            ...RatioUtil.padding(20, 20, 20, 20),
                                            backgroundColor: Colors.WHITE,
                                            borderBottomWidth: 7,
                                            justifyContent: "center",
                                            borderBottomColor: Colors.GRAY9,
                                        }}
                                    >
                                        {/*INQUIRY */}
                                        {renderItemInquiry(item, index)}
                                        {isShow.includes(index) && item.STATUS != 0
                                            ? renderItemReply(item, index)
                                            : null}
                                    </View>
                                )}
                            />
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={getMyInquiry}
                            style={{
                                ...RatioUtil.size(360, 480),
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                            }}
                        >
                            <Image
                                source={liveImg.noData}
                                style={{
                                    ...RatioUtil.size(100, 100),
                                    ...RatioUtil.margin(0, 0, 10, 0),
                                }}
                                resizeMode="contain"
                            />
                            <PretendText
                                style={{ textAlign: "center", fontSize: RatioUtil.font(14), color: Colors.GRAY2 }}
                            >
                                {/* {"등록된 문의가 없어요."} */}
                                {jsonSvc.findLocalById("173136")}
                            </PretendText>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </SafeAreaView>
    )
}

export default MyInquiry
