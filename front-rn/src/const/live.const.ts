export const enum PeriodType {
    BEFORE = "BEFORE",
    END = "END",
    CANCEL = "CANCEL",
    SUSPENDED = "SUSPENDED",
    ROUND1 = "ROUND1",
    ROUND2 = "ROUND2",
    ROUND3 = "ROUND3",
    ROUND4 = "ROUND4",
    ROUND5 = "ROUND5",
    EXTRA_ROUND = "EXTRA_ROUND",
}
export const enum GameStatus {
    BEFORE = "BEFORE",
    PLAY = "PLAY",
    CONTINUE = "CONTINUE",
    END = "END",
    CANCEL = "CANCEL",
    SUSPENDED = "SUSPENDED",
}

export const RoundType = {
    [PeriodType.BEFORE]: 0,
    [PeriodType.CANCEL]: null,
    [PeriodType.SUSPENDED]: null,
    [PeriodType.ROUND1]: 1,
    [PeriodType.ROUND2]: 2,
    [PeriodType.ROUND3]: 3,
    [PeriodType.ROUND4]: 4,
    [PeriodType.ROUND5]: 5,
    [PeriodType.EXTRA_ROUND]: 6,
    [PeriodType.END]: 99,
}

export const enum GOLF_STAT {
    HOLE_IN_ONE = -4,
    ALBATROSS = -3,
    EAGLE = -2,
    BIRDIE = -1,
    PAR = 0,
    BOGEY = 1,
    DOUBLEBOGEY = 2,
}

export const MAX_NUM_CHAT = 250