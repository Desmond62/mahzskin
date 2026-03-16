# Admin Dashboard MVP - Implementation Tasks

## Overview
This document outlines the implementation tasks for the Admin Dashboard MVP. Tasks are organized by feature area and should be completed in the order listed to maintain dependencies.

---

## Phase 1: Setup & Authentication

### Task 1: Database Setup
Set up the database schema and initial data in Supabase.

#### Subtasks:
- [ ] 1.1 Create `user_profiles` table with RLS policies
- [ ] 1.2 Create `categories` table with RLS policies and indexes
- [ ] 1.3 Create `orders` table with RLS policies and indexes
- [ ] 1.4 Create `order_items` table with RLS policies and indexes
- [ ] 1.5 Create `product-images` storage bucket with RLS policies
- [ ] 1.6 Create `update_updated_at_column()` function and triggers
- [ ] 1.7 Insert sample categories data
- [ ] 1.8 Update user_profiles to set `is_admin = TRUE` for admin users

**Acceptance Criteria:**
- All tables exist with correct columns and constraints
- RLS policies enforce admin-only access for write operations
- Indexes are created for performance
- Storage bucket is configured for public read, admin write
- At least one admin user exists in user_profiles

---

### Task 2: Admin Authentication Middleware
Implement middleware to protect admin routes and verify admin access.

#### Subtasks:
- [ ] 2.1 Create middleware.ts to protect `/admin/*` routes (except `/admin/login`)
- [ ] 2.2 Implement session validation using Supabase Auth
- [ ] 2.3 Implement admin role verification (check `is_admin = TRUE`)
- [ ] 2.4 Add redirect to `/admin/login` for unauthenticated users
- [ ] 2.5 Add redirect to `/unauthorized` for non-admin users

**Acceptance Criteria:**
- Unauthenticated users cannot access `/admin/*` routes
- Non-admin users cannot access `/admin/*` routes
- Admin users can access all `/admin/*` routes
- Redirects work correctly

---

### Task 3: Admin Login Page
Create the admin login page with authentication.

#### Subtasks:
- [ ] 3.1 Create `/admin/login/page.tsx` with email and password fields
- [ ] 3.2 Implement login form with React Hook Form and Zod validation
- [ ] 3.3 Create server action for admin login using Supabase Auth
- [ ] 3.4 Add error handling and display error messages
- [ ] 3.5 Redirect to `/admin/dashboard` on successful login
- [ ] 3.6 Style login page with company colors (#F8E7DD background)

**Acceptance Criteria:**
- Login form validates email and password
- Valid credentials authenticate successfully
- Invalid credentials show error message
- Non-admin users see "Unauthorized" message
- Successful login redirects to dashboard

---

### Task 4: Admin Layout Structure
Create the admin layout with sidebar and header.

#### Subtasks:
- [ ] 4.1 Create `/admin/layout.tsx` with AdminLayout component
- [ ] 4.2 Create `Sidebar` component with navigation links
- [ ] 4.3 Create `Header` component with user info and logout button
- [ ] 4.4 Implement logout functionality
- [ ] 4.5 Add active state highlighting for current page
- [ ] 4.6 Style layout with company colors

**Acceptance Criteria:**
- Sidebar displays navigation links: Dashboard, Products, Categories, Orders
- Header displays admin user name and logout button
- Active page is highlighted in sidebar
- Logout button ends session and redirects to login
- Layout uses #F8E7DD background color

---

## Phase 2: Dashboard & Products

### Task 5: Dashboard Overview Page
Create the dashboard overview with metrics and recent orders.

#### Subtasks:
- [ ] 5.1 Create `/admin/dashboard/page.tsx`
- [ ] 5.2 Create `MetricCard` component for displaying metrics
- [ ] 5.3 Implement `getDashboardMetrics()` query function
- [ ] 5.4 Display total products, orders, categories, and revenue
- [ ] 5.5 Display 5 most recent orders in a table
- [ ] 5.6 Style dashboard with metric cards in 2x2 grid

**Acceptance Criteria:**
- Dashboard displays 4 metric cards with correct values
- Recent orders table shows 5 most recent orders
- Metrics are calculated correctly from database
- Dashboard loads within 3 seconds

---

### Task 6: Products Listing Page
Create the products listing page with table and pagination.

#### Subtasks:
- [ ] 6.1 Create `/admin/dashboard/products/page.tsx`
- [ ] 6.2 Create reusable `Table` component
- [ ] 6.3 Create `Pagination` component
- [ ] 6.4 Implement `getProducts()` query function with pagination
- [ ] 6.5 Display products table with image, name, price, category, stock, actions
- [ ] 6.6 Add "Add Product" button linking to `/admin/dashboard/products/new`
- [ ] 6.7 Add Edit and Delete action buttons for each product
- [ ] 6.8 Implement delete confirmation dialog
- [ ] 6.9 Implement product deletion with image cleanup

**Acceptance Criteria:**
- Products table displays all required columns
- Pagination shows 20 products per page
- Add Product button navigates to form
- Edit button navigates to edit form
- Delete button shows confirmation and removes product
- Product image is deleted from storage on product deletion

---

### Task 7: Product Form (Create & Edit)
Create the product form for adding and editing products.

#### Subtasks:
- [ ] 7.1 Create `/admin/dashboard/products/new/page.tsx`
- [ ] 7.2 Create `/admin/dashboard/products/[id]/edit/page.tsx`
- [ ] 7.3 Create `ProductForm` component with all fields
- [ ] 7.4 Create Zod validation schema for product
- [ ] 7.5 Create `ImageUpload` component with preview
- [ ] 7.6 Implement image validation (type, size)
- [ ] 7.7 Implement `createProduct()` server action
- [ ] 7.8 Implement `updateProduct()` server action
- [ ] 7.9 Implement `uploadProductImage()` storage function
- [ ] 7.10 Implement `deleteProductImage()` storage function
- [ ] 7.11 Add form validation error messages
- [ ] 7.12 Add loading states for form submission and image upload
- [ ] 7.13 Redirect to products list on successful save

**Acceptance Criteria:**
- Form has all required fields: name, description, price, category, stock, image
- Form validates all inputs with specific error messages
- Image upload accepts only JPEG, PNG, WebP under 5MB
- Image preview displays before upload
- Create form saves new product with image
- Edit form populates with existing data
- Edit form updates product and replaces image if changed
- Old image is deleted when replaced

---

## Phase 3: Categories & Orders

### Task 8: Categories Listing Page
Create the categories listing page.

#### Subtasks:
- [ ] 8.1 Create `/admin/dashboard/categories/page.tsx`
- [ ] 8.2 Implement `getCategories()` query function with product count
- [ ] 8.3 Display categories list with name, description, product count, actions
- [ ] 8.4 Add "Add Category" button linking to `/admin/dashboard/categories/new`
- [ ] 8.5 Add Edit and Delete action buttons for each category
- [ ] 8.6 Implement delete confirmation with dependency check
- [ ] 8.7 Implement category deletion with constraint validation

**Acceptance Criteria:**
- Categories list displays all required fields
- Product count is accurate for each category
- Add Category button navigates to form
- Edit button navigates to edit form
- Delete button checks for products and shows error if products exist
- Delete succeeds if no products reference the category

---

### Task 9: Category Form (Create & Edit)
Create the category form for adding and editing categories.

#### Subtasks:
- [ ] 9.1 Create `/admin/dashboard/categories/new/page.tsx`
- [ ] 9.2 Create `/admin/dashboard/categories/[id]/edit/page.tsx`
- [ ] 9.3 Create `CategoryForm` component with name and description fields
- [ ] 9.4 Create Zod validation schema for category
- [ ] 9.5 Implement `generateSlug()` utility function
- [ ] 9.6 Implement `createCategory()` server action with slug generation
- [ ] 9.7 Implement `updateCategory()` server action with slug update
- [ ] 9.8 Add uniqueness validation for category name
- [ ] 9.9 Add form validation error messages
- [ ] 9.10 Redirect to categories list on successful save

**Acceptance Criteria:**
- Form has name and description fields
- Form validates name is required and unique
- Slug is auto-generated from name (lowercase, hyphens)
- Create form saves new category with slug
- Edit form populates with existing data
- Edit form updates category and regenerates slug if name changed
- Duplicate name shows error message

---

### Task 10: Orders Listing Page
Create the orders listing page with table and pagination.

#### Subtasks:
- [ ] 10.1 Create `/admin/dashboard/orders/page.tsx`
- [ ] 10.2 Create `StatusBadge` component for order and payment status
- [ ] 10.3 Implement `getOrders()` query function with pagination
- [ ] 10.4 Display orders table with order number, customer, total, status, payment status, date, actions
- [ ] 10.5 Add View action button for each order
- [ ] 10.6 Sort orders by date (newest first)
- [ ] 10.7 Implement pagination (25 per page)

**Acceptance Criteria:**
- Orders table displays all required columns
- Status badges show correct colors for each status
- Pagination shows 25 orders per page
- Orders are sorted by date (newest first)
- View button navigates to order details

---

### Task 11: Order Details Page
Create the order details page with status update.

#### Subtasks:
- [ ] 11.1 Create `/admin/dashboard/orders/[id]/page.tsx`
- [ ] 11.2 Implement `getOrderDetails()` query function
- [ ] 11.3 Display order information (number, date, customer, address)
- [ ] 11.4 Display order items table with product, quantity, price, subtotal
- [ ] 11.5 Display order summary with total amount
- [ ] 11.6 Add status dropdown with all valid statuses
- [ ] 11.7 Add payment status dropdown with all valid statuses
- [ ] 11.8 Implement `updateOrderStatus()` server action
- [ ] 11.9 Add Update button to save status changes
- [ ] 11.10 Verify order total equals sum of item subtotals

**Acceptance Criteria:**
- Order details display all required information
- Order items table shows all items with correct calculations
- Total amount equals sum of item subtotals
- Status dropdowns show all valid options
- Update button saves status changes
- Success message displays after update
- `updated_at` timestamp is updated

---

## Phase 4: Testing & Polish

### Task 12: Unit Tests
Write unit tests for components and functions.

#### Subtasks:
- [ ] 12.1 Set up Jest and React Testing Library
- [ ] 12.2 Write tests for LoginPage component
- [ ] 12.3 Write tests for ProductForm validation
- [ ] 12.4 Write tests for CategoryForm validation
- [ ] 12.5 Write tests for ImageUpload component
- [ ] 12.6 Write tests for generateSlug() function
- [ ] 12.7 Write tests for pagination logic
- [ ] 12.8 Achieve 80% code coverage

**Acceptance Criteria:**
- All unit tests pass
- Code coverage is at least 80%
- Tests cover authentication, validation, and CRUD operations

---

### Task 13: Property-Based Tests
Write property-based tests for all 20 correctness properties.

#### Subtasks:
- [ ] 13.1 Install fast-check library
- [ ] 13.2 Configure property tests with 100 iterations minimum
- [ ] 13.3 Write property test for Property 1: Admin Access Control
- [ ] 13.4 Write property test for Property 2: Authentication Error Handling
- [ ] 13.5 Write property test for Property 3: Order Total Calculation
- [ ] 13.6 Write property test for Property 4: Dashboard Metrics Accuracy
- [ ] 13.7 Write property test for Property 5: Recent Orders Sorting
- [ ] 13.8 Write property test for Property 6: Table Field Completeness
- [ ] 13.9 Write property test for Property 7: Pagination Correctness
- [ ] 13.10 Write property test for Property 8: Product CRUD Operations
- [ ] 13.11 Write property test for Property 9: Form Validation
- [ ] 13.12 Write property test for Property 10: Edit Form Population
- [ ] 13.13 Write property test for Property 11: Image Upload Validation
- [ ] 13.14 Write property test for Property 12: Image Upload Uniqueness
- [ ] 13.15 Write property test for Property 13: Image Replacement Cleanup
- [ ] 13.16 Write property test for Property 14: Category Slug Generation
- [ ] 13.17 Write property test for Property 15: Category Name Uniqueness
- [ ] 13.18 Write property test for Property 16: Category Slug Update
- [ ] 13.19 Write property test for Property 17: Category Deletion Constraint
- [ ] 13.20 Write property test for Property 18: Order Status Update
- [ ] 13.21 Write property test for Property 19: Payment Status Update
- [ ] 13.22 Write property test for Property 20: Stock Non-Negativity

**Acceptance Criteria:**
- All 20 correctness properties have corresponding property tests
- Each test runs minimum 100 iterations
- Each test is tagged with property reference
- All property tests pass

---

### Task 14: Integration Tests
Write end-to-end integration tests for critical user flows.

#### Subtasks:
- [ ] 14.1 Set up Playwright for E2E testing
- [ ] 14.2 Set up Supabase test project
- [ ] 14.3 Write E2E test for admin login flow
- [ ] 14.4 Write E2E test for product creation flow
- [ ] 14.5 Write E2E test for product edit flow
- [ ] 14.6 Write E2E test for product deletion flow
- [ ] 14.7 Write E2E test for category creation with dependency check
- [ ] 14.8 Write E2E test for order status update flow

**Acceptance Criteria:**
- All integration tests pass
- Tests cover complete user flows from login to completion
- Tests use real Supabase test environment

---

### Task 15: Error Handling & Polish
Improve error handling and user experience.

#### Subtasks:
- [ ] 15.1 Add toast notifications for success/error messages
- [ ] 15.2 Add loading skeletons for tables
- [ ] 15.3 Add loading spinners for form submissions
- [ ] 15.4 Add progress indicators for image uploads
- [ ] 15.5 Improve error messages for all validation failures
- [ ] 15.6 Add confirmation dialogs for destructive actions
- [ ] 15.7 Implement proper error logging
- [ ] 15.8 Test all error scenarios

**Acceptance Criteria:**
- All async operations show loading states
- All success/error actions show toast notifications
- All destructive actions require confirmation
- Error messages are specific and helpful
- No unhandled errors in console

---

## Dependencies

### External Dependencies
- All required dependencies already in package.json
- Add `fast-check` as dev dependency for property-based testing

### Task Dependencies
- Task 2 depends on Task 1 (database must exist)
- Task 3 depends on Task 2 (middleware must protect routes)
- Task 4 depends on Task 3 (layout needs auth)
- Task 5-11 depend on Task 4 (pages need layout)
- Task 7 depends on Task 6 (form needs list page)
- Task 9 depends on Task 8 (form needs list page)
- Task 11 depends on Task 10 (details needs list page)
- Task 12-14 depend on Task 5-11 (tests need implementation)
- Task 15 can be done in parallel with other tasks

---

## Notes

- Complete tasks in order to maintain dependencies
- Test each feature thoroughly before moving to the next
- Use existing UI components from the project where possible
- Follow the design document for all implementation details
- Refer to requirements-mvp.md for acceptance criteria
- Refer to database-schema.md for database structure
- All property tests must reference the design document property number
