import { finalize, type MonoTypeOperatorFunction, Observable } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';

export function trackLoading<T>(loadingService: LoadingService): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    loadingService.start();
    return source.pipe(finalize(() => loadingService.stop()));
  };
}
