# Admin Dashboard MVP - Requirements Document

## Phase 1: Core Features Only

This document focuses on the **Minimum Viable Product (MVP)** - the essential features needed to launch a working admin dashboard.

## MVP Scope

### ✅ Included in MVP (Phase 1)
1. Admin Authentication
2. Dashboard Overview
3. Product Management (CRUD)
4. Category Management
5. Order Management
6. Image Upload

### ❌ Not in MVP (Future Phases)
- Customer management
- Inventory management
- Search & filters
- Data export
- Sales analytics
- Activity logs
- Real-time notifications
- Bulk operations
- Store settings

---

## Requirements

### Requirement 1: Admin Authentication

**User Story:** As a store owner, I want to log in securely to access the admin dashboard.

#### Acceptance Criteria
1. WHEN an unauthenticated user visits /admin, THE system SHALL redirect to /admin/login
2. THE login page SHALL have fields for email and password
3. WHEN valid credentials are entered, THE system SHALL authenticate using Supabase Auth
4. WHEN authentication succeeds, THE system SHALL redirect to /admin/dashboard
5. WHEN authentication fails, THE system SHALL display an error message
6. THE system SHALL check if the user has `is_admin = TRUE` in user_profiles table
7. WHEN a non-admin user tries to access /admin, THE system SHALL show "Unauthorized" message
8. THE admin dashboard SHALL have a logout button that ends the session

---

### Requirement 2: Dashboard Overview

**User Story:** As an admin, I want to see key metrics when I log in.

#### Acceptance Criteria
1. THE dashboard SHALL display total number of products
2. THE dashboard SHALL display total number of orders
3. THE dashboard SHALL display total number of categories
4. THE dashboard SHALL display total revenue (sum of all paid orders)
5. THE dashboard SHALL display a list of the 5 most recent orders
6. THE recent orders list SHALL show: order number, customer name, total, status, date
7. THE dashboard SHALL use the company color scheme (#F8E7DD background)
8. THE dashboard SHALL have a sidebar with navigation links

---

### Requirement 3: Product Management

**User Story:** As an admin, I want to add, edit, and delete products.

#### Acceptance Criteria

**View Products:**
1. THE products page SHALL display a table of all products
2. THE table SHALL show: image thumbnail, name, price, category, stock, actions
3. THE table SHALL display 20 products per page with pagination
4. THE products page SHALL have an "Add Product" button

**Add Product:**
5. WHEN "Add Product" is clicked, THE system SHALL show a form with these fields:
   - Product name (required, max 200 characters)
   - Description (required, max 1000 characters)
   - Price (required, positive decimal with 2 decimal places)
   - Category (required, dropdown from categories table)
   - Stock (required, non-negative integer)
   - Image (required, file upload)
6. WHEN the form is submitted with valid data, THE system SHALL create a new product record
7. WHEN the form has errors, THE system SHALL display specific error messages

**Edit Product:**
8. WHEN "Edit" is clicked on a product, THE system SHALL populate the form with existing data
9. WHEN the edit form is submitted, THE system SHALL update the product record
10. THE system SHALL update the `updated_at` timestamp

**Delete Product:**
11. WHEN "Delete" is clicked, THE system SHALL show a confirmation dialog
12. WHEN deletion is confirmed, THE system SHALL delete the product and its image from storage
13. THE system SHALL display a success message after deletion

---

### Requirement 4: Image Upload

**User Story:** As an admin, I want to upload product images with preview.

#### Acceptance Criteria
1. THE image upload field SHALL accept JPEG, PNG, and WebP formats only
2. THE system SHALL validate file size is less than 5MB
3. WHEN an image is selected, THE system SHALL display a preview before upload
4. WHEN the form is submitted, THE system SHALL upload the image to Supabase Storage bucket "product-images"
5. THE system SHALL generate a unique filename using UUID
6. THE system SHALL store the public image URL in the product's `image` field
7. WHEN upload fails, THE system SHALL display an error message
8. WHEN replacing an image, THE system SHALL delete the old image from storage
9. THE system SHALL show a loading indicator during upload

---

### Requirement 5: Category Management

**User Story:** As an admin, I want to organize products into categories.

#### Acceptance Criteria

**View Categories:**
1. THE categories page SHALL display a list of all categories
2. THE list SHALL show: category name, description, product count
3. THE categories page SHALL have an "Add Category" button

**Add Category:**
4. WHEN "Add Category" is clicked, THE system SHALL show a form with:
   - Category name (required, unique, max 100 characters)
   - Description (optional, max 500 characters)
5. WHEN the form is submitted, THE system SHALL create a new category
6. THE system SHALL generate a slug from the category name (lowercase, hyphens)
7. WHEN category name already exists, THE system SHALL show an error

**Edit Category:**
8. WHEN "Edit" is clicked, THE system SHALL populate the form with existing data
9. WHEN the form is submitted, THE system SHALL update the category
10. THE system SHALL update the slug if the name changed

**Delete Category:**
11. WHEN "Delete" is clicked, THE system SHALL check if products use this category
12. WHEN products exist in the category, THE system SHALL show error: "Cannot delete category with products"
13. WHEN no products exist, THE system SHALL delete the category after confirmation

---

### Requirement 6: Order Management

**User Story:** As an admin, I want to view orders and update their status.

#### Acceptance Criteria

**View Orders:**
1. THE orders page SHALL display a table of all orders
2. THE table SHALL show: order number, customer name, total, status, payment status, date
3. THE table SHALL display 25 orders per page with pagination
4. THE orders SHALL be sorted by date (newest first)

**View Order Details:**
5. WHEN an order is clicked, THE system SHALL display full order details:
   - Order number
   - Customer name, email, phone
   - Shipping address
   - Order items (product name, image, quantity, price, subtotal)
   - Total amount
   - Status
   - Payment status
   - Payment method
   - Order date
6. THE order details SHALL calculate total correctly: sum of (quantity × unit_price) for all items

**Update Order Status:**
7. THE order details page SHALL have a status dropdown with options:
   - Pending
   - Paid
   - Shipped
   - Delivered
   - Cancelled
8. WHEN status is changed, THE system SHALL update the order record
9. THE system SHALL update the `updated_at` timestamp
10. THE system SHALL display a success message after update

**Update Payment Status:**
11. THE order details page SHALL have a payment status dropdown with options:
   - Pending
   - Paid
   - Failed
   - Refunded
12. WHEN payment status is changed, THE system SHALL update the order record

---

## UI/UX Requirements

### Layout
1. THE admin dashboard SHALL have a sidebar navigation on the left
2. THE sidebar SHALL contain links to:
   - Dashboard
   - Products
   - Categories
   - Orders
   - Logout
3. THE sidebar SHALL highlight the current active page
4. THE main content area SHALL be on the right side
5. THE header SHALL display the admin user's name and logout button

### Colors
1. THE dashboard SHALL use #F8E7DD as the background color
2. THE dashboard SHALL use black/dark colors for primary elements
3. THE dashboard SHALL use existing Tailwind CSS color variables

### Responsive Design
1. THE dashboard SHALL work on desktop screens (1024px and above)
2. Mobile responsive design is NOT required for MVP

---

## Technical Requirements

### Technology Stack
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- Existing UI components from the project

### Security
1. ALL /admin routes SHALL require authentication
2. ALL database operations SHALL use Row Level Security (RLS)
3. ONLY users with `is_admin = TRUE` can access admin features
4. ALL form inputs SHALL be validated on both client and server
5. ALL file uploads SHALL validate file type and size

### Performance
1. THE dashboard SHALL load within 3 seconds on broadband
2. THE dashboard SHALL use pagination for all tables
3. THE dashboard SHALL display loading states while fetching data

---

## Correctness Properties (for Testing)

### Property 1: Order Total Calculation
FOR ALL orders, the total amount SHALL equal the sum of (quantity × unit_price) for all order items.

### Property 2: Stock Non-Negativity
FOR ALL stock updates, the resulting stock value SHALL be >= 0.

### Property 3: Admin Access Control
FOR ALL /admin routes, only authenticated users with `is_admin = TRUE` SHALL have access.

### Property 4: Image Upload Uniqueness
WHEN the same image is uploaded twice, only one copy SHALL exist in storage.

### Property 5: Category Name Uniqueness
FOR ALL categories, the name SHALL be unique (case-insensitive).

---

## Database Tables Required

See `database-schema.md` for complete schema.

**Core tables:**
- user_profiles (with is_admin field)
- products
- categories
- orders
- order_items

**Storage bucket:**
- product-images

---

## Out of Scope for MVP

These features will be added in future phases:

**Phase 2:**
- Customer management
- Inventory management
- Search & filter functionality
- Data export (CSV)

**Phase 3:**
- Sales analytics with charts
- Activity logs
- Real-time notifications
- Bulk operations
- Store settings

**Phase 4:**
- Mobile responsive design
- Performance optimization
- Advanced security features
