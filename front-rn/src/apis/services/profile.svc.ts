import { ProfileApi } from "apis/context"
import { ABaseScv } from "./base.svc"
import {
    IMyProfile,
    IMyProfileDetail,
    IMyProfileEdit,
    IPanProfile,
    IProDetail,
    IProProfileRecord,
    IProProfileUP,
    IProSeason,
    ISetting,
    IUserProfileRecord,
    IUserProfileUP,
    ProfileApiData,
} from "apis/data"
import { KakaoSignApi } from "apis/external"
import { nftSvc } from "./nft.svc"
import { ConfigUtil } from "utils"
import { SettingMenu, SettingTitle } from "const"
import { SETTING_ID } from "utils/env"

class ProfileSvc extends ABaseScv<ProfileSvc>() {
    private readonly profileSignApi = new ProfileApi()
    private readonly kakaoSignApi = new KakaoSignApi()

    getKakaoProfile = async () => {
        return await this.kakaoSignApi.getProfile()
    }

    // [나의 프로필] - 나의 간략 프로필 정보
    getMyProfile = async (): Promise<IMyProfile> => {
        return await this.profileSignApi.getMyProfile()
    }

    // [나의 프로필] - 나의 주간 UP 정보
    getMyProfileUpCount = async (): Promise<IUserProfileUP> => {
        return await this.profileSignApi.getMyProfileUpCount()
    }

    // [나의 프로필] - 나의 기록/통계 정보
    getMyProfileRecord = async (): Promise<IUserProfileRecord> => {
        return await this.profileSignApi.getMyProfileRecord()
    }

    // [나의 프로필] - 나의 모든 프로필 정보
    getMyProfileDetail = async (): Promise<IMyProfileDetail> => {
        return await this.profileSignApi.getMyProfileDetail()
    }

    // [나의 프로필 변경] - 수정
    editMyProfile = async (reqData: {
        NICK?: string
        HELLO?: string
        ICON_TYPE?: number
        NFT_SEQ?: number
    }): Promise<IMyProfileEdit> => {
        console.log(reqData)

        return await this.profileSignApi.editMyProfile(reqData)
    }

    // [팬 프로필] - 간략 프로필 정보
    getFanProfile = async (USER_SEQ: number): Promise<IMyProfile> => {
        return await this.profileSignApi.getFanProfile(USER_SEQ)
    }

    // [팬 프로필] - 주간 UP 정보
    getFanProfileUpCount = async (USER_SEQ: number): Promise<IUserProfileUP> => {
        return await this.profileSignApi.getFanProfileUpCount(USER_SEQ)
    }

    // [팬 주간 UP]
    postFanProfileUpCount = async (userSeq: number): Promise<IUserProfileUP> => {
        return await this.profileSignApi.postFanProfileUpCount(userSeq)
    }

    // [팬 프로필] - 유저 기록/통계 정보
    getFanProfileRecord = async (USER_SEQ: number): Promise<IUserProfileRecord> => {
        return await this.profileSignApi.getFanProfileRecord(USER_SEQ)
    }

    // [팬 프로필] - 유저 모든 프로필 정보
    getFanProfileDetail = async (USER_SEQ: number): Promise<IPanProfile> => {
        return await this.profileSignApi.getFanProfileDetail(USER_SEQ)
    }

    // [프로 프로필] - 시즌 UP 정보
    getProProfileUpCount = async (PLAYER_CODE: number): Promise<IProProfileUP> => {
        return await this.profileSignApi.getProProfileUpCount(PLAYER_CODE)
    }

    // [프로 시즌 UP]
    postProProfileUpCount = async (PLAYER_CODE: number): Promise<IProProfileUP> => {
        return await this.profileSignApi.postProProfileUpCount(PLAYER_CODE)
    }

    // [프로 프로필] - 프로 기록/통계 정보
    getProProfileRecord = async (PLAYER_CODE: number): Promise<IProProfileRecord> => {
        return await this.profileSignApi.getProProfileRecord(PLAYER_CODE)
    }

    // [프로 프로필] - 프로 기록/시즌 정보
    getProProfileSeason = async (PLAYER_CODE: number): Promise<IProSeason> => {
        return await this.profileSignApi.getProProfileSeason(PLAYER_CODE)
    }

    // [프로 프로필] - 프로 모든 프로필 정보
    getProProfileDetail = async (PLAYER_CODE: number): Promise<IProDetail> => {
        let dto = await this.profileSignApi.getProProfileDetail(PLAYER_CODE)

        dto.PROFILE_PLAYER = nftSvc.getNftPlayer(dto.PLAYER_CODE)

        return dto
    }

    getAsset = async () => {
        return await this.profileSignApi.getAsset()
    }

    checkNick = async (nickName: string) => {
        const { exist } = await this.profileSignApi.checkNick(nickName)
        return exist
    }
    // [프로필 신고]
    Blame = async (userSeq: number) => {
        return await this.profileSignApi.blame(userSeq)
    }
    // [프로필 신고 기록]
    BlameCheck = async (userSeq: number) => {
        return await this.profileSignApi.getProfileBlameHistory(userSeq)
    }

    setAlarm = async (editedSetting: SettingMenu) => {
        const setting: ISetting = {
            isLiveHeart: this.getCheckValue(SettingTitle.LIVE_HEART, editedSetting),
            isLiveStartPush: this.getCheckValue(SettingTitle.LIVE_BEGIN, editedSetting),
            isTourRewardPush: this.getCheckValue(SettingTitle.TOUR_REWARD, editedSetting),
            isUpPush: this.getCheckValue(SettingTitle.PROFILE_UP, editedSetting),
            isInquiryPush: this.getCheckValue(SettingTitle.FAQ, editedSetting),
            isRaffleOpenPush: this.getCheckValue(SettingTitle.RAFFLE_BEGIN, editedSetting),
            isRaffleResultPush: this.getCheckValue(SettingTitle.RAFFLE_RESULT, editedSetting),
        }

        const data = await this.profileSignApi.editSetting(setting)
        console.error(data)

        const settingMenu = this.mapResponseToSettingMenu(data)

        return settingMenu
    }
    private getCheckValue = (title: string, settingMenu: SettingMenu): boolean => {
        const found = settingMenu.find(setting => setting.title === title)
        return found ? found.isCheck : false
    }
    private mapResponseToSettingMenu = (data: any): SettingMenu => {
        return [
            { title: SettingTitle.LIVE_HEART, isCheck: data.isLiveHeart },
            { title: SettingTitle.LIVE_BEGIN, isCheck: data.isLiveStartPush },
            { title: SettingTitle.TOUR_REWARD, isCheck: data.isTourRewardPush },
            { title: SettingTitle.PROFILE_UP, isCheck: data.isUpPush },
            { title: SettingTitle.FAQ, isCheck: data.isInquiryPush },
            { title: SettingTitle.RAFFLE_BEGIN, isCheck: data.isRaffleOpenPush },
            { title: SettingTitle.RAFFLE_RESULT, isCheck: data.isRaffleResultPush },
        ]
    }
    sigWallet = async ({ idToken }: { idToken: string }) => {
        return await this.profileSignApi.sigWallet(idToken)
    }
}

export const profileSvc = ProfileSvc.instance

// getInfo = async () => {
//     return await this.profileSignApi.getInfo()
// }

// edit = async (editDto: ProfileApiData.Edit.ReqDto) => {
//     return await this.profileSignApi.edit(editDto)
// }

// getPanInfo = async (userSeq: number) => {
//     return await this.profileSignApi.getPanInfo(userSeq)
// }

// getProInfo = async (procode: number) => {
//     return await this.profileSignApi.getProInfo(procode)
// }

// panUp = async (dto: ProfileApiData.SeasonUp.ReqDto) => {
//     return await this.profileSignApi.panUp(dto)
// }
// proUp = async (dto: ProfileApiData.SeasonUp.ReqDto) => {
//     return await this.profileSignApi.proUp(dto)
// }

// getMyInfoData = async () => {
//     const kakaoProfile = await this.kakaoSignApi.getProfile()
//     const profile = await this.profileSignApi.getInfo()
//     return { email: kakaoProfile.email, regDate: profile.profile.date.reg }
// }
