export interface Course {
  id: string;
  course_name: string;
  instructor_name: string;
  category: 'Frontend' | 'Backend' | 'Design' | 'DevOps' | 'Mobile' | 'Data Science' | 'AI' | 'Other';
  duration: number;
  price: number;
  status: 'Active' | 'Draft' | 'Archived';
  description?: string;
  created_at: string;
}

export interface CourseFormData {
  course_name: string;
  instructor_name: string;
  category: string;
  duration: number;
  price: number;
  status: string;
  description?: string;
}

export interface CourseFilters {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
}

export const CATEGORIES = [
  'Frontend', 'Backend', 'Design', 'DevOps', 'Mobile', 'Data Science', 'AI', 'Other'
] as const;

export const STATUSES = ['Active', 'Draft', 'Archived'] as const;
