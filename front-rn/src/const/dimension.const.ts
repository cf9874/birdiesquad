export const Dimension = {
    BASE: {
        // 피그마 기본값, 해상도 관련 사용필요성있을예정 현재사용안함
        WIDTH: 360,
        HEIGHT: 660,
    },
    NFT: {
        DETAIL: {
            PADDING: 15,
            get COMPGAP() {
                return this.PADDING * 2 - 8
            },
        },
    },
    MAINHEADER: {
        get MARGINLEFT() {
            return 57 - Dimension.NFT.DETAIL.PADDING
        },
    },
} as const
