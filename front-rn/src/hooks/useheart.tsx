import { chatSvc, profileSvc } from "apis/services"
import { jsonSvc } from "apis/services"
import heart_effect from "json/heart_effect.json"
import { useCallback, useEffect, useRef, useState } from "react"
import { Alert, Animated, ImageBackground, Text, View } from "react-native"
import { ISeasonDetail } from "apis/data/season.data"
import { scaleSize } from "styles/minixs"
import { NFTCardImages } from "assets/images"
import { AnalyticsEventName, Colors } from "const"
import Heart from "screens/live/Heart"
import moment from "moment"
import { ISendHeart, ProfileApiData } from "apis/data"
import _ from "lodash"
import { ErrorUtil, RatioUtil } from "utils"
import { useFocusEffect } from "@react-navigation/native"
import FastImage from "react-native-fast-image"
import MyHeart from "screens/live/Heart/myheart"
import { Analytics } from "utils/analytics.util"

const bdst = jsonSvc.findConstBynId("TV_HEART_COST_ONCE").dDoubleValue
const countTime = jsonSvc.findConstById(21002).dDoubleValue * 1000
const maxHeartCount = jsonSvc.findConstBynId("TV_HEART_TOUCH_MAX_COUNT").nIntValue
const minHeartProcessInterval = jsonSvc.findConstBynId("TV_HEART_EFFECT_CREATE_MIN_TIME_SEC").nIntValue * 1000

interface IHeart {
    heartCount: number
    startedTime: number
    startAnimation: boolean
    animationStartedTime: number
}

interface IFakeHeart {
    heartCount: number
    startedTime: number
    delay: number
}

export const useHeart = ({
    gameData,
    assetBdst,
}: {
    gameData?: ISeasonDetail
    assetBdst: React.MutableRefObject<number | undefined>
}) => {
    const heartArrayRef = useRef<IHeart[]>([])

    const timeSecond = useRef(0)
    const playerID = useRef(0)

    let recvHearts: IFakeHeart[] = []
    let lastHeartProcessed: number = 0

    const [tempHeartArray, setTempHeartArray] = useState<IFakeHeart[]>([])
    const [needRender, setNeedRender] = useState<number>(1)

    let timeoutId: undefined | NodeJS.Timeout = undefined
    let recvTimeoutId: undefined | NodeJS.Timeout = undefined

    const onPressHeart = async () => {
        timeSecond.current = moment().unix()

        heartArrayRef.current = heartArrayRef.current.filter(heart => {
            return heart.animationStartedTime === 0 || heart.animationStartedTime + 6000 > Date.now()
        })

        //console.log('heartArray: ' + JSON.stringify(heartArrayRef.current))

        if (assetBdst.current! < 1 * bdst) {
            //qa-1420 수정 bdst부족시 sendHeart 주석처리
            // sendHeart(heartArrayRef.current[heartArrayRef.current.length - 1])
            ErrorUtil.heartSendCaution()
            await Analytics.logEvent(
                AnalyticsEventName.view_bdp_shortage_50,

                {
                    hasNewUserData: true,
                    first_action: "FALSE",
                    game_id: gameData?.GAME_CODE,
                }
            )
            return
        }

        if (
            heartArrayRef.current.length == 0 ||
            heartArrayRef.current[heartArrayRef.current.length - 1].startAnimation
        ) {
            heartArrayRef.current.push({
                heartCount: 1,
                startedTime: Date.now(),
                startAnimation: false,
                animationStartedTime: 0,
            })
        } else {
            heartArrayRef.current[heartArrayRef.current.length - 1].heartCount++
        }

        // if (assetBdst.current! < heartArrayRef.current[heartArrayRef.current.length - 1].heartCount * bdst) {
        //     //qa-1420 수정 bdst부족시 sendHeart 주석처리
        //     // sendHeart(heartArrayRef.current[heartArrayRef.current.length - 1])
        //     ErrorUtil.heartSendCaution()
        //     await Analytics.logEvent(
        //         AnalyticsEventName.view_bdp_shortage_50,

        //         {
        //             hasNewUserData: true,
        //             first_action: "FALSE",
        //             game_id: gameData?.GAME_CODE,
        //         }
        //     )
        //     return
        // }

        if (heartArrayRef.current[heartArrayRef.current.length - 1].heartCount >= maxHeartCount) {
            if (timeoutId) clearTimeout(timeoutId)
            sendHeart(heartArrayRef.current[heartArrayRef.current.length - 1])
            return
        }

        setNeedRender(Date.now())

        if (!assetBdst.current) {
            if (timeoutId) clearTimeout(timeoutId)
            ErrorUtil.heartSendCaution()
            await Analytics.logEvent(
                AnalyticsEventName.view_bdp_shortage_50,

                {
                    hasNewUserData: true,
                    first_action: "FALSE",
                    game_id: gameData?.GAME_CODE,
                }
            )
            return
        }

        if (timeoutId) clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
            if (heartArrayRef.current[heartArrayRef.current.length - 1].heartCount > 0) {
                sendHeart(heartArrayRef.current[heartArrayRef.current.length - 1])
            }
        }, countTime)
    }

    const sendHeart = (heart: IHeart) => {
        if (!heart) return

        heart.startAnimation = true
        heart.animationStartedTime = Date.now()

        chatSvc.sendHeart(playerID.current, heart.heartCount * bdst, () => {
            assetBdst.current! -= heart.heartCount * bdst
        })

        setNeedRender(Date.now())
    }

    useEffect(() => {}, [heartArrayRef])

    useEffect(() => {
        return () => {
            if (timeoutId) clearTimeout(timeoutId)
            if (recvTimeoutId) clearTimeout(recvTimeoutId)
        }
    }, [])

    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max)
    }

    const callAnimation = async (res: ISendHeart) => {
        if (!res || !gameData || res.data.HEART.GAME_CODE !== gameData.GAME_CODE) return

        //if (res.data.HEART.PLAYER_CODE == playerID.current)
        //    return

        //console.log('recvHeart: ' + JSON.stringify(res.data))

        const current = Date.now()

        recvHearts = [
            ...recvHearts,
            {
                heartCount: res.data.HEART.HEART,
                startedTime: current,
                delay: Math.floor(Math.random() * minHeartProcessInterval),
            },
        ]

        if (lastHeartProcessed <= 0) lastHeartProcessed = current

        if (lastHeartProcessed + minHeartProcessInterval > current) {
            if (!recvTimeoutId) {
                recvTimeoutId = setTimeout(() => {
                    processRecvHerts()
                }, minHeartProcessInterval)
            }
            return
        }

        clearTimeout(recvTimeoutId)
        recvTimeoutId = undefined

        processRecvHerts()
    }

    const processRecvHerts = () => {
        let totalHearts = 0
        recvHearts.forEach(element => {
            totalHearts += element.heartCount
        })

        const current = Date.now()

        const heartEffect = heart_effect
            .slice()
            .reverse()
            .find(effect => totalHearts >= effect.nInputHeartMinAmount)
        const numHearts = heartEffect ? heartEffect.nEffectGeneratedAmount : 1

        const newHearts: IFakeHeart[] = []
        for (let i = 0; i < numHearts; i++) {
            newHearts.push({
                heartCount: 1,
                startedTime: current + i,
                delay: Math.floor(Math.random() * minHeartProcessInterval),
            })
        }

        setTempHeartArray(prevData => [
            ...prevData.filter(heart => {
                return heart.startedTime === 0 || heart.startedTime + 6000 > current
            }),
            ...newHearts,
        ])

        recvHearts = []
        lastHeartProcessed = current

        //console.log('tempHeartArray: ' + JSON.stringify(tempHeartArray))
    }

    const removeHeart = (startedTime: number) => {
        heartArrayRef.current = heartArrayRef.current.filter(heart => {
            return heart.startedTime !== startedTime
        })
    }

    const onMyHeartFinish = (startedTime: number) => {
        removeHeart(startedTime)
    }

    const renderHeartIndex = () => {
        return (
            <>
                {needRender &&
                    heartArrayRef.current.map((heart, index) => {
                        if (heart.startAnimation && heart.animationStartedTime == 0)
                            heart.animationStartedTime = Date.now()
                        return (
                            <MyHeart
                                key={heart.startedTime}
                                index={heart.startedTime}
                                size={heart.heartCount}
                                start={heart.startAnimation}
                                onFinish={onMyHeartFinish}
                            />
                        )
                    })}
            </>
        )
    }

    const removeTempHeart = (startedTime: number) => {
        setTempHeartArray(prevData =>
            prevData.filter(heart => {
                return heart.startedTime !== startedTime
            })
        )
    }

    const onHeartFinish = (startedTime: number) => {
        removeTempHeart(startedTime)
    }

    const renderHeartArray = () => {
        return (
            <>
                {tempHeartArray.map((heart, index) => {
                    return (
                        <Heart
                            key={heart.startedTime}
                            index={heart.startedTime}
                            size={1}
                            delay={heart.delay}
                            onFinish={onHeartFinish}
                        />
                    )
                })}
            </>
        )
    }

    return {
        onPressHeart,
        setplayerId: (id: number) => (playerID.current = id),
        callAnimation,
        renderHeartIndex,
        renderHeartArray,
    }
}
