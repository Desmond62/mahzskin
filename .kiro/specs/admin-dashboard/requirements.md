# Requirements Document: Admin Dashboard (MVP - Phase 1)

## Introduction

The Admin Dashboard MVP is a web-based management interface for the mahzskin e-commerce platform. This first version focuses on core functionality: admin authentication, dashboard overview, product management, category management, order management, and image uploads. The goal is to launch a working admin dashboard quickly, with additional features planned for future phases.

## Glossary

- **Admin_Dashboard**: The web-based administrative interface for managing the e-commerce store
- **Admin_User**: An authenticated user with administrative privileges
- **Auth_System**: Supabase Authentication service managing user sessions
- **Product_Manager**: Component responsible for CRUD operations on product records
- **Order_Manager**: Component responsible for viewing and updating order status
- **Category_Manager**: Component responsible for organizing products into categories
- **Storage_Service**: Supabase Storage service for product image uploads
- **RLS_Policy**: Row Level Security policy enforcing data access rules in Supabase
- **Order_Status**: Enumerated state of an order (Pending, Paid, Shipped, Delivered)
- **Stock_Level**: Current quantity of a product available for sale
- **Company_Color_Scheme**: Visual theme using #F8E7DD background with black/dark primary colors
- **MVP**: Minimum Viable Product - the first working version with core features only

## Requirements

### Requirement 1: Admin Authentication and Authorization

**User Story:** As a store owner, I want only authorized administrators to access the admin dashboard, so that my store data remains secure and protected from unauthorized access.

#### Acceptance Criteria

1. WHEN an unauthenticated user attempts to access /admin routes, THE Auth_System SHALL redirect them to the admin login page
2. WHEN an admin user provides valid credentials, THE Auth_System SHALL create an authenticated session and grant access to the Admin_Dashboard
3. THE Auth_System SHALL verify the Admin_Role field in the user's profile before granting dashboard access
4. WHEN a user without an Admin_Role attempts to access /admin routes, THE Auth_System SHALL deny access and display an unauthorized error message
5. WHEN an admin session is inactive for 30 minutes, THE Session_Manager SHALL terminate the session and require re-authentication
6. THE Auth_System SHALL store admin sessions securely using Supabase Auth session management
7. WHEN an admin user clicks logout, THE Auth_System SHALL terminate the session and redirect to the login page
8. THE RLS_Policy SHALL enforce that only users with Admin_Role can query administrative data tables

### Requirement 2: Role-Based Access Control

**User Story:** As a super admin, I want to control what different admin users can access, so that I can delegate responsibilities while maintaining security.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL support two role types: Super_Admin and Regular_Admin
2. WHEN a Super_Admin is authenticated, THE Admin_Dashboard SHALL grant access to all features including user management and settings
3. WHEN a Regular_Admin is authenticated, THE Admin_Dashboard SHALL restrict access to product management and order management only
4. THE Admin_Dashboard SHALL hide navigation menu items that the current admin role cannot access
5. WHEN a Regular_Admin attempts to access restricted routes directly, THE Auth_System SHALL return a 403 Forbidden response
6. THE RLS_Policy SHALL enforce role-based data access at the database level
7. FOR ALL administrative actions, THE Activity_Logger SHALL record which Admin_User performed the action

### Requirement 3: Dashboard Home Overview

**User Story:** As an admin, I want to see key metrics at a glance when I log in, so that I can quickly assess store performance.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display a widget showing the total count of products in the store
2. THE Admin_Dashboard SHALL display a widget showing the total count of orders
3. THE Admin_Dashboard SHALL display a widget showing the total count of registered customers
4. THE Admin_Dashboard SHALL display a widget showing total revenue for the current month
5. THE Admin_Dashboard SHALL display a list of the 10 most recent orders with order ID, customer name, total, and status
6. THE Admin_Dashboard SHALL display a sales summary chart showing revenue for the last 30 days
7. WHEN the dashboard loads, THE Admin_Dashboard SHALL fetch all metrics within 2 seconds
8. THE Admin_Dashboard SHALL refresh metrics automatically every 60 seconds

### Requirement 4: Product Management

**User Story:** As an admin, I want to add, edit, and delete products, so that I can keep the store catalog up to date.

#### Acceptance Criteria

1. THE Product_Manager SHALL display a paginated table of all products showing name, price, category, stock, and image thumbnail
2. WHEN an admin clicks "Add Product", THE Product_Manager SHALL display a form with fields for name, description, price, category, stock, and image
3. WHEN an admin submits a valid product form, THE Product_Manager SHALL create a new product record in the database
4. WHEN an admin clicks "Edit" on a product, THE Product_Manager SHALL populate the form with existing product data
5. WHEN an admin updates a product, THE Product_Manager SHALL save changes and update the updated_at timestamp
6. WHEN an admin clicks "Delete" on a product, THE Product_Manager SHALL display a confirmation dialog
7. WHEN an admin confirms deletion, THE Product_Manager SHALL remove the product record and associated images from Storage_Service
8. THE Product_Manager SHALL validate that price is a positive decimal number with maximum 2 decimal places
9. THE Product_Manager SHALL validate that stock is a non-negative integer
10. THE Product_Manager SHALL validate that name is not empty and has maximum length of 200 characters
11. WHEN a product form has validation errors, THE Product_Manager SHALL display specific error messages for each invalid field
12. THE Product_Manager SHALL display 20 products per page with pagination controls

### Requirement 5: Product Image Upload

**User Story:** As an admin, I want to upload product images with preview, so that customers can see what they're buying.

#### Acceptance Criteria

1. THE Product_Manager SHALL provide an image upload field accepting JPEG, PNG, and WebP formats
2. WHEN an admin selects an image file, THE Product_Manager SHALL validate the file size is less than 5MB
3. WHEN an admin selects a valid image, THE Product_Manager SHALL display a preview of the image before upload
4. WHEN an admin submits the product form, THE Storage_Service SHALL upload the image to the "product-images" bucket
5. THE Storage_Service SHALL generate a unique filename using UUID to prevent collisions
6. WHEN image upload succeeds, THE Product_Manager SHALL store the public URL in the product's image field
7. WHEN image upload fails, THE Product_Manager SHALL display an error message and prevent form submission
8. WHEN an admin replaces an existing product image, THE Storage_Service SHALL delete the old image file
9. THE Product_Manager SHALL display a loading indicator during image upload

### Requirement 6: Order Management

**User Story:** As an admin, I want to view and update order statuses, so that I can track order fulfillment.

#### Acceptance Criteria

1. THE Order_Manager SHALL display a paginated table of all orders showing order ID, customer name, total, status, and date
2. THE Order_Manager SHALL support filtering orders by Order_Status (All, Pending, Paid, Shipped, Delivered, Cancelled)
3. THE Order_Manager SHALL support searching orders by order ID or customer name
4. WHEN an admin clicks on an order, THE Order_Manager SHALL display full order details including items, quantities, prices, and shipping address
5. THE Order_Manager SHALL display an order timeline showing status change history with timestamps
6. WHEN an admin selects a new Order_Status from the dropdown, THE Order_Manager SHALL update the order status in the database
7. WHEN order status changes, THE Activity_Logger SHALL record the admin user, timestamp, old status, and new status
8. THE Order_Manager SHALL validate that status transitions follow allowed sequences (Pending → Paid → Shipped → Delivered)
9. WHEN an invalid status transition is attempted, THE Order_Manager SHALL display an error message and prevent the update
10. THE Order_Manager SHALL display 25 orders per page with pagination controls
11. THE Order_Manager SHALL calculate and display order totals correctly by summing (item price × quantity) for all items

### Requirement 7: Customer Management

**User Story:** As an admin, I want to view customer information and their order history, so that I can provide better customer service.

#### Acceptance Criteria

1. THE Customer_Manager SHALL display a paginated table of all registered customers showing name, email, phone, and registration date
2. THE Customer_Manager SHALL support searching customers by name or email
3. WHEN an admin clicks on a customer, THE Customer_Manager SHALL display the customer's full profile including address
4. THE Customer_Manager SHALL display a list of all orders placed by the selected customer
5. THE Customer_Manager SHALL calculate and display total lifetime value (sum of all completed orders) for each customer
6. WHERE Super_Admin role is assigned, THE Customer_Manager SHALL provide a "Ban User" action
7. WHEN a Super_Admin bans a user, THE Auth_System SHALL prevent that user from logging in
8. WHERE Super_Admin role is assigned, THE Customer_Manager SHALL provide a "Remove User" action with confirmation dialog
9. THE Customer_Manager SHALL display 25 customers per page with pagination controls

### Requirement 8: Category Management

**User Story:** As an admin, I want to organize products into categories, so that customers can browse products more easily.

#### Acceptance Criteria

1. THE Category_Manager SHALL display a list of all product categories with product count for each
2. WHEN an admin clicks "Add Category", THE Category_Manager SHALL display a form with fields for category name and description
3. WHEN an admin submits a valid category form, THE Category_Manager SHALL create a new category record
4. THE Category_Manager SHALL validate that category name is unique and not empty
5. WHEN an admin clicks "Edit" on a category, THE Category_Manager SHALL populate the form with existing category data
6. WHEN an admin updates a category, THE Category_Manager SHALL save changes and update all associated products
7. WHEN an admin clicks "Delete" on a category, THE Category_Manager SHALL display a confirmation dialog showing the number of affected products
8. WHEN an admin confirms category deletion, THE Category_Manager SHALL either reassign products to "Uncategorized" or prevent deletion if products exist
9. THE Category_Manager SHALL display categories in alphabetical order

### Requirement 9: Inventory and Stock Control

**User Story:** As an admin, I want to monitor and update stock levels, so that I can prevent overselling and manage inventory effectively.

#### Acceptance Criteria

1. THE Inventory_Controller SHALL display a table of all products with current Stock_Level
2. THE Inventory_Controller SHALL highlight products where Stock_Level is below Low_Stock_Threshold in red
3. THE Inventory_Controller SHALL support filtering to show only low stock products
4. WHEN an admin clicks "Update Stock" on a product, THE Inventory_Controller SHALL display a form to adjust the Stock_Level
5. WHEN an admin submits a stock update, THE Inventory_Controller SHALL validate the new stock value is a non-negative integer
6. WHEN stock is updated, THE Activity_Logger SHALL record the admin user, product, old stock value, and new stock value
7. THE Inventory_Controller SHALL display a notification badge on the sidebar when any product has low stock
8. THE Inventory_Controller SHALL calculate and display total inventory value by summing (price × stock) for all products
9. WHERE Low_Stock_Threshold is not configured, THE Inventory_Controller SHALL use a default value of 10 units

### Requirement 10: Bulk Operations

**User Story:** As an admin, I want to perform actions on multiple items at once, so that I can save time on repetitive tasks.

#### Acceptance Criteria

1. THE Product_Manager SHALL provide checkboxes to select multiple products
2. WHEN products are selected, THE Product_Manager SHALL display a bulk actions menu with options: Update Price, Update Category, Delete
3. WHEN an admin selects "Bulk Update Price", THE Product_Manager SHALL display a form to apply a percentage increase or decrease
4. WHEN an admin submits bulk price update, THE Product_Manager SHALL update all selected products and record the action in Activity_Logger
5. WHEN an admin selects "Bulk Update Category", THE Product_Manager SHALL display a category dropdown
6. WHEN an admin submits bulk category update, THE Product_Manager SHALL update all selected products
7. WHEN an admin selects "Bulk Delete", THE Product_Manager SHALL display a confirmation dialog showing the count of products to be deleted
8. WHEN an admin confirms bulk delete, THE Product_Manager SHALL delete all selected products and their associated images
9. THE Product_Manager SHALL display a progress indicator during bulk operations
10. WHEN bulk operation completes, THE Product_Manager SHALL display a success message with the count of affected items

### Requirement 11: Sales Analytics

**User Story:** As an admin, I want to view sales analytics with charts, so that I can understand revenue trends and make informed business decisions.

#### Acceptance Criteria

1. THE Analytics_Engine SHALL display a line chart showing daily revenue for the last 30 days
2. THE Analytics_Engine SHALL provide filter options for time periods: Daily, Weekly, Monthly, Yearly
3. WHEN an admin selects a time period filter, THE Analytics_Engine SHALL recalculate and redisplay the chart
4. THE Analytics_Engine SHALL display total revenue for the selected time period
5. THE Analytics_Engine SHALL display average order value for the selected time period
6. THE Analytics_Engine SHALL display a bar chart showing top 10 selling products by quantity
7. THE Analytics_Engine SHALL display a pie chart showing revenue distribution by category
8. THE Analytics_Engine SHALL calculate revenue only from orders with payment_status = 'paid'
9. THE Analytics_Engine SHALL format currency values according to the store's configured currency setting
10. THE Analytics_Engine SHALL provide an "Export Report" button to download analytics data as CSV

### Requirement 12: Activity Logs and Audit Trail

**User Story:** As a super admin, I want to see who changed what and when, so that I can maintain accountability and troubleshoot issues.

#### Acceptance Criteria

1. THE Activity_Logger SHALL record all administrative actions including create, update, and delete operations
2. FOR ALL logged actions, THE Activity_Logger SHALL store: admin user ID, action type, affected resource type, resource ID, timestamp, and old/new values
3. WHERE Super_Admin role is assigned, THE Admin_Dashboard SHALL display an Activity Logs page
4. THE Activity_Logger SHALL display logs in reverse chronological order (newest first)
5. THE Activity_Logger SHALL support filtering logs by admin user, action type, and date range
6. THE Activity_Logger SHALL support searching logs by resource ID or description
7. THE Activity_Logger SHALL display 50 log entries per page with pagination controls
8. THE Activity_Logger SHALL retain logs for a minimum of 90 days
9. WHERE Super_Admin role is assigned, THE Activity_Logger SHALL provide an "Export Logs" button to download as CSV

### Requirement 13: Data Export

**User Story:** As an admin, I want to export orders and customer data to CSV, so that I can analyze data in external tools or create backups.

#### Acceptance Criteria

1. THE Order_Manager SHALL provide an "Export to CSV" button
2. WHEN an admin clicks "Export to CSV" on orders, THE Order_Manager SHALL generate a CSV file containing all visible orders (respecting current filters)
3. THE CSV_Export SHALL include columns: Order ID, Customer Name, Customer Email, Total, Status, Payment Status, Order Date
4. THE Customer_Manager SHALL provide an "Export to CSV" button
5. WHEN an admin clicks "Export to CSV" on customers, THE Customer_Manager SHALL generate a CSV file containing all customers
6. THE CSV_Export SHALL include columns: Customer ID, Name, Email, Phone, Registration Date, Total Orders, Lifetime Value
7. THE CSV_Export SHALL use UTF-8 encoding to support international characters
8. THE CSV_Export SHALL trigger a browser download with a filename including the export type and timestamp
9. THE Activity_Logger SHALL record all data export actions with the admin user and timestamp

### Requirement 14: Real-Time Notifications

**User Story:** As an admin, I want to receive instant notifications for new orders, so that I can process them quickly.

#### Acceptance Criteria

1. WHEN a new order is created, THE Admin_Dashboard SHALL display a real-time notification to all logged-in admins
2. THE Admin_Dashboard SHALL use Supabase Realtime subscriptions to listen for new order events
3. THE Admin_Dashboard SHALL display notifications in a toast/popup in the top-right corner
4. THE Admin_Dashboard SHALL include order ID, customer name, and total in the notification
5. WHEN an admin clicks on a notification, THE Admin_Dashboard SHALL navigate to the order details page
6. THE Admin_Dashboard SHALL display a notification badge on the Orders menu item showing unread order count
7. THE Admin_Dashboard SHALL mark notifications as read when the admin views the Orders page
8. THE Admin_Dashboard SHALL store notification preferences in the admin user's profile
9. WHERE notification preferences allow, THE Admin_Dashboard SHALL play a subtle sound when new orders arrive

### Requirement 15: Store Settings Management

**User Story:** As a super admin, I want to configure store settings, so that I can customize the store's behavior and appearance.

#### Acceptance Criteria

1. WHERE Super_Admin role is assigned, THE Admin_Dashboard SHALL display a Settings page
2. THE Admin_Dashboard SHALL provide a form to update store name
3. THE Admin_Dashboard SHALL provide a dropdown to select currency (USD, EUR, GBP, NGN)
4. THE Admin_Dashboard SHALL provide a field to set Low_Stock_Threshold
5. THE Admin_Dashboard SHALL provide toggles to enable/disable payment methods (Paystack, Stripe, PayPal)
6. THE Admin_Dashboard SHALL provide fields to configure shipping rates by region
7. WHEN a Super_Admin updates settings, THE Admin_Dashboard SHALL validate all fields before saving
8. WHEN settings are saved, THE Admin_Dashboard SHALL update the settings table in the database
9. THE Admin_Dashboard SHALL display a success message when settings are saved
10. THE Activity_Logger SHALL record all settings changes with old and new values

### Requirement 16: Responsive Design and Mobile Support

**User Story:** As an admin, I want to access the dashboard from my mobile device, so that I can manage the store while away from my computer.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL render correctly on screen widths from 320px to 2560px
2. WHEN viewed on screens below 768px width, THE Admin_Dashboard SHALL display a collapsible hamburger menu
3. THE Admin_Dashboard SHALL use responsive tables that scroll horizontally on small screens
4. THE Admin_Dashboard SHALL stack form fields vertically on screens below 640px width
5. THE Admin_Dashboard SHALL use touch-friendly button sizes (minimum 44px × 44px) on mobile devices
6. THE Admin_Dashboard SHALL display charts that resize appropriately for mobile screens
7. THE Admin_Dashboard SHALL maintain the Company_Color_Scheme across all screen sizes
8. THE Admin_Dashboard SHALL load and render the mobile view within 3 seconds on 3G connections

### Requirement 17: Search and Filter Functionality

**User Story:** As an admin, I want to search and filter data in tables, so that I can quickly find specific items.

#### Acceptance Criteria

1. THE Product_Manager SHALL provide a search input that filters products by name or description
2. THE Product_Manager SHALL provide dropdown filters for category and stock status (All, In Stock, Low Stock, Out of Stock)
3. WHEN an admin types in the search input, THE Product_Manager SHALL debounce the search by 300ms before filtering
4. THE Order_Manager SHALL provide a search input that filters orders by order ID or customer name
5. THE Order_Manager SHALL provide dropdown filters for Order_Status and date range (Today, Last 7 Days, Last 30 Days, Custom)
6. THE Customer_Manager SHALL provide a search input that filters customers by name or email
7. WHEN filters are applied, THE Admin_Dashboard SHALL update the URL query parameters to maintain filter state
8. WHEN an admin refreshes the page, THE Admin_Dashboard SHALL restore filters from URL query parameters
9. THE Admin_Dashboard SHALL display a "Clear Filters" button when any filters are active
10. THE Admin_Dashboard SHALL display the count of filtered results (e.g., "Showing 15 of 150 products")

### Requirement 18: Security and Data Protection

**User Story:** As a store owner, I want the admin dashboard to be secure, so that my business data is protected from unauthorized access and attacks.

#### Acceptance Criteria

1. THE Auth_System SHALL enforce HTTPS for all /admin routes in production
2. THE Auth_System SHALL implement CSRF protection for all form submissions
3. THE Admin_Dashboard SHALL sanitize all user inputs to prevent XSS attacks
4. THE RLS_Policy SHALL prevent admins from accessing data they don't have permission to view
5. THE Auth_System SHALL rate-limit login attempts to 5 attempts per 15 minutes per IP address
6. WHEN rate limit is exceeded, THE Auth_System SHALL temporarily block login attempts and display a cooldown message
7. THE Admin_Dashboard SHALL never expose Supabase service_role key to the client
8. THE Admin_Dashboard SHALL use parameterized queries for all database operations to prevent SQL injection
9. THE Storage_Service SHALL validate uploaded file types by checking file headers, not just extensions
10. THE Activity_Logger SHALL log all failed authentication attempts with IP address and timestamp

### Requirement 19: Performance and Optimization

**User Story:** As an admin, I want the dashboard to load quickly, so that I can work efficiently without waiting.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL load the initial dashboard home page within 2 seconds on broadband connections
2. THE Admin_Dashboard SHALL implement pagination for all tables to limit data fetched per request
3. THE Admin_Dashboard SHALL use database indexes on frequently queried columns (user_id, product_id, order_id, created_at)
4. THE Admin_Dashboard SHALL cache analytics data for 5 minutes to reduce database queries
5. THE Admin_Dashboard SHALL lazy-load images in product tables
6. THE Admin_Dashboard SHALL debounce search inputs by 300ms to reduce unnecessary queries
7. THE Admin_Dashboard SHALL display loading skeletons while data is being fetched
8. THE Admin_Dashboard SHALL compress images uploaded to Storage_Service to maximum 1MB
9. THE Admin_Dashboard SHALL use optimistic UI updates for actions like status changes, showing immediate feedback before server confirmation

### Requirement 20: User Interface and Design Consistency

**User Story:** As an admin, I want a clean and consistent interface, so that I can navigate the dashboard intuitively.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL use the Company_Color_Scheme with #F8E7DD background and black/dark primary colors throughout
2. THE Admin_Dashboard SHALL use consistent spacing, typography, and component styles from Tailwind CSS
3. THE Admin_Dashboard SHALL display a persistent sidebar navigation menu on screens wider than 768px
4. THE Admin_Dashboard SHALL highlight the current active page in the sidebar menu
5. THE Admin_Dashboard SHALL display a header bar with the admin user's name and logout button
6. THE Admin_Dashboard SHALL use consistent button styles: primary actions in dark/black, secondary actions in outlined style
7. THE Admin_Dashboard SHALL display success messages in green, error messages in red, and warning messages in yellow
8. THE Admin_Dashboard SHALL use consistent icons from the lucide-react library
9. THE Admin_Dashboard SHALL display loading states with spinners or skeleton screens, never blank pages
10. THE Admin_Dashboard SHALL use consistent form layouts with labels above inputs and error messages below

## Correctness Properties for Property-Based Testing

### Property 1: Order Total Calculation Invariant
FOR ALL orders with items, the order total SHALL equal the sum of (item.price × item.quantity) for all items in the order, regardless of the number of items or order of calculation.

### Property 2: Stock Level Non-Negativity Invariant
FOR ALL stock update operations, the resulting Stock_Level SHALL be greater than or equal to zero. No sequence of valid operations SHALL produce a negative stock value.

### Property 3: Role-Based Access Idempotence
FOR ALL admin users, checking access permissions twice SHALL return the same result. The permission check function SHALL be idempotent: hasPermission(user, resource) = hasPermission(hasPermission(user, resource), resource).

### Property 4: Activity Log Completeness
FOR ALL administrative actions (create, update, delete), exactly one corresponding entry SHALL exist in the Activity_Logger. The count of logged actions SHALL equal the count of performed actions.

### Property 5: CSV Export Round-Trip Property
FOR ALL data exported to CSV and then imported back, the imported data SHALL match the original data structure and values (excluding formatting). parse(export(data)) SHALL be equivalent to data.

### Property 6: Image Upload Idempotence
WHEN the same image file is uploaded multiple times for the same product, only one image SHALL exist in Storage_Service, and the product SHALL reference the same image URL. Uploading the same file twice SHALL not create duplicate storage entries.

### Property 7: Filter Commutativity
FOR ALL combinations of filters (search + category + stock status), applying filters in any order SHALL produce the same result set. filter(filter(products, categoryFilter), searchFilter) SHALL equal filter(filter(products, searchFilter), categoryFilter).

### Property 8: Pagination Completeness
FOR ALL paginated tables, the union of all pages SHALL equal the complete dataset. No items SHALL be missing or duplicated across page boundaries. concat(page1, page2, ..., pageN) SHALL equal allItems.

### Property 9: Status Transition Validity
FOR ALL order status updates, only valid transitions SHALL be allowed. The system SHALL reject invalid transitions and maintain the current status. validTransitions(currentStatus) SHALL contain nextStatus, or the update SHALL fail.

### Property 10: Session Timeout Consistency
FOR ALL admin sessions, if no activity occurs for 30 minutes, the session SHALL be terminated. The session state SHALL transition from active to expired, never to any other state. After timeout, any authenticated request SHALL fail with 401 Unauthorized.

### Property 11: Bulk Operation Atomicity
FOR ALL bulk operations, either all selected items SHALL be updated successfully, or none SHALL be updated (all-or-nothing). Partial updates SHALL not occur. If any item fails validation, the entire bulk operation SHALL be rolled back.

### Property 12: Price Calculation Precision
FOR ALL price calculations involving multiplication and addition, the result SHALL maintain exactly 2 decimal places. No rounding errors SHALL accumulate across multiple calculations. round(sum(prices), 2) SHALL equal sum(map(prices, p => round(p, 2))).

### Property 13: Search Result Consistency
FOR ALL search queries, the same search term SHALL always return the same results when the underlying data hasn't changed. search(term, data) SHALL be deterministic and repeatable.

### Property 14: Real-Time Notification Delivery
FOR ALL new orders created, exactly one notification SHALL be delivered to each logged-in admin. No notifications SHALL be duplicated or lost. The count of notifications SHALL equal the count of new orders.

### Property 15: Audit Trail Immutability
FOR ALL entries in the Activity_Logger, once created, they SHALL never be modified or deleted. The audit trail SHALL be append-only. The count of log entries SHALL only increase, never decrease.
