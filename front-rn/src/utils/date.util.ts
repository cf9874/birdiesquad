import { jsonSvc } from "apis/services"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"
import Weekday from "dayjs/plugin/weekday"
dayjs.extend(Weekday)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

dayjs.updateLocale("en", {
    relativeTime: {
        // future: "방금전",
        future: "%s 뒤",
        past: "%s 전",
        // past: "방금전",
        // s: "방금 전",
        s: jsonSvc.findLocalById("130001"),
        m: "1분 전",
        mm: "%d분 전",
        h: "한시간 전",
        hh: "%d시간 전",
        d: "하루",
        dd: "%d일",
        M: "한 달",
        MM: "%d달",
        y: "일 년",
        yy: "%d년",
    },
})

export const DateUtil = {
    agoUnit: (time: string) => {
        const targetDate = new Date(time)
        const currentDate = Date.now()

        const elapsed = currentDate - targetDate.getTime()
        if (elapsed < 60000)
            return "방금 전"
        else if (elapsed < 3600000)
            return Math.floor(elapsed / 60000) + "분 전"
        else if (elapsed < 60 * 60 * 24 * 1000)
            return Math.floor(elapsed / (60 * 60 * 1000)) + "시간 전"
        else if (elapsed < 60 * 60 * 24 * 1000 * 30)
            return Math.floor(elapsed / (60 * 60 * 24 * 1000)) + "일 전"
        else
            return Math.floor(elapsed / (60 * 60 * 24 * 1000 * 30)) + "달 전"

        //return dayjs(time).toNow(true)
    },
    currentDate: () => {
        const curr = new Date()
        const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000

        // 3. UTC to KST (UTC + 9시간)
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000
        const kr_curr = new Date(utc + KR_TIME_DIFF)
        return kr_curr
    },

    getWeekNumber: (date: Date | undefined) => {
        if (!date)
            return -1

        const year = new Date(date.getFullYear(), 0, 1)
        const days = Math.floor((date.getTime() - year.getTime()) / (24 * 60 * 60 * 1000))
        const week = Math.ceil((date.getDay() + 1 + days) / 7)
        console.log('week: ' + week)
        return week
    },
    getWeekCode: (date: Date) => {
        const thisWeekMonday = dayjs(date).startOf("week").add(1, "day").format("YYYYMMDD") // 1은 월요일
        return thisWeekMonday
    },
    format: (dateString: string | Date = new Date()) => {
        const date = new Date(dateString)

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        //const hour = date.getUTCHours() // 왜 UTC 시간을 가져오나?
        const hour = date.getHours()
        const minute = date.getMinutes()
        const amPm = hour >= 12 ? "오후" : "오전"

        return {
            year,
            month,
            day,
            hour,
            minute,
            amPm,
        }
    },
    convertToSeconds: (timeStr: string) => {
        const [hours, minutes] = timeStr?.split(":")?.map(val => parseInt(val)) ?? []

        const second = hours * 3600 + minutes * 60

        return second
    },

    isToday: (dateString: Date) => {
        const inputDate = new Date(dateString)
        const currentDate = new Date()

        return (
            inputDate.getFullYear() === currentDate.getFullYear() &&
            inputDate.getMonth() === currentDate.getMonth() &&
            inputDate.getDate() === currentDate.getDate()
        )
    },
    timeToText: (seconds: number) => {
        seconds = Number(seconds)
        let day = Math.floor(seconds / (3600 * 24))
        let hour = Math.floor((seconds % (3600 * 24)) / 3600)
        let minute = Math.floor((seconds % 3600) / 60)
        let second = Math.floor(seconds % 60)

        let dDisplay = day > 0 ? day + "일 " : ""
        let hDisplay = hour > 0 ? hour + "시간 " : ""
        let mDisplay = minute > 0 ? minute + "분 " : ""
        let sDisplay = second > 0 ? second + "초 " : ""
        return { type1: mDisplay + sDisplay, type2: dDisplay + hDisplay, day, hour, minute, second }
    },
    parseDate: (dateStr: string) => {
        return new Date(
            parseInt(dateStr.substring(0, 4)),
            parseInt(dateStr.substring(4, 6)) - 1,
            parseInt(dateStr.substring(6, 8))
        )
    },
    dateFormat: (date: string) => {
        const month = date.slice(4, 6)
        const day = date.slice(6)

        return `${Number(month)}월 ${Number(day)}일`
    },
    timeFormat: (time: string) => {
        if (!time) return ""
        const hour = time.slice(0, 2)
        const min = time.slice(2)

        return `${Number(hour)}시 ${Number(min)}분`
    },
}
