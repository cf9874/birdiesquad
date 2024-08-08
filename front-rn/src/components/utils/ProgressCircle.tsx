import React, { useState } from "react"
import { GestureResponderEvent, Image, Text, TextInput, View, ViewStyle } from "react-native"
import * as Progress from "react-native-progress"
import { Slider } from "@miblanchard/react-native-slider"
import { RatioUtil } from "utils"
import { ProgressCircleStyle } from "styles/components/views"
import { Colors } from "const"
import { NftDetailStyle } from "styles/screens"
import { nftDetailImg } from "assets/images"
import { CustomButton } from "./CustomButton"

export const ProgressCircle = ({ progressedColor, type }: React.PropsWithChildren<IProps>) => {
    const current: number = 85
    const energydata = {
        current: current,
        max: 100,
    }
    const [change, setChange] = useState<number>(type == "energy" ? 0 : 85)
    return (
        <View>
            <View style={ProgressCircleStyle.progressCircleCss.container}>
                <Progress.Circle
                    progress={
                        type == "energy"
                            ? (energydata.current + Number(change)) / energydata.max
                            : Number(change) / energydata.max
                    }
                    size={RatioUtil.width(112)}
                    thickness={RatioUtil.width(8)}
                    color={progressedColor}
                    unfilledColor="#D9D9D9"
                    borderWidth={0}
                    direction="counter-clockwise"
                    fill="transparent"
                    showsText={false}
                    opacity={0.5}
                />
                <Progress.Circle
                    style={{ position: "absolute", top: 0, left: 0 }}
                    progress={energydata.current / energydata.max}
                    size={RatioUtil.width(112)}
                    thickness={RatioUtil.width(8)}
                    color={progressedColor}
                    borderWidth={0}
                    direction="counter-clockwise"
                    fill="transparent"
                    showsText={true}
                    textStyle={{
                        fontSize: RatioUtil.font(20),
                        color: Number(change) == current ? "black" : progressedColor,
                        fontWeight: "700",
                    }}
                    formatText={() =>
                        type == "energy" ? `${Math.trunc(Number(change) + current)}%` : `${Math.trunc(Number(change))}%`
                    }
                />
            </View>
            <View>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: RatioUtil.height(28),
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <PretendText
                        style={[
                            ProgressCircleStyle.progressCircleCss.progressText,
                            type == "energy"
                                ? { color: Number(change) == current ? "black" : progressedColor }
                                : { color: Number(change) == current ? "black" : progressedColor },
                        ]}
                    >
                        {Math.trunc(Number(change))}
                    </PretendText>
                    <PretendText style={ProgressCircleStyle.progressCircleCss.progressText}>/ {energydata.max}</PretendText>
                </View>

                <Slider
                    containerStyle={{
                        marginLeft: RatioUtil.width(18),
                        width: RatioUtil.width(284),
                        borderRadius: RatioUtil.height(18),
                        marginTop: RatioUtil.height(17),
                    }}
                    minimumValue={0}
                    maximumValue={type == "energy" ? energydata.max - current : energydata.max}
                    minimumTrackTintColor={progressedColor}
                    maximumTrackTintColor="#F2F2F5"
                    thumbStyle={{
                        width: RatioUtil.width(33),
                        height: RatioUtil.height(33),
                        borderRadius: RatioUtil.height(33),
                        backgroundColor: Colors.WHITE,
                        borderWidth: RatioUtil.width(1),
                    }}
                    thumbTouchSize={{ width: RatioUtil.width(40), height: RatioUtil.height(40) }}
                    value={change}
                    onValueChange={(value: number | number[]) => setChange(value as number)}
                    trackStyle={{ height: RatioUtil.height(16), borderRadius: RatioUtil.height(18) }}
                />
            </View>

            {type == "energy" ? (
                <View style={NftDetailStyle.energyChargeCss.textBox}>
                    <PretendText style={{ marginLeft: RatioUtil.width(19) }}>가격</PretendText>
                    <Image
                        source={nftDetailImg.coin}
                        style={{
                            marginLeft: RatioUtil.width(149),
                            width: RatioUtil.width(20),
                            height: RatioUtil.height(20),
                        }}
                    />
                    <PretendText style={{ marginLeft: RatioUtil.width(8) }}>{Math.trunc(100 * change)}</PretendText>
                </View>
            ) : (
                <View style={NftDetailStyle.energyChargeCss.textBox}>
                    <PretendText style={{ marginLeft: RatioUtil.width(19) }}>사용 포인트</PretendText>
                    <Image
                        source={nftDetailImg.point}
                        style={{
                            marginLeft: RatioUtil.width(63),
                            width: RatioUtil.width(20),
                            height: RatioUtil.height(20),
                        }}
                    />
                    <PretendTextInput
                        keyboardType="numeric"
                        placeholder="0"
                        style={{
                            justifyContent: "flex-end",
                            marginLeft: RatioUtil.width(8),
                            width: RatioUtil.width(94),
                            height: RatioUtil.height(30),
                        }}
                    ></PretendTextInput>
                </View>
            )}
            <View style={NftDetailStyle.energyChargeCss.remainBox}>
                <PretendText>현재 육성포인트 수 : 9999999.99</PretendText>
                {/* 토큰 수 관련 함수 넣기 */}
            </View>

            <CustomButton
                style={[
                    NftDetailStyle.energyChargeCss.chargeButton,
                    { backgroundColor: Number(change) == current ? Colors.GRAY : Colors.POINT },
                ]}
            >
                <PretendText style={{ color: Colors.WHITE }}>충전</PretendText>
            </CustomButton>
        </View>
    )
}

export interface IProps {
    energydata?: {
        current: number
        max: number
    }
    progressedColor: string
    type: string | object
    opacity?: number
}

//사용 라이브러리
// https://github.com/miblanchard/react-native-slider
// https://www.npmjs.com/package/react-native-progress
