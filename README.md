# Notes
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/cadamsdev/notes/issues)

Note: This app is in early alpha. Expect breaking changes and bugs.

![Screenshot_8-6-2024_135854_chad lan](https://github.com/cadamsdev/notes/assets/12568665/c9797014-a246-4e1a-b9a6-a50f67a16928)

## Why another note app?
For taking technical notes I wanted a note taking app that is...
- Simple like Apple notes (but has code syntax highlighting)
- Block-based editor like Notion
- Works offline (Like Obsidian)
- Uses tags instead of a folder structure
  - Don't have to worry about categorizing your notes in a hierarchy, just create the note.
  - To categorize the notes add a tag (Also will help you find it)
- Works on Windows, Linux or Mac
- Self hostable
- Privacy respecting (no telemetry, no selling data)
- Secure
- Highly configurable
- Free and open-source

## Roadmap
- More blocks
- Light mode (currently only dark mode)
- Settings page
- AI Integration
- Password protected notes
- Graph view (like Obsidian)
- Plugins (Extensible)
- Desktop app
- Mobile app
- Support more architectures

## Supported architectures
| Architecture    | Support |
| -------- | ------- |
| x86-64 (AMD64)  | ✅ |
| ARM64 | ✅ |
| x86 (32-bit) | ❌ |

## Current Features
- Self-hostable
- Create notes
- Edit notes
- Search notes
- Add tags to notes
- Edit tags (tag name, color)
- Delete tags
- Block editor
    - Headings (h1, h2, h3)
    - Paragraphs
    - Bulleted list
    - Numbered lists
    - Inline code 
    - Code blocks
    - Divider
    - Quote

## Local development
1. Install dependencies
```
npm install
```
2. Start the development server
```
npm run dev
```
3. Navigate to http://localhost:5173/

## Self hosting with Docker

Docker compose is the easiest way to get started.

Create a `docker-compose.yml` file with the following:
```yaml
services:
  api:
    image: cadamsdev/notes-api:latest
    ports:
      - "3001:3001"
    volumes:
      - ./apps/api/data:/app/data
    environment:
      - PORT=3001
  web-app:
    image: cadamsdev/notes:latest
    ports:
      - "4173:4173"
    depends_on:
      - api
    environment:
      - PUBLIC_API_URL=http://localhost:3001
```

Run `docker compose up`

Navigate to http://localhost:4173/
