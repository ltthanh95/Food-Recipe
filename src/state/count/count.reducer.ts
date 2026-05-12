import { createReducer, on } from "@ngrx/store"
import { countDecreasement, countIncreasement } from "./count.action"

export interface CountState {
    val: number
}

export const initialState: CountState = {
    val: 0
}

export const countReducer = createReducer (
    initialState,
    on(countIncreasement, (state) => ({
        ...state,
        val : state.val+1
    })),

    on(countDecreasement, (state) => ({
        ...state,
        val : state.val-1
    })),


)