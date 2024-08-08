import { ABaseApi } from "./base.api"
import {
    IMyProfile,
    IMyProfileDetail,
    IMyProfileEdit,
    IPanProfile,
    IProDetail,
    IProProfileRecord,
    IProProfileUP,
    IProSeason,
    IProfileBlame,
    IProfileBlameHistory,
    ISetting,
    IUserProfileRecord,
    IUserProfileUP,
    ProfileApiData,
} from "../data"
import { IconType } from "const"
import { ErrorUtil } from "utils"
import { jsonSvc } from "apis/services/json.svc"

// import mime from "mime";
export class ProfileApi extends ABaseApi {
    constructor() {
        super()
    }
    // [나의 프로필] - 나의 간략 프로필 정보
    async getMyProfile(): Promise<IMyProfile> {
        const { data } = await this.get<IMyProfile>({
            url: "/api/v1/profile/my/profile",
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [나의 프로필] - 나의 주간 UP 정보
    async getMyProfileUpCount(): Promise<IUserProfileUP> {
        const { data } = await this.get<IUserProfileUP>({
            url: "/api/v1/profile/my/up-count",
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [나의 프로필] - 나의 기록/통계 정보
    async getMyProfileRecord(): Promise<IUserProfileRecord> {
        const { data } = await this.get<IUserProfileRecord>({
            url: "/api/v1/profile/my/record",
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [나의 프로필] - 나의 모든 프로필 정보
    async getMyProfileDetail(): Promise<IMyProfileDetail> {
        const { data } = await this.get<IMyProfileDetail>({
            url: "/api/v1/profile/my/detail",
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [나의 프로필 변경] - 수정
    async editMyProfile(reqData: {
        NICK?: string
        HELLO?: string
        ICON_TYPE?: IconType
        NFT_SEQ?: number
    }): Promise<IMyProfileEdit> {
        const { data } = await this.post<IMyProfileEdit>({
            url: "/api/v1/profile/my/edit-profile",
            body: reqData,
            options: await this.genAuthConfig(),
        },
        (error)=>{
            if(error?.data.message == 'DUPLICATE_NICK'){
                ErrorUtil.genModal(jsonSvc.findLocalById("160006"))
            }
        })
        return data
    }

    // [팬 프로필] - 간략 프로필 정보
    async getFanProfile(USER_SEQ: number): Promise<IMyProfile> {
        const { data } = await this.get<IMyProfile>({
            url: `/api/v1/profile/user/profile?USER_SEQ=${USER_SEQ}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [팬 프로필] - 주간 UP 정보
    async getFanProfileUpCount(USER_SEQ: number): Promise<IUserProfileUP> {
        const { data } = await this.get<IUserProfileUP>({
            url: `/api/v1/profile/user/up-count?USER_SEQ=${USER_SEQ}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [팬 주간 UP]
    async postFanProfileUpCount(userSeq: number): Promise<IUserProfileUP> {
        const { data } = await this.post<IUserProfileUP>(
            {
                url: "/api/v1/profile/user/up-count",
                body: { USER_SEQ: userSeq },
                options: await this.genAuthConfig(),
            },
            error => ErrorUtil.panUp(error)
        )
        return data
    }

    // [팬 프로필] - 유저 기록/통계 정보
    async getFanProfileRecord(USER_SEQ: number): Promise<IUserProfileRecord> {
        const { data } = await this.get<IUserProfileRecord>({
            url: `/api/v1/profile/user/record?USER_SEQ=${USER_SEQ}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [팬 프로필] - 유저 모든 프로필 정보
    async getFanProfileDetail(USER_SEQ: number): Promise<IPanProfile> {
        const { data } = await this.get<IPanProfile>(
            {
                url: `/api/v1/profile/user/detail?USER_SEQ=${USER_SEQ}`,
                options: await this.genAuthConfig(),
            },
            error => ErrorUtil.notFoundUserModal(error)
        )
        return data
    }
    // [프로 프로필] - 간략 프로필 정보
    // 아직 스키마 안나옴
    // async getProProfileDetail(PLAYER_CODE: number) {
    //     const { data } = await this.get({
    //         url: `/api/v1/profile/player/profile?PLAYER_CODE=${PLAYER_CODE}`,
    //         options: await this.genAuthConfig(),
    //     })
    //     return data
    // }

    // [프로 프로필] - 시즌 UP 정보
    async getProProfileUpCount(PLAYER_CODE: number): Promise<IProProfileUP> {
        const { data } = await this.get<IProProfileUP>({
            url: `/api/v1/profile/player/up-count?PLAYER_CODE=${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [프로 시즌 UP]
    async postProProfileUpCount(PLAYER_CODE: number): Promise<IProProfileUP> {
        const { data } = await this.post<IProProfileUP>({
            url: "/api/v1/profile/player/up_count",
            body: { PLAYER_CODE },
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [프로 프로필] - 프로 기록/통계 정보
    async getProProfileRecord(PLAYER_CODE: number): Promise<IProProfileRecord> {
        const { data } = await this.get<IProProfileRecord>({
            url: `/api/v1/profile/player/record?PLAYER_CODE=${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [프로 프로필] - 프로 기록/시즌 정보
    async getProProfileSeason(PLAYER_CODE: number): Promise<IProSeason> {
        const { data } = await this.get<IProSeason>({
            url: `/api/v1/profile/player/season?PLAYER_CODE=${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [프로 프로필] - 프로 모든 프로필 정보
    async getProProfileDetail(PLAYER_CODE: number): Promise<IProDetail> {
        const { data } = await this.get<IProDetail>({
            url: `/api/v1/profile/player/detail?PLAYER_CODE=${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [프로필 신고]
    async blame(userSeq: number): Promise<IProfileBlame> {
        const { data } = await this.post<IProfileBlame>({
            url: "/api/v1/profile/do-blame",
            body: { USER_SEQ: userSeq },
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [프로필 신고 기록]
    async getProfileBlameHistory(userSeq: number): Promise<IProfileBlameHistory> {
        const { data } = await this.get<IProfileBlameHistory>({
            url: `/api/v1/profile/blame-history?USER_SEQ=${userSeq}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async getAsset() {
        const { data } = await this.get<ProfileApiData.MyAsset.ResDao>({
            url: "/api/v1/asset/my-asset",
            options: await this.genAuthConfig(),
        })

        return ProfileApiData.MyAsset.toResDto(data)
    }

    async checkNick(nickName: string) {
        const { data } = await this.get<ProfileApiData.Edit.CheckNick.ResDao>({
            url: `/api/v1/profile/check-nick?NICK=${nickName}`,
            options: await this.genAuthConfig(),
        })

        return ProfileApiData.Edit.CheckNick.toResDto(data)
    }

    // [나의 프로필] - 나의 간략 프로필 정보
    async editSetting(body: ISetting) {
        const { data } = await this.post<{
            inquiryUdt: string
            isInquiryPush: boolean
            isLiveHeart: boolean
            isLiveStartPush: boolean
            isRaffleOpenPush: boolean
            isRaffleResultPush: boolean
            isTourRewardPush: boolean
            isUpPush: boolean
            liveHeartUdt: string
            liveStartUdt: string
            raffleOpenUdt: string
            raffleResultUdt: string
            seqNo: number
            tourRewardUdt: string
            upUdt: string
            userSeq: number
        }>({
            url: "/api/v1/profile/my/setting",
            body,
            options: await this.genAuthConfig(),
        })

        return data
    }
    // [Sig wallet user]
    async sigWallet(idToken: string) {
        const { data } = await this.get<string>({
            url: `/api/v1/auth/wallet-sig?idToken=${idToken}`,
            options: await this.genAuthConfig(),
        })

        return data
    }
}
