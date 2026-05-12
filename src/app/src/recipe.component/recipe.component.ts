import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ingredients, Recipe } from '../../../models/recipe.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-card',
  imports: [CommonModule],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent implements OnInit {
  @Input()  recipe!: Recipe;
  @Output() cardClick = new EventEmitter<Recipe>();
 
  totalTime = 0;
 
  readonly categoryDotColor: Record<string, string> = {
    meat:      '#E24B4A',
    oil:       '#97C459',
    vegetable: '#97C459',
    herb:      '#5DCAA5',
    fruit:     '#FAC775',
    condiment: '#888780',
    dairy:     '#85B7EB',
    spice:     '#EF9F27',
    grain:     '#FAC775',
    fish:      '#85B7EB',
    nut:       '#EF9F27',
    sweetener: '#F0997B',
    other:     '#888780',
  };
 
  readonly dietaryTagLabel: Record<string, string> = {
    gluten_free: 'Gluten free',
    nut_free:    'Nut free',
    halal:       'Halal',
    vegan:       'Vegan',
    vegetarian:  'Vegetarian',
    dairy_free:  'Dairy free',
  };
 
  readonly dietaryTagClass: Record<string, string> = {
    gluten_free: 'tag-green',
    nut_free:    'tag-green',
    halal:       'tag-blue',
    vegan:       'tag-teal',
    vegetarian:  'tag-teal',
    dairy_free:  'tag-blue',
  };
 
  ngOnInit(): void {
    this.totalTime = (this.recipe?.prep_time ?? 0) + (this.recipe?.cook_time ?? 0);
  }
 
  getDotColor(ingredient: Ingredients): string {
    return this.categoryDotColor[ingredient.category] ?? '#888780';
  }
 
  formatQuantity(qty: number): string {
    return qty % 1 === 0 ? qty.toString() : qty.toFixed(1);
  }
 
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
  }
 
  open(): void {
    this.cardClick.emit(this.recipe);
  }
}
