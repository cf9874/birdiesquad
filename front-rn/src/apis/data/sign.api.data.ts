export namespace SignApiData {
    export namespace SignIn {
        export interface ReqDao {
            SIGN_HEAD: string
            SIGN_DATA: string
        }
        export interface ReqDto {
            accessToken: string
            id: string
            deviceKey: string
            devicePushKey: string
            appVersion: string
            osType: "aos" | "ios"
        }

        export interface ResDao {
            FIRST: number
            TOKEN: string
            REFRESH_TOKEN: string
            WALLET_ADDRESS: string
            SANCTION_STATUS: number
            SANCTION_BEGIN_AT: string
            SANCTION_END_AT: string
            REG_AT: string
        }

        export interface ResDto {
            isfirst: boolean
            token: string
            refreshToken: string
            walletAddress: string
            sanctionStatus: number
            sanctionBeginAt: string
            sanctionEndAt: string
            regAt: string
        }

        export const toResDto = (dao: ResDao): ResDto => {
            return {
                isfirst: Boolean(dao.FIRST),
                token: dao.TOKEN,
                refreshToken: dao.REFRESH_TOKEN,
                walletAddress: dao.WALLET_ADDRESS,
                sanctionStatus: dao.SANCTION_STATUS,
                sanctionBeginAt: dao.SANCTION_BEGIN_AT,
                sanctionEndAt: dao.SANCTION_END_AT,
                regAt: dao.REG_AT,
            }
        }
        export const toReqDao = (dto: ReqDto): ReqDao => {
            return {
                SIGN_HEAD: `{\"PROTOCOL_VERSION\":\"1.0.1\"}`,
                SIGN_DATA: `{\"SNS_ID\":\"${dto.id}\",\"SNS_TOKEN\":\"${dto.accessToken}\",\"SNS_PROVIDER\":\"kakao\", \"deviceKey\":\"${dto.deviceKey}\", \"devicePushKey\":\"${dto.devicePushKey}\", \"osType\":\"${dto.osType}\", \"appVersion\": \"${dto.appVersion}\"}`,
            }
        }
    }
    export namespace SignInit {
        export interface ResDao {
            FIRST: number
        }
        export interface ResDto {
            isfirst: boolean
        }
        export const toResDto = (dao: ResDao): ResDto => {
            return {
                isfirst: Boolean(dao.FIRST),
            }
        }
    }
    export namespace SignReward {
        export interface ResDao {
            DAY_CODE: number
            SIGNUP_REWARDS: {
                SEQ_NO: number
                REG_AT: string
                REWARD_ITEM: number
                REWARD_COUNT: number
                USER_SEQ: number
            }[]
        }
        export interface ResDto {
            dayCode: number
            signupRewards: {
                seq: number
                regDate: string
                itemId: number
                itemCount: number
                userSeq: number
            }[]
        }
        export const toResDto = (dao: ResDao): ResDto => {
            const result: ResDto = {
                dayCode: dao?.DAY_CODE,
                signupRewards: [],
            }
            for (let i = 0; i < dao?.SIGNUP_REWARDS.length; i++) {
                result.signupRewards.push({
                    seq: dao?.SIGNUP_REWARDS[i].USER_SEQ,
                    itemCount: dao?.SIGNUP_REWARDS[i].REWARD_COUNT,
                    itemId: dao?.SIGNUP_REWARDS[i].REWARD_ITEM,
                    regDate: dao?.SIGNUP_REWARDS[i].REG_AT,
                    userSeq: dao?.SIGNUP_REWARDS[i].USER_SEQ,
                })
            }
            return result
        }
    }
}
