import moment from "moment"

export const checkStopNFT = () => {
    return moment().day() === 1 && moment().hour() === 0 && moment().minute() <= 10
}

export const checkHaveRewardTour = () => {
    return (
        (moment().day() > 1 && moment().day() < 4) ||
        (moment().day() === 1 && moment().hour() === 0 && moment().minute() > 10)
    )
}

export const checkTourReward = () => {
    return (
        (moment().day() === 3 && moment().hour() >= 0 && moment().hour() < 24) ||
        (moment().day() === 4 && moment().hour() === 0)
    )
}
