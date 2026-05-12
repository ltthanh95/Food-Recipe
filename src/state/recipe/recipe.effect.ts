import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from "../../services/api-services";
import { catchError, map, mergeMap, of } from 'rxjs';
import { loadRecipe, loadRecipeFailure, loadRecipeSuccess } from "./recipe.action";
@Injectable()
export class RecipeEffects{
    private actions$ = inject(Actions);
    private apiService = inject(ApiService)

    loadRecipe$ = createEffect(() =>
        this.actions$.pipe(
                ofType(loadRecipe),
                mergeMap(() =>
                    this.apiService.getAPI().pipe(
                        map((recipe) =>loadRecipeSuccess({recipe: recipe.data})),
                        catchError((error) => 
                        of(loadRecipeFailure({
                            error:error.message || 'Failed to load songs'
                        })))
                    )
            )
        )
    )
}