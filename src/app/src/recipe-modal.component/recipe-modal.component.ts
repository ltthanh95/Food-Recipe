import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe ,Ingredients} from '../../../models/recipe.model';


@Component({
  selector: 'app-recipe-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss'],
})
export class RecipeModalComponent implements OnChanges {
  @Input()  recipe: Recipe | null = null;
  @Output() close = new EventEmitter<void>();

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

  ngOnChanges(): void {
    this.totalTime = (this.recipe?.prep_time ?? 0) + (this.recipe?.cook_time ?? 0);
    // prevent body scroll when modal open
    document.body.style.overflow = this.recipe ? 'hidden' : '';
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

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}