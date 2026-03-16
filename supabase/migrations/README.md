# Admin Dashboard Migrations

This folder contains database migrations for the Mahz Skin admin dashboard feature.

## Migration Files

Run these migrations **in order** in your Supabase SQL Editor:

1. **001_user_profiles.sql** - Creates user_profiles table with admin support
2. **002_admin_helper_function.sql** - Creates `is_admin()` helper function for cleaner policies
3. **003_categories.sql** - Creates categories table for product organization
4. **004_products_update.sql** - Adds category_id, stock, and is_featured to products
5. **005_orders_update.sql** - Adds order_number and admin policies to orders
6. **006_order_items.sql** - Creates order_items table for normalized order structure
7. **007_storage_product_images.sql** - Creates storage bucket for product images

## How to Run

### Option 1: Run All at Once (Recommended for first-time setup)

Copy and paste all files in order into Supabase SQL Editor.

### Option 2: Run One by One (Recommended for debugging)

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `001_user_profiles.sql`
3. Click "Run"
4. Verify it worked (check Tables in sidebar)
5. Repeat for files 002-007

## Verification Queries

After running all migrations, verify everything worked:

```sql
-- Check admin users
SELECT email, up.is_admin 
FROM auth.users au
JOIN user_profiles up ON au.id = up.id
WHERE email IN ('mahzskinltd@gmail.com', 'desmondsolomon623@gmail.com');

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'categories', 'products', 'orders', 'order_items', 'cart_items', 'wishlist')
ORDER BY table_name;

-- Check storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'product-images';
```

## Key Features

### Admin Helper Function
All admin policies use the `is_admin()` function for cleaner, more maintainable code:

```sql
-- Instead of this (verbose):
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  )
)

-- We use this (clean):
USING (is_admin())
```

### Safe Migrations
- Uses `IF NOT EXISTS` to avoid errors if tables already exist
- Uses `ALTER TABLE ADD COLUMN IF NOT EXISTS` to safely add columns
- Migrates data from old `profiles` table if it exists
- Generates order numbers for existing orders

### Admin Emails
These emails have admin access:
- mahzskinltd@gmail.com
- desmondsolomon623@gmail.com

To add more admins later:
```sql
UPDATE user_profiles
SET is_admin = TRUE
WHERE id = (SELECT id FROM auth.users WHERE email = 'new-admin@example.com');
```

## Rollback (If Needed)

If you need to undo a migration, you can drop the specific table/function:

```sql
-- Example: Undo migration 003 (categories)
DROP TABLE IF EXISTS categories CASCADE;
```

⚠️ **Warning**: Only do this in development. In production, create a new migration to revert changes.

## Next Steps

After running these migrations:
1. Verify admin access works
2. Start building the admin dashboard UI
3. Test product/category/order management features
