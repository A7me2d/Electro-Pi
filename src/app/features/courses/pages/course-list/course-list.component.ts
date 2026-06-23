import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CoursesService } from '../../services/courses.service';
import { Course, CourseFilters, STATUSES } from '../../models/course.model';
import { ReusableTableComponent, TableColumn } from '../../../../shared/components/reusable-table/reusable-table.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { listAnimation } from '../../../../shared/animations/animations';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    MatDialogModule, MatIconModule, MatFormFieldModule,
    MatSelectModule, MatButtonModule,
    ReusableTableComponent, SearchInputComponent, PaginationComponent
  ],
  animations: [listAnimation],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private _coursesService = inject(CoursesService);
  private _destroyRef = inject(DestroyRef);

  protected readonly statuses = STATUSES;
  protected readonly columns: TableColumn[] = [
    { key: 'course_name', label: 'Course Name', sortable: true, width: '25%' },
    { key: 'instructor_name', label: 'Instructor', sortable: true, width: '18%' },
    { key: 'category', label: 'Category', width: '12%' },
    { key: 'duration', label: 'Duration (hrs)', sortable: true, width: '12%' },
    { key: 'price', label: 'Price', sortable: true, width: '10%', type: 'price' },
    { key: 'status', label: 'Status', width: '10%', type: 'status' },
  ];

  protected courses = signal<Course[]>([]);
  protected loading = signal(false);
  protected error = signal(false);
  protected totalCount = signal(0);
  protected page = signal(1);
  protected pageSize = signal(10);
  protected searchTerm = signal('');
  protected statusFilter = signal<string | null>(null);
  protected sortBy = signal('created_at');
  protected sortOrder = signal<'asc' | 'desc'>('desc');
  protected readonly tableData = signal<any[]>([]);

  private _searchSubject = new Subject<string>();

  ngOnInit(): void {
    this._searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(term => {
      this.searchTerm.set(term);
      this.page.set(1);
      this.loadCourses();
    });
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    this.error.set(false);

    const filters: CourseFilters = {
      search: this.searchTerm() || undefined,
      status: this.statusFilter() || undefined,
      page: this.page(),
      pageSize: this.pageSize(),
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder()
    };

    this._coursesService.getCourses(filters).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (result) => {
        this.courses.set(result.data);
        this.totalCount.set(result.count);
        this.tableData.set(result.data.map(course => ({
          ...course,
          duration: `${course.duration}h`
        })));
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this._snackBar.open('Failed to load courses', 'Close', { duration: 3000, panelClass: 'snackbar-error' });
      }
    });
  }

  onSearch(term: string): void {
    this._searchSubject.next(term);
  }

  onStatusFilter(value: string): void {
    this.statusFilter.set(value || null);
    this.page.set(1);
    this.loadCourses();
  }

  onSort(key: string): void {
    if (this.sortBy() === key) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(key);
      this.sortOrder.set('asc');
    }
    this.loadCourses();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadCourses();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
    this.loadCourses();
  }

  viewCourse(course: Course): void {
    this._router.navigate(['/courses', course.id]);
  }

  editCourse(course: Course): void {
    this._router.navigate(['/courses', course.id, 'edit']);
  }

  deleteCourse(course: Course): void {
    const dialogRef = this._dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(result => {
      if (result) {
        this._coursesService.deleteCourse(course.id).pipe(
          takeUntilDestroyed(this._destroyRef)
        ).subscribe({
          next: () => {
            this._snackBar.open('Course deleted successfully!', 'Close', { duration: 3000, panelClass: 'snackbar-success' });
            this.loadCourses();
          },
          error: () => this._snackBar.open('Failed to delete course', 'Close', { duration: 3000, panelClass: 'snackbar-error' })
        });
      }
    });
  }

  onAddCourse(): void {
    this._router.navigate(['/courses/new']);
  }
}
