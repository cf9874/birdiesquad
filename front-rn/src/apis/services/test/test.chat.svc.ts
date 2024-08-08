import { connect } from "http2"
// import { ChatSvc } from "../chat.svc"

export class TestChatSvc {
    // private readonly uri = 'http://10.32.100.147:6001';
    private readonly uri = "https://bdsqd-stg-chat.kakaovx.net"
    private readonly token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQUk9UT0NPTF9WRVJTSU9OIjoiMS4wLjEiLCJVU0VSX1VVSUQiOiI0NzUyZmVkNTQ0ZWVkYzFiYjllZjE4NmRiNmE3Y2YwOCIsIlRPS0VOX1VVSUQiOiI0NGMzNDBlYTUwOTJmNTUxODRjZWFlODUzZmI4MmFjNCIsImlhdCI6MTY3ODM0OTYwOSwiZXhwIjoxNjgwOTQxNjA5fQ.i3hEtXtzFbEjAVI33Oue0QGzVo9UdGsS9TMbXnleFNU"
    private readonly room = 80069421

    constructor() {
        console.log("start")
        ChatSvc.create(
            new ChatSvc(`${this.uri}?token=${this.token}`, c => {
                console.log(`connect: ${c}`)

                if (c) {
                    this.onConnect()
                } else {
                    this.onDisconnect()
                }
            })
        )
    }

    private onConnect() {
        // ChatSvc.instance.listen(ChatSvc.instance.EventJoinRoom, (res) => {

        //     console.log(res);

        // });

        ChatSvc.instance.joinRoom(this.room, res => {
            console.log(res)

            this.listenMsg()
            this.sendMsg("apple pen!")
        })
    }

    private onDisconnect() {
        console.log("!!!!!!!!!!disconnect")
    }

    private listenMsg() {
        ChatSvc.instance.listen(ChatSvc.instance.EventSendMessage, res => {
            // 다른 사람 메시지 (자기 메시지는 안들어옴, sendMsg 참조)
            console.log(res)
        })
    }

    private sendMsg(msg: string) {
        ChatSvc.instance.sendMessage(this.room, msg, res => {
            // 자기 메시지
            console.log(res)
        })
    }
}
// prev Chat svc
import { ABaseScv } from "../base.svc"

import io, { Socket } from "socket.io-client"

export class ChatSvc extends ABaseScv<ChatSvc>() {
    readonly EventJoinRoom = "join-room"
    readonly EventLeaveRoom = "leave-room"
    readonly EventSendMessage = "chat-say"

    private readonly socket: Socket

    constructor(ep: string, listener: (connection: boolean) => void) {
        super()

        this.socket = io(ep, { transports: ["websocket"] })

        this.socket.on("connect", () => {
            this.socket.on("disconnect", () => {
                listener(false)
            })

            listener(true)
        })
    }

    joinRoom(GAME_CODE: number, listener: (res: any) => void) {
        this.socket.emit("join-room", { GAME_CODE }, (res: any) => {
            listener(res)
        })
    }

    listen(e: string, listener: (res: any) => void) {
        this.socket.on(e, (res: any) => {
            listener(res)
        })
    }

    sendMessage(GAME_CODE: number, CHAT_MSG: string, listener: (res: any) => void) {
        this.socket.emit("chat-say", { GAME_CODE, CHAT_MSG }, (res: any) => {
            listener(res)
        })
    }
}
