import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { countReducer } from '../state/count/count.reducer';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../interceptors/auth-interceptor';
import { recipeReducer } from '../state/recipe/recipe.reducer';
import { provideEffects } from '@ngrx/effects';
import { RecipeEffects } from '../state/recipe/recipe.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({
      count: countReducer,
      recipe: recipeReducer,
    }),
    provideEffects([RecipeEffects]),
  ],
};
