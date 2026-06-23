import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      {
        path: 'courses',
        loadChildren: () => import('./features/courses/courses.routes')
      }
    ]
  },
  { path: '**', redirectTo: 'courses' }
];
