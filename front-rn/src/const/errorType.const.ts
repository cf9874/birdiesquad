export const enum ErrorType {
    NOTALLOWSELF = "NOT_ALLOWED_SELF",
    NOTFOUNDUSER = "NOT_FOUND_USER",
    WRONGTOKEN = "WRONG_TOKEN",
    UNAUTHORIZED = "Unauthorized",
    WRONGPARAMETER = "WRONG_PARAMETER",
    WRONGPERIODREWARD = "WRONG_PERIOD_REWARD",
    JWT_TOKEN_EXPIRED = "JWT_TOKEN_EXPIRED", // refresh 만료
    JWT_RELOGIN = "JWT_RELOGIN", // 재로그인
    JWT_REFRESH_TOKEN_INVALID = "JWT_REFRESH_TOKEN_INVALID", // 토큰 유효안함
    JWT_TOKEN_INVALID = "JWT_TOKEN_INVALID", // 토큰 유효안함
    ALREADYTOOKREWARD = "ALREADY_TOOK_REWARD",
    WRONG_PERIOD_REWARD = "WRONG_PERIOD_REWARD",
    WRONG_BILLING_RECEIPT_DUPLICATE = "WRONG_BILLING_RECEIPT_DUPLICATE",
    SERVER_MAINTENANCE_CHECK = 9999, // 서버 점검중
    SANCTION_STATUS_USER = "SANCTION_STATUS_USER", //회원제재
}

export const enum WalletErrorType {
    JWT_TOKEN_EXPIRED = "인증키가 만료되었습니다.",
    EXPECT_TOKEN = "인증 토큰이 누락되었습니다.",
    SERVER_MAINTENANCE_CHECK = 9999, // 서버 점검중
}

// 지갑 api 코드
export const WalletMessageCode = [
    1008, // 토큰 전송 최대 개수를 초과하였습니다. (최대 십억(9,999,999,999) 단위)
    1009, // 등록되어있지 않거나, 활동하지 않는 유저입니다.
    1010, //유저가 이미 가지고있는 수량보다 토큰 전송 수량이 큽니다.
    1011, // 지갑으로 전송 가능한 1일 최대 수량(10,000 tBORA)을 초과했습니다.
    1012, // 지갑으로 전송 가능한 1일 최대 수량(100,000 BDST)을 초과했습니다.
    2001, // 소유한 nft가 아닙니다.
    2002, // 승급 가능 조건을 확인해주세요.
    2003, // BDP가 부족합니다.
    2004, // 대회 보상 정산 중에는 승급이 불가능합니다.
    2005, // 이미 승급 진행 중인 nft 입니다.
]

// 지갑 api 에러 코드
export const WalletServerErrorCode = [
    8000, // 메타보라 서버 통신에 문제가 발생하였습니다.
    8001, // 메타보라 서버 통신에 문제가 발생하였습니다.
    8002, // 트랜잭션에 문제가 발생했습니다.
    8100, // 카프카 프로듀서 적재 중 문제가 발생하였습니다.
]

// 회원 제재 사유
export enum SanctionCode {
    SANCTION_ADMIN = -1, // 운영상 관리자에 의해 잠금
    SANCTION_NONE = 0, // 제재 없음
    SANCTION_01 = 1, // 불건전 언어 사용
    SANCTION_02 = 2, // 불건전 이름 사용
    SANCTION_03 = 3, // 부정거래 및 광고
    SANCTION_04 = 4, // 운영서비스 방해
    SANCTION_05 = 5, // 계정 도용
    SANCTION_06 = 6, // 버그 및 어뷰징
    SANCTION_07 = 7, // 개인정보 유출
    SANCTION_08 = 8, // 운영자 사칭
    SANCTION_09 = 9, // 사기 및 사기 시도
    SANCTION_10 = 10, // 결제시스템 악용
    SANCTION_ETC = 11, // 기타
}
export const SanctionMsg = [
    { code: SanctionCode.SANCTION_ADMIN, msg: "관리자에 의해\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_NONE, msg: "" },
    { code: SanctionCode.SANCTION_01, msg: "불건전 언어 사용으로\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_02, msg: "불건전 이름 사용으로\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_03, msg: "부정거래 및 광고로\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_04, msg: "운영서비스 방해로\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_05, msg: "계정 도용으로\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_06, msg: "버그 및 어뷰징으로\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_07, msg: "개인정보 유출로\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_08, msg: "운영자 사칭으로\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_09, msg: "사기 및 사기 시도로\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_10, msg: "결제시스템 악용으로\n계정이 제재되었습니다." },
    { code: SanctionCode.SANCTION_ETC, msg: "운영정책을 위반하여\n계정이 제재되었습니다." },
]
