-- ============================================
-- Course Management Dashboard - Supabase Schema
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_name VARCHAR(255) NOT NULL,
  instructor_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('Frontend', 'Backend', 'Design', 'DevOps', 'Mobile', 'Data Science', 'AI', 'Other')),
  duration NUMERIC NOT NULL CHECK (duration > 0),
  price NUMERIC NOT NULL CHECK (price >= 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Draft', 'Archived')),
  description TEXT CHECK (char_length(description) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for public" ON courses
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_courses_status ON courses (status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses (category);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_course_name_search ON courses USING gin(to_tsvector('simple', course_name));

INSERT INTO courses (course_name, instructor_name, category, duration, price, status, description, created_at) VALUES
  ('Angular Fundamentals', 'Ahmed Ali', 'Frontend', 20, 1500, 'Active', 'Complete Angular course covering components, services, routing, and forms.', '2026-06-01'),
  ('React Basics', 'Sara Hassan', 'Frontend', 18, 1200, 'Draft', 'Introduction to React library for building user interfaces.', '2026-06-02'),
  ('Node.js Masterclass', 'Mohamed Kamel', 'Backend', 25, 2000, 'Active', 'Deep dive into Node.js, Express, and REST APIs.', '2026-05-28'),
  ('UI/UX Design Principles', 'Nour El-Deen', 'Design', 15, 1000, 'Archived', 'Learn the fundamentals of user interface and user experience design.', '2026-05-15'),
  ('Python for Data Science', 'Dalia Youssef', 'Data Science', 30, 2500, 'Active', 'Python programming for data analysis and machine learning.', '2026-06-10'),
  ('Docker & Kubernetes', 'Khaled Mostafa', 'DevOps', 22, 1800, 'Active', 'Containerization with Docker and orchestration with Kubernetes.', '2026-06-05'),
  ('Flutter Mobile Development', 'Mona Refaat', 'Mobile', 28, 2200, 'Draft', 'Build cross-platform mobile apps with Flutter and Dart.', '2026-06-12'),
  ('Machine Learning A-Z', 'Omar Sherif', 'AI', 35, 3000, 'Active', 'Comprehensive machine learning course from basics to advanced.', '2026-05-20'),
  ('Vue.js Essentials', 'Laila Mahmoud', 'Frontend', 16, 1100, 'Draft', 'Learn Vue.js framework and build reactive web applications.', '2026-06-08'),
  ('Spring Boot Microservices', 'Amr El-Din', 'Backend', 32, 2800, 'Active', 'Building microservices with Spring Boot and Spring Cloud.', '2026-04-01')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION search_courses(search_term TEXT)
RETURNS SETOF courses AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM courses
  WHERE 
    course_name ILIKE '%' || search_term || '%'
    OR instructor_name ILIKE '%' || search_term || '%'
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;
