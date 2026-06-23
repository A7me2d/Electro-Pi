import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { CoursesService } from '../../services/courses.service';
import { CATEGORIES, STATUSES, Course } from '../../models/course.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent implements OnInit {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _toastr = inject(ToastrService);
  private _coursesService = inject(CoursesService);
  private _destroyRef = inject(DestroyRef);

  protected readonly categories = CATEGORIES;
  protected readonly statuses = STATUSES;
  protected isEditMode = signal(false);
  protected submitting = signal(false);
  private _courseId: string | null = null;

  protected courseForm = new FormGroup({
    course_name: new FormControl('', { validators: [Validators.required, Validators.minLength(3)], nonNullable: true }),
    instructor_name: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    category: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    duration: new FormControl('', { validators: [Validators.required, Validators.min(1)], nonNullable: true }),
    price: new FormControl('', { validators: [Validators.required, Validators.min(0)], nonNullable: true }),
    status: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    description: new FormControl('', { validators: [Validators.maxLength(500)] })
  });

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._courseId = id;
      this.isEditMode.set(true);
      this._coursesService.getCourseById(id).pipe(
        takeUntilDestroyed(this._destroyRef)
      ).subscribe({
        next: (course) => {
          if (course) {
            this.courseForm.patchValue({
              course_name: course.course_name,
              instructor_name: course.instructor_name,
              category: course.category,
              duration: String(course.duration),
              price: String(course.price),
              status: course.status,
              description: course.description || ''
            });
          }
        },
        error: () => this._toastr.error('Failed to load course', 'Error')
      });
    }
  }

  protected onSubmit(): void {
    if (this.courseForm.invalid) return;

    this.submitting.set(true);
    const formValue = this.courseForm.value;

    const courseData = {
      course_name: formValue.course_name || '',
      instructor_name: formValue.instructor_name || '',
      category: formValue.category as Course['category'],
      duration: Number(formValue.duration),
      price: Number(formValue.price),
      status: formValue.status as Course['status'],
      description: formValue.description || undefined
    };

    const request = this._courseId
      ? this._coursesService.updateCourse(this._courseId, courseData)
      : this._coursesService.createCourse(courseData);

    request.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: () => {
        this._toastr.success(
          this._courseId ? 'Course updated successfully!' : 'Course created successfully!',
          'Success'
        );
        this._router.navigate(['/courses']);
      },
      error: () => {
        this.submitting.set(false);
        this._toastr.error('Failed to save course', 'Error');
      }
    });
  }
}
