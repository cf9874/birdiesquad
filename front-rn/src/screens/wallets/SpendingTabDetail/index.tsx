import { useEffect, useRef, useState } from "react"
import { FlatList, Image, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RatioUtil } from "utils"
import { Colors } from "const"
import { WalletImg } from "assets/images"
import { PretendText } from "components/utils"
import { walletStyle } from "styles/wallet.style"
import { SpendingTransferDto } from "apis/data"
import { ProfileHeader } from "components/layouts"
import { jsonSvc, walletSvc } from "apis/services"

const SpendingTabDetail = () => {
    const listRef = useRef<FlatList | null>(null)
    const [contentVerticalOffset, setContentVerticalOffset] = useState(0)
    const CONTENT_OFFSET_THRESHOLD = 300
    const [page, setPage] = useState<number>(1)
    const [totalCount, setTotalCount] = useState<number>(0)

    const [dataTransactionHistory, setDataTransactionHistory] = useState<SpendingTransferDto[]>([])

    useEffect(() => {
        fetchTransferList(page)
    }, [])

    const fetchTransferList = async (page: number) => {
        const response = await walletSvc.getTransferList({ page: page })
        console.log(`Response Success:`, response)
        setDataTransactionHistory(dataTransactionHistory?.concat(response.tokenTransferHistoryList))
        setTotalCount(response.totalCount)
        setPage(page)
        if (!response) return null ?? undefined
    }
    const EmptyListMessage = () => {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", height: RatioUtil.heightSafeArea(101) }}>
                <PretendText
                    style={{
                        color: Colors.GRAY3,
                        fontSize: RatioUtil.font(16),
                    }}
                >
                    {/* 거래내역이 없습니다. */}
                    {jsonSvc.findLocalById("2060")}
                </PretendText>
            </View>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            {/* <ProfileHeader title="거래내역" /> */}
            <ProfileHeader title={jsonSvc.findLocalById("2005")} />
            <FlatList
                ref={listRef}
                initialNumToRender={6}
                onScrollBeginDrag={() => {
                    dataTransactionHistory.length < totalCount ? fetchTransferList(page + 1) : null
                }}
                onScroll={event => {
                    setContentVerticalOffset(event.nativeEvent.contentOffset.y)
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                style={{marginTop: RatioUtil.heightSafeArea(10)}}
                data={dataTransactionHistory || []}
                renderItem={({ item, index }) => (
                    <View style={{
                        width: RatioUtil.width(320),
                        height: RatioUtil.heightSafeArea(67),
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginHorizontal: RatioUtil.width(20),
                    }} key={index}>
                        <View style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "center"
                        }}>
                            <PretendText
                                style={{
                                    color: Colors.BLACK,
                                    fontSize: RatioUtil.font(16),
                                }}
                            >
                                {/* {item.status == "complete" ? "승인완료" : ""} */}
                                {item.status == "complete" ? jsonSvc.findLocalById("2043") : ""}
                            </PretendText>
                            <PretendText
                                style={{
                                    color: Colors.GRAY3,
                                    fontSize: RatioUtil.font(14),
                                    marginTop: RatioUtil.heightSafeArea(2)
                                }}
                            >
                                {item?.createDt ?? ""}
                            </PretendText>
                        </View>
                        <View style={{
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "center"
                        }}>
                            <PretendText
                                numberOfLines={1}
                                style={{
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    fontSize: RatioUtil.font(16),
                                    color: item.amount < 0 ? Colors.RED2 : Colors.BLUE,
                                }}
                            >
                                {item.amount > 0 ? "+" : ""}
                                {item.amount?.toString()} {item.tokenSymbol}
                            </PretendText>
                            <PretendText
                                numberOfLines={1}
                                style={{
                                    color: Colors.GRAY3,
                                    fontSize: RatioUtil.font(14),
                                }}
                            >
                                {item.walletAddress?.slice(0, 4) +
                                    "...." +
                                    item.walletAddress?.slice(
                                        item.walletAddress.length - 4,
                                        item.walletAddress.length
                                    )}
                            </PretendText>
                        </View>
                    </View>
                )}
                ListEmptyComponent={EmptyListMessage}
            />
            {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
                <TouchableOpacity
                    onPress={() => {
                        listRef?.current?.scrollToOffset({ offset: 0, animated: true })
                    }}
                >
                    <Image
                        style={{ ...RatioUtil.size(80, 80), position: "absolute", bottom: 30, right: 10 }}
                        source={WalletImg.button_to_top}
                    />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    )
}

export default SpendingTabDetail
