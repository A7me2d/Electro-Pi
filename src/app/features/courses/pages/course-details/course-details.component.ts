import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/course.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { LoadingSkeletonComponent } from '../../../../core/components/loading-skeleton/loading-skeleton.component';
import { ErrorStateComponent } from '../../../../core/components/error-state/error-state.component';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatCardModule, MatButtonModule, StatusBadgeComponent, LoadingSkeletonComponent, ErrorStateComponent],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss'
})
export class CourseDetailsComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _coursesService = inject(CoursesService);
  private _destroyRef = inject(DestroyRef);

  protected readonly Number = Number;

  protected course = signal<Course | null>(null);
  protected loading = signal(true);
  protected error = signal(false);

  ngOnInit(): void {
    this.loadCourse();
  }

  loadCourse(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loading.set(true);
    this.error.set(false);

    this._coursesService.getCourseById(id).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (course) => {
        this.course.set(course);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
