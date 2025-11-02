/*
  # Add Profile Fields

  ## Changes
  - Add phone field to student_profiles
  - Add graduation_year field to student_profiles  
  - Add current_education field to student_profiles
  - Add bio field to student_profiles

  ## Purpose
  Enhanced student profile with additional information fields for better career matching
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'student_profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE student_profiles ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'student_profiles' AND column_name = 'graduation_year'
  ) THEN
    ALTER TABLE student_profiles ADD COLUMN graduation_year text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'student_profiles' AND column_name = 'current_education'
  ) THEN
    ALTER TABLE student_profiles ADD COLUMN current_education text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'student_profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE student_profiles ADD COLUMN bio text;
  END IF;
END $$;
