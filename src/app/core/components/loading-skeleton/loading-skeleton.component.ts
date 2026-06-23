import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  templateUrl: './loading-skeleton.component.html',
  styleUrl: './loading-skeleton.component.scss'
})
export class LoadingSkeletonComponent {
  readonly rows = input(5);
  readonly columns = input([25, 30, 20, 15, 10]);

  getRows(): number[] {
    return Array(this.rows()).fill(0);
  }
}
