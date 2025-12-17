# Brutal Notes - AI Agent Instructions

## Project Overview

**Brutal Notes** is a Neo-Brutalist, no-framework note-taking Progressive Web App (PWA). Pure HTML/CSS/JavaScript with zero dependencies, designed for offline-first usage and installability across Web, iOS, and Android platforms.

**Key Principle:** Brutalist design philosophy = stripped-down, high-contrast UI with raw productivity. No frameworks, no bloat.

## Architecture

### Single-Page Application Pattern

- **Core Class:** `BrutalNotesApp` (script.js) - Singleton managing all app state
- **Storage:** Browser localStorage with JSON serialization (`brutalNotes_documents`, `brutalNotes_archived`)
- **Rendering:** Direct DOM manipulation, no virtual DOM or templating library
- **Styling:** Custom CSS (styles.css) with explicit brutalist color scheme: `#1D1D1B` (black), `#EF8354` (orange), `#EAC119` (yellow)

### Data Model

```javascript
// Document structure stored in localStorage
documents: {
  'doc-id-001': {
    name: 'Document Title',
    title: 'Document Title',
    content: '<html-content>',
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

// Reserved document IDs (always in memory, templates from code):
// 'getting-started', 'home', 'todo-list', 'kanban-board', 'profile', 'project', 'library'
```

### Document Lifecycle

1. **Load:** `loadDocument(docId)` → fetches from localStorage or uses template
2. **Edit:** contentEditable divs with rich text support via document.execCommand()
3. **Save:** `saveDocument()` → serializes DOM content to localStorage on blur/change
4. **Archive:** `archiveDocument(docId)` → moves to separate `brutalNotes_archived` storage

## Key Components & Workflows

### Adding Features to Documents

**Pattern:** All documents use contentEditable blocks with manual event listener attachment.

```javascript
// Example: Adding a new editable element
const elem = document.createElement('div');
elem.className = 'text-block';
elem.contentEditable = true;
elem.addEventListener('input', () => this.saveDocument());

// Re-attach listeners after DOM updates via attachContentListeners()
```

**Critical:** After dynamically inserting content, call `attachContentListeners()` to rebind event handlers.

### Saving Changes

- **Trigger:** Input events on `.text-block`, `.heading-block`, todo/kanban items, form changes
- **Method:** `saveDocument()` - serializes current DOM content into localStorage
- **Format:** HTML strings stored directly (no markdown conversion in storage)

### Rich Text Editing

Uses native contentEditable + `document.execCommand()` for formatting:
- Bold, italic, underline, strikethrough via format buttons
- Font size/family via dropdowns
- Code blocks & tables via custom HTML insertion
- No external WYSIWYG editor—all formatting manual

### Block Types

1. **Text Block** - `.text-block` with contentEditable
2. **Heading** - `.heading-block` with contentEditable
3. **Code Block** - `.code-block` with `<pre>` + language label
4. **Table** - `.table` with `.table-row` / `.table-data` grid
5. **Todo List** - `.todo-item` with checkbox + text, input-driven
6. **Kanban** - `.kanban-column` with drag-ready `.kanban-item` cards

## Critical Developer Workflows

### Setting Up Local Dev

```bash
# Simple HTTP server (any of these work):
npx serve .                    # Node.js
python -m http.server 8000    # Python
php -S localhost:8000         # PHP
```

No build step required. Changes to HTML/CSS/JS take effect on refresh.

### Testing PWA Features Locally

1. Serve with HTTPS (ngrok, local self-signed cert, or use GitHub Pages)
2. Open DevTools → Application tab → Service Workers to check registration
3. Test offline mode by toggling airplane mode in DevTools Network tab
4. Test install prompt: Chrome → address bar icon, Safari → Share → Add to Home Screen

### iOS/Android Deployment Options

- **PWA Web Link** - Deploy to GitHub Pages, Netlify, or Vercel; users add to home screen
- **Capacitor Native Build** - Run `npx cap init`, `npx cap add ios/android`, `npx cap open ios/android`, build in Xcode/Android Studio
- **Electron Desktop** - electron-main.js exists; minimal setup for Windows/Mac/Linux

### Exporting User Data

Documents export via:
- **PDF, Markdown, Text, HTML** via `showExportMenu()` → DOM serialization to file
- Uses native browser APIs (no external libs), direct innerHTML/textContent capture

## Project-Specific Patterns

### Document ID Generation

```javascript
// Auto-increment counter appended to timestamp:
this.documentCounter++;
const docId = `doc-${Date.now()}-${this.documentCounter}`;
```

### Event Delegation Gotcha

Direct `.addEventListener()` on DOM elements. After DOM changes, listeners must be re-attached via `attachContentListeners()`. Watch for missing handlers on dynamically added blocks.

### No Framework Implications

- **Rendering:** Manual string concatenation and innerHTML assignment
- **Validation:** Inline null/undefined checks; see `loadSavedDocuments()` for try-catch patterns
- **Performance:** Acceptable for single-user app; avoid large bulky documents (localStorage limits ~5-10MB)
- **Testing:** No test infrastructure; QA is manual browser testing

### Color Palette (CSS Variables Not Used)

Use hex codes directly:
- **Background:** `#1D1D1B` (dark charcoal)
- **Accent:** `#EF8354` (brutalist orange)
- **Highlight:** `#EAC119` (brutalist yellow)
- **Borders:** 3-4px solid `#1D1D1B` for chunky, high-contrast look

## Integration Points

### Service Worker (sw.js)

Minimal stub—only logs install. Extend for offline caching strategy:
```javascript
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request) || fetch(e.request));
});
```

### Manifest (manifest.json)

PWA metadata. Update `name`, `short_name`, `start_url`, `icons` when branding changes. Icons in `/icons/` directory (multiple sizes for maskable support).

### Capacitor Integration (capacitor.config.json)

For native builds. Key settings:
- `appId`: `com.yeatz.brutalnotes`
- `appName`: Displayed on home screen
- `webDir`: `./` (root serves app)

## Common Modification Points

| Feature | File | Pattern |
|---------|------|---------|
| Add new default document template | script.js `getDocumentContent()` | Return HTML string |
| Add new toolbar button | index.html `.toolbar` | Add `<button class="format-btn" data-command="...">` |
| Change color scheme | styles.css | Replace `#1D1D1B`, `#EF8354`, `#EAC119` |
| Fix missing event handlers | script.js | Call `attachContentListeners()` after DOM changes |
| Modify PWA icon/title | manifest.json | Update `name`, `icons[].src` |
| Add keyboard shortcut | script.js `setupEventListeners()` | Add `document.addEventListener('keydown', ...)` |

## Gotchas & Edge Cases

1. **localStorage Quota:** ~5-10MB per origin. Large documents (100+ pages) may exceed limit. Consider IndexedDB migration for future scaling.
2. **contentEditable Quirks:** Browser inconsistencies in formatting. Test across Chrome, Firefox, Safari, Mobile Safari.
3. **Archived Documents:** Stored separately; deletion is permanent once moved to archive. No undo.
4. **Font Size via execCommand:** Uses deprecated `<font>` tag; modern CSS approach preferred but kept for simplicity.
5. **Mobile Sidebar Toggle:** `.mobile-menu-toggle` handled via CSS media query + JS toggle; test responsive behavior.

## Next Steps for Contributors

1. **Understand the current workflow:** Load app, create document, edit content, refresh page—confirm localStorage persistence
2. **Modify a template:** Edit `'getting-started'` content in `getDocumentContent()`, test in browser
3. **Add a new toolbar button:** Insert HTML, wire up `setupEventListeners()` handler, test formatting
4. **Test PWA offline:** Use Chrome DevTools Network throttling → set to offline, verify app remains usable
5. **Package for iOS:** Follow `ios-deployment.md`; use Capacitor for native build or web PWA link

---

**Last Updated:** December 2025  
**Maintainer:** yeatz  
**License:** MIT
