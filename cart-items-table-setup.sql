-- Create cart_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Enable Row Level Security
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for cart_items
-- Users can view their own cart
CREATE POLICY "Users can view their own cart"
  ON cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add to their own cart
CREATE POLICY "Users can add to their own cart"
  ON cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart
CREATE POLICY "Users can update their own cart"
  ON cart_items
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can remove from their own cart
CREATE POLICY "Users can remove from their own cart"
  ON cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
