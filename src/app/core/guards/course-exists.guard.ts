import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CoursesService } from '../../features/courses/services/courses.service';
import { map } from 'rxjs';

export const courseExistsGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(CoursesService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  if (!id) return router.parseUrl('/courses');
  return service.getCourseById(id).pipe(
    map(course => course ? true : router.parseUrl('/courses'))
  );
};
