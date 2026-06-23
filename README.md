# Course Management Dashboard

A modern Angular application for managing educational courses with Supabase backend.

## Technologies Used

- **Angular 22** (Standalone Components, Signals, Control Flow)
- **Supabase** (Backend as a Service)
- **Angular Material** (Form fields, selects, buttons, cards, icons, dialogs)
- **Tailwind CSS v3** (Utility-first styling)
- **RxJS** (Reactive Programming)
- **ngx-toastr** (Notifications)

## Features

- ✅ Course listing with search, filter, sort, and pagination
- ✅ Add new course with reactive form validation
- ✅ Edit existing course
- ✅ Delete course with confirmation dialog
- ✅ Course details page
- ✅ Responsive design (mobile + desktop)
- ✅ Loading skeletons for better UX
- ✅ Toast notifications for all actions
- ✅ Empty & error states
- ✅ Reusable table component
- ✅ Lazy-loaded routes
- ✅ Route guard for course details/edit
- ✅ Deferred loading

## Prerequisites

- Node.js 18+
- Angular CLI 22+
- A Supabase account (free tier)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL in `supabase-schema.sql`
3. Copy your project URL and anon key from Settings > API
4. Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

### 3. Run the Application

```bash
ng serve
```

Navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── components/       # Layout, navbar, footer, loading-skeleton
│   │   │                    # confirm-dialog, error-state, empty-state
│   │   ├── guards/           # Route guards
│   │   └── services/         # Supabase client service
│   ├── features/
│   │   └── courses/
│   │       ├── models/       # Course interface
│   │       ├── pages/        # Course-list, course-form, course-details
│   │       └── services/     # Courses CRUD service
│   ├── shared/
│   │   ├── components/       # Search-input, status-badge, pagination, table
│   │   └── animations/       # Reusable animations
│   ├── app.component.ts
│   └── app.routes.ts
├── environments/
└── supabase-schema.sql
```

## Component Highlights

### Angular Material Integration
- **Form fields**: `mat-form-field` with `matInput`, `mat-select`, `textarea` across all forms
- **Buttons**: `mat-raised-button`, `mat-stroked-button`, `mat-icon-button`, `mat-button`
- **Cards**: `mat-card` for course details layout
- **Icons**: `mat-icon` with Material icons throughout
- **Dialogs**: `MatDialog` for delete confirmation
- **Selects**: `mat-select` with `mat-option` for status filter and form dropdowns

## Data Source

This application uses **Supabase** (PostgreSQL) as its backend. All CRUD operations are performed through the Supabase REST API.

### Database Schema

The `courses` table contains the following fields:
- `id` (UUID, primary key)
- `course_name` (varchar, required)
- `instructor_name` (varchar, required)
- `category` (varchar: Frontend, Backend, Design, DevOps, Mobile, Data Science, AI, Other)
- `duration` (numeric, > 0)
- `price` (numeric, >= 0)
- `status` (varchar: Active, Draft, Archived)
- `description` (text, max 500 chars)
- `created_at` (timestamptz, auto-generated)

## Bonus Features

- Pagination with page size selector
- Sorting by column
- Confirmation dialog (Material Dialog)
- Toast notifications
- Lazy-loaded routes with guard
- Reusable table component
- Loading skeleton
- Empty & error states
- Responsive design
- Search with debounce
