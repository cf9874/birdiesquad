import { jsonSvc } from "apis/services"

export const SettingTitle = {
    LIVE_HEART: jsonSvc.findLocalById("172013"),
    LIVE_BEGIN: jsonSvc.findLocalById("172014"),
    TOUR_REWARD: jsonSvc.findLocalById("172015"),
    RAFFLE_BEGIN: jsonSvc.findLocalById("172016"),
    RAFFLE_RESULT: jsonSvc.findLocalById("172017"),
    PROFILE_UP: jsonSvc.findLocalById("172018"),
    FAQ: jsonSvc.findLocalById("172020"),
} as const
export const settingMenu = [
    { title: SettingTitle.LIVE_HEART, isCheck: jsonSvc.findConstById(41007).bBoolValue },
    { title: SettingTitle.LIVE_BEGIN, isCheck: jsonSvc.findConstById(41000).bBoolValue },
    { title: SettingTitle.TOUR_REWARD, isCheck: jsonSvc.findConstById(41001).bBoolValue },
    { title: SettingTitle.PROFILE_UP, isCheck: jsonSvc.findConstById(41004).bBoolValue },
    { title: SettingTitle.FAQ, isCheck: jsonSvc.findConstById(41006).bBoolValue },
    { title: SettingTitle.RAFFLE_BEGIN, isCheck: jsonSvc.findConstById(41002).bBoolValue },
    { title: SettingTitle.RAFFLE_RESULT, isCheck: jsonSvc.findConstById(41003).bBoolValue },
]

export type SettingMenu = { title: string; isCheck: boolean }[]
