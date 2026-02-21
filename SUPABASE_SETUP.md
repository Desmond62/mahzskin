# Supabase Setup Guide

## ✅ What's Been Done

### 1. Installed Packages
- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/ssr` - Server-side rendering support

### 2. Environment Variables Added
```env
NEXT_PUBLIC_SUPABASE_URL=https://ejoruykrstamsnktozke.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Created Supabase Clients
- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server client
- `src/lib/supabase/auth.ts` - Authentication utilities

### 4. Created Auth Utilities
- `signInWithGoogle()` - Google OAuth sign-in
- `signInWithEmail()` - Email/password sign-in
- `signUpWithEmail()` - Email/password sign-up
- `signOut()` - Sign out user
- `getCurrentUser()` - Get current user
- `getSession()` - Get current session

### 5. Created Custom Hooks
- `src/hooks/use-supabase-auth.ts` - React hook for authentication state

### 6. Updated Middleware
- `middleware.ts` - Handles session refresh and protected routes

### 7. Created Auth Callback Route
- `src/app/auth/callback/route.ts` - Handles OAuth redirects

### 8. Updated Login Page
- Added Google Sign-in button with loading state
- Integrated Supabase authentication
- Error handling for auth failures

---

## 🔧 What You Need to Do Next

### Step 1: Configure Google OAuth in Supabase Dashboard

1. Go to your Supabase project: https://supabase.com/dashboard/project/ejoruykrstamsnktozke
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and enable it
4. You'll need Google OAuth credentials:

#### Create Google OAuth App:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add these URLs:
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
     - `https://your-production-domain.com` (when deployed)
   - **Authorized redirect URIs**:
     - `https://ejoruykrstamsnktozke.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback`
7. Copy **Client ID** and **Client Secret**

#### Add to Supabase:
1. Back in Supabase **Authentication** → **Providers** → **Google**
2. Paste **Client ID** and **Client Secret**
3. Click **Save**

### Step 2: Test Authentication

1. Start your development server:
   ```bash
   cd malzskin
   pnpm dev
   ```

2. Go to `http://localhost:3000/auth/login`
3. Click "Sign in with Google"
4. You should be redirected to Google sign-in
5. After signing in, you'll be redirected back to your app

---

## 📊 Next Steps: Database Tables

Once authentication is working, we need to create database tables for:

### 1. Profiles Table (extends auth.users)
```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  phone text,
  address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

### 2. Products Table
```sql
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  image text,
  category text,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Policy: Anyone can view products
create policy "Anyone can view products"
  on public.products for select
  to authenticated, anon
  using (true);
```

### 3. Cart Items Table
```sql
create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  quantity integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Enable RLS
alter table public.cart_items enable row level security;

-- Policies
create policy "Users can view own cart"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own cart items"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cart items"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete own cart items"
  on public.cart_items for delete
  using (auth.uid() = user_id);
```

### 4. Wishlist Table
```sql
create table public.wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Enable RLS
alter table public.wishlist enable row level security;

-- Policies
create policy "Users can view own wishlist"
  on public.wishlist for select
  using (auth.uid() = user_id);

create policy "Users can insert own wishlist items"
  on public.wishlist for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own wishlist items"
  on public.wishlist for delete
  using (auth.uid() = user_id);
```

### 5. Orders Table
```sql
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  total decimal(10,2) not null,
  status text not null default 'pending',
  shipping_address jsonb not null,
  items jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policies
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);
```

---

## 🔐 Security Best Practices

✅ **Already Implemented:**
- Environment variables for sensitive keys
- Row Level Security (RLS) policies in SQL above
- Server-side session management
- Protected routes via middleware

⚠️ **Remember:**
- Never expose service_role key on client
- Always use anon key on client-side
- Enable RLS on all tables
- Test policies thoroughly

---

## 📝 Testing Checklist

- [ ] Google OAuth configured in Supabase
- [ ] Google OAuth credentials added
- [ ] Can sign in with Google
- [ ] Can sign in with email/password
- [ ] Can sign up with email/password
- [ ] Can sign out
- [ ] Protected routes redirect to login
- [ ] Database tables created
- [ ] RLS policies working
- [ ] Cart syncs with Supabase
- [ ] Wishlist syncs with Supabase

---

## 🚀 Ready to Test!

Once you've configured Google OAuth in Supabase, let me know and I'll help you:
1. Create the database tables
2. Migrate existing localStorage data to Supabase
3. Update all components to use Supabase instead of localStorage
4. Test the complete authentication flow
