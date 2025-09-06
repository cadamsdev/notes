# Copilot Instructions for Notes App

## Architecture Overview

This is a **monorepo** with three main applications:
- **`apps/api/`** - Fastify REST API with SQLite database using better-sqlite3
- **`apps/web-app/`** - Nuxt 3 SPA frontend with TipTap block editor
- **`apps/desktop-app/`** - Electron wrapper (in development)

**Key architectural decisions:**
- SQLite with WAL mode for local-first data storage
- Tag-based organization (no folders) with many-to-many relationships
- Block-based rich text editor using TipTap with JSON storage
- Dockerized deployment with separate API and web containers

## Design System

### **X-Inspired Modern Dark Theme**
This app follows X's refined design language with:
- **Pure black backgrounds** (#000000) for maximum contrast
- **Subtle gray hierarchies** for content organization
- **Signature blue accents** (#1d9bf0) for primary actions
- **Refined typography** with improved readability
- **Minimalist aesthetics** with clean lines and purposeful spacing

### **Color Palette**
- **Primary**: #1d9bf0 (X blue) with hover states
- **Backgrounds**: Pure black to dark grays (#000000, #16181c, #202327)
- **Text**: High contrast whites and grays (#ffffff, #e7e9ea, #71767b)
- **Borders**: Subtle grays (#2f3336) for clean separation
- **Status**: Modern success/error/warning colors

### **Component Styling Guidelines**
- Use **rounded corners** (rounded-lg, rounded-full for inputs)
- Implement **smooth transitions** (duration-200, ease-out)
- Apply **subtle hover effects** with color and scale changes
- Maintain **consistent spacing** using Tailwind's spacing scale
- Use **semantic color tokens** from the design system

## Development Workflow

### Starting the Development Environment
```bash
bun run dev  # Starts API first, then web app when API health check passes
# OR individually:
bun run api:dev  # Port 3001
bun run web:dev  # Port 3000
```

### Database Schema
Located in `apps/api/src/db.ts` - uses auto-seeding pattern:
- `notes` table with JSON content storage
- `tags` table with name/color
- `note_tags` junction table for many-to-many relationships
- `settings` table for user preferences

## Code Patterns & Conventions

### Frontend State Management
- **Nuxt composables** in `composables/` for data fetching (`useNotes`, `useSettings`)
- **Pinia stores** in `stores/` for UI state (modals)
- **Global state** via `useState()` for shared data across components

### Component Structure
Components follow atomic design in `components/`:
- Use `<script setup>` syntax with TypeScript
- Props are type-safe interfaces matching backend models
- **TailwindCSS with X-inspired design tokens** in `nuxt.config.ts`
- Follow **modern X design patterns**: clean cards, subtle borders, refined spacing

### API Patterns
- RESTful endpoints with consistent error handling
- Database operations use prepared statements
- Auto-incrementing IDs with `lastInsertRowid`
- Foreign key constraints with cascade deletes

### Editor Integration
`components/Editor.vue` uses TipTap with:
- Custom CodeBlock extension in `lib/tiptap/extensions/`
- Debounced auto-save (500ms) that updates both content and title
- JSON content format stored in database

## Critical Integration Points

### API-Frontend Communication
- Runtime config: `PUBLIC_API_URL` environment variable
- Type sharing: Duplicate interfaces in `apps/api/src/models/` and `composables/useNotes.ts`
- Error handling: Frontend assumes API success, minimal error boundaries

### Build & Deployment
- **Development**: Uses `wait-on` to ensure API readiness before starting frontend
- **Production**: Docker Compose with volume mounts for SQLite persistence
- **Database**: Auto-creates in `apps/api/data/` directory with WAL mode

### Search & Filtering
- Client-side search using Fuse.js in `useNotes` composable
- Tag filtering with intersection logic for multiple tag selection
- Real-time filtering without backend queries

## Development Guidelines

### **X-Like Design Implementation**
- **Prioritize contrast and readability** - use high contrast text on dark backgrounds
- **Implement smooth micro-interactions** - hover states, focus rings, transitions
- **Use consistent component patterns** - cards, modals, inputs should follow X design language
- **Apply semantic spacing** - consistent margins, padding, and component sizing
- **Maintain visual hierarchy** - clear text sizes, weights, and color usage

### **Component Development**
- **Database changes**: Modify the `seed()` function in `apps/api/src/db.ts`
- **New components**: Place in appropriate `components/` subdirectory with TypeScript props
- **State management**: Use composables for data, Pinia stores for UI-only state
- **Styling**: Use design system tokens from `nuxt.config.ts`, avoid hardcoded colors
- **Editor features**: Extend TipTap in `lib/tiptap/extensions/` directory

## Common Tasks

### Adding a new API endpoint:
1. Add route handler in `apps/api/src/index.ts`
2. Add database function in `apps/api/src/db.ts`
3. Update frontend composable in `composables/useNotes.ts`

### Adding new note content types:
1. Create TipTap extension in `lib/tiptap/extensions/`
2. Register in `components/Editor.vue`
3. Update content JSON schema handling

### Modifying the database:
1. Update `seed()` function in `apps/api/src/db.ts`
2. Consider migration strategy for existing data
3. Update TypeScript interfaces in both API and frontend

### Implementing X-like UI Components:
1. Use design system colors and tokens from `nuxt.config.ts`
2. Implement consistent hover and focus states
3. Add smooth transitions (duration-200, ease-out)
4. Ensure proper contrast ratios and accessibility
5. Follow X's minimalist design principles
