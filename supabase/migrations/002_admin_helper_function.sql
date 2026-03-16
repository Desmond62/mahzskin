-- ============================================================================
-- Migration 002: Admin Helper Function
-- ============================================================================
-- Creates reusable is_admin() function to simplify RLS policies
-- This is a senior-level pattern for cleaner, more maintainable policies
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON FUNCTION is_admin() IS 'Returns true if the current user has admin privileges';
