<div align="center">

# 📝 NoteX

### A Modern, Minimalist Note-Taking App

*Fast • Beautiful • Cross-Platform • Cloud-Syncable*

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/cadamsdev/notes-app/issues)
[![Built with Tauri](https://img.shields.io/badge/Built%20with-Tauri-24C8DB?logo=tauri)](https://tauri.app/)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js)](https://vuejs.org/)

![NoteX Preview](./media/preview.png)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Cloud Sync](#-cloud-sync) • [Development](#-development) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎨 **Beautiful Design**
- **SpaceX-Inspired UI** - Clean, minimal black/white aesthetic with glassmorphism effects
- **Light & Dark Mode** - Seamless theme switching with automatic system preference detection
- **Frosted Glass Panels** - Modern backdrop blur effects for a premium feel
- **Responsive Layout** - Optimized for various screen sizes

### 📅 **Smart Organization**
- **Calendar View** - Visual calendar with note count indicators per day
- **Tag System** - Organize notes with hashtags (`#work`, `#personal`, etc.)
- **Advanced Search** - Fuzzy search with real-time filtering
- **Date Filtering** - Quickly find notes by date

### ⚡ **Performance**
- **Native Performance** - Built with Tauri (Rust + Vue 3) for blazing fast speeds
- **Infinite Scroll** - Smooth loading of large note collections
- **SQLite Database** - Fast, reliable local storage
- **Hot Module Replacement** - Instant updates during development

### 🔄 **Cloud Sync**
- **Custom Database Location** - Save your notes anywhere
- **Multi-Device Sync** - Use with OneDrive, Google Drive, Dropbox, or any cloud storage
- **Automatic Migration** - Seamless database copying when changing locations
- **Cross-Platform** - Sync notes between Windows, macOS, and Linux

### 📝 **Markdown Support**
- **GitHub Flavored Markdown** - Full GFM support
- **Live Preview** - See formatted markdown in real-time
- **Syntax Highlighting** - Code blocks with proper formatting

### 🛠️ **Developer-Friendly**
- **Open Source** - GPL-3.0 licensed
- **Modern Stack** - Vue 3 Composition API + TypeScript + Tailwind CSS v4
- **Monorepo Structure** - Clean organization with Bun workspaces
- **CI/CD Ready** - GitHub Actions workflows included

---

## 📦 Installation

### Download Pre-built Binaries

**Coming Soon!** Check the [Releases](https://github.com/cadamsdev/notes-app/releases) page for platform-specific installers.

### Build from Source

#### Prerequisites
- [Bun](https://bun.sh/) (package manager)
- [Rust](https://www.rust-lang.org/) (for Tauri backend)
- [Node.js](https://nodejs.org/) (optional, for compatibility)

#### Steps

```bash
# Clone the repository
git clone https://github.com/cadamsdev/notes-app.git
cd notes-app

# Install dependencies
bun install

# Run in development mode
cd desktop
bun run tauri dev

# Build for production
bun run tauri build
```

The built application will be in `desktop/src-tauri/target/release/bundle/`.

---

## 🚀 Usage

### Creating Notes

1. Click the **"What's on your mind?"** text area
2. Type your note using markdown syntax
3. Click **Create Note** or press `Ctrl+Enter`

### Using Tags

Add hashtags anywhere in your note:
```markdown
Meeting notes for #project #work tomorrow at 2pm
Remember to bring #documents
```

Tags automatically appear in the sidebar for easy filtering.

### Search & Filter

- **Search Bar**: Fuzzy search across all notes
- **Calendar**: Click any date to filter notes from that day
- **Tags Panel**: Click tags to filter (supports multiple tags)

### Markdown Examples

```markdown
# Heading 1
## Heading 2

**Bold text** and *italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item

`inline code` and code blocks:

```js
function hello() {
  console.log("Hello, NoteX!");
}
```

[Links](https://github.com) and images work too!
```

---

## ☁️ Cloud Sync

NoteX supports saving your database to cloud storage for multi-device synchronization.

### Setup Cloud Sync

1. **Open Settings** (⚙️ icon in top-right)
2. Click **"Change Database Location"**
3. Select your cloud storage folder:
   - Windows: `C:\Users\YourName\OneDrive\Notes`
   - macOS: `~/Library/CloudStorage/OneDrive-Personal/Notes`
   - Linux: `~/OneDrive/Notes`
4. The app will copy your database and reload

### Multi-Device Setup

1. Set up cloud sync on your first device
2. On other devices, point to the **same cloud folder**
3. Your notes sync automatically via your cloud service

⚠️ **Important**: Only open NoteX on one device at a time to avoid database conflicts.

📖 **Full Guide**: See [CLOUD_SYNC_GUIDE.md](./CLOUD_SYNC_GUIDE.md) for detailed instructions.

---

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

### CI/CD

GitHub Actions workflows automatically:
- ✅ Lint frontend code
- ✅ Check Rust formatting
- ✅ Run Rust tests
- ✅ Build application on Windows, macOS, and Linux

---

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

---

## 📝 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Tauri Team** - For the amazing framework
- **Vue.js Team** - For Vue 3 and its excellent ecosystem
- **Tailwind CSS** - For the utility-first CSS framework
- **SpaceX** - Design inspiration

---

## 📧 Contact

**Chad Adams**
- GitHub: [@cadamsdev](https://github.com/cadamsdev)
- Repository: [notes-app](https://github.com/cadamsdev/notes-app)

---

<div align="center">

**If you find NoteX useful, please consider giving it a ⭐ on GitHub!**

Made with ❤️ by [Chad Adams](https://github.com/cadamsdev)

</div>
