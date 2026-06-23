import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (_loadingService.loading()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div
          class="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"
        ></div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  protected readonly _loadingService = inject(LoadingService);
}
