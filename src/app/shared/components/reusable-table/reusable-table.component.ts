import { Component, input, output, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LoadingSkeletonComponent } from '../../../core/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../core/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../core/components/error-state/error-state.component';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'status' | 'price';
}

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [NgTemplateOutlet, LoadingSkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss'
})
export class ReusableTableComponent {
  readonly columns = input.required<TableColumn[]>();
  readonly data = input<any[]>([]);
  readonly loading = input(false);
  readonly error = input(false);
  readonly errorMessage = input('An error occurred while loading courses.');
  readonly emptyMessage = input('Try adjusting your search or filter.');
  readonly sortBy = input<string>('');
  readonly sortOrder = input<'asc' | 'desc'>('desc');
  readonly actionsTemplate = input<TemplateRef<any>>();

  readonly sort = output<string>();
  readonly retry = output<void>();
  readonly addAction = output<void>();

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatPrice(price: number | string): string {
    return Number(price).toFixed(2);
  }
}
