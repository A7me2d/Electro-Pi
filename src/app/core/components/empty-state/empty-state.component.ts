import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  readonly icon = input('inbox');
  readonly title = input('No Data');
  readonly message = input('There are no items to display.');
  readonly showAction = input(false);
  readonly actionLabel = input('Add New');
  readonly action = output<void>();
}
