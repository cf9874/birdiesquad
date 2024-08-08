//custom
export * from "./func.util"
export * from "./array.util"
export * from "./regex.util"
export * from "./number.util"
export * from "./error.util"
export * from "./game.util"

// native 전용
export * from "./navigate.util"
export * from "./ratio.util"
export * from "./object.util"
export * from "./config.util"
export * from "./date.util"
export * from "./text.util"
export * from "./check_stop_nft"

//배열끼리 중복 값확인
// export const isOverlap = (accList = [], currList = []) => {
//   let isOverlap = false

//   for (let i = 0; i < accList.length; i++) {
//     if (currList.indexOf(accList[i]) < 0) isOverlap = true
//   }

//   return isOverlap
// }
