import { ABaseScv } from "./base.svc"
import { ChatApi } from "apis/external/socket.api"
import { TOKEN_ID } from "utils/env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CHAT_TYPE, Colors, ResultSendMessage, Screen } from "const"
import {
    ChatType,
    IBotMsg,
    IChat,
    IChatBot,
    IChatBotEvent,
    IChatRes,
    IJoinGame,
    IRepeatRes,
    IReport,
    ISendCashMsg,
    ISendHeart,
    ISendMsg,
} from "apis/data"
import { Alert } from "react-native"
import { ShopApi } from "apis/context/shop.api"
import { ItemApi } from "apis/context/item.api"
import { jsonSvc } from "./json.svc"
import { nftSvc } from "./nft.svc"
import { GOLF_STAT } from "const/live.const"
import nftPlayer from "json/nft_player.json"
import { ErrorUtil, navigate } from "utils"
export class ChatSvc extends ABaseScv<ChatSvc>() {
    readonly chatApi = new ChatApi()
    readonly shopApi = new ShopApi()
    readonly itemApi = new ItemApi()

    private _gameId: number = 0

    get gameId() {
        return this._gameId
    }
    set gameId(id: number) {
        this._gameId = id
    }

    joinRoomRetryCount = 0
    private readonly maxJoinRetryCount = 3
    isJoiningRoom: boolean = false
    initInProgress: boolean = false

    private readonly CheckPreventInputTime = jsonSvc.findConstById(20005).nIntValue * 1000
    private readonly PreventInputTime = jsonSvc.findConstById(20003).nIntValue * 1000
    private readonly maxInputCount = jsonSvc.findConstById(20001).nIntValue
    private lastChatTimes: number[] = []
    private preventUntil: number = 0

    chatBotList = []

    isUserOut = false

    retryCount = 0
    private readonly maxRetryCount = 3

    init = async (gameId: number, onConnected: () => void) => {
        if (!gameId) return
        this.gameId = gameId

        const token = await AsyncStorage.getItem(TOKEN_ID)
        if (!token) return

        this.isUserOut = false
        this.joinRoomRetryCount = 0
        this.retryCount = 0

        this.chatApi.onConnect(token, isConnect => {
            if (this.isUserOut) return

            if (!isConnect) {
                // this.chatApi.isSocketConnected = false
                if (this.retryCount < this.maxRetryCount) {
                    this.retryCount++
                    this.chatApi.reconnect(token, isReconnected => {
                        if (isReconnected) {
                            this.joinRoom()
                        }
                    })
                } else {
                    ErrorUtil.genModal(
                        "현재 채팅연결이 끊어졌습니다\n 다시 입장해주세요.",
                        () => navigate(Screen.NFTLIST),
                        true
                    )
                }
                return
            } else {
                onConnected()
                this.joinRoom()
            }
            this.joinRoomRetryCount = 0
            this.retryCount = 0
        })
    }

    joinRoom = () => {
        // if (!this.chatApi.isSocketConnected || this.isJoiningRoom) {
        //     return
        // }
        if (this.isJoiningRoom) {
            return
        }

        this.isJoiningRoom = true
        let isResponseReceived = false

        if (this.joinRoomRetryCount < this.maxJoinRetryCount) {
            this.joinRoomRetryCount++

            this.chatApi.joinRoom(this.gameId, ({ code }: IJoinGame) => {
                console.log(`=======>join room matching ${code}`)

                if (code === "ALREADY_JOIN_ROOM" || code === "SUCCESS") {
                    this.joinRoomRetryCount = 0
                    this.chatApi.isJoinedRoom = true
                    isResponseReceived = true
                } else {
                    this.chatApi.isJoinedRoom = false
                    isResponseReceived = false
                    this.isJoiningRoom = false
                }
            })

            setTimeout(() => {
                if (!isResponseReceived) {
                    this.isJoiningRoom = false
                    this.joinRoom()
                }
            }, 1000)
        } else {
            // this.isJoiningRoom = false
            // this.chatApi.isJoinedRoom = false
            ErrorUtil.genModal(
                "현재 채팅연결이 끊어졌습니다\n 다시 입장해주세요.",
                () => navigate(Screen.NFTLIST),
                true
            )
        }
    }

    isLive = () => {
        return this.chatApi.isSocketConnected && this.chatApi.isJoinedRoom
    }

    sendMsg = (msg: string, listener: (res: IChatRes) => void) => {
        const rt = this.checkPreventTrashChat()
        if (rt !== ResultSendMessage.Success) {
            return rt
        }

        this.chatApi.emitMsg(this.gameId, msg, ({ data }: ISendMsg) => {
            if (!data) {
                listener(data)
                return
            }

            const chatRes = this.extractTopics(data.CHAT, ChatType.MSG)

            listener(chatRes)
        })

        return ResultSendMessage.Success
    }

    private getGolfMsgWithColor = (type: GOLF_STAT) => {
        switch (type) {
            case GOLF_STAT.HOLE_IN_ONE:
                // return { statMsg: "홀인원!", statMsgColor: "#FFA500" }
                return { statMsg: jsonSvc.findLocalById("131003"), statMsgColor: "#FFA500" }
            case GOLF_STAT.EAGLE:
                // return { statMsg: "이글!", statMsgColor: "#0000FF" }
                return { statMsg: jsonSvc.findLocalById("131001"), statMsgColor: "#0000FF" }
            case GOLF_STAT.ALBATROSS:
                // return { statMsg: "알바트로스!", statMsgColor: "#FFFF00" }
                return { statMsg: jsonSvc.findLocalById("131002"), statMsgColor: "#FFFF00" }
            case GOLF_STAT.BIRDIE:
                // return { statMsg: "버디!", statMsgColor: "#87CEEB" }
                return { statMsg: jsonSvc.findLocalById("131000"), statMsgColor: "#87CEEB" }
            default:
                return { statMsg: null, statMsgColor: null }
        }
    }

    // private getMostRecentEventWithPlayer = (
    //     prev: { event: IChatBotEvent | null; player: typeof nftPlayer[number] | null },
    //     current: IChatBotEvent
    // ) => {
    //     const currentPlayer = nftSvc.getNftPlayer(current.PLAYER_CODE)
    //     if (currentPlayer) {
    //         if (!prev.event || new Date(current.REG_AT) > new Date(prev.event!.REG_AT)) {
    //             return { event: current, player: currentPlayer }
    //         }
    //     }
    //     return prev
    // }

    private applyPlayer = (data: IChatBotEvent) => {
        const currentPlayer = nftSvc.getNftPlayer(data.PLAYER_CODE)

        // if (!currentPlayer) return null

        return { event: data, player: currentPlayer }
    }

    listenChatBot = (listener: (data: IBotMsg[]) => void) => {
        this.chatApi.onChatBot(({ data }: IChatBot) => {
            // const recentEventWithPlayer = data.reduce(this.getMostRecentEventWithPlayer, { event: null, player: null })
            console.error("serverdata", data)

            // const sortedEvents = data.sort(
            //     (acc, cur) => new Date(acc.REG_AT).getTime() - new Date(cur.REG_AT).getTime()
            // )

            const bots = data.map(event => this.applyPlayer(event))

            const chatevents = bots.map(bot => {
                if (!bot) return null

                const { event, player } = bot

                if (!player) return null

                const { statMsg, statMsgColor } = this.getGolfMsgWithColor(event.HOLE_STAT)
                if (!statMsg || !statMsgColor) return null
                // const msg = `${event.HOLE_CODE}번홀 ${player.sPlayerName} 선수!`
                const msg = jsonSvc.formatLocal(jsonSvc.findLocalById("131004"), [
                    event.HOLE_CODE.toString(),
                    player.sPlayerName,
                ])
                return {
                    seq: event.SEQ_NO,
                    contents: msg,
                    statMsg,
                    statMsgColor,
                    date: event.REG_AT,
                    type: ChatType.BOT,
                    bdst: event.REWARD_BDST,
                    training: event.REWARD_TRAINING,
                    regAt: event.REG_AT,
                }
            })

            const filteredEvents = chatevents
                .filter(event => event !== null)
                .sort((acc, cur) => new Date(acc!.regAt).getTime() - new Date(cur!.regAt).getTime()) as IBotMsg[]

            listener(filteredEvents)
        })
    }

    listenMsg = (listener: (res: IChatRes) => void) => {
        this.chatApi.onMsg(({ data }: ISendMsg) => {
            const chatRes = this.extractTopics(data.CHAT, ChatType.MSG)
            listener(chatRes)
        })
    }

    sendCashMsg = async (msg: string, code: number, response: any, listener: (res: IChatRes) => void) => {
        const { BILL_ITEMS } = response

        if (!BILL_ITEMS || BILL_ITEMS.length <= 0) return

        const recentItem = BILL_ITEMS.reduce((latest: any, item: any) => {
            const currentItemDate = new Date(item.REG_AT)
            const latestItemDate = latest ? new Date(latest.REG_AT) : new Date(0)

            return !latest || currentItemDate > latestItemDate ? item : latest
        }, BILL_ITEMS[0])

        if (recentItem.SEQ_NO) {
            this.chatApi.emitCash(this.gameId, msg, code, recentItem.SEQ_NO, ({ data }: ISendCashMsg) => {
                const chatRes = this.extractTopics(data.CHAT, ChatType.CASH)

                listener(chatRes)
            })
        } else {
            Alert.alert("구매 실패")
        }
    }

    disconnect = () => {
        this.isUserOut = true
        this.retryCount = 0
        this.joinRoomRetryCount = 0
        this.isJoiningRoom = false

        this.chatApi.onDisconnect()
    }

    removeListen = () => {
        this.chatApi.removeListen()
    }

    listenCashMsg = (listener: (res: IChatRes) => void) => {
        this.chatApi.onCash(({ data }: ISendCashMsg) => {
            const chatRes = this.extractTopics(data.CHAT, ChatType.CASH)

            listener(chatRes)
        })
    }

    private getIsDeclare = (reportCount: number) => {
        const chatBlameCount = jsonSvc.findConstById(20004)

        if (chatBlameCount.nIntValue !== null) {
            return reportCount >= chatBlameCount.nIntValue
        } else {
            return false
        }
    }

    onReport = (
        seq: number,
        type: string | number | undefined,
        listener: (res: { isDeclare: boolean; seq: number } | false) => void
    ) => {
        if (type) {
            this.chatApi.emitReport(this.gameId, seq, type, (res: IReport | false) => {
                if (res === false) {
                    listener(res)
                } else {
                    listener({
                        isDeclare: this.getIsDeclare(res.data.CHAT_REPORT.REPORT),
                        seq: res.data.CHAT_REPORT.SEQ_NO,
                    })
                }
            })
        }
    }

    listenReport = (listener: (res: { isDeclare: boolean; seq: number }) => void) => {
        this.chatApi.onReport(({ data }: IReport) => {
            listener({
                isDeclare: this.getIsDeclare(data.CHAT_REPORT.REPORT),
                seq: data.CHAT_REPORT.SEQ_NO,
            })
        })
    }

    listenHeart = (listener: (res: ISendHeart) => void) => {
        this.chatApi.onHeart((res: ISendHeart) => {
            listener(res)
        })
    }

    sendHeart = (code: number, amount: number, listener: (res: ISendHeart) => void) => {
        this.chatApi.emitHeart(this.gameId, code, amount, (res: ISendHeart | false) => {
            if (res === false) {
                ErrorUtil.genModal("네트워크가 불안정하여\n하트가 반영되지 않았습니다.\n다시 시도해주세요.")
                return
            }

            listener(res)
        })
    }

    isChatBot = (element: IChatRes | IRepeatRes | IBotMsg): element is IBotMsg => {
        try {
            return element.type === ChatType.BOT
        }
        catch (e) {
            return false
        }
    }

    private extractTopics = (chat: IChat, type: ChatType): IChatRes => {
        return {
            seq: chat.SEQ_NO,
            name: chat.USER_NICK,
            contents: chat.CHAT_MSG,
            date: chat.REG_AT.toString(),
            isDeclare: this.getIsDeclare(chat.REPORT),
            cash: chat.SPONSOR_CASH,
            icon: { name: chat.ICON_NAME, type: chat.ICON_TYPE },
            type,
            playerCode: chat.PLAYER_CODE,
            userSeq: chat.USER_SEQ,
        }
    }

    isRepeatMsg = (element: IChatRes | IRepeatRes | IBotMsg): element is IRepeatRes => {
        try {
            return element.type === ChatType.REPEAT
        }
        catch (e) {
            return false
        }
    }

    chatDuplication = (chats: Array<IChatRes | IRepeatRes | IBotMsg>) => {
        try {
            console.log(JSON.stringify(chats))
            return chats.filter((v, i, self) => {
                if (this.isRepeatMsg(v) || this.isChatBot(v)) {
                    return true
                }
                return self.findIndex(e => !this.isRepeatMsg(e) && e.seq === v.seq) === i
            })
        }
        catch (e) {
            console.log(e)
            console.log(JSON.stringify(chats))
        }
    }
    getCashColor = (cash: number) => {
        const [gray, green, blue, purple, yellow, red] = jsonSvc.mapShopDonateCash()

        const colorSchemes = [
            { threshold: gray, colors: [Colors.GRAY3, Colors.WHITE3], thumbColor: Colors.GRAY3 },
            { threshold: green, colors: [Colors.GREEN2, Colors.GREEN], thumbColor: Colors.GREEN },
            { threshold: blue, colors: [Colors.BLUE5, Colors.BLUE4], thumbColor: Colors.BLUE5 },
            { threshold: purple, colors: [Colors.PURPLE4, Colors.PURPLE3], thumbColor: Colors.PURPLE3 },
            { threshold: yellow, colors: [Colors.YELLOW6, Colors.YELLOW5], thumbColor: Colors.YELLOW6 },
            { threshold: red, colors: [Colors.RED4, Colors.RED3], thumbColor: Colors.RED3 },
        ]

        for (const scheme of colorSchemes) {
            if (cash <= scheme.threshold) {
                return {
                    colors: scheme.colors,
                    thumbColor: scheme.thumbColor,
                }
            }
        }

        return {
            colors: [Colors.RED4, Colors.RED3],
            thumbColor: Colors.RED3,
        }
    }

    private checkPreventTrashChat = () => {
        const now = Date.now()

        if (now < this.preventUntil) {
            return ResultSendMessage.PreventTrashChat
        }

        this.lastChatTimes.push(now) // 현재 채팅 시간 기록.

        if (this.lastChatTimes.length > this.maxInputCount) {
            this.lastChatTimes.shift() // 가장 오래된 채팅 시간 제거.
        }

        // 마지막으로 체크한 채팅 시간부터 지금까지의 시간 차가 CheckPreventInputTime 이내인지 확인
        if (
            this.lastChatTimes.length >= this.maxInputCount &&
            now - this.lastChatTimes[0] <= this.CheckPreventInputTime
        ) {
            // PreventInputTime 동안 채팅을 금지합니다.
            this.preventUntil = now + this.PreventInputTime
            return ResultSendMessage.PreventTrashChat
        }

        return ResultSendMessage.Success
    }
}
export const chatSvc = ChatSvc.instance

// this.chatApi.onChatBot(({ data }: IChatBot) => {
//     const recentEvent = data.reduce((prev, current) =>
//         new Date(prev.REG_AT) > new Date(current.REG_AT) ? prev : current
//     )
//     console.log(recentEvent)

//     const player = nftSvc.getNftPlayer(recentEvent.PLAYER_CODE)

//     const { statMsg, color } = this.hadleGolfStat(recentEvent.HOLE_STAT)

//     if (!player || !statMsg) return

//     const msg = `${recentEvent.HOLE_CODE}번홀 ${player.sPlayerName} 선수!`

//     listener({
//         seq: recentEvent.SEQ_NO,
//         contents: msg,
//         statMsg,
//         statMsgColor: color,
//         date: recentEvent.REG_AT,
//         type: ChatType.BOT,
//         bdst: recentEvent.REWARD_BDST,
//         training: recentEvent.REWARD_TRAINING,
//     })
// })
