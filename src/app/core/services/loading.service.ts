import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _count = signal(0);
  readonly loading = computed(() => this._count() > 0);

  start(): void {
    this._count.update(c => c + 1);
  }

  stop(): void {
    this._count.update(c => Math.max(0, c - 1));
  }
}
