import { createAction } from "typesafe-actions"
import { IDonateState } from "./types"

export const DONATEDUSER = "store/reducers/donate.reducer/user"

export const updateDonatedUser = createAction(DONATEDUSER)<IDonateState>()
