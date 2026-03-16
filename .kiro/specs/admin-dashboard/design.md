# Admin Dashboard MVP - Design Document

## Overview

The admin dashboard is a secure, server-side rendered web application that enables store administrators to manage products, categories, and orders for the MalzSkin e-commerce platform. Built with Next.js 16 App Router, the dashboard provides a clean, efficient interface for core administrative tasks.

### Goals
- Provide secure authentication and authorization for admin users
- Enable CRUD operations for products, categories, and orders
- Display key business metrics and recent activity
- Support image upload and management for products
- Maintain data integrity through validation and constraints

### Non-Goals (Future Phases)
- Customer management interface
- Advanced analytics and reporting
- Mobile responsive design
- Real-time notifications
- Bulk operations
- Search and filtering

### Technology Stack
- **Framework**: Next.js 16 with App Router (React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI primitives (existing in project)

---

## Architecture

### High-Level Architecture


```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Admin Dashboard UI                        │  │
│  │  ┌─────────────┐  ┌──────────────────────────────┐   │  │
│  │  │   Sidebar   │  │     Main Content Area        │   │  │
│  │  │             │  │  - Dashboard                  │   │  │
│  │  │ - Dashboard │  │  - Products Table/Forms       │   │  │
│  │  │ - Products  │  │  - Categories List/Forms      │   │  │
│  │  │ - Categories│  │  - Orders Table/Details       │   │  │
│  │  │ - Orders    │  │                               │   │  │
│  │  │ - Logout    │  │                               │   │  │
│  │  └─────────────┘  └──────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Middleware Layer                          │  │
│  │  - Session validation                                  │  │
│  │  - Admin role verification                             │  │
│  │  - Route protection                                    │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Server Components/Actions                    │  │
│  │  - Authentication logic                                │  │
│  │  - Data fetching                                       │  │
│  │  - Form submissions                                    │  │
│  │  - Image upload handling                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                                │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Auth       │  │  PostgreSQL  │  │    Storage      │   │
│  │              │  │              │  │                 │   │
│  │ - Sessions   │  │ - Products   │  │ - Product       │   │
│  │ - Users      │  │ - Categories │  │   Images        │   │
│  │ - Admin      │  │ - Orders     │  │                 │   │
│  │   Roles      │  │ - Order Items│  │                 │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Route Structure

```
/admin
├── /login                    # Public: Admin login page
└── /dashboard               # Protected: Admin dashboard root
    ├── (overview)           # Dashboard metrics and recent orders
    ├── /products            # Product management
    │   ├── (list)          # Products table
    │   ├── /new            # Add product form
    │   └── /[id]/edit      # Edit product form
    ├── /categories          # Category management
    │   ├── (list)          # Categories list
    │   ├── /new            # Add category form
    │   └── /[id]/edit      # Edit category form
    └── /orders              # Order management
        ├── (list)          # Orders table
        └── /[id]           # Order details
```

### Data Flow

**Authentication Flow:**
1. User visits `/admin/*` route
2. Middleware checks for valid session
3. If no session → redirect to `/admin/login`
4. If session exists → verify `is_admin = true` in user_profiles
5. If not admin → show "Unauthorized" error
6. If admin → allow access to route

**CRUD Operations Flow:**
1. User interacts with form (create/update) or button (delete)
2. Client-side validation (React Hook Form + Zod)
3. Server Action receives validated data
4. Server Action performs database operation via Supabase client
5. RLS policies enforce admin-only access
6. Success/error response returned to client
7. UI updates with feedback message
8. Data refetches to show updated state

**Image Upload Flow:**
1. User selects image file
2. Client validates file type and size
3. Preview displayed to user
4. On form submit, image uploaded to Supabase Storage
5. UUID-based filename generated
6. Public URL returned and stored in product record
7. Old image deleted if replacing existing

---

## Components and Interfaces

### Layout Components

#### AdminLayout
**Purpose**: Provides consistent layout structure for all admin pages

**Props**:
```typescript
interface AdminLayoutProps {
  children: React.ReactNode
}
```

**Structure**:
- Fixed sidebar navigation (left)
- Header with user info and logout (top)
- Main content area (right)
- Background color: #F8E7DD


#### Sidebar
**Purpose**: Navigation menu for admin sections

**Props**:
```typescript
interface SidebarProps {
  currentPath: string
}
```

**Features**:
- Navigation links: Dashboard, Products, Categories, Orders
- Active state highlighting
- Logout button at bottom
- Company logo at top

#### Header
**Purpose**: Top bar with user context

**Props**:
```typescript
interface HeaderProps {
  userName: string
  userEmail: string
}
```

**Features**:
- Display admin user name
- Logout button
- Page title

### Page Components

#### LoginPage (`/admin/login`)
**Purpose**: Admin authentication

**Features**:
- Email input field
- Password input field
- Submit button
- Error message display
- Redirect to dashboard on success

**Server Actions**:
```typescript
async function loginAdmin(formData: FormData): Promise<{
  success: boolean
  error?: string
}>
```

#### DashboardPage (`/admin/dashboard`)
**Purpose**: Overview of key metrics and recent activity

**Features**:
- Metric cards (4 cards in grid):
  - Total Products
  - Total Orders
  - Total Categories
  - Total Revenue
- Recent Orders table (5 most recent)
- Each metric card shows icon, label, and value

**Data Fetching**:
```typescript
async function getDashboardMetrics(): Promise<{
  totalProducts: number
  totalOrders: number
  totalCategories: number
  totalRevenue: number
  recentOrders: Order[]
}>
```

#### ProductsPage (`/admin/dashboard/products`)
**Purpose**: Product listing and management

**Features**:
- Products table with columns:
  - Image thumbnail (60x60px)
  - Name
  - Price
  - Category
  - Stock
  - Actions (Edit, Delete buttons)
- Pagination (20 per page)
- "Add Product" button
- Delete confirmation dialog

**Data Fetching**:
```typescript
async function getProducts(page: number): Promise<{
  products: Product[]
  totalCount: number
  totalPages: number
}>
```

#### ProductFormPage (`/admin/dashboard/products/new` and `/admin/dashboard/products/[id]/edit`)
**Purpose**: Create or edit product

**Form Fields**:
```typescript
interface ProductFormData {
  name: string          // required, max 200 chars
  description: string   // required, max 1000 chars
  price: number        // required, positive, 2 decimals
  category_id: string  // required, UUID
  stock: number        // required, >= 0
  image: File          // required for new, optional for edit
}
```

**Validation Schema** (Zod):
```typescript
const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  price: z.number().positive().multipleOf(0.01),
  category_id: z.string().uuid(),
  stock: z.number().int().min(0),
  image: z.instanceof(File).optional()
})
```

**Features**:
- Image preview
- Image upload with progress indicator
- Form validation with error messages
- Cancel button
- Submit button

**Server Actions**:
```typescript
async function createProduct(data: ProductFormData): Promise<{
  success: boolean
  error?: string
  productId?: string
}>

async function updateProduct(id: string, data: ProductFormData): Promise<{
  success: boolean
  error?: string
}>
```


#### CategoriesPage (`/admin/dashboard/categories`)
**Purpose**: Category listing and management

**Features**:
- Categories list with:
  - Category name
  - Description
  - Product count
  - Actions (Edit, Delete buttons)
- "Add Category" button
- Delete confirmation with dependency check

**Data Fetching**:
```typescript
async function getCategories(): Promise<{
  categories: CategoryWithCount[]
}>

interface CategoryWithCount extends Category {
  product_count: number
}
```

#### CategoryFormPage (`/admin/dashboard/categories/new` and `/admin/dashboard/categories/[id]/edit`)
**Purpose**: Create or edit category

**Form Fields**:
```typescript
interface CategoryFormData {
  name: string         // required, unique, max 100 chars
  description: string  // optional, max 500 chars
}
```

**Validation Schema**:
```typescript
const categorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional()
})
```

**Features**:
- Auto-generate slug from name
- Uniqueness validation
- Form validation with error messages

**Server Actions**:
```typescript
async function createCategory(data: CategoryFormData): Promise<{
  success: boolean
  error?: string
  categoryId?: string
}>

async function updateCategory(id: string, data: CategoryFormData): Promise<{
  success: boolean
  error?: string
}>

async function deleteCategory(id: string): Promise<{
  success: boolean
  error?: string
}>
```

#### OrdersPage (`/admin/dashboard/orders`)
**Purpose**: Order listing

**Features**:
- Orders table with columns:
  - Order number
  - Customer name
  - Total amount
  - Status badge
  - Payment status badge
  - Date
  - Actions (View button)
- Pagination (25 per page)
- Sorted by date (newest first)

**Data Fetching**:
```typescript
async function getOrders(page: number): Promise<{
  orders: Order[]
  totalCount: number
  totalPages: number
}>
```

#### OrderDetailsPage (`/admin/dashboard/orders/[id]`)
**Purpose**: View and update order details

**Features**:
- Order information section:
  - Order number
  - Order date
  - Customer name, email, phone
  - Shipping address
- Order items table:
  - Product image
  - Product name
  - Quantity
  - Unit price
  - Subtotal
- Order summary:
  - Total amount
- Status controls:
  - Status dropdown (Pending, Paid, Shipped, Delivered, Cancelled)
  - Payment status dropdown (Pending, Paid, Failed, Refunded)
  - Update button

**Data Fetching**:
```typescript
async function getOrderDetails(id: string): Promise<{
  order: Order
  items: OrderItem[]
}>
```

**Server Actions**:
```typescript
async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentStatus: PaymentStatus
): Promise<{
  success: boolean
  error?: string
}>
```

### Shared Components

#### Table
**Purpose**: Reusable table component

**Props**:
```typescript
interface TableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  onRowClick?: (row: T) => void
}
```

#### Pagination
**Purpose**: Reusable pagination controls

**Props**:
```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
```

#### MetricCard
**Purpose**: Dashboard metric display

**Props**:
```typescript
interface MetricCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
}
```

#### ImageUpload
**Purpose**: Image upload with preview

**Props**:
```typescript
interface ImageUploadProps {
  value?: string
  onChange: (file: File) => void
  onRemove: () => void
  maxSize?: number  // default 5MB
  acceptedFormats?: string[]  // default ['image/jpeg', 'image/png', 'image/webp']
}
```

#### StatusBadge
**Purpose**: Display order status with color coding

**Props**:
```typescript
interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus
  variant: 'order' | 'payment'
}
```

---

## Data Models

### TypeScript Interfaces

```typescript
// User Profile
interface UserProfile {
  id: string
  full_name: string | null
  phone: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

// Product
interface Product {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  stock: number
  image: string
  in_stock: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

// Category
interface Category {
  id: string
  name: string
  description: string | null
  slug: string
  created_at: string
  updated_at: string
}

// Order
interface Order {
  id: string
  order_number: string
  user_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: ShippingAddress
  total_amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: string | null
  payment_reference: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// Order Item
interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string | null
  quantity: number
  unit_price: number
  subtotal: number
  created_at: string
}

// Supporting Types
interface ShippingAddress {
  street: string
  city: string
  state: string
  postal_code: string
  country: string
}

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
```


### Database Queries

#### Authentication Queries

```typescript
// Check if user is admin
async function isUserAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()
  
  return data?.is_admin ?? false
}
```

#### Dashboard Queries

```typescript
// Get dashboard metrics
async function getDashboardMetrics() {
  const [products, orders, categories, revenue, recentOrders] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount').eq('payment_status', 'paid'),
    supabase.from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
  ])
  
  const totalRevenue = revenue.data?.reduce((sum, order) => sum + order.total_amount, 0) ?? 0
  
  return {
    totalProducts: products.count ?? 0,
    totalOrders: orders.count ?? 0,
    totalCategories: categories.count ?? 0,
    totalRevenue,
    recentOrders: recentOrders.data ?? []
  }
}
```

#### Product Queries

```typescript
// Get paginated products
async function getProducts(page: number, pageSize: number = 20) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  
  const { data, count } = await supabase
    .from('products')
    .select('*, categories(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  
  return {
    products: data ?? [],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize)
  }
}

// Get single product
async function getProduct(id: string) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  return data
}

// Create product
async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()
  
  return { data, error }
}

// Update product
async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

// Delete product
async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  return { error }
}
```

#### Category Queries

```typescript
// Get all categories with product count
async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select(`
      *,
      products:products(count)
    `)
    .order('name')
  
  return data?.map(cat => ({
    ...cat,
    product_count: cat.products[0]?.count ?? 0
  })) ?? []
}

// Create category
async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single()
  
  return { data, error }
}

// Update category
async function updateCategory(id: string, updates: Partial<Category>) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

// Delete category (with dependency check)
async function deleteCategory(id: string) {
  // Check for products using this category
  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id)
  
  if (count && count > 0) {
    return { error: { message: 'Cannot delete category with products' } }
  }
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  
  return { error }
}
```

#### Order Queries

```typescript
// Get paginated orders
async function getOrders(page: number, pageSize: number = 25) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  
  const { data, count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  
  return {
    orders: data ?? [],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize)
  }
}

// Get order with items
async function getOrderDetails(id: string) {
  const [orderResult, itemsResult] = await Promise.all([
    supabase.from('orders').select('*').eq('id', id).single(),
    supabase.from('order_items').select('*').eq('order_id', id)
  ])
  
  return {
    order: orderResult.data,
    items: itemsResult.data ?? []
  }
}

// Update order status
async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  paymentStatus: PaymentStatus
) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, payment_status: paymentStatus })
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}
```

#### Storage Operations

```typescript
// Upload product image
async function uploadProductImage(file: File): Promise<{ url: string | null, error: any }> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)
  
  if (uploadError) {
    return { url: null, error: uploadError }
  }
  
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)
  
  return { url: data.publicUrl, error: null }
}

// Delete product image
async function deleteProductImage(imageUrl: string) {
  // Extract file path from URL
  const fileName = imageUrl.split('/').pop()
  if (!fileName) return
  
  await supabase.storage
    .from('product-images')
    .remove([fileName])
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Admin Access Control

*For any* authenticated user attempting to access any `/admin/*` route (except `/admin/login`), access SHALL be granted if and only if the user has `is_admin = TRUE` in the user_profiles table.

**Validates: Requirements 1.6, 1.7**

### Property 2: Authentication Error Handling

*For any* invalid credentials submitted to the login form, the system SHALL display an error message and SHALL NOT grant access to the admin dashboard.

**Validates: Requirements 1.5**

### Property 3: Order Total Calculation

*For any* order with order items, the order's `total_amount` SHALL equal the sum of `subtotal` for all associated order_items, where each `subtotal = quantity × unit_price`.

**Validates: Requirements 2.4, 6.6**

### Property 4: Dashboard Metrics Accuracy

*For any* database state, the dashboard metrics SHALL accurately reflect:
- Total products = count of all records in products table
- Total orders = count of all records in orders table
- Total categories = count of all records in categories table
- Total revenue = sum of `total_amount` for all orders where `payment_status = 'paid'`

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 5: Recent Orders Sorting

*For any* set of orders in the database, the dashboard's recent orders list SHALL display exactly the 5 most recent orders sorted by `created_at` in descending order (newest first).

**Validates: Requirements 2.5, 6.4**

### Property 6: Table Field Completeness

*For any* entity displayed in a table (product, category, or order), all required fields specified in the requirements SHALL be present in the rendered table row.

**Validates: Requirements 3.2, 5.2, 6.2**

### Property 7: Pagination Correctness

*For any* paginated list with N total items and page size P, page number X SHALL display items from index `(X-1) * P` to `min(X * P - 1, N-1)`, and the total number of pages SHALL equal `ceil(N / P)`.

**Validates: Requirements 3.3, 6.3**

### Property 8: Product CRUD Operations

*For any* valid product data:
- Creating a product SHALL result in a new record in the products table with all provided fields
- Updating a product SHALL modify only the specified fields and update the `updated_at` timestamp
- Deleting a product SHALL remove the record and its associated image from storage

**Validates: Requirements 3.6, 3.9, 3.10, 3.12**

### Property 9: Form Validation

*For any* form submission with invalid data (missing required fields, exceeding max length, negative values where positive required), the system SHALL reject the submission and display specific error messages for each validation failure.

**Validates: Requirements 3.7**

### Property 10: Edit Form Population

*For any* existing entity (product, category, or order), clicking the edit action SHALL populate the form with all current field values from the database.

**Validates: Requirements 3.8, 5.8**

### Property 11: Image Upload Validation

*For any* file selected for upload:
- Files with MIME types other than `image/jpeg`, `image/png`, or `image/webp` SHALL be rejected
- Files larger than 5MB SHALL be rejected
- Valid files SHALL display a preview before upload

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 12: Image Upload Uniqueness

*For any* image uploaded to Supabase Storage, the filename SHALL be generated using a UUID, ensuring uniqueness even if the same file is uploaded multiple times.

**Validates: Requirements 4.5**

### Property 13: Image Replacement Cleanup

*For any* product image replacement operation, the old image file SHALL be deleted from Supabase Storage before or after the new image is uploaded, preventing orphaned files.

**Validates: Requirements 4.8**

### Property 14: Category Slug Generation

*For any* category name, the generated slug SHALL be the lowercase version of the name with spaces replaced by hyphens and special characters removed.

**Validates: Requirements 5.6**

### Property 15: Category Name Uniqueness

*For any* category creation or update, if a category with the same name (case-insensitive) already exists, the operation SHALL fail with an error message indicating the name must be unique.

**Validates: Requirements 5.7**

### Property 16: Category Slug Update

*For any* category name change, the slug SHALL be regenerated from the new name following the slug generation rules.

**Validates: Requirements 5.10**

### Property 17: Category Deletion Constraint

*For any* category deletion attempt:
- If products exist with `category_id` matching the category being deleted, the deletion SHALL fail with error "Cannot delete category with products"
- If no products reference the category, the deletion SHALL succeed

**Validates: Requirements 5.11, 5.12, 5.13**

### Property 18: Order Status Update

*For any* order and any valid status change (to 'pending', 'paid', 'shipped', 'delivered', or 'cancelled'), the order record SHALL be updated with the new status and the `updated_at` timestamp SHALL be updated to the current time.

**Validates: Requirements 6.8, 6.9**

### Property 19: Payment Status Update

*For any* order and any valid payment status change (to 'pending', 'paid', 'failed', or 'refunded'), the order record SHALL be updated with the new payment status.

**Validates: Requirements 6.12**

### Property 20: Stock Non-Negativity

*For any* product stock update operation, the resulting stock value SHALL be greater than or equal to zero.

**Validates: MVP Requirements - Property 2**

---

## Error Handling

### Client-Side Error Handling

**Form Validation Errors**:
- Display inline error messages below each invalid field
- Highlight invalid fields with red border
- Prevent form submission until all errors are resolved
- Use Zod schema validation with React Hook Form

**Network Errors**:
- Display toast notification for failed API calls
- Show retry button for transient failures
- Maintain form state to prevent data loss

**File Upload Errors**:
- Validate file type and size before upload attempt
- Display specific error messages:
  - "File type not supported. Please upload JPEG, PNG, or WebP."
  - "File size exceeds 5MB limit."
  - "Upload failed. Please try again."

### Server-Side Error Handling

**Authentication Errors**:
- Invalid credentials → "Invalid email or password"
- Non-admin user → "Unauthorized. Admin access required."
- Session expired → Redirect to login with message

**Database Errors**:
- Unique constraint violation → "A record with this name already exists"
- Foreign key constraint → "Cannot delete. This item is referenced by other records."
- Connection error → "Database connection failed. Please try again."

**Storage Errors**:
- Upload failure → "Image upload failed. Please try again."
- Delete failure → Log error but don't block operation
- Invalid file → "Invalid image file"

**Validation Errors**:
- Return structured error object with field-specific messages
- HTTP 400 status code
- Format: `{ field: string, message: string }[]`

### Error Logging

- Log all server-side errors to console (development)
- Include error context: user ID, operation, timestamp
- Do not expose sensitive information in client error messages

---

## Testing Strategy

### Dual Testing Approach

The admin dashboard will use both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Unit Testing

**Focus Areas**:
- Specific authentication flows (valid login, invalid login, logout)
- UI component rendering (forms, tables, buttons exist)
- Specific CRUD operations with known data
- Edge cases (empty lists, single item, boundary values)
- Error conditions (network failures, validation errors)

**Tools**:
- Jest for test runner
- React Testing Library for component testing
- MSW (Mock Service Worker) for API mocking

**Example Unit Tests**:
```typescript
describe('LoginPage', () => {
  it('should redirect to dashboard on successful login', async () => {
    // Test specific successful login flow
  })
  
  it('should display error message on invalid credentials', async () => {
    // Test specific error case
  })
})

describe('ProductForm', () => {
  it('should show validation error for empty name', async () => {
    // Test specific validation case
  })
})
```


### Property-Based Testing

**Focus Areas**:
- Universal properties that hold for all inputs
- Calculation correctness (order totals, revenue)
- Data integrity (uniqueness, constraints)
- Access control across all routes
- Pagination logic for any dataset size

**Tools**:
- **fast-check** (JavaScript/TypeScript property-based testing library)
- Minimum 100 iterations per property test
- Each test tagged with reference to design document property

**Configuration**:
```typescript
import fc from 'fast-check'

// Configure all property tests to run minimum 100 iterations
const propertyTestConfig = { numRuns: 100 }
```

**Test Tagging Format**:
```typescript
/**
 * Feature: admin-dashboard, Property 3: Order Total Calculation
 * For any order with order items, the order's total_amount SHALL equal 
 * the sum of subtotal for all associated order_items
 */
test('order total equals sum of item subtotals', () => {
  fc.assert(
    fc.property(
      fc.array(orderItemArbitrary),
      (items) => {
        const calculatedTotal = items.reduce(
          (sum, item) => sum + item.quantity * item.unit_price,
          0
        )
        const order = createOrderFromItems(items)
        expect(order.total_amount).toBe(calculatedTotal)
      }
    ),
    propertyTestConfig
  )
})
```

**Property Test Examples**:

```typescript
// Property 3: Order Total Calculation
/**
 * Feature: admin-dashboard, Property 3: Order Total Calculation
 */
test('order total calculation is correct', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        quantity: fc.integer({ min: 1, max: 100 }),
        unit_price: fc.float({ min: 0.01, max: 1000, noNaN: true })
      })),
      (items) => {
        const expectedTotal = items.reduce(
          (sum, item) => sum + item.quantity * item.unit_price,
          0
        )
        const order = calculateOrderTotal(items)
        expect(order.total_amount).toBeCloseTo(expectedTotal, 2)
      }
    ),
    propertyTestConfig
  )
})

// Property 7: Pagination Correctness
/**
 * Feature: admin-dashboard, Property 7: Pagination Correctness
 */
test('pagination returns correct items for any page', () => {
  fc.assert(
    fc.property(
      fc.array(fc.string()),
      fc.integer({ min: 1, max: 50 }),
      fc.integer({ min: 1, max: 10 }),
      (items, pageSize, pageNumber) => {
        const result = paginate(items, pageSize, pageNumber)
        const expectedStart = (pageNumber - 1) * pageSize
        const expectedEnd = Math.min(pageNumber * pageSize, items.length)
        const expectedItems = items.slice(expectedStart, expectedEnd)
        
        expect(result.items).toEqual(expectedItems)
        expect(result.totalPages).toBe(Math.ceil(items.length / pageSize))
      }
    ),
    propertyTestConfig
  )
})

// Property 11: Image Upload Validation
/**
 * Feature: admin-dashboard, Property 11: Image Upload Validation
 */
test('image upload rejects invalid file types', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(
        'application/pdf',
        'text/plain',
        'video/mp4',
        'application/zip'
      ),
      fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
      (mimeType, fileSize) => {
        const file = createMockFile(mimeType, fileSize)
        const result = validateImageUpload(file)
        
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
          expect(result.valid).toBe(false)
          expect(result.error).toContain('File type not supported')
        }
      }
    ),
    propertyTestConfig
  )
})

// Property 14: Category Slug Generation
/**
 * Feature: admin-dashboard, Property 14: Category Slug Generation
 */
test('category slug generation is consistent', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 1, maxLength: 100 }),
      (categoryName) => {
        const slug = generateSlug(categoryName)
        
        // Slug should be lowercase
        expect(slug).toBe(slug.toLowerCase())
        
        // Slug should not contain spaces
        expect(slug).not.toContain(' ')
        
        // Slug should be idempotent
        expect(generateSlug(slug)).toBe(slug)
      }
    ),
    propertyTestConfig
  )
})

// Property 20: Stock Non-Negativity
/**
 * Feature: admin-dashboard, Property 20: Stock Non-Negativity
 */
test('stock updates maintain non-negativity', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 1000 }),
      fc.integer({ min: -100, max: 100 }),
      (initialStock, adjustment) => {
        const result = updateStock(initialStock, adjustment)
        
        if (initialStock + adjustment < 0) {
          // Should reject update
          expect(result.success).toBe(false)
        } else {
          // Should accept update
          expect(result.success).toBe(true)
          expect(result.newStock).toBeGreaterThanOrEqual(0)
        }
      }
    ),
    propertyTestConfig
  )
})
```

### Integration Testing

**Focus Areas**:
- End-to-end user flows
- Database operations with real Supabase instance (test environment)
- File upload to Supabase Storage
- Authentication flow with Supabase Auth

**Tools**:
- Playwright for E2E testing
- Supabase test project

**Example Integration Tests**:
- Complete product creation flow (login → navigate → fill form → upload image → submit → verify)
- Order status update flow
- Category deletion with dependency check

### Test Coverage Goals

- Unit tests: 80% code coverage
- Property tests: All 20 correctness properties implemented
- Integration tests: All critical user flows covered
- Each correctness property has exactly one property-based test

---

## Security

### Authentication & Authorization

**Middleware Protection**:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Protect all /admin routes except /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const supabase = createServerClient(...)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Check admin status
    const isAdmin = await isUserAdmin(user.id)
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  return NextResponse.next()
}
```

**Server Action Protection**:
```typescript
async function protectedAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const isAdmin = await isUserAdmin(user.id)
  if (!isAdmin) {
    throw new Error('Admin access required')
  }
  
  // Proceed with action
}
```

### Row Level Security (RLS)

All database tables have RLS policies enforcing:
- Public read access for products and categories
- Admin-only write access for products and categories
- User can view own orders
- Admin can view and update all orders

See `database-schema.md` for complete RLS policies.

### Input Validation

**Client-Side**:
- Zod schemas for all forms
- Type checking with TypeScript
- File type and size validation before upload

**Server-Side**:
- Re-validate all inputs in Server Actions
- Sanitize user inputs
- Use parameterized queries (Supabase handles this)

### File Upload Security

- Validate MIME type on server
- Validate file size on server
- Generate random filenames (UUID) to prevent path traversal
- Store in isolated Supabase Storage bucket
- Public read access only for product-images bucket
- Admin-only write access via RLS policies

### Environment Variables

Required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Never expose service role key to client.

---

## Performance Considerations

### Data Fetching

- Use React Server Components for initial data fetching
- Minimize client-side JavaScript
- Fetch only required fields in queries
- Use pagination for large datasets

### Image Optimization

- Store images in Supabase Storage with public CDN
- Use Next.js Image component for automatic optimization
- Compress images before upload (client-side)
- Thumbnail generation for table views (60x60px)

### Caching Strategy

- Server Components cache by default
- Revalidate data after mutations using `revalidatePath()`
- No client-side caching for admin data (always fresh)

### Database Optimization

- Indexes on frequently queried columns (see database-schema.md)
- Limit query results with pagination
- Use `select` to fetch only needed columns
- Batch operations where possible

### Loading States

- Show skeleton loaders for tables
- Show spinner for form submissions
- Show progress indicator for image uploads
- Disable buttons during async operations

---

## UI/UX Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header (h-16, bg-white, border-b)                          │
│  [Logo] Admin Dashboard                    [User] [Logout]  │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│ Sidebar  │  Main Content Area                               │
│ (w-64)   │  (flex-1, p-8, bg-[#F8E7DD])                    │
│          │                                                   │
│ • Dash   │  [Page Title]                                    │
│ • Prod   │                                                   │
│ • Cat    │  [Content: Tables, Forms, Cards]                 │
│ • Orders │                                                   │
│          │                                                   │
│ [Logout] │                                                   │
│          │                                                   │
└──────────┴──────────────────────────────────────────────────┘
```

### Color Scheme

- **Background**: #F8E7DD (warm beige)
- **Primary**: Black/Dark gray for text and primary elements
- **Sidebar**: White background
- **Cards**: White background with subtle shadow
- **Borders**: Light gray (#E5E7EB)
- **Status badges**:
  - Pending: Yellow
  - Paid/Delivered: Green
  - Cancelled/Failed: Red
  - Shipped: Blue

### Typography

- **Font**: System font stack (default Next.js)
- **Headings**: Bold, larger sizes
- **Body**: Regular weight, readable size (16px base)
- **Labels**: Semibold, smaller size

### Component Styling

**Buttons**:
- Primary: Black background, white text
- Secondary: White background, black border
- Danger: Red background, white text
- Disabled: Gray background, gray text

**Forms**:
- Input fields: White background, gray border, rounded corners
- Labels: Above inputs, semibold
- Error messages: Red text, below inputs
- Required indicator: Red asterisk

**Tables**:
- Header: Light gray background, bold text
- Rows: White background, hover effect
- Borders: Light gray
- Actions: Icon buttons (Edit, Delete, View)

**Cards** (Dashboard metrics):
- White background
- Rounded corners
- Subtle shadow
- Icon, label, and value
- Grid layout (2x2 on desktop)

### Responsive Design

MVP focuses on desktop only (1024px and above). Mobile responsive design is planned for Phase 4.

---

## Implementation Notes

### File Structure

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx              # AdminLayout wrapper
│       ├── login/
│       │   └── page.tsx            # LoginPage
│       └── dashboard/
│           ├── page.tsx            # DashboardPage
│           ├── products/
│           │   ├── page.tsx        # ProductsPage
│           │   ├── new/
│           │   │   └── page.tsx    # ProductFormPage (create)
│           │   └── [id]/
│           │       └── edit/
│           │           └── page.tsx # ProductFormPage (edit)
│           ├── categories/
│           │   ├── page.tsx        # CategoriesPage
│           │   ├── new/
│           │   │   └── page.tsx    # CategoryFormPage (create)
│           │   └── [id]/
│           │       └── edit/
│           │           └── page.tsx # CategoryFormPage (edit)
│           └── orders/
│               ├── page.tsx        # OrdersPage
│               └── [id]/
│                   └── page.tsx    # OrderDetailsPage
├── components/
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── MetricCard.tsx
│       ├── Table.tsx
│       ├── Pagination.tsx
│       ├── ImageUpload.tsx
│       ├── StatusBadge.tsx
│       └── forms/
│           ├── ProductForm.tsx
│           └── CategoryForm.tsx
├── lib/
│   ├── admin/
│   │   ├── auth.ts              # Admin auth utilities
│   │   ├── products.ts          # Product queries
│   │   ├── categories.ts        # Category queries
│   │   ├── orders.ts            # Order queries
│   │   ├── dashboard.ts         # Dashboard queries
│   │   └── storage.ts           # Image upload utilities
│   └── validations/
│       ├── product.ts           # Product Zod schema
│       └── category.ts          # Category Zod schema
└── types/
    └── admin.ts                 # Admin-specific TypeScript types
```

### Development Phases

**Phase 1: Setup & Authentication** (Week 1)
- Database schema setup
- Middleware configuration
- Login page
- Admin layout structure

**Phase 2: Dashboard & Products** (Week 2)
- Dashboard metrics
- Products listing
- Product CRUD forms
- Image upload

**Phase 3: Categories & Orders** (Week 3)
- Categories management
- Orders listing
- Order details and status updates

**Phase 4: Testing & Polish** (Week 4)
- Unit tests
- Property-based tests
- Integration tests
- Bug fixes and refinements

### Dependencies

All required dependencies are already in package.json:
- `@supabase/ssr` and `@supabase/supabase-js` for Supabase
- `react-hook-form` and `@hookform/resolvers` for forms
- `zod` for validation
- `@radix-ui/*` for UI primitives
- `lucide-react` for icons

Additional dependency needed:
- `fast-check` for property-based testing (dev dependency)

---

## Appendix

### Glossary

- **RLS**: Row Level Security - PostgreSQL feature for row-level access control
- **Server Component**: React component that renders on the server
- **Server Action**: Server-side function callable from client components
- **UUID**: Universally Unique Identifier
- **CRUD**: Create, Read, Update, Delete operations

### References

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [fast-check](https://fast-check.dev/)
- [Radix UI](https://www.radix-ui.com/)

### Related Documents

- `requirements-mvp.md` - Feature requirements
- `database-schema.md` - Database schema and RLS policies
- `requirements.md` - Full requirements (all phases)

