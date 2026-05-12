import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { selectRecipe, selectRecipeError, selectRecipeLoading } from '../state/recipe/recipe.selector';
import { loadRecipe } from '../state/recipe/recipe.action';
import { RecipeModalComponent } from './src/recipe-modal.component/recipe-modal.component';
import { RecipeComponent } from './src/recipe.component/recipe.component';
import { DietaryTag, Difficulty, MealType, Recipe } from '../models/recipe.model';

export type SortOption = 'default' | 'calories_asc' | 'calories_desc' | 'time_asc' | 'name_az';

export interface SidebarFilters {
  search: string;
  mealTypes: MealType[];
  difficulties: Difficulty[];
  dietaryTags: DietaryTag[];
  maxTime: number;
  sort: SortOption;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule, RecipeComponent, RecipeModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private store = inject(Store);

  // ── NgRx streams
  recipe$   = this.store.select(selectRecipe);
  loading$  = this.store.select(selectRecipeLoading);
  error$    = this.store.select(selectRecipeError);

  // ── UI state
  sidebarOpen    = signal(true);
  selectedRecipe = signal<Recipe | null>(null);

  openModal(recipe: Recipe): void { this.selectedRecipe.set(recipe); }
  closeModal(): void { this.selectedRecipe.set(null); }

  filters = signal<SidebarFilters>({
    search:      '',
    mealTypes:   [],
    difficulties:[],
    dietaryTags: [],
    maxTime:     180,
    sort: 'default',
  });

  // ── Static option lists ───────────────────────────────────────────────────
  readonly mealTypeOptions: { value: MealType; label: string; icon: string }[] = [
    { value: 'main',    label: 'Main',    icon: 'ti-bowl-chopsticks' },
    { value: 'starter', label: 'Starter', icon: 'ti-salad'    },
    { value: 'dessert', label: 'Dessert', icon: 'ti-ice-cream'},
    { value: 'side',    label: 'Side',    icon: 'ti-apple'    },
    { value: 'snack',   label: 'Snack',   icon: 'ti-cookie'   },
  ];

  readonly difficultyOptions: { value: Difficulty; label: string; color: string }[] = [
    { value: 'easy',   label: 'Easy',   color: '#3b6d11' },
    { value: 'medium', label: 'Medium', color: '#854f0b' },
    { value: 'hard',   label: 'Hard',   color: '#a32d2d' },
  ];

  readonly dietaryOptions: { value: DietaryTag; label: string; icon: string }[] = [
    { value: 'gluten_free', label: 'Gluten Free', icon: 'ti-wheat-off'   },
    { value: 'nut_free',    label: 'Nut Free',    icon: 'ti-nut'  },
    { value: 'halal',label: 'Halal',icon: 'ti-check'},
    { value: 'vegan',label: 'Vegan',icon: 'ti-leaf' },
    { value: 'vegetarian',  label: 'Vegetarian',  icon: 'ti-salad'},
    { value: 'dairy_free',  label: 'Dairy Free',  icon: 'ti-droplet-off' },
  ];

  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default',label: 'Default' },
    { value: 'name_az',label: 'Name A→Z'},
    { value: 'calories_asc',  label: 'Calories ↑'     },
    { value: 'calories_desc', label: 'Calories ↓'     },
    { value: 'time_asc',      label: 'Quickest first' },
  ];

  //  Lifecycle 
  ngOnInit(): void {
    this.store.dispatch(loadRecipe());
  }

  //  Sidebar actions 
  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  toggleMealType(val: MealType): void {
    this.filters.update(f => ({
      ...f,
      mealTypes: f.mealTypes.includes(val)
 ? f.mealTypes.filter(x => x !== val)
 : [...f.mealTypes, val],
    }));
  }

  toggleDifficulty(val: Difficulty): void {
    this.filters.update(f => ({
      ...f,
      difficulties: f.difficulties.includes(val)
 ? f.difficulties.filter(x => x !== val)
 : [...f.difficulties, val],
    }));
  }

  toggleDietary(val: DietaryTag): void {
    this.filters.update(f => ({
      ...f,
      dietaryTags: f.dietaryTags.includes(val)
 ? f.dietaryTags.filter(x => x !== val)
 : [...f.dietaryTags, val],
    }));
  }

  setSort(val: SortOption): void {
    this.filters.update(f => ({ ...f, sort: val }));
  }

  updateSearch(val: string): void {
    this.filters.update(f => ({ ...f, search: val }));
  }

  updateMaxTime(val: number): void {
    this.filters.update(f => ({ ...f, maxTime: val }));
  }

  clearFilters(): void {
    this.filters.set({
      search: '', mealTypes: [], difficulties: [],
      dietaryTags: [], maxTime: 180, sort: 'default',
    });
  }

  hasActiveFilters(): boolean {
    const f = this.filters();
    return (
      f.search !== '' ||
      f.mealTypes.length > 0    ||
      f.difficulties.length > 0 ||
      f.dietaryTags.length > 0  ||
      f.maxTime < 180
    );
  }

  // ── Filter + sort
  applyFilters(recipes: Recipe[]): Recipe[] {
    const f = this.filters();
    let result = [...recipes];

    if (f.search) {
      const q = f.search.toLowerCase();
      result = result.filter(
 r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
      );
    }
    if (f.mealTypes.length)
      result = result.filter(r => f.mealTypes.includes(r.meal_type));
    if (f.difficulties.length)
      result = result.filter(r => f.difficulties.includes(r.difficulty));
    if (f.dietaryTags.length)
      result = result.filter(r => f.dietaryTags.every(t => r.dietary_tags.includes(t)));

    result = result.filter(r => r.prep_time + r.cook_time <= f.maxTime);

    switch (f.sort) {
      case 'name_az':result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'calories_asc':  result.sort((a, b) => a.calories_per_serving - b.calories_per_serving); break;
      case 'calories_desc': result.sort((a, b) => b.calories_per_serving - a.calories_per_serving); break;
      case 'time_asc':      result.sort((a, b) => (a.prep_time + a.cook_time) - (b.prep_time + b.cook_time)); break;
    }
    return result;
  }
}