import { createClient } from './client';

const ADMIN_EMAILS = ['mahzskinltd@gmail.com', 'desmondsolomon623@gmail.com'];

export async function checkIsAdmin(): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  // First try reading from user_profiles
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  console.log('Admin check - email:', user.email);
  console.log('Admin check - profile:', profile);
  console.log('Admin check - error:', error);

  if (!error && profile) {
    return profile.is_admin === true;
  }

  // Fallback: if RLS blocks the query, check email directly
  // This ensures admins can always access the dashboard
  if (error) {
    console.log('Admin check - falling back to email check due to RLS error');
    return ADMIN_EMAILS.includes(user.email || '');
  }

  return false;
}

export async function requireAdmin() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) throw new Error('Unauthorized: Admin access required');
  return true;
}
