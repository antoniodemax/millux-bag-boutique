# Millux Collections - Project Memory for Claude Code

## Project Overview
Millux Collections is a luxury e-commerce application specializing in high-end handbags and accessories. The platform serves both individual customers and business clients through a multi-tenant architecture. Built with modern React/Vite frontend and Node.js/Express/PostgreSQL backend, the application focuses on delivering a premium shopping experience with emphasis on design, performance, and customer service via WhatsApp integration.

## Tech Stack

### Frontend
- **Framework**: React 18.3.1 with Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.11 (custom luxury design system)
- **UI Library**: Radix UI primitives + custom components
- **State Management**: React Context API (CartContext, planned AuthContext)
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts (for dashboard)
- **Routing**: React Router DOM v6.26.2
- **Build Tool**: Vite
- **Language**: TypeScript 5.5.3
- **SEO**: react-helmet-async
- **Notifications**: sonner (toast), Custom modals/dialogs

### Backend
- **Runtime**: Node.js with Express 5.2.1
- **Database**: PostgreSQL with pg driver (raw SQL queries)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs for password hashing
- **OAuth**: passport-google-oauth20 + google-auth-library (Google Sign-in)
- **File Uploads**: Multer
- **Middleware**: CORS, cookie-parser, body-parser
- **Validation**: Zod
- **Environment**: dotenv
- **Development**: nodemon, tsx, typescript
- **Language**: TypeScript 7.0.2

### Infrastructure & Services
- **Database**: PostgreSQL (development/local)
- **Storage**: Local filesystem (`./uploads` directory)
- **Authentication**: JWT cookies (HTTP-only, secure flags)
- **Third-party Auth**: Google OAuth for admin access
- **Communication**: WhatsApp integration for customer/service communication
- **Email**: Planned (SendGrid/SMTP for order confirmations)
- **Payments**: Planned (Stripe integration)
- **Search**: Planned (PostgreSQL full-text search or external)

### Development Tools
- **Linting**: ESLint with React and TypeScript plugins
- **Formatting**: Prettier (implicit via eslint config)
- **Type Checking**: TypeScript compiler
- **Debugging**: Chrome DevTools, VS Code debugger
- **API Testing**: Built-in endpoints with manual testing
- **Version Control**: Git (GitHub implied)

## Folder Structure

```
millux-bag-boutique/
├── .claude/                    # Claude Code settings
├── backend/                    # Backend (Node.js/Express)
│   ├── .claude/                # Backend-specific Claude settings
│   ├── src/                    # Source code
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # Request handlers
│   │   ├── db/                 # Database connection & utilities
│   │   ├── middleware/         # Custom Express middleware
│   │   ├── models/             # TypeScript interfaces (not ORM models)
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic layer
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # Server entry point
│   ├── migrations/             # SQL database migrations
│   ├── seeds/                  # Database seed data
│   ├── uploads/                # File upload storage
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   ├── package.json            # Dependencies & scripts
│   └── tsconfig.json           # TypeScript configuration
├── src/                        # Frontend (React/Vite)
│   ├── components/             # Reusable UI components
│   │   ├── dashboard/          # Admin dashboard components
│   │   ├── layout/             # Layout components (navbar, footer, sidebar)
│   │   └── ui/                 # Headless UI components (from Radix/shadcn)
│   ├── context/                # React Context providers
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions & constants
│   ├── pages/                  # Page components (route components)
│   │   └── admin/              # Admin pages (to be implemented)
│   ├── services/               # Frontend service layers (API clients)
│   ├── types/                  # TypeScript type definitions
│   ├── App.tsx                 # Root application component
│   ├── main.tsx                # Application entry point
│   ├── index.css               # Base CSS styles
│   └── vite-env.d.ts           # Vite TypeScript definitions
├── public/                     # Static assets (images, icons, etc.)
│   └── images/                 # Product images, logos, banners
├── .env                        # Frontend environment variables
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML template
├── package.json                # Frontend dependencies & scripts
├── README.md                   # Project overview
├── SUMMARY.md                  # Project summary
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── tailwind.config.ts          # Tailwind CSS configuration
```

## Backend Architecture

### API Design
- **RESTful** resource-oriented endpoints
- **Versioning**: Not implemented (could use `/api/v1/` prefix)
- **Authentication**: JWT bearer tokens in HTTP-only cookies
- **Error Handling**: Centralized error handling middleware
- **Validation**: Zod schemas for request validation
- **Responses**: JSON format with consistent structure
- **Status Codes**: Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)

### Key Components

#### Controllers (`src/controllers/`)
- Thin layer handling HTTP concerns (request/response)
- Call services for business logic
- Handle validation errors and throw appropriate HTTP errors
- Examples: `products.ts`, `auth.ts`, `categories.ts`, `uploads.ts`

#### Services (`src/services/`)
- Business logic layer
- Contains core application logic
- Interacts with database through `query` function
- Handles data transformation and validation
- Examples: `productService.ts`, `authService.ts`, `categoryService.ts`

#### Models (`src/models/`)
- TypeScript interfaces defining data shapes
- Not actual ORM models (using raw SQL)
- Define TypeScript types for database rows
- Examples: `Product.ts`, `Category.ts`, `User.ts`

#### Middleware (`src/middleware/`)
- Custom Express middleware
- `auth.ts`: Authentication (`requireAuth`, `requireAdmin`) 
- `upload.ts`: Multer configuration for file uploads
- `errorHandler.ts`: Centralized error handling
- `notFoundHandler.ts`: 404 handling
- `index.ts`: DB connection utilities

#### Routes (`src/routes/`)
- Route definition files
- Mount controllers on specific paths
- Apply middleware (auth, validation) as needed
- Mounted under `/api` prefix in `app.ts`
- Examples: `auth.ts`, `products.ts`, `categories.ts`, `uploads.ts`, `dashboard.ts`

#### Database (`src/db/`)
- PostgreSQL connection pool
- Connection utility functions
- Migration system (SQL files in `migrations/` folder)

### Database Schema (PostgreSQL)

#### Core Tables
1. **products**: Product catalog
   - id (UUID PK), slug (unique), name, category, price
   - images (text[]), description, materials, dimensions, care
   - availability (in_stock/low_stock/out_of_stock)
   - featured, newArrival, bestseller (booleans)
   - createdAt, updatedAt timestamps

2. **categories**: Product categorization
   - id (UUID PK), name, image, available, orderNumber
   - createdAt, updatedAt timestamps

3. **users**: System users (admins & future customers)
   - id (UUID PK), email (unique), password_hash, role (admin/user)
   - createdAt, updatedAt timestamps

4. **customers**: Customer information
   - id (UUID PK), email (unique), name, phone
   - createdAt, updatedAt timestamps

5. **orders**: Customer orders
   - id (UUID PK), customerId (FK), status, totalAmount
   - whatsappMessage, createdAt, updatedAt timestamps

6. **order_items**: Line items in orders
   - id (UUID PK), orderId (FK), productId (FK), quantity, priceAtPurchase
   - createdAt timestamp

7. **inventory**: Stock levels per product
   - productId (FK PK), quantity, reserved, updatedAt timestamp

8. **inventory_movements**: Stock change history
   - id (UUID PK), productId (FK), change (+/-), reason, referenceId
   - createdAt timestamp

### Security Features
- **Authentication**: JWT tokens in HTTP-only cookies
- **Authorization**: Role-based access control (admin/user)
- **Password Security**: bcryptjs hashing (12 rounds)
- **Input Validation**: Zod schemas on all endpoints
- **SQL Injection**: Parameterized queries prevent SQLi
- **CORS**: Configured to allow frontend origin with credentials
- **Cookies**: Secure, SameSite flags based on environment
- **Headers**: Basic security (could enhance with helmet.js)
- **File Uploads**: Restricted to specific extensions (implied)

## Frontend Architecture

### State Management
- **CartContext**: Manages shopping cart state (items, quantities, totals)
- **Persisted**: Cart saved to localStorage for persistence across sessions
- **Planned**: AuthContext for user authentication state
- **Planned**: OrderContext for order state during checkout

### Component Organization
- **Pages**: Route-level components in `src/pages/`
  - Public pages: Index, Collections, ProductDetail, About, Contact, etc.
  - Admin pages: AdminDashboard, AdminLogin (partial implementation)
  - To be implemented: CartPage, CheckoutPage, Login, Register, Profile, etc.
  
- **Components**: Reusable UI elements in `src/components/`
  - Layout: Navbar, Footer, PremiumNavbar, AdminSidebar
  - UI Elements: Buttons, forms, modals, tooltips, dropdowns, etc. (often using Radix UI)
  - Feature-Specific: ProductCard, ProductGrid, HeroBanner, WhatsAppFloat
  - Admin: Dashboard components (StatCard, SalesChart, etc.), Admin layout pieces
  
- **Services**: API client wrappers in `src/services/`
  - ProductService: Product CRUD operations
  - DashboardService: Analytics data fetching
  - ApiClient: Base axios instance with interceptors
  
- **Hooks**: Custom React hooks in `src/hooks/`
  - useCart: Cart context wrapper
  - Planned: useAuth, useOrder, useForm, etc.
  
- **Lib**: Utility functions and constants in `src/lib/`
  - utils.ts: Format helpers (price, date)
  - constants.ts: Application constants
  
- **Types**: TypeScript definitions in `src/types/`
  - models.ts: Shared interfaces (Product, User, etc.)
  - Service-specific types as needed

### UI/UX Guidelines (Millux Luxury Aesthetic)

#### Design Principles
1. **Minimalism**: Clean layouts with ample whitespace
2. **Typography**: Playfair Display for headings, system fonts for body
3. **Color Palette**: 
   - Primary: Deep brand colors (luxury feel)
   - Accent: Complementary colors for CTAs
   - Neutral: Sophisticated grays and off-whites
   - Background: Light/dark mode support
4. **Imagery**: High-quality product photography
5. **Interactions**: Subtle animations and hover effects
6. **Accessibility**: WCAG compliance (aim for AA)
7. **Performance**: Optimized for fast loading

#### Specific Style Rules
- **Buttons**: 
  - Primary: Solid brand color with white text
  - Secondary: Outline or transparent with brand text
  - Sizes: Consistent padding and border-radius
  - States: Hover, focus, loading, disabled variations
  
- **Forms**:
  - Inputs: Consistent height, border, border-radius, padding
  - Labels: Clear, associated with inputs
  - Validation: Inline error messages, success states
  
- **Cards & Containers**:
  - Border: Subtle borders or shadow for elevation
  - Border-radius: Consistent rounded corners
  - Padding: Consistent internal spacing
  
- **Navigation**:
  - Navbar: Fixed/top, transparent on scroll, branded
  - Sidebar: Collapsible, icon-only mode on mobile
  
- **Typography**:
  - Headings: Playfair Display font family
  - Body: System UI font stack
  - Weights: Defined hierarchy (light, regular, medium, bold, semibold)
  - Sizes: Consistent scale (xs, sm, base, lg, xl, 2xl, 3xl, etc.)

#### Responsive Breakpoints
- Mobile: < 640px
- Tablet: ≥ 640px
- Desktop: ≥ 1024px
- Large Desktop: ≥ 1280px

## Coding Conventions

### TypeScript
- **Interfaces**: Use `interface` for object shapes, `type` for unions/complex types
- **Naming**: PascalCase for types/interfaces, camelCase for variables/functions
- **Strictness**: Strict mode enabled (noImplicitAny, strictNullChecks, etc.)
- **Imports**: 
  - Named imports: `import { Component } from 'library'`
  - Default imports: `import Component from 'library'`
  - Path aliases: `@/` for src root (configured in tsconfig and vite)
- **JSX**: Self-closing tags for empty components, proper indentation

### Backend (Node.js/Express)
- **Controllers**: Async functions with try/catch, call next() for errors
- **Services**: Async functions throwing errors for controller to handle
- **Validation**: Validate early in controllers using Zod schemas
- **Responses**: Consistent JSON structure: `{ data: ... }` or `{ message: ..., data: ... }`
- **Error Handling**: Throw errors with message, let middleware handle status codes
- **Database**: Parameterized queries to prevent SQLi
- **Files**: Consistent naming (camelCase for functions/variables, PascalCase for classes/interfaces)

### Frontend (React)
- **Components**: 
  - Functional components with arrow functions or function declarations
  - Early returns for conditional rendering
  - Destructuring props at top level
  - PropTypes or TypeScript interfaces for props
- **Hooks**: 
  - Custom hooks start with `use`
  - Follow Rules of Hooks (only call at top level)
  - Return arrays or objects as appropriate
- **State**: 
  - useState for local state
  - Context for global/shared state
  - Reducers for complex state logic (useReducer)
- **Styling**: 
  - Tailwind utility classes
  - Custom CSS in `.css` or `.module.css` files when needed
  - Avoid inline styles
- **Performance**: 
  - Memoization with useMemo/useCallback when beneficial
  - Lazy loading for routes and heavy components
  - Virtual scrolling for large lists (if implemented)
- **Testing**: 
  - Jest and React Testing Library preferred (not yet implemented)
  - Test components in isolation
  - Test custom hooks with @testing-library/react-hooks
  - Test service functions with mocked dependencies

## Files/Folders Requiring Special Attention

### Never Change Without Confirmation
1. **Database Migrations** (`backend/migrations/`)
   - Structural changes to production data
   - Requires backup and rollback plan
   
2. **Authentication Files**
   - `backend/src/services/authService.ts`
   - `backend/src/middleware/auth.ts`
   - `backend/src/routes/auth.ts`
   - Changes affect security and access control
   
3. **Payment Related Files** (when implemented)
   - Will handle financial transactions
   - Requires PCI compliance considerations
   
4. **Environment Files**
   - `.env` (both root and backend/)
   - Contains secrets and configuration
   - Never commit to version control
   
5. **Root entry points**
   - `backend/src/server.ts`
   - `src/main.tsx`
   - `src/App.tsx`
   - Application bootstrap

### Frequently Modified Areas
1. **Product/Category Logic**
   - `backend/src/services/productService.ts`
   - `backend/src/services/categoryService.ts`
   - `backend/src/controllers/products.ts`
   - `backend/src/controllers/categories.ts`
   - `src/services/productService.ts`
   - `src/pages/ProductDetail.tsx`
   - `src/components/ProductCard.tsx`
   - `src/components/ProductGrid.tsx`
   
2. **UI Components**
   - `src/components/` directory (general UI improvements)
   - Follow existing patterns when adding new components
   
3. **Styles**
   - `tailwind.config.ts` (design system updates)
   - `src/index.css` (base styles)
   
4. **Routes**
   - `backend/src/routes/` (add new API endpoints)
   - `src/App.tsx` (add new frontend routes)
   
5. **Services**
   - `backend/src/services/` (business logic)
   - `src/services/frontend` (API clients)

## Common Development Commands

### General
```bash
# Install dependencies (both root and backend)
npm install          # Root frontend
cd backend && npm install  # Backend

# Start development servers
npm run dev          # Frontend (Vite) on http://localhost:5173
cd backend && npm run dev  # Backend (nodemon/tsx) on http://localhost:5000

# Build for production
npm run build        # Frontend production build
cd backend && npm run build  # Backend TypeScript compilation

# Preview production builds
npm run preview      # Frontend preview
cd backend && npm start  # Backend production server

# Linting
npm run lint         # ESLint for frontend
cd backend && npm run lint  # ESLint for backend (if configured)

# Type checking
npm run type-check   # tsc --noEmit
cd backend && npm run type-check
```

### Backend Specific
```bash
cd backend
npm run dev          # Development with nodemon
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled server
npm test             # Run tests (if implemented)
```

### Frontend Specific
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Database
```bash
cd backend
# Run migrations (manual process - run SQL files in order)
psql -d milluxdb -f migrations/001_init.sql
psql -d milluxdb -f migrations/002_add_google_oauth.sql

# Reset database (development only)
# Drop and recreate database, then run migrations
```

### Environment Variables

#### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000
```

#### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/milluxdb
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./uploads
BACKEND_URL=http://localhost:5000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
ADMIN_GOOGLE_EMAIL=admin@example.com

# Future: Payment provider keys
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...

# Future: Email service
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=username
# SMTP_PASS=password
# EMAIL_FROM=noreply@milluxcollections.com
```

## Preferred Implementation Patterns

### Backend Patterns
1. **Service Layer Pattern**: Controllers call services, services contain business logic
2. **Repository Pattern**: Services interact with database through query functions
3. **Validation First**: Validate input at controller entry point using Zod
4. **Error Throwing**: Services throw errors, controllers catch and convert to HTTP responses
5. **Async/Await**: Use async/await forpromise handling, avoid .then() chains
6. **Parameterized Queries**: Always use $1, $2 placeholders for SQL parameters
7. **Consistent Response Format**: 
   ```json
   // Success
   { "data": {...} }
   
   // Success with message
   { "message": "Success", "data": {...} }
   
   // Error handled by middleware
   throw new Error("Descriptive message")
   ```
8. **Middleware Chain**: auth → validation → controller → errorHandler
9. **File Organization**: Group by feature (products, auth, etc.) not by type
10. **Constants**: Define magic strings/numbers in constants files or at top of files

### Frontend Patterns
1. **Component Composition**: Small, reusable components that compose to form complex UIs
2. **Custom Hooks**: Extract reusable logic into custom hooks (prefix with `use`)
3. **Context API**: For global state that needs to be accessed by many components
4. **Error Boundaries**: Catch errors in component trees (to be implemented)
5. **Loading States**: Show skeletons/spinners during async operations
6. **Error States**: Display user-friendly error messages with retry options
7. **Empty States**: Show helpful empty states when lists are empty
8. **Form Patterns**: 
   - Controlled components with form libraries (React Hook Form)
   - Validation schemas (Zod) matching backend
   - Submit disabling during async operations
9. **Data Fetching**: 
   - Custom hooks for API calls (useProduct, useOrders, etc.)
   - React Query or SWR for advanced caching (to be considered)
   - Manual useState/useEffect for simple cases
10. **Styling**: 
    - Tailwind utility classes for rapid UI development
    - Component variants using class-variance-authority (cva)
    - Responsive design with mobile-first breakpoints
11. **Accessibility**: 
    - Semantic HTML elements
    - Proper ARIA labels and roles
    - Keyboard navigation support
    - Focus management
12. **Performance**: 
    - React.memo for expensive render components
    - useMemo/useCallback for expensive computations
    - Lazy loading with React.lazy and Suspense
    - Image optimization and lazy loading
13. **Analytics**: Track important user events (planned)
14. **SEO**: 
    - Proper meta tags (react-helmet-async)
    - Structured data for products (to be implemented)
    - Clean URLs with slugs

## Error Handling Guidelines

### Backend
1. **Validation Errors**: 
   - Use Zod to validate request bodies/params/queries
   - Return 400 with detailed error information
   
2. **Authentication Errors**: 
   - 401 for missing/invalid token
   - 403 for insufficient permissions
   
3. **Not Found Errors**: 
   - 404 for requested resources that don't exist
   
4. **Conflict Errors**: 
   - 409 for resource conflicts (e.g., duplicate email)
   
5. **Server Errors**: 
   - 500 for unexpected errors (logged but don't expose details to client)
   - Use middleware to catch and format errors
   
6. **Logging**: 
   - Log errors with sufficient detail for debugging
   - Never log sensitive information (passwords, tokens, etc.)
   
7. **Error Objects**: 
   - Create custom error classes for specific error types when beneficial
   - Include error codes for frontend handling

### Frontend
1. **API Errors**: 
   - Catch errors from service calls
   - Display user-friendly messages based on error type/status
   - Retry mechanisms for transient errors (to be implemented)
   
2. **Form Errors**: 
   - Field-level validation (show near field)
   - Form-level validation (show at top of form)
   - Disable submit during validation/submission
   
3. **Network Errors**: 
   - Show connection error messages
   - Offer retry option
   
4. **Empty States**: 
   - Show helpful messages when data is empty
   - Provide call-to-action when appropriate (e.g., "Add your first product")
   
5. **Loading States**: 
   - Show skeletons or spinners during data fetching
   - Disable interactive elements during loading
   
6. **Error Boundaries**: 
   - Catch JavaScript errors in component trees
   - Show fallback UI
   - Log errors to service (to be implemented)
   
7. **Console Logging**: 
   - Limit console.log in production
   - Use proper logging levels (debug, info, warn, error)
   - Remove debugging statements before commits

## Testing Guidelines (To Be Implemented)

### Backend Testing
1. **Unit Tests**: 
   - Test service functions in isolation
   - Mock database queries
   - Test validation logic
   - Frameworks: Jest or Vitest
   
2. **Integration Tests**: 
   - Test API endpoints with supertest
   - Test database interactions
   - Test authentication flows
   
3. **Test Coverage**: 
   - Aim for 80%+ coverage on critical paths
   - Focus on business logic and edge cases
   
4. **Test Organization**: 
   - `__tests__` folders or `.test.ts` suffix
   - Arrange-Act-Assert pattern
   - Descriptive test names

### Frontend Testing
1. **Unit Tests**: 
   - Test utility functions and custom hooks
   - Mock API calls and context values
   - Frameworks: Jest + React Testing Library
   
2. **Component Tests**: 
   - Test rendering with different props
   - Test user interactions (clicks, form inputs)
   - Test state changes
   
3. **E2E Tests**: 
   - Test critical user journeys (login, purchase, etc.)
   - Frameworks: Cypress or Playwright
   
4. **Accessibility Tests**: 
   - Automated axe-core testing
   - Manual keyboard/screen reader testing
   
5. **Visual Regression**: 
   - To be considered for UI consistency
   - Frameworks: Percy or Chromatic

## Deployment Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use `.env.example` as template for required variables
- Different environments: development, staging, production
- Secret management: Use vault services or platform secrets (AWS Secrets Manager, etc.)

### Database
- Migrations should be backward compatible when possible
- Backup strategy: Regular automated backups
- Connection pooling: Configure appropriately for expected load
- Read replicas: Consider for scaling read-heavy operations

### Asset Management
- Images: Optimize and serve appropriate sizes
- CDN: Serve static assets via CDN for global performance
- Caching: Proper cache headers for static assets
- Fingerprinting: Use content hashes for cache busting

### Monitoring & Logging
- Error tracking: Sentry or similar for production errors
- Performance monitoring: Track page load times, API response times
- Logging: Centralized logging (ELK stack, Datadog, etc.)
- Uptime monitoring: Pingdom or similar for availability alerts
- Business metrics: Track conversion rates, average order value, etc.

### Security
- HTTPS: Enforce HTTPS in production
- Headers: Implement security headers (CSP, HSTS, X-Frame-Options, etc.)
- Dependencies: Regularly update dependencies, scan for vulnerabilities
- Rate Limiting: Implement API rate limiting to prevent abuse
- Input Sanitization: While using parameterized queries, sanitize where appropriate
- File Uploads: Validate file types, scan for malware, store outside web root
- CSP: Content Security Policy to prevent XSS

## Troubleshooting Guide

### Common Backend Issues
1. **Database Connection Failures**
   - Check `.env` DATABASE_URL format
   - Verify PostgreSQL service is running
   - Check network connectivity and firewall rules
   
2. **Authentication Failures**
   - Verify JWT_SECRET matches between services
   - Check token expiration and cookie settings
   - Validate Google OAuth configuration and callback URLs
   
3. **File Upload Issues**
   - Check UPLOAD_DIR permissions and existence
   - Verify Multer configuration
   - Check file size limits
   
4. **API Route Issues**
   - Verify routes are mounted correctly in index.ts
   - Check middleware order (auth before controller)
   - Validate Zod schemas aren't too restrictive
   
5. **Performance Issues**
   - Check database query execution times (EXPLAIN ANALYZE)
   - Look for missing indexes on queried columns
   - Check for N+1 query problems
   - Consider caching frequent queries

### Common Frontend Issues
1. **API Connection Issues**
   - Check VITE_API_BASE_URL in .env
   - Verify CORS settings on backend
   - Check network tab in dev tools for failed requests
   
2. **State Management Issues**
   - Verify Context providers wrap consuming components
   - Check for stale closures in useCallback/useMemo
   - Verify dependency arrays in hooks
   
3. **Styling Issues**
   - Check Tailwind class names for typos
   - Verify responsive classes (md:, lg:, etc.)
   - Check for CSS specificity conflicts
   - Verify purge settings in tailwind.config (don't break in production)
   
4. **Performance Issues**
   - Bundle size analysis (use `npm run build` and check output)
   - Identify and remove unused dependencies
   - Lazy load routes and heavy components
   - Optimize images (compress, proper dimensions, next-gen formats)
   
5. **Hydration Mismatches** (SSR-like issues)
   - Ensure client and server render same content (if implementing SSR)
   - Check useEffect vs useLayoutUsage timing
   - Verify initial state matches between client and server

## Future Enhancements & Ideas

### Short-Term (Post-MVP)
1. **Wishlist/Save for Later**
2. **Product Reviews & Ratings**
3. **Email Marketing Integration** (Mailchimp, Klaviyo)
4. **Advanced Search** (filtering, sorting, faceted navigation)
5. **Order Tracking** for customers
6. **Inventory Alerts** (low stock notifications)
7. **Abandoned Cart Recovery**
8. **Gift Cards & Store Credit**

### Medium-Term
1. **Multi-language Support** (i18n)
2. **Multiple Currencies**
3. **Advanced Analytics** (cohort analysis, LTV, etc.)
4. **Customer Segmentation**
5. **Loyalty Programs**
6. **Subscription Products**
7. **Bulk Ordering for B2B**
8. **POS Integration** for physical stores

### Long-Term
1. **Marketplace Model** (third-party sellers)
2. **AR/VR Product Visualization**
3. **AI-Powered Recommendations**
4. **Voice Shopping Integration**
5. **Social Commerce** (Instagram, TikTok shopping)
6. **Sustainability Tracking** (carbon footprint, etc.)
7. **Advanced Personalization**
8. **Headless Commerce** (separate frontend/backend teams)

## Contact & Support

### Project Owner
- **Name**: Anthony Peter
- **Email**: antypeterke@gmail.com (admin Google OAuth email)
- **Role**: Founder/Product Lead

### Development
- **Primary Repository**: This GitHub repository
- **Issue Tracking**: GitHub Issues (recommended)
- **Documentation**: This CLAUDE.md, PROJECT_AUDIT.md, NEXT_STEPS.md
- **Code Reviews**: Pull request reviews
- **Knowledge Transfer**: Pairing sessions, documentation

### Emergency Contacts
- **Infrastructure**: [To be documented]
- **Security**: [To be documented]
- **Business**: [To be documented]

---
*This document serves as the single source of truth for project understanding. Update it when significant changes occur to the architecture, tech stack, or conventions.*