import { FanRank } from "assets/images"
import { PretendText } from "components/utils"
import { Colors } from "const"
import { walletStyle } from "styles/wallet.style"
import { View, Image, TouchableOpacity } from "react-native"
import { RatioUtil } from "utils"
import _ from "lodash"
import { Shadow } from "react-native-shadow-2"
import { ITransferHistory } from "apis/data/wallet.api.data"
import { jsonSvc } from "apis/services"

export interface IMainGroupItemRank {
    onPress: () => void
    data: ITransferHistory[] | null
    title?: string
}

export const TransactionHistory = (props: IMainGroupItemRank) => {
    return (
        <Shadow distance={7} startColor={Colors.WHITE3} style={walletStyle.header.shadowMainView}>
            <View style={{
                width: RatioUtil.width(320)
            }}>
                <TouchableOpacity
                    onPress={() => {
                        props.onPress()
                    }}
                >
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottomColor: Colors.WHITE3,
                        borderBottomWidth: RatioUtil.heightSafeArea(1),
                        marginHorizontal: RatioUtil.width(20),
                        height: RatioUtil.heightSafeArea(60)
                    }}>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(18),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK
                            }}
                        >
                            {props.title}
                        </PretendText>
                        <Image style={RatioUtil.size(20, 20)} source={FanRank.arrow.right} />
                    </View>
                </TouchableOpacity>

                {props.data?.length != 0 ? (
                    props.data?.map((item, index) => (
                        <View style={{
                            width: RatioUtil.width(280),
                            height: RatioUtil.heightSafeArea(67),
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginHorizontal: RatioUtil.width(20),
                            marginTop: (index === 0 ? RatioUtil.heightSafeArea(10) : 0),
                            marginBottom: (index + 1 === props.data?.length) ? RatioUtil.heightSafeArea(10) : 0
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
                    ))
                ) : (
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
                )}
            </View>
        </Shadow>
    )
}
