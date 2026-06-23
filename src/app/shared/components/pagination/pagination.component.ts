import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  readonly currentPage = input(1);
  readonly totalItems = input(0);
  readonly pageSize = input(10);
  readonly pageSizeOptions = input([5, 10, 20, 50]);

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));
  protected readonly startItem = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  protected readonly endItem = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }
    return range;
  });

  protected onPageSizeChange(value: number): void {
    this.pageSizeChange.emit(value);
  }
}
