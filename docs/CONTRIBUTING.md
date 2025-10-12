## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure CI passes before requesting review

## 🛠️ Development

### Project Structure

```
notes-app/
├── desktop/              # Tauri application workspace
│   ├── src/             # Vue 3 frontend
│   │   ├── components/  # Vue components
│   │   ├── styles/      # Tailwind CSS
│   │   └── utils/       # Utilities
│   ├── src-tauri/       # Rust backend
│   │   └── src/         # Tauri commands
│   └── package.json     # Frontend dependencies
├── .github/
│   └── workflows/       # CI/CD pipelines
└── package.json         # Root workspace config
```

### Tech Stack

**Frontend:**
- Vue 3 (Composition API with `<script setup>`)
- TypeScript
- Tailwind CSS v4
- Vite
- Marked (Markdown parser)
- Fuse.js (Fuzzy search)

**Backend:**
- Tauri v2
- Rust
- SQLite (via tauri-plugin-sql)

**Build Tools:**
- Bun (package manager)
- Cargo (Rust build tool)

### Development Commands

```bash
# Start dev server
cd desktop
bun run tauri dev

# Run tests (Rust)
cd desktop/src-tauri
cargo test

# Format Rust code
cargo fmt

# Lint frontend
cd desktop
bun run lint

# Build for production
bun run tauri build
```

### Environment Variables

Create `.env` in `desktop/`:

```bash
# Use test database (for development)
VITE_USE_TEST_DB=true
```

---

## 🧪 Testing

### Frontend
```bash
cd desktop
bun run lint
```

### Backend (Rust)
```bash
cd desktop/src-tauri
cargo test
cargo fmt --check
```
