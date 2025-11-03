# EduZen - Next.js Application

EduZen is a fullstack AI-powered learning platform that helps students and teachers manage classrooms, generate tests, and track learning progress.

• Code Style

- Write concise, technical JavaScript code
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
- Don't repeat functionality or code
- Keep code organized and consistent across the codebase
- Always return data from fetchers and actions in following format: `{ data: value | null, error: string | null }`
- Always wrap fetchers and actions within try-catch block

• App Router Structure (Next.js 15)

- Every page.jsx should be a server component by default, use 'use client' directive when browser APIs are needed
- Use route groups (folders with parentheses) to organize routes without affecting URL structure: (auth), (dashboard), (app)
- Server components should handle data fetching directly
- Use async/await for all server components that fetch data
- Leverage Next.js 15 features: partial prerendering, parallel routes, and intercepting routes when appropriate
- All middleware logic should be defined in middleware.js at root level

• Server Components & Data Fetching

- Prefer Server Components over Client Components (default to Server Components)
- Use async Server Components for data fetching: `export default async function Page() {}`
- Leverage Next.js 15 streaming and Suspense boundaries for loading states
- Use generateStaticParams for static routes with dynamic segments
- Implement generateMetadata for SEO and dynamic metadata
- Use unstable_cache when appropriate for data caching

• Server Actions (Next.js 15)

⚠️ **IMPORTANT**: Server Actions should ALWAYS be prioritized over API routes. API routes should only be used when Server Actions are not suitable, such as:
  - Third-party integrations (webhooks, OAuth callbacks, etc.)
  - Long-processing tasks that need separate handling
  - Public endpoints that don't require form submissions
  - Legacy compatibility requirements

- Always use 'use server' directive at the top of server action files
- Use inline server actions (with 'use server') within server components when appropriate
- Use bind for form actions to pass additional parameters
- Revalidate paths and cache after mutations using revalidatePath() and revalidateTag()
- Handle ALL form submissions with server actions instead of API routes
- Use useFormStatus for form pending states in Client Components
- Prefer server actions for data mutations, database operations, and server-side logic

• Folder Structure

- All server actions should be defined within /actions folder
- All data fetchers should be defined within /fetchers folder
- Use lowercase with dashes as file naming conventions for both actions and fetchers
- All forms should be defined within /components/forms folder
- All modals should be defined within /components/modals folder
- All configuration files must be defined within /config folder
- All constant data must be defined within /constants folder
- All custom hooks must be defined within /hooks folder
- Always add css/scss files to /styles folder
- Always add any third-party providers to /providers folder and use it in /providers/index.jsx file
- Use route groups for organizing pages: (auth)/login/page.jsx, (dashboard)/settings/page.jsx
- Use loading.jsx files for route-level loading states
- Use error.jsx files for route-level error boundaries
- Use not-found.jsx files for 404 handling
- Use layout.jsx files for shared layouts per route

• Client Components

- Limit 'use client' directive to only interactive components that need browser APIs
- Keep Client Components small and colocated with data fetching logic in parent Server Components
- Use React Server Components pattern: Server Component as parent, Client Component for interactivity
- Prefer passing data as props from Server Components rather than fetching in Client Components

• Naming Conventions

- All components should go in /components and be named like new-component.jsx
- Use lowercase with dashes for directories (e.g., components/auth-wizard)
- Don't define custom components within /ui folder
- Favor named exports for components
- Route folders should be lowercase with dashes: user-profile/page.jsx

• Metadata & SEO

- Export metadata object or generateMetadata function in page.jsx and layout.jsx
- Use Next.js Metadata API for dynamic metadata generation
- Implement Open Graph and Twitter Card metadata for social sharing

• UI and Styling

- Always use colors from tailwind.config.js, without opacity variants i.e. bg-background instead of bg-background/40
- Implement responsive design with Tailwind CSS
- Make sure everything you produce is mobile-friendly
- Avoid customizing base components with className unless necessary, i.e. <Card/> instead of <Card className="blah blah blah">
- Don't change element sizes on hover
- Keep UI consistent across pages
- In dialogs the cancel button should be on the right, the action button on the left, only ever have max 2 buttons in a dialog
- Use modern UI/UX design patterns

• Component Library (shadcn/ui)

- Never create components from scratch - always check if shadcn/ui has the component available first
- Use `npx shadcn@latest add [component-name]` to install shadcn/ui components
- Only create custom components when shadcn/ui doesn't provide the required functionality
- Extend shadcn/ui components by wrapping them rather than modifying their source code
- Keep all shadcn/ui components in the /components/ui folder as per their convention
- Use shadcn/ui's built-in variants and styling system instead of custom CSS

• Icons

- Never create SVGs from scratch - always use lucide-react icons
- Import icons from lucide-react: `import { IconName } from 'lucide-react'`
- Use lucide-react icons for all UI elements that need icons
- Only create custom SVGs when lucide-react doesn't have the specific icon needed

• Forms

- Always use shadcn/ui Form components with react-hook-form for all form inputs
- Use Form from shadcn/ui even for the smallest single input forms
- Leverage react-hook-form's validation and error handling capabilities
- Use FormField, FormItem, FormLabel, FormControl, and FormMessage components
- Never create custom form inputs when shadcn/ui Form components are available
- Use zod for form validation schemas with react-hook-form

• Performance Optimization

- Minimize Client Component re-renders
- Use Next.js Image component for all images with proper width/height
- Leverage automatic code splitting with App Router
- Use dynamic imports with 'use client' for heavy Client Components
- Implement Suspense boundaries for streaming and loading states
- Use loading.jsx for route-level loading states
- Leverage Next.js caching strategies: fetch cache, router cache, full route cache

• Animations

- Always use Motion (latest package) instead of Framer Motion for animations
- Import from 'motion/react' for React components: `import { motion } from 'motion/react'`
- Use Motion's modern API and performance optimizations
- Prefer Motion over CSS animations for complex interactions
- Use Motion's built-in variants and orchestration features

• Next.js Specific Patterns

- Always use Next.js Link component for internal navigation (same-origin links)
- Only use anchor tags (<a>) for external links, email links (mailto:), or file downloads
- Never use anchor tags for internal navigation - always use Link from 'next/link'
- Use Next.js router for programmatic navigation
- Implement proper error boundaries with error.jsx files
- Use not-found() function for custom 404s
- ⚠️ **PRIORITIZE SERVER ACTIONS**: Use route handlers (API routes) ONLY when Server Actions are not suitable:
  - Webhooks from third-party services
  - OAuth callbacks and external integrations
  - Long-running tasks that require separate endpoints
  - Public APIs that need to be accessed externally
- Use cookie-based or header-based authentication patterns
- All API routes should use route.js files in /app/api folder structure
- For internal application logic, always prefer Server Actions over fetch() calls to API routes

• Key Conventions

- Always prioritize Server Components (default)
- Use Client Components only when necessary ('use client' directive)
- ⚠️ **CRITICAL**: Server Actions > API Routes - Always use Server Actions for internal application logic, form handling, and data mutations. API routes are exceptions, not the rule
- Avoid using space-x and space-y, instead use flex and gap e.g. flex flex-row gap-2
- Leverage Next.js built-in patterns before introducing external solutions
- Keep Server and Client boundaries clear and well-defined
- Use npm or the project's configured package manager for all dependency management
- Always check package.json before installing anything new to avoid duplicates
- All API routes should be in /app/api folder with route.js files (use sparingly)
- Use .jsx extension for React components
- Use .js extension for utilities and non-component files

• Code Quality

- Use proper quotes: single quotes for strings, backticks for template literals
- Follow consistent formatting and indentation
- Use meaningful variable and function names
- Avoid unused imports and variables
- Use proper semicolons and trailing commas where appropriate
- Write clean, readable code that follows JavaScript best practices

Always write comments to explain your code.
When writing tests, never use class based selectors, only use visual selectors like text or role. If really necessary use data-testid as a last resource.

• Documentation

- Never create README, documentation, or markdown files unless explicitly requested by the user
- Do not add comments or documentation files proactively
- Focus on code implementation rather than documentation
