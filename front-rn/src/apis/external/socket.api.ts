import { CHAT_API_URL } from "utils/env"
import { IJoinGame } from "apis/data"
import { Screen } from "const"
import { Alert } from "react-native"
import io, { Socket } from "socket.io-client"
import { ErrorUtil, FuncUtil, navigate } from "utils"
import { DisconnectDescription } from "socket.io-client/build/esm/socket"

export class ChatApi {
    private _socket?: Socket
    // private _socketState: boolean = false
    private _isJoinedRoom: boolean = false

    private readonly connectWaitTime = 2000 // 2초
    private readonly reConnectWaitTime = 1000 // 1초
    private readonly EVENT = Object.freeze({
        CONNECT: "connect",
        DISCONNECT: "disconnect",
        JOIN: "join-room",
        MSG: "chat-say",
        CASH: "chat-sponsor",
        HEART: "chat-heart",
        REPORT: "chat-police",
        CHATBOT: "chat-bot",
        CONNECTERROR: "connect_error",
        TIMEOUTERROR: "connect_error",
        CHECKCONNECT: "conn-completed",
    } as const)

    get isJoinedRoom() {
        return this._isJoinedRoom
    }
    set isJoinedRoom(flag: boolean) {
        this._isJoinedRoom = flag
    }
    // get isSocketConnected() {
    //     return this._socketState
    // }
    // set isSocketConnected(flag: boolean) {
    //     this._socketState = flag
    // }

    get isSocketConnected() {
        return this.socket?.connected
    }

    get socket(): Socket | undefined {
        return this._socket
    }
    set socket(socket: Socket | undefined) {
        this._socket = socket
    }

    // getSocket() {
    //     return this.socket
    // }

    private async wrappedListener<T extends Listen>(listener: T, res: any) {
        if (res === undefined || (res.code && res.stack)) {
            if (res.code === "NEED_JOIN_ROOM") {
                this.onDisconnect()
            }

            listener(false)
        }

        listener(res)

        return true
    }

    removeListen() {
        this.socket?.off(this.EVENT.MSG)
        this.socket?.off(this.EVENT.CASH)
        this.socket?.off(this.EVENT.REPORT)
        this.socket?.off(this.EVENT.HEART)
        this.socket?.off(this.EVENT.CHATBOT)
    }

    onDisconnect = () => {
        this.isJoinedRoom = false
        this.socket?.disconnect()
    }

    onConnect(token: string, listener: (connection: boolean) => void) {
        if (this.socket?.connected) {
            listener(true)
            return
        }

        const socket = io(`${CHAT_API_URL}?token=${token}`, { transports: ["websocket"] })

        const onError = (err: Error) => {
            console.error("ChatApi - onConnect() Error : " + JSON.stringify(err))

            this.isJoinedRoom = false
            listener(false)

            socket.off(this.EVENT.CONNECTERROR, onError)
            socket.off(this.EVENT.TIMEOUTERROR, onError)
            socket.off(this.EVENT.DISCONNECT, onDisconnect)
        }
        const onDisconnect = (reason: Socket.DisconnectReason, description: DisconnectDescription | undefined) => {
            console.error("ChatApi - onConnect() Disconnect : " + JSON.stringify(reason) + ", " + JSON.stringify(description))

            this.isJoinedRoom = false
            listener(false)

            socket.off(this.EVENT.CONNECTERROR, onError)
            socket.off(this.EVENT.TIMEOUTERROR, onError)
            socket.off(this.EVENT.DISCONNECT, onDisconnect)
        }

        socket.on(this.EVENT.CONNECTERROR, onError)
        socket.on(this.EVENT.TIMEOUTERROR, onError)
        socket.on(this.EVENT.DISCONNECT, onDisconnect)
        socket.on(this.EVENT.CONNECT, () => {
            this.socket = socket
            // listener(true)
        })
        socket.on(this.EVENT.CHECKCONNECT, () => {
            // this.socket = socket
            listener(true)
        })

        setTimeout(() => {
            if (!this.socket?.connected) {
                listener(false)
            }
        }, this.connectWaitTime)
    }

    reconnect(token: string, listener: (connection: boolean) => void) {
        if (!this.socket?.connected) {
            console.log(`reconnect... wait , currnet isSocketConnected ${this.socket?.connected}`)

            setTimeout(() => this.onConnect(token, listener), this.reConnectWaitTime)
        }
    }

    joinRoom(GAME_CODE: number, listener: (res: IJoinGame) => void) {
        this.socket?.emit(this.EVENT.JOIN, { GAME_CODE }, (res: IJoinGame) => {
            listener(res)
        })
    }

    private onHandler<T extends Listen>(event: typeof this.EVENT[keyof typeof this.EVENT], listener: T) {
        this.socket?.on(event, (res: any) => this.wrappedListener(listener, res))
    }

    private emitHandler<D extends any, T extends Listen>(
        event: typeof this.EVENT[keyof typeof this.EVENT],
        data: D,
        listener: T
    ) {
        if (!this.socket?.connected) {
            ErrorUtil.genModal(
                "현재 채팅연결이 끊어졌습니다\n 다시 입장해주세요.",
                () => navigate(Screen.NFTLIST),
                true
            )

            return
        }

        this.socket?.emit(event, data, (res: any) => this.wrappedListener(listener, res))
    }

    onMsg<T extends Listen>(listener: T) {
        return this.onHandler(this.EVENT.MSG, listener)
    }

    emitMsg<T extends Listen>(GAME_CODE: number, CHAT_MSG: string, listener: T) {
        return this.emitHandler(this.EVENT.MSG, { GAME_CODE, CHAT_MSG }, listener)
    }

    onCash<T extends Listen>(listener: T) {
        return this.onHandler(this.EVENT.CASH, listener)
    }

    emitCash<T extends Listen>(
        GAME_CODE: number,
        CHAT_MSG: string,
        PLAYER_CODE: number,
        ITEM_SEQ: number,
        listener: T
    ) {
        return this.emitHandler(this.EVENT.CASH, { GAME_CODE, CHAT_MSG, PLAYER_CODE, ITEM_SEQ }, listener)
    }

    onHeart<T extends Listen>(listener: T) {
        return this.onHandler(this.EVENT.HEART, listener)
    }

    emitHeart<T extends Listen>(GAME_CODE: number, PLAYER_CODE: number, HEART_AMOUNT: number, listener: T) {
        return this.emitHandler(this.EVENT.HEART, { GAME_CODE, PLAYER_CODE, HEART_AMOUNT }, listener)
    }

    onReport<T extends Listen>(listener: T) {
        return this.onHandler(this.EVENT.REPORT, listener)
    }

    emitReport<T extends Listen>(GAME_CODE: number, CHAT_SEQ: number, POLICE_TYPE: string | number, listener: T) {
        return this.emitHandler(this.EVENT.REPORT, { GAME_CODE, CHAT_SEQ, POLICE_TYPE }, listener)
    }

    onChatBot<T extends Listen>(listener: T) {
        return this.onHandler(this.EVENT.CHATBOT, listener)
    }
}

type Listen = (res: any) => void
