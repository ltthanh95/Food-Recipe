import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RecipeState } from "./recipe.reducer";

export const selectRecipeState = createFeatureSelector<RecipeState>('recipe');

export const selectRecipe = createSelector(
    selectRecipeState,
    (state) => state.recipe
)

export const selectRecipeLoading = createSelector(
    selectRecipeState,
    (state) => state.loading
)

export const selectRecipeError = createSelector(
    selectRecipeState,
    (state) => state.error
)