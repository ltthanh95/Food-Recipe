import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CountState } from "./count.reducer";

//count is same to app config
const selectCounterState = createFeatureSelector<CountState>('count')

export const selectCount = createSelector(
    selectCounterState,
    (state) => state.val
)