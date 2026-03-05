-- Create wishlist table if it doesn't exist
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON wishlist(product_id);

-- Enable Row Level Security
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlist
-- Users can view their own wishlist
CREATE POLICY "Users can view their own wishlist"
  ON wishlist
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add to their own wishlist
CREATE POLICY "Users can add to their own wishlist"
  ON wishlist
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove from their own wishlist
CREATE POLICY "Users can remove from their own wishlist"
  ON wishlist
  FOR DELETE
  USING (auth.uid() = user_id);
