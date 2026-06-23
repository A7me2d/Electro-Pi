import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Course, CourseFilters, PaginatedResult } from '../models/course.model';
import { from, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private _supabase = inject(SupabaseService);

  getCourses(filters: CourseFilters = {}): Observable<PaginatedResult<Course>> {
    let query = this._supabase.client
      .from('courses')
      .select('*', { count: 'exact' });

    if (filters.search) {
      query = query.ilike('course_name', `%${filters.search}%`);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const rangeFrom = (page - 1) * pageSize;
    const rangeTo = rangeFrom + pageSize - 1;
    query = query.range(rangeFrom, rangeTo);

    return from(query).pipe(
      map(({ data, error, count }) => {
        if (error) throw error;
        return { data: (data as Course[]) || [], count: count || 0 };
      })
    );
  }

  getCourseById(id: string): Observable<Course | null> {
    return from(
      this._supabase.client.from('courses').select('*').eq('id', id).single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Course;
      })
    );
  }

  createCourse(course: Omit<Course, 'id' | 'created_at'>): Observable<Course> {
    return from(
      this._supabase.client.from('courses').insert(course).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Course;
      })
    );
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return from(
      this._supabase.client.from('courses').update(course).eq('id', id).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Course;
      })
    );
  }

  deleteCourse(id: string): Observable<void> {
    return from(
      this._supabase.client.from('courses').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}
