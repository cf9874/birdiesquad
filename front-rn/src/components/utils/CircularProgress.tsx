import { PretendText } from "components/utils"
import * as React from "react"
import { Button, View } from "react-native"
import { Svg, Circle, Path, Text, G, LinearGradient, Stop, Defs } from "react-native-svg"
import { RatioUtil } from "utils"

export const CircularProgress = ({
    size,
    progress,
    strokeWidth,
    text,
    linearGradient,
    fontSize,
    isClockwise = false,
}: ProgressBarProps) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const dashoffset = isClockwise
        ? circumference - (progress / 100) * circumference
        : circumference + (progress / 100) * circumference

    return (
        <View>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {linearGradient ? (
                    <Defs>
                        <LinearGradient id="gradient" x1="0%" y1="100%" x2="75%" y2="0">
                            {linearGradient.map((gradient, index) => (
                                <Stop key={index} offset={gradient.offset} stopColor={gradient.color} />
                            ))}
                        </LinearGradient>
                    </Defs>
                ) : (
                    <Circle
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                        strokeWidth={strokeWidth}
                        origin={`${size / 2}, ${size / 2}`}
                    />
                )}

                <Circle stroke="#E9ECEF" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
                <G rotation="-60" origin={`${size / 2}, ${size / 2}`}>
                    <Circle
                        stroke="url(#gradient)"
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                        strokeWidth={strokeWidth}
                    />
                </G>
                <Text
                    fill="black"
                    fontSize={fontSize}
                    x={size / 2}
                    y={size / 2}
                    fontWeight={"bold"}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    fontFamily={"Pretendard Variable"}
                >
                    {text}
                </Text>
            </Svg>
        </View>
    )
}

interface GradientProps {
    offset: string
    color: string
}

interface ProgressBarProps {
    size: number
    progress: number
    strokeWidth: number
    text: string
    linearGradient?: [GradientProps, GradientProps]
    isClockwise?: boolean
    fontSize: number
}
