# AI AGENT GUIDELINES & RULES

## 1. Project Context & Tech Stack
- **Framework**: Next.js 16 (App Router) with Turbopack.
- **Language**: TypeScript (Strict Mode enabled).
- **Styling**: Tailwind CSS v4.
- **Components**: Shadcn/UI (Radix UI primitives).
- **Forms & Validation**: React Hook Form + Zod.
- **Icons**: Lucide React.
- **State Management**: React Context or URL state (Nuqs) where applicable. Prefer server state.
- **Date Handling**: date-fns.

## 2. Coding Standards
### TypeScript Rules
- **No `any`**: Explicitly define interfaces or types for all props and state. Avoid using `any` at all costs.
- **Interfaces over Types**: Use `interface` for object definitions and `type` for unions/intersections/aliases.
- **Strict Typing**: Ensure all function arguments, return types, and API responses are strictly typed.

### Next.js 16 Best Practices
- **Server Components by Default**: Assume all components are Server Components. Add `'use client'` only when using React hooks (`useState`, `useEffect`) or event listeners.
- **Data Fetching**: Use standard `fetch` or server actions. Leverage Next.js caching unless explicitly opting out.
- **Image Optimization**: Always use `next/image`.
- **Modularity**: Keep client components at the leaf nodes of the component tree whenever possible to maximize server rendering.

### Code Structure
- **Functional Components**: Use strict functional components with named exports.
- **Hooks**: Isolate logic into custom hooks (`src/hooks/use-hook-name.ts`) if logic exceeds 10 lines or is reusable.
- **File Naming**:
  - Components: `kebab-case.tsx` (e.g., `user-profile.tsx`).
  - Pages: `page.tsx` within folders.
  - Layouts: `layout.tsx`.
- **Directory Structure**:
  - `src/app`: Routes and layouts.
  - `src/components`: UI components (Shadcn) and feature-specific components.
  - `src/lib`: Utilities and helpers.
  - `src/api`: API integration layers.
  - `src/types`: Global type definitions.

### Tailwind CSS v4
- **Styling**: Use utility classes. Avoid `@apply` in CSS files unless creating reusable text layers.
- **Consistency**: Use existing Shadcn variables (e.g., `bg-background`, `text-foreground`, `border-border`) to ensure theme compatibility (Dark/Light mode).
- **Responsive Design**: Mobile-first approach.

## 3. Security & Performance
- **Secrets**: NEVER output `.env` values or API keys in chat or artifacts.
- **Sanitization**: Ensure user input is sanitized.
- **Optimization**: Use `next/dynamic` for heavy components below the fold.

## 4. Agent Behavior & Workflow
- **Plan First**: Before writing complex features, create a brief "Implementation Plan" artifact.
- **Verify**: After generating code, run `npm run lint` and `npm run build` to ensure stability.
- **Tests**: If creating complex utilities, generate a `.test.ts` file.
- **Safe Operations**: Ask for explicit confirmation before destructive commands (delete, force push).

## 5. Error Handling
- **Boundaries**: Use `error.tsx` in route segments.
- **API**: Wrap external calls in `try/catch` and return typed error responses.
- **Toast Notifications**: Use `sonner` for user-facing feedback (success/error states).

## 6. Reference Implementations (GOLDEN SAMPLES)
- **Component Pattern**: Refer to `src/components/ui` for Shadcn patterns or `src/components/stats-card.tsx` (if available) for custom UI.
- **API Pattern**: Refer to `src/api/auth` or `src/api/admin` for fetching logic.
- **Layout Pattern**: Refer to `src/app/role-based-layout.tsx` or `src/app/dashboard/layout.tsx`.

**CRITICAL**: When creating new components, analyze these references to match the project's coding style exactly.
