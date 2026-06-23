import { Route } from '@angular/router';
import { CourseListComponent } from './pages/course-list/course-list.component';
import { CourseFormComponent } from './pages/course-form/course-form.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { courseExistsGuard } from '../../core/guards/course-exists.guard';

export default [
  { path: '', component: CourseListComponent, title: 'Courses' },
  { path: 'new', component: CourseFormComponent, title: 'Add Course' },
  { path: ':id', component: CourseDetailsComponent, title: 'Course Details', canActivate: [courseExistsGuard] },
  { path: ':id/edit', component: CourseFormComponent, title: 'Edit Course', canActivate: [courseExistsGuard] }
] as Route[];
