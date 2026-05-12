import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../../models/recipe.model";
import { loadRecipe, loadRecipeFailure, loadRecipeSuccess } from "./recipe.action";

export interface RecipeState{
    recipe: Recipe[];
    loading:boolean;
    error: Error | null
}

export const initialState: RecipeState = {
    recipe: [],
    loading:false,
    error: null
}

export const recipeReducer = createReducer(
    initialState,
    on(loadRecipe,(state) =>({
        ...state,
        loading: true,
        error: null
    })),

    on(loadRecipeSuccess, (state, {recipe}) => ({
        ...state,
        recipe,
        loading:false
    })),
    on(loadRecipeFailure, (state, {error}) => ({
        ...state,
        loading:false,
        error: error
    }))
)