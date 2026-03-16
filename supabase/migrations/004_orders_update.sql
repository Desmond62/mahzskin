-- ============================================================================
-- Migration 005: Orders Table Updates
-- ============================================================================
-- Adds admin features to existing orders table:
-- - Adds order_number for tracking
-- - Renames total to total_amount for consistency
-- - Adds admin view/update policies
-- ============================================================================

-- Add order_number column if it doesn't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_number TEXT;

-- Generate order numbers for existing orders that don't have one
UPDATE orders 
SET order_number = 'ORD-' || 
  LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0') || '-' || 
  SUBSTRING(id::TEXT, 1, 8)
WHERE order_number IS NULL;

-- Make order_number unique and not null
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number_unique ON orders(order_number);
ALTER TABLE orders 
ALTER COLUMN order_number SET NOT NULL;

-- Rename total to total_amount if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'total'
  ) THEN
    ALTER TABLE orders RENAME COLUMN total TO total_amount;
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Drop old admin policies if they exist
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- Add admin policies using the is_admin() helper function
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (is_admin());
