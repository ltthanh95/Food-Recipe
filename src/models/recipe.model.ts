export interface Ingredients {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    optional: boolean;
}
export type MealType = 'main' | 'starter' | 'dessert' | 'side' | 'snack';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type DietaryTag = 'gluten_free' | 'nut_free' | 'halal' | 'vegan' | 'vegetarian' | 'dairy_free';
 
export interface Recipe {
  id: number;
  name: string;
  description: string;
  difficulty: Difficulty;
  meal_type: MealType;
  cuisine: string;
  dietary_tags: DietaryTag[];
  servings: number;
  prep_time: number;
  cook_time: number;
  calories_per_serving: number;
  protein: number;
  instructions: string[];
  ingredients: Ingredients[];
}
 
