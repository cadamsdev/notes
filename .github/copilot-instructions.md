# Copilot Instructions for Notes App

## Architecture Overview

This is a **monorepo** with three main applications:
- **`apps/api/`** - Hono REST API with SQLite database using better-sqlite3
- **`apps/web-app/`** - Vue 3 SPA frontend with TipTap block editor
- **`apps/desktop-app/`** - Electron wrapper (in development)

**Key architectural decisions:**
- SQLite with WAL mode for local-first data storage
- Tag-based organization (no folders) with many-to-many relationships
- Block-based rich text editor using TipTap with JSON storage
- Dockerized deployment with separate API and web containers

## Design System

### **Minimalist Note-Taking Theme**
This app follows a clean, minimalist design optimized for note-taking and productivity:
- **Professional dark backgrounds** (#0d1117) for reduced eye strain
- **Subtle color hierarchies** for content organization without distraction
- **Gentle blue accents** (#58a6ff) for primary actions and focus states
- **Excellent typography contrast** for extended reading and writing
- **Clean, distraction-free interface** focused on content creation

### **Color Palette**
- **Primary**: #58a6ff (gentle blue) for focus and primary actions
- **Backgrounds**: Professional grays (#0d1117, #21262d, #373e47)
- **Text**: High contrast for readability (#f8f9fa, #e8eaed, #9aa0a6)
- **Borders**: Subtle and unobtrusive (#30363d, #21262d)
- **Tags**: Muted professional colors for organization without distraction

### **Component Styling Guidelines**
- Use **generous white space** and clean layouts
- Implement **subtle transitions** (duration-200, ease-out) for smooth interactions
- Apply **minimal but effective hover states** without being distracting
- Maintain **consistent spacing** optimized for reading and writing
- Use **semantic color tokens** that support long-form content creation

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
- **Vue composables** in `composables/` for data fetching (`useNotes`, `useSettings`)
- **Pinia stores** in `stores/` for UI state (modals)
- **Reactive refs and computed properties** for shared data across components

### Component Structure
Components follow atomic design in `components/`:
- Use `<script setup>` syntax with TypeScript
- Props are type-safe interfaces matching backend models
- **TailwindCSS with productivity-focused design tokens**
- Follow **minimalist note-taking patterns**: clean cards, subtle interactions, content-first design
- **Mobile responsive design** using Tailwind CSS v4 breakpoints (sm, md, lg, xl, 2xl)
- **Mobile-first approach** with progressive enhancement for larger screens
- **Always create reusable components** - extract UI elements into standalone components instead of writing inline markup
- **Component composition over duplication** - build complex UI by composing smaller, focused components

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

### **Note-Taking App Design Implementation**
- **Prioritize readability and writability** - optimize for extended reading and writing sessions
- **Minimize visual distractions** - clean interfaces that keep focus on content
- **Use professional, muted colors** - avoid bright or saturated colors that compete with content
- **Implement smooth, subtle interactions** - support workflow without being flashy
- **Design for productivity** - every element should serve the note-taking experience

### **Component Development**
- **Always create reusable components** - extract all UI elements into standalone components instead of writing inline markup
- **Component composition over duplication** - build complex UI by composing smaller, focused components
- **Extract UI patterns immediately** - whenever you create UI elements (buttons, cards, forms, lists), make them standalone components
- **Design for reusability** - use props, slots, and events to make components flexible and composable
- **Type-safe component interfaces** - define clear TypeScript interfaces for props and emits
- **Database changes**: Modify the `seed()` function in `apps/api/src/db.ts`
- **New components**: Place in appropriate `components/` subdirectory with TypeScript props
- **State management**: Use composables for data, Pinia stores for UI-only state
- **Styling**: Use design system colors and Tailwind CSS, prioritize content readability
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

### Implementing Note-Taking UI Components:
1. **Extract reusable patterns** - create standalone components for common UI elements (modals, calendars, input fields, etc.)
2. Use design system colors and Tailwind CSS
3. Prioritize content readability and writing comfort
4. Add smooth, non-distracting transitions (duration-200, ease-out)
5. Ensure excellent contrast ratios for extended reading
6. Follow minimalist, productivity-focused design principles
7. **Design for composition** - use props, slots, and events to make components flexible and reusable
8. **Implement mobile-first responsive design** using Tailwind CSS v4 breakpoints:
   - Start with mobile layout and enhance for larger screens
   - Use `sm:` (640px+), `md:` (768px+), `lg:` (1024px+), `xl:` (1280px+), `2xl:` (1536px+)
   - Ensure touch-friendly interactions on mobile devices
   - Optimize layouts for both portrait and landscape orientations
   - Test across different screen sizes and device types
