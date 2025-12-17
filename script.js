// Simplified Brutal Notes App
class BrutalNotesApp {
    constructor() {
        this.currentDocument = 'getting-started';
        this.documents = {}; // Store document data
        this.archivedDocuments = {}; // Store archived documents
        this.documentCounter = 0; // Counter for unique document IDs
        this.init();
    }

    init() {
        // Load saved documents from localStorage
        this.loadSavedDocuments();
        this.setupEventListeners();
        this.loadDocument('dashboard');
        this.setupDocumentTitleListener();
        console.log('🚀 Brutal Notes App Loaded!');
    }

    setupDocumentTitleListener() {
        const titleElement = document.querySelector('.document-title');
        if (titleElement) {
            titleElement.addEventListener('blur', () => {
                this.renameCurrentDocument();
            });
            titleElement.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.target.blur();
                }
            });
        }
    }

    loadSavedDocuments() {
        try {
            const saved = localStorage.getItem('brutalNotes_documents');
            if (saved) {
                this.documents = JSON.parse(saved);
                // Update document counter based on existing documents
                const docIds = Object.keys(this.documents);
                if (docIds.length > 0) {
                    const maxNum = Math.max(...docIds.map(id => {
                        const match = id.match(/doc-\d+-(\d+)/);
                        return match ? parseInt(match[1]) : 0;
                    }));
                    this.documentCounter = maxNum;
                }
                // Restore document list items
                this.restoreDocumentList();
            }
            
            // Load archived documents
            const archived = localStorage.getItem('brutalNotes_archived');
            if (archived) {
                this.archivedDocuments = JSON.parse(archived);
            }
        } catch (e) {
            console.log('Could not load saved documents:', e);
        }
    }

    restoreDocumentList() {
        const customDocumentList = document.querySelector('#customDocumentList');
        if (!customDocumentList) return;
        
        Object.keys(this.documents).forEach(docId => {
            const doc = this.documents[docId];
            // Skip if it's a default document
            if (docId === 'getting-started' || docId === 'todo-list' || docId === 'kanban-board' || docId === 'profile' || docId === 'home' || docId === 'project' || docId === 'library') {
                return;
            }
            
            const docItem = document.createElement('li');
            docItem.className = 'document-item';
            docItem.dataset.doc = docId;
            docItem.innerHTML = `
                <svg class="doc-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    <rect x="7" y="13" width="10" height="1.5" rx="0.75"/>
                    <rect x="7" y="15.5" width="10" height="1.5" rx="0.75"/>
                    <rect x="7" y="18" width="7" height="1.5" rx="0.75"/>
                </svg>
                ${doc.name.toUpperCase()}
            `;
            
            docItem.addEventListener('click', () => {
                this.loadDocument(docId);
                this.setActiveDocument(docItem);
            });
            
            customDocumentList.appendChild(docItem);
        });
    }

    setupEventListeners() {
        // Document navigation
        document.querySelectorAll('.document-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const docName = item.dataset.doc;
                if (docName === 'home') {
                    this.loadDocument('getting-started');
                    const gettingStarted = document.querySelector('.document-item[data-doc="getting-started"]');
                    if (gettingStarted) {
                        this.setActiveDocument(gettingStarted);
                    }
                } else if (docName === 'pinned') {
                    this.showNotification(`${docName.toUpperCase()} - COMING SOON`);
                } else {
                    this.loadDocument(docName);
                    this.setActiveDocument(item);
                }
            });
        });

        // New document button
        document.querySelector('.new-doc-btn').addEventListener('click', () => {
            this.createNewDocument();
        });

        // New note button (middle panel)
        const newNoteBtn = document.querySelector('.new-note-btn');
        if (newNoteBtn) {
            newNoteBtn.addEventListener('click', () => {
                this.createNewNote();
            });
        }

        // Note list item clicks (middle panel)
        document.querySelectorAll('.note-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const noteName = item.dataset.note;
                this.loadDocument(noteName);
                // Update active state
                document.querySelectorAll('.note-list-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Action buttons
        document.querySelector('.action-btn.save').addEventListener('click', () => {
            this.saveCurrentDocument();
        });

        document.querySelector('.action-btn.delete').addEventListener('click', () => {
            this.deleteCurrentDocument();
        });

        document.querySelector('.action-btn.home').addEventListener('click', () => {
            this.loadDocument('getting-started');
        });

        document.querySelector('.action-btn.archive').addEventListener('click', () => {
            this.archiveCurrentDocument();
        });

        document.querySelector('.action-btn.profile').addEventListener('click', () => {
            this.loadDocument('profile');
            const profileItem = document.querySelector('.document-item[data-doc="profile"]');
            if (profileItem) {
                this.setActiveDocument(profileItem);
            }
        });

        // Mobile menu toggle
        const menuToggleBtn = document.querySelector('.menu-toggle-btn');
        const sidebar = document.querySelector('.sidebar');
        if (menuToggleBtn && sidebar) {
            menuToggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                document.body.classList.toggle('sidebar-open');
            });

            // Close sidebar when clicking overlay
            document.body.addEventListener('click', (e) => {
                if (document.body.classList.contains('sidebar-open') && 
                    !sidebar.contains(e.target) && 
                    !menuToggleBtn.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                    document.body.classList.remove('sidebar-open');
                }
            });
        }

        // Search functionality
        const searchInput = document.querySelector('#documentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchDocuments(e.target.value);
            });
        }

        // Formatting toolbar
        this.setupFormattingToolbar();

        // Register service worker
        this.registerServiceWorker();
    }

    setupFormattingToolbar() {
        // Format buttons
        document.querySelectorAll('.format-btn[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                document.execCommand(command, false, null);
                this.updateFormattingButtons();
            });
        });

        // Font size selector
        const fontSizeSelect = document.querySelector('#fontSize');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => {
                const size = e.target.value;
                document.execCommand('fontSize', false, '7'); // Use font tag
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const fontElements = range.commonAncestorContainer.parentElement.querySelectorAll('font[size="7"]');
                    fontElements.forEach(el => {
                        el.style.fontSize = size + 'px';
                        el.removeAttribute('size');
                    });
                }
            });
        }

        // Font family selector
        const fontFamilySelect = document.querySelector('#fontFamily');
        if (fontFamilySelect) {
            fontFamilySelect.addEventListener('change', (e) => {
                const fontFamily = e.target.value;
                document.execCommand('fontName', false, fontFamily);
            });
        }

        // Code block button
        const codeBlockBtn = document.querySelector('#codeBlockBtn');
        if (codeBlockBtn) {
            codeBlockBtn.addEventListener('click', () => {
                this.insertCodeBlock();
            });
        }

        // Table button
        const tableBtn = document.querySelector('#tableBtn');
        if (tableBtn) {
            tableBtn.addEventListener('click', () => {
                this.insertTableQuick();
            });
        }

        // Insert button
        const insertBtn = document.querySelector('#insertBtn');
        if (insertBtn) {
            insertBtn.addEventListener('click', () => {
                this.showInsertMenu();
            });
        }

        // Export button
        const exportBtn = document.querySelector('#exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.showExportMenu();
            });
        }

        // Update formatting buttons on selection change
        document.addEventListener('selectionchange', () => {
            this.updateFormattingButtons();
        });

        // Slash command button
        const slashCommandBtn = document.querySelector('#slashCommandBtn');
        if (slashCommandBtn) {
            slashCommandBtn.addEventListener('click', () => {
                this.showSlashCommandMenu();
            });
        }

        // Setup slash command listener in document body
        this.setupSlashCommandListener();
    }

    setupSlashCommandListener() {
        const documentBody = document.querySelector('.document-body');
        if (!documentBody) return;

        // Listen for / key during typing
        documentBody.addEventListener('keypress', (e) => {
            // Only trigger on mobile (≤768px)
            if (window.innerWidth > 768) return;

            if (e.key === '/') {
                e.preventDefault();
                this.showSlashCommandMenu();
            }
        });
    }

    showSlashCommandMenu() {
        // Prevent duplicate menus
        if (document.querySelector('.slash-command-menu')) {
            document.querySelector('.slash-command-menu').remove();
        }
        if (document.querySelector('.slash-command-overlay')) {
            document.querySelector('.slash-command-overlay').remove();
        }

        const menu = document.createElement('div');
        menu.className = 'slash-command-menu';
        menu.innerHTML = `
            <div class="slash-command-item" data-command="bold">Bold</div>
            <div class="slash-command-item" data-command="italic">Italic</div>
            <div class="slash-command-item" data-command="underline">Underline</div>
            <div class="slash-command-item" data-command="strikethrough">Strikethrough</div>
            <div class="slash-command-item" data-command="insertUnorderedList">Bullet List</div>
            <div class="slash-command-item" data-command="insertOrderedList">Numbered List</div>
            <div class="slash-command-item" data-command="blockquote">Quote</div>
            <div class="slash-command-item" data-command="code">Code</div>
            <div class="slash-command-item" data-command="heading">Heading</div>
            <div class="slash-command-item" data-command="table">Table</div>
        `;

        menu.querySelectorAll('.slash-command-item').forEach(item => {
            item.addEventListener('click', () => {
                const command = item.dataset.command;
                this.executeSlashCommand(command);
                menu.remove();
                overlay.remove();
            });
        });

        // Close on outside click
        const overlay = document.createElement('div');
        overlay.className = 'slash-command-overlay';
        overlay.addEventListener('click', () => {
            menu.remove();
            overlay.remove();
        });

        // Close on escape key
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                menu.remove();
                overlay.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        };
        document.addEventListener('keydown', closeHandler);

        document.body.appendChild(overlay);
        document.body.appendChild(menu);

        // Focus menu for keyboard navigation
        menu.querySelectorAll('.slash-command-item')[0]?.focus();
    }

    executeSlashCommand(command) {
        switch (command) {
            case 'bold':
                document.execCommand('bold', false, null);
                break;
            case 'italic':
                document.execCommand('italic', false, null);
                break;
            case 'underline':
                document.execCommand('underline', false, null);
                break;
            case 'strikethrough':
                document.execCommand('strikeThrough', false, null);
                break;
            case 'insertUnorderedList':
                document.execCommand('insertUnorderedList', false, null);
                break;
            case 'insertOrderedList':
                document.execCommand('insertOrderedList', false, null);
                break;
            case 'blockquote':
                document.execCommand('formatBlock', false, '<blockquote>');
                break;
            case 'code':
                this.insertCodeBlock();
                break;
            case 'heading':
                document.execCommand('formatBlock', false, '<h2>');
                break;
            case 'table':
                this.insertTableQuick();
                break;
        }
        this.saveDocument();
    }

    updateFormattingButtons() {
        document.querySelectorAll('.format-btn[data-command]').forEach(btn => {
            const command = btn.dataset.command;
            try {
                const isActive = document.queryCommandState(command);
                btn.classList.toggle('active', isActive);
            } catch (e) {
                // Ignore errors for unsupported commands
            }
        });
    }

    showInsertMenu() {
        const menu = document.createElement('div');
        menu.className = 'insert-menu';
        menu.innerHTML = `
            <button class="insert-menu-item" data-type="image">IMAGE</button>
            <button class="insert-menu-item" data-type="link">LINK</button>
            <button class="insert-menu-item" data-type="table">TABLE</button>
            <button class="insert-menu-item" data-type="hr">HORIZONTAL LINE</button>
        `;
        
        menu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            border: 4px solid #1D1D1B;
            padding: 20px;
            z-index: 10001;
            box-shadow: 8px 8px 0 #1D1D1B;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        menu.querySelectorAll('.insert-menu-item').forEach(item => {
            item.style.cssText = `
                background: #EAC119;
                color: #1D1D1B;
                border: 3px solid #1D1D1B;
                padding: 12px 20px;
                font-weight: 700;
                cursor: pointer;
                font-family: 'Space Grotesk', sans-serif;
                text-transform: uppercase;
            `;
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                this.insertContent(type);
                menu.remove();
            });
            item.addEventListener('mouseenter', () => {
                item.style.background = '#ff6b35';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = '#EAC119';
            });
        });

        // Close on outside click
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.3);
            z-index: 10000;
        `;
        overlay.addEventListener('click', () => {
            menu.remove();
            overlay.remove();
        });

        document.body.appendChild(overlay);
        document.body.appendChild(menu);
    }

    insertContent(type) {
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        switch(type) {
            case 'image':
                const imageUrl = prompt('ENTER IMAGE URL:');
                if (imageUrl) {
                    document.execCommand('insertImage', false, imageUrl);
                }
                break;
            case 'link':
                const linkUrl = prompt('ENTER LINK URL:');
                const linkText = prompt('ENTER LINK TEXT:', 'LINK');
                if (linkUrl) {
                    document.execCommand('createLink', false, linkUrl);
                }
                break;
            case 'table':
                const rows = prompt('NUMBER OF ROWS:', '3');
                const cols = prompt('NUMBER OF COLUMNS:', '3');
                if (rows && cols) {
                    this.insertTable(parseInt(rows), parseInt(cols));
                }
                break;
            case 'hr':
                document.execCommand('insertHorizontalRule', false, null);
                break;
        }
    }

    insertTableQuick() {
        const rows = prompt('NUMBER OF ROWS:', '3');
        const cols = prompt('NUMBER OF COLUMNS:', '3');
        if (rows && cols) {
            this.insertTable(parseInt(rows), parseInt(cols));
        }
    }

    insertTable(rows, cols) {
        let tableHTML = '<div class="table-block"><div class="table-header"><div class="table-row">';
        for (let i = 0; i < cols; i++) {
            tableHTML += `<div class="table-cell" contenteditable="true">HEADER ${i + 1}</div>`;
        }
        tableHTML += '</div></div>';
        for (let i = 0; i < rows; i++) {
            tableHTML += '<div class="table-row">';
            for (let j = 0; j < cols; j++) {
                tableHTML += '<div class="table-data" contenteditable="true">CELL</div>';
            }
            tableHTML += '</div>';
        }
        tableHTML += '</div>';

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const div = document.createElement('div');
            div.className = 'block';
            div.innerHTML = tableHTML;
            range.insertNode(div);
        } else {
            // Insert at cursor position or end of document
            const documentBody = document.querySelector('.document-body');
            const div = document.createElement('div');
            div.className = 'block';
            div.innerHTML = tableHTML;
            documentBody.appendChild(div);
        }
    }

    insertCodeBlock() {
        const language = prompt('LANGUAGE (e.g., JavaScript, Python, HTML):', 'JavaScript');
        const codeHTML = `
            <div class="code-block">
                <div class="code-block-header">${language || 'CODE'}</div>
                <pre contenteditable="true" spellcheck="false">// Paste your code here...</pre>
            </div>
        `;

        const documentBody = document.querySelector('.document-body');
        const div = document.createElement('div');
        div.className = 'block';
        div.innerHTML = codeHTML;
        
        const addBlock = document.querySelector('.add-block');
        if (addBlock && addBlock.parentNode) {
            addBlock.parentNode.insertBefore(div, addBlock);
        } else {
            documentBody.appendChild(div);
        }

        // Focus on the code area
        const codeArea = div.querySelector('pre');
        if (codeArea) {
            codeArea.focus();
            // Select all placeholder text
            const range = document.createRange();
            range.selectNodeContents(codeArea);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }

        this.showNotification('CODE BLOCK INSERTED');
    }

    showExportMenu() {
        const menu = document.createElement('div');
        menu.className = 'export-menu';
        menu.innerHTML = `
            <button class="export-menu-item" data-type="pdf">EXPORT AS PDF</button>
            <button class="export-menu-item" data-type="markdown">EXPORT AS MARKDOWN</button>
            <button class="export-menu-item" data-type="text">EXPORT AS TEXT</button>
            <button class="export-menu-item" data-type="html">EXPORT AS HTML</button>
        `;
        
        menu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            border: 4px solid #1D1D1B;
            padding: 20px;
            z-index: 10001;
            box-shadow: 8px 8px 0 #1D1D1B;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        menu.querySelectorAll('.export-menu-item').forEach(item => {
            item.style.cssText = `
                background: #EAC119;
                color: #1D1D1B;
                border: 3px solid #1D1D1B;
                padding: 12px 20px;
                font-weight: 700;
                cursor: pointer;
                font-family: 'Space Grotesk', sans-serif;
                text-transform: uppercase;
            `;
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                this.exportDocument(type);
                menu.remove();
            });
            item.addEventListener('mouseenter', () => {
                item.style.background = '#ff6b35';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = '#EAC119';
            });
        });

        // Close on outside click
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.3);
            z-index: 10000;
        `;
        overlay.addEventListener('click', () => {
            menu.remove();
            overlay.remove();
        });

        document.body.appendChild(overlay);
        document.body.appendChild(menu);
    }

    exportDocument(type) {
        const documentBody = document.querySelector('.document-body');
        const title = document.querySelector('.document-title').value || 'Document';
        let content = '';
        let filename = '';

        switch(type) {
            case 'pdf':
                this.showNotification('PDF EXPORT - USE BROWSER PRINT (CTRL+P)');
                window.print();
                return;
            case 'markdown':
                content = this.convertToMarkdown(documentBody);
                filename = `${title}.md`;
                break;
            case 'text':
                content = documentBody.innerText || documentBody.textContent;
                filename = `${title}.txt`;
                break;
            case 'html':
                content = documentBody.innerHTML;
                filename = `${title}.html`;
                break;
        }

        // Download file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification(`EXPORTED AS ${type.toUpperCase()}`);
    }

    convertToMarkdown(element) {
        let markdown = '';
        const title = document.querySelector('.document-title').value || '';
        if (title) {
            markdown += `# ${title}\n\n`;
        }

        const processNode = (node) => {
            if (node.nodeType === 3) { // Text node
                return node.textContent;
            }
            if (node.nodeType === 1) { // Element node
                const tag = node.tagName.toLowerCase();
                const text = Array.from(node.childNodes).map(processNode).join('');
                
                switch(tag) {
                    case 'h1': return `# ${text}\n\n`;
                    case 'h2': return `## ${text}\n\n`;
                    case 'h3': return `### ${text}\n\n`;
                    case 'p': return `${text}\n\n`;
                    case 'strong': case 'b': return `**${text}**`;
                    case 'em': case 'i': return `*${text}*`;
                    case 'u': return `<u>${text}</u>`;
                    case 'ul': return `${text}\n`;
                    case 'ol': return `${text}\n`;
                    case 'li': return `- ${text}\n`;
                    case 'br': return '\n';
                    default: return text;
                }
            }
            return '';
        };

        markdown += Array.from(element.childNodes).map(processNode).join('');
        return markdown;
    }

    setActiveDocument(selectedItem) {
        document.querySelectorAll('.document-item').forEach(item => {
            item.classList.remove('active');
        });
        selectedItem.classList.add('active');
    }

    loadDocument(docName) {
        this.currentDocument = docName;
        const documentBody = document.querySelector('.document-body');
        const toolbar = document.querySelector('.formatting-toolbar');
        
        // Hide formatting toolbar on dashboard
        if (toolbar) {
            toolbar.style.display = docName === 'dashboard' ? 'none' : 'flex';
        }
        
        // Make document body contenteditable for rich text editing
        documentBody.contentEditable = true;
        
        // Check if it's a custom document or a default one
        let content;
        let title;
        
        if (this.documents[docName]) {
            // Load custom document
            const doc = this.documents[docName];
            content = doc.content || this.getEmptyDocumentContent();
            title = doc.title || 'NEW DOCUMENT';
        } else {
            // Load default document
            content = this.getDocumentContent(docName);
            title = this.getDocumentTitle(docName);
        }
        
        documentBody.innerHTML = content;
        
        // Update title
        const titleElement = document.querySelector('.document-title');
        titleElement.value = title;

        // Re-attach event listeners for dynamically added content
        this.attachContentListeners();
    }

    attachContentListeners() {
        // Mobile short dashboard buttons
        document.querySelectorAll('.mobile-dashboard-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                if (action === 'recent-docs') {
                    // load getting-started as representative recent area
                    this.loadDocument('getting-started');
                } else if (action === 'todo-list') {
                    this.loadDocument('todo-list');
                } else if (action === 'fav-notes') {
                    this.showFavorites();
                }
            });
        });
        // Dashboard tiles
        document.querySelectorAll('.dashboard-tile').forEach(tile => {
            tile.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleDashboardAction(action);
            });
        });

        // Add Block button
        const addBlockBtn = document.querySelector('.add-block');
        if (addBlockBtn) {
            addBlockBtn.addEventListener('click', () => {
                this.addNewBlock();
            });
        }

        // Make text blocks editable and contenteditable
        document.querySelectorAll('.text-block').forEach(textarea => {
            // Convert textarea to contenteditable div for rich text
            if (textarea.tagName === 'TEXTAREA') {
                const div = document.createElement('div');
                div.className = 'text-block';
                div.contentEditable = true;
                div.textContent = textarea.value;
                div.style.cssText = textarea.style.cssText;
                textarea.parentNode.replaceChild(div, textarea);
            }
            
            const block = document.querySelector('.text-block');
            if (block) {
                block.addEventListener('input', () => {
                    // Auto-resize if needed
                    if (block.style.height) {
                        block.style.height = 'auto';
                        block.style.height = block.scrollHeight + 'px';
                    }
                });
            }
        });

        // Make heading blocks editable
        document.querySelectorAll('.heading-block').forEach(heading => {
            heading.addEventListener('input', () => {
                // Auto-resize heading
                heading.style.height = 'auto';
                heading.style.height = heading.scrollHeight + 'px';
            });
        });

        // Todo input functionality
        const todoInput = document.querySelector('.todo-input');
        if (todoInput) {
            todoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && todoInput.value.trim()) {
                    this.addTodoItem(todoInput.value.trim());
                    todoInput.value = '';
                }
            });
        }

        // Todo checkbox functionality
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                const todoItem = e.target.closest('.todo-item');
                if (todoItem) {
                    todoItem.classList.toggle('completed');
                    checkbox.textContent = todoItem.classList.contains('completed') ? '✓' : '';
                }
            });
        });

        // Kanban board functionality
        this.setupKanbanBoard();

        // Update dashboard if viewing it
        if (this.currentDocument === 'dashboard') {
            this.updateDashboard();
        }
    }

    setupKanbanBoard() {
        // Add card buttons
        document.querySelectorAll('.kanban-add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const column = e.target.dataset.column;
                this.addKanbanCard(column);
            });
        });

        // Delete card buttons
        document.querySelectorAll('.kanban-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.kanban-item');
                if (card && confirm('DELETE THIS CARD?')) {
                    card.remove();
                }
            });
        });

        // Make kanban items editable
        document.querySelectorAll('.kanban-item-title, .kanban-item-content').forEach(element => {
            element.addEventListener('blur', () => {
                // Auto-save could go here
            });
        });
    }

    addKanbanCard(column) {
        const columnItems = document.querySelector(`.kanban-items[data-column="${column}"]`);
        if (!columnItems) return;

        const cardId = `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newCard = document.createElement('div');
        newCard.className = 'kanban-item';
        newCard.dataset.cardId = cardId;
        newCard.innerHTML = `
            <div class="kanban-item-title" contenteditable="true" placeholder="Card title...">NEW CARD</div>
            <div class="kanban-item-content" contenteditable="true" placeholder="Card description...">Click to edit</div>
            <button class="kanban-item-delete">×</button>
        `;

        // Add delete button handler
        const deleteBtn = newCard.querySelector('.kanban-item-delete');
        deleteBtn.addEventListener('click', (e) => {
            if (confirm('DELETE THIS CARD?')) {
                newCard.remove();
            }
        });

        columnItems.appendChild(newCard);
        
        // Focus on the title
        const title = newCard.querySelector('.kanban-item-title');
        title.focus();
        
        // Select all text for easy replacement
        const range = document.createRange();
        range.selectNodeContents(title);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    getDocumentTitle(docName) {
        const titles = {
            'dashboard': 'DASHBOARD',
            'getting-started': 'STOP TAKING WIMPY NOTES',
            'todo-list': 'BRUTAL TO-DO LIST', 
            'kanban-board': 'KANBAN BOARD',
            'profile': 'MY PROFILE',
            'project': 'MY PROJECTS',
            'library': 'MY LIBRARY'
        };
        return titles[docName] || 'BRUTAL DOCUMENT';
    }

    getDocumentContent(docName) {
        const contents = {
            'dashboard': `
                <div class="block dashboard-top-block">
                    <h2 class="dashboard-main-title">STOP TAKING WIMPY NOTES</h2>
                    <h3 class="dashboard-subtitle">NO NONSENSE. NO DISTRACTIONS. NO BLOAT. JUST RAW PRODUCTIVITY.</h3>
                    <hr class="dashboard-separator" />
                </div>
                <!-- Mobile short dashboard (shown only on small screens) -->
                <div class="mobile-dashboard-short">
                    <div class="mobile-dashboard-item" data-action="recent-docs">RECENT DOCUMENTS</div>
                    <div class="mobile-dashboard-item" data-action="todo-list">TO DO LIST</div>
                    <div class="mobile-dashboard-item" data-action="fav-notes">FAV NOTES</div>
                </div>
                <div class="dashboard-container">
                    <div class="dashboard-section">
                        <h2 class="dashboard-section-title">QUICK STATS</h2>
                        <div class="dashboard-stats">
                            <div class="stat-card">
                                <div class="stat-label">TOTAL DOCUMENTS</div>
                                <div class="stat-value" id="totalDocsCount">0</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">ARCHIVED</div>
                                <div class="stat-value" id="archivedDocsCount">0</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">FAVORITE PAGES</div>
                                <div class="stat-value" id="favoritePagesCount">0</div>
                            </div>
                        </div>
                    </div>
                    <div class="dashboard-section">
                        <h2 class="dashboard-section-title">RECENT DOCUMENTS</h2>
                        <div class="dashboard-recent" id="recentDocsList">
                            <div style="color: #999; padding: 16px;">No recent documents</div>
                        </div>
                    </div>
                    <div class="dashboard-section">
                        <h2 class="dashboard-section-title">QUICK ACCESS</h2>
                        <div class="dashboard-tiles">
                            <div class="dashboard-tile" data-action="new-doc">
                                <div class="tile-icon">+</div>
                                <div class="tile-label">NEW DOCUMENT</div>
                            </div>
                            <div class="dashboard-tile" data-action="get-started">
                                <div class="tile-icon">?</div>
                                <div class="tile-label">GET STARTED</div>
                            </div>
                            <div class="dashboard-tile" data-action="todo-list">
                                <div class="tile-icon">X</div>
                                <div class="tile-label">TO-DO LIST</div>
                            </div>
                            <div class="dashboard-tile" data-action="kanban">
                                <div class="tile-icon">=</div>
                                <div class="tile-label">KANBAN</div>
                            </div>
                            <div class="dashboard-tile" data-action="profile">
                                <div class="tile-icon">@</div>
                                <div class="tile-label">PROFILE</div>
                            </div>
                            <div class="dashboard-tile" data-action="project">
                                <div class="tile-icon">#</div>
                                <div class="tile-label">PROJECTS</div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            
            'getting-started': `
                <div class="block">
                    <h1 class="heading-block" contenteditable="true">WELCOME TO BRUTAL NOTES</h1>
                </div>
                <div class="block">
                    <textarea class="text-block" placeholder="Start typing...">NO NONSENSE. NO DISTRACTIONS. NO BLOAT.

JUST RAW PRODUCTIVITY.</textarea>
                </div>
                <div class="block">
                    <textarea class="text-block" placeholder="Start typing..."></textarea>
                </div>
                <div class="add-block">
                    <div class="add-block-icon">+</div>
                    <span>CLICK TO ADD A NEW BLOCK</span>
                </div>
            `,
            
            'todo-list': `
                <div class="block">
                    <h1 class="heading-block" contenteditable="true">BRUTAL TO-DO LIST</h1>
                </div>
                <div class="todo-list">
                    <input type="text" class="todo-input" placeholder="ADD TASK... PRESS ENTER">
                    <div class="todo-list-items">
                        <div class="todo-item">
                            <div class="todo-checkbox"></div>
                            <div class="todo-text">SAMPLE TASK</div>
                        </div>
                    </div>
                </div>
            `,
            
            'kanban-board': `
                <div class="block">
                    <h1 class="heading-block" contenteditable="true">KANBAN BOARD</h1>
                </div>
                <div class="kanban-board">
                    <div class="kanban-column" data-column="todo">
                        <div class="kanban-header">TO DO</div>
                        <div class="kanban-items" data-column="todo">
                            <div class="kanban-item">
                                <div class="kanban-item-title" contenteditable="true">SAMPLE TASK</div>
                                <div class="kanban-item-content" contenteditable="true">Click to edit</div>
                                <button class="kanban-item-delete">×</button>
                            </div>
                        </div>
                        <button class="kanban-add-btn" data-column="todo">+ ADD CARD</button>
                    </div>
                    <div class="kanban-column" data-column="progress">
                        <div class="kanban-header">IN PROGRESS</div>
                        <div class="kanban-items" data-column="progress">
                        </div>
                        <button class="kanban-add-btn" data-column="progress">+ ADD CARD</button>
                    </div>
                    <div class="kanban-column" data-column="review">
                        <div class="kanban-header">REVIEW</div>
                        <div class="kanban-items" data-column="review">
                        </div>
                        <button class="kanban-add-btn" data-column="review">+ ADD CARD</button>
                    </div>
                    <div class="kanban-column" data-column="done">
                        <div class="kanban-header">DONE</div>
                        <div class="kanban-items" data-column="done">
                        </div>
                        <button class="kanban-add-btn" data-column="done">+ ADD CARD</button>
                    </div>
                </div>
            `,
            
            'project': `
                <div class="block">
                    <h1 class="heading-block" contenteditable="true">MY PROJECTS</h1>
                </div>
                <div class="profile-section">
                    <h2 class="profile-section-title">ACTIVE PROJECTS</h2>
                    <div class="profile-content" contenteditable="true">
                        <div class="experience-item">
                            <strong>PROJECT NAME</strong> - Status: In Progress<br>
                            <em>Start Date - End Date</em><br>
                            Brief description of the project, goals, and current progress.
                        </div>
                        <div class="experience-item">
                            <strong>PROJECT NAME</strong> - Status: Planning<br>
                            <em>Start Date - End Date</em><br>
                            Brief description of the project, goals, and current progress.
                        </div>
                    </div>
                </div>
                <div class="profile-section">
                    <h2 class="profile-section-title">COMPLETED PROJECTS</h2>
                    <div class="profile-content" contenteditable="true">
                        <div class="experience-item">
                            <strong>PROJECT NAME</strong> - Status: Completed<br>
                            <em>Start Date - End Date</em><br>
                            Brief description, outcomes, and key achievements.
                        </div>
                    </div>
                </div>
                <div class="profile-section">
                    <h2 class="profile-section-title">PROJECT NOTES</h2>
                    <div class="profile-content" contenteditable="true">
                        Add your project ideas, notes, and future plans here.
                    </div>
                </div>
            `,
            
            'library': `
                <div class="block">
                    <h1 class="heading-block" contenteditable="true">MY LIBRARY</h1>
                </div>
                <div class="profile-section">
                    <h2 class="profile-section-title">CURRENTLY READING</h2>
                    <div class="profile-content" contenteditable="true">
                        <div class="experience-item">
                            <strong>Book Title</strong> - Author Name<br>
                            <em>Genre / Category</em><br>
                            Your notes, thoughts, and progress.
                        </div>
                    </div>
                </div>
                <div class="profile-section">
                    <h2 class="profile-section-title">WANT TO READ</h2>
                    <div class="profile-content" contenteditable="true">
                        <div class="experience-item">
                            <strong>Book Title</strong> - Author Name<br>
                            <em>Genre / Category</em><br>
                            Why you want to read this book.
                        </div>
                        <div class="experience-item">
                            <strong>Book Title</strong> - Author Name<br>
                            <em>Genre / Category</em><br>
                            Why you want to read this book.
                        </div>
                    </div>
                </div>
                <div class="profile-section">
                    <h2 class="profile-section-title">COMPLETED</h2>
                    <div class="profile-content" contenteditable="true">
                        <div class="experience-item">
                            <strong>Book Title</strong> - Author Name<br>
                            <em>Genre / Category</em><br>
                            Your review, rating, and key takeaways.
                        </div>
                    </div>
                </div>
                <div class="profile-section">
                    <h2 class="profile-section-title">FAVORITE QUOTES</h2>
                    <div class="profile-content" contenteditable="true">
                        Add your favorite quotes and excerpts from your reading.
                    </div>
                </div>
            `,
            
            'profile': `
                <div class="profile-section">
                    <div class="profile-header-block">
                        <div class="profile-avatar">
                            <div class="avatar-placeholder">👤</div>
                        </div>
                        <div class="profile-info">
                            <h1 class="profile-name" contenteditable="true">YOUR NAME</h1>
                            <div class="profile-email" contenteditable="true">your.email@example.com</div>
                            <div class="profile-links">
                                <span class="profile-link" contenteditable="true">LinkedIn</span>
                                <span class="profile-link" contenteditable="true">Twitter</span>
                                <span class="profile-link" contenteditable="true">GitHub</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-section">
                    <h2 class="profile-section-title">BACKGROUND</h2>
                    <div class="profile-content" contenteditable="true">
                        Write your professional background, summary, and career objectives here. This is your chance to introduce yourself and highlight your key strengths.
                    </div>
                </div>
                
                <div class="profile-section">
                    <h2 class="profile-section-title">WORK EXPERIENCE</h2>
                    <div class="profile-content" contenteditable="true">
                        <div class="experience-item">
                            <strong>Job Title</strong> - Company Name<br>
                            <em>Date Range</em><br>
                            Description of your role and achievements.
                        </div>
                        <div class="experience-item">
                            <strong>Job Title</strong> - Company Name<br>
                            <em>Date Range</em><br>
                            Description of your role and achievements.
                        </div>
                    </div>
                </div>
                
                <div class="profile-section">
                    <h2 class="profile-section-title">EDUCATION</h2>
                    <div class="profile-content" contenteditable="true">
                        <div class="education-item">
                            <strong>Degree</strong> - University Name<br>
                            <em>Year</em><br>
                            Additional details or achievements.
                        </div>
                        <div class="education-item">
                            <strong>Degree</strong> - University Name<br>
                            <em>Year</em><br>
                            Additional details or achievements.
                        </div>
                    </div>
                </div>
                
                <div class="profile-section">
                    <h2 class="profile-section-title">SKILLS</h2>
                    <div class="profile-content" contenteditable="true">
                        List your key skills, technologies, and competencies here.
                    </div>
                </div>
                
                <div class="profile-section">
                    <h2 class="profile-section-title">ACHIEVEMENTS</h2>
                    <div class="profile-content" contenteditable="true">
                        Highlight your key achievements, certifications, awards, or notable projects.
                    </div>
                </div>
            `
        };
        
        return contents[docName] || '<div class="block"><p>DOCUMENT CONTENT</p></div>';
    }

    handleDashboardAction(action) {
        switch(action) {
            case 'new-doc':
                this.createNewDocument();
                break;
            case 'get-started':
                this.loadDocument('getting-started');
                this.setActiveItemInSidebar('getting-started');
                break;
            case 'todo-list':
                this.loadDocument('todo-list');
                this.setActiveItemInSidebar('todo-list');
                break;
            case 'kanban':
                this.loadDocument('kanban-board');
                this.setActiveItemInSidebar('kanban-board');
                break;
            case 'profile':
                this.loadDocument('profile');
                this.setActiveItemInSidebar('profile');
                break;
            case 'project':
                this.loadDocument('project');
                this.setActiveItemInSidebar('project');
                break;
            default:
                break;
        }
    }

    setActiveItemInSidebar(docId) {
        document.querySelectorAll('.document-item').forEach(item => {
            item.classList.remove('active');
        });
        const item = document.querySelector(`[data-doc="${docId}"]`);
        if (item) {
            item.classList.add('active');
        }
    }

    updateDashboard() {
        // Update stats
        const totalDocs = Object.keys(this.documents).length;
        const totalArchived = Object.keys(this.archivedDocuments).length;
        
        // Count favorite pages (documents with isFavorite flag)
        const favoriteCount = Object.values(this.documents).filter(doc => doc.isFavorite).length;
        
        const totalDocsEl = document.querySelector('#totalDocsCount');
        const archivedEl = document.querySelector('#archivedDocsCount');
        const favEl = document.querySelector('#favoritePagesCount');
        
        if (totalDocsEl) totalDocsEl.textContent = totalDocs;
        if (archivedEl) archivedEl.textContent = totalArchived;
        if (favEl) favEl.textContent = favoriteCount;
        
        // Update recent documents list
        this.updateRecentDocsList();
    }

    updateRecentDocsList() {
        const recentList = document.querySelector('#recentDocsList');
        if (!recentList) return;
        
        // Get all custom documents (exclude default templates)
        const customDocs = Object.entries(this.documents)
            .filter(([id]) => !['getting-started', 'home', 'todo-list', 'kanban-board', 'profile', 'project', 'library', 'dashboard'].includes(id))
            .sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0))
            .slice(0, 5); // Show top 5
        
        if (customDocs.length === 0) {
            recentList.innerHTML = '<div style="color: #999; padding: 16px;">No recent documents</div>';
            return;
        }
        
        let html = '';
        customDocs.forEach(([docId, doc]) => {
            const updatedDate = doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : 'Recently';
            html += `
                <div class="recent-item" data-doc="${docId}">
                    <div class="recent-title">${doc.name.toUpperCase()}</div>
                    <div class="recent-date">${updatedDate}</div>
                </div>
            `;
        });
        
        recentList.innerHTML = html;
        
        // Add click handlers to recent items
        document.querySelectorAll('.recent-item').forEach(item => {
            item.addEventListener('click', () => {
                const docId = item.dataset.doc;
                this.loadDocument(docId);
                this.setActiveItemInSidebar(docId);
            });
        });
    }

    showFavorites() {
        const favorites = Object.entries(this.documents)
            .filter(([id, doc]) => doc.isFavorite)
            .sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0));

        const documentBody = document.querySelector('.document-body');
        let html = '<div class="block"><h2 class="heading-block">FAVORITE NOTES</h2></div>';
        if (favorites.length === 0) {
            html += '<div class="block"><div style="padding:16px;color:#999">No favorite notes</div></div>';
        } else {
            favorites.forEach(([id, doc]) => {
                html += `
                    <div class="block recent-item" data-doc="${id}">
                        <div style="font-weight:700">${(doc.name||doc.title||'Untitled').toUpperCase()}</div>
                        <div style="font-size:12px;color:#666">${doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : ''}</div>
                    </div>
                `;
            });
        }
        documentBody.innerHTML = html;

        // attach click handlers to open favorite docs
        document.querySelectorAll('.recent-item').forEach(item => {
            item.addEventListener('click', () => {
                const docId = item.dataset.doc;
                this.loadDocument(docId);
                this.setActiveItemInSidebar(docId);
            });
        });
    }

    createNewDocument() {
        // Generate unique document ID
        this.documentCounter++;
        const docId = `doc-${Date.now()}-${this.documentCounter}`;
        const docName = `New Document ${this.documentCounter}`;
        
        // Create document data
        this.documents[docId] = {
            id: docId,
            name: docName,
            title: 'NEW DOCUMENT',
            content: this.getEmptyDocumentContent(),
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        // Create new document item in sidebar
        const documentList = document.querySelector('#customDocumentList') || document.querySelector('.document-list');
        const newDocItem = document.createElement('li');
        newDocItem.className = 'document-item';
        newDocItem.dataset.doc = docId;
        newDocItem.innerHTML = `
            <svg class="doc-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                <rect x="7" y="13" width="10" height="1.5" rx="0.75"/>
                <rect x="7" y="15.5" width="10" height="1.5" rx="0.75"/>
                <rect x="7" y="18" width="7" height="1.5" rx="0.75"/>
            </svg>
            ${docName.toUpperCase()}
        `;
        
        // Add click handler to new document item
        newDocItem.addEventListener('click', () => {
            this.loadDocument(docId);
            this.setActiveDocument(newDocItem);
        });
        
        // Insert at the top of the list (after getting started)
        const firstItem = documentList.querySelector('.document-item');
        if (firstItem && firstItem.nextSibling) {
            documentList.insertBefore(newDocItem, firstItem.nextSibling);
        } else {
            documentList.appendChild(newDocItem);
        }
        
        // Load the new document
        this.loadDocument(docId);
        this.setActiveDocument(newDocItem);
        
        this.showNotification('NEW DOCUMENT CREATED');
    }

    createNewNote() {
        // Generate unique note ID
        this.documentCounter++;
        const noteId = `note-${Date.now()}-${this.documentCounter}`;
        const noteName = `New Note ${this.documentCounter}`;
        
        // Create note data
        this.documents[noteId] = {
            id: noteId,
            name: noteName,
            title: 'NEW NOTE',
            content: this.getEmptyDocumentContent()
        };
        
        // Create new note item in middle panel
        const noteListContainer = document.querySelector('.note-list-container');
        const newNoteItem = document.createElement('div');
        newNoteItem.className = 'note-list-item';
        newNoteItem.dataset.note = noteId;
        newNoteItem.innerHTML = `
            <div class="note-item-title">${noteName}</div>
        `;
        
        // Add click handler to new note item
        newNoteItem.addEventListener('click', () => {
            this.loadDocument(noteId);
            // Update active state
            document.querySelectorAll('.note-list-item').forEach(n => n.classList.remove('active'));
            newNoteItem.classList.add('active');
        });
        
        // Insert at the top of the note list
        noteListContainer.insertBefore(newNoteItem, noteListContainer.firstChild);
        
        // Load the new note
        this.loadDocument(noteId);
        
        // Update active state
        document.querySelectorAll('.note-list-item').forEach(n => n.classList.remove('active'));
        newNoteItem.classList.add('active');
        
        this.showNotification('NEW NOTE CREATED');
    }

    getEmptyDocumentContent() {
        return `
            <div class="block">
                <h1 class="heading-block" contenteditable="true">NEW DOCUMENT</h1>
            </div>
            <div class="block">
                <textarea class="text-block" placeholder="Start typing..."></textarea>
            </div>
            <div class="add-block">
                <div class="add-block-icon">+</div>
                <span>CLICK TO ADD A NEW BLOCK</span>
            </div>
        `;
    }

    addNewBlock() {
        const documentBody = document.querySelector('.document-body');
        const addBlockBtn = document.querySelector('.add-block');
        
        const newBlock = document.createElement('div');
        newBlock.className = 'block';
        newBlock.innerHTML = `
            <textarea class="text-block" placeholder="Start typing..."></textarea>
        `;
        
        if (addBlockBtn && addBlockBtn.parentNode) {
            addBlockBtn.parentNode.insertBefore(newBlock, addBlockBtn);
        } else {
            documentBody.appendChild(newBlock);
        }

        // Make the new textarea editable and auto-resize
        const newTextarea = newBlock.querySelector('.text-block');
        newTextarea.addEventListener('input', () => {
            newTextarea.style.height = 'auto';
            newTextarea.style.height = newTextarea.scrollHeight + 'px';
        });
        
        // Focus the new textarea
        newTextarea.focus();
        
        this.showNotification('NEW BLOCK ADDED');
    }

    addTodoItem(text) {
        const todoListItems = document.querySelector('.todo-list-items');
        if (!todoListItems) return;

        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
            <div class="todo-checkbox"></div>
            <div class="todo-text">${text}</div>
        `;

        todoListItems.appendChild(todoItem);

        // Add click handler to the new checkbox
        const checkbox = todoItem.querySelector('.todo-checkbox');
        checkbox.addEventListener('click', () => {
            todoItem.classList.toggle('completed');
            checkbox.textContent = todoItem.classList.contains('completed') ? '✓' : '';
        });
    }

    saveCurrentDocument() {
        const docId = this.currentDocument;
        const documentBody = document.querySelector('.document-body');
        const titleElement = document.querySelector('.document-title');
        
        // Don't save default documents (except profile, project, library which should be saved)
        if (docId === 'getting-started' || docId === 'todo-list' || docId === 'kanban-board' || docId === 'dashboard') {
            this.showNotification('DEFAULT DOCUMENTS CANNOT BE SAVED');
            return;
        }
        
        // Allow saving profile, project, library
        if (docId === 'profile' || docId === 'project' || docId === 'library') {
            // Save to localStorage
            if (!this.documents[docId]) {
                const titles = {
                    'profile': 'MY PROFILE',
                    'project': 'MY PROJECTS',
                    'library': 'MY LIBRARY'
                };
                this.documents[docId] = {
                    id: docId,
                    name: titles[docId],
                    title: titles[docId],
                    content: documentBody.innerHTML,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };
            } else {
                this.documents[docId].content = documentBody.innerHTML;
                this.documents[docId].updatedAt = Date.now();
            }
            
            try {
                localStorage.setItem('brutalNotes_documents', JSON.stringify(this.documents));
            } catch (e) {
                console.log('Could not save to localStorage:', e);
                this.showNotification('SAVE FAILED - STORAGE FULL');
                return;
            }
            
            const saveMessages = {
                'profile': 'PROFILE SAVED BRUTALLY',
                'project': 'PROJECTS SAVED BRUTALLY',
                'library': 'LIBRARY SAVED BRUTALLY'
            };
            this.showNotification(saveMessages[docId]);
            return;
        }
        
        // Save document content
        if (this.documents[docId]) {
            this.documents[docId].content = documentBody.innerHTML;
            this.documents[docId].title = titleElement.value || 'NEW DOCUMENT';
            this.documents[docId].name = titleElement.value || 'NEW DOCUMENT';
            this.documents[docId].updatedAt = Date.now();
        } else {
            // Create new document entry
            this.documents[docId] = {
                id: docId,
                name: titleElement.value || 'NEW DOCUMENT',
                title: titleElement.value || 'NEW DOCUMENT',
                content: documentBody.innerHTML,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
        }
        
        // Update document name in sidebar
        this.updateDocumentNameInSidebar(docId);
        
        // Also save to localStorage for persistence
        try {
            localStorage.setItem('brutalNotes_documents', JSON.stringify(this.documents));
        } catch (e) {
            console.log('Could not save to localStorage:', e);
            this.showNotification('SAVE FAILED - STORAGE FULL');
            return;
        }
        
        this.showNotification('DOCUMENT SAVED BRUTALLY');
    }

    deleteCurrentDocument() {
        const docId = this.currentDocument;
        
        // Don't allow deleting default documents
        if (docId === 'getting-started' || docId === 'todo-list' || docId === 'kanban-board' || docId === 'profile' || docId === 'project' || docId === 'library') {
            this.showNotification('DEFAULT DOCUMENTS CANNOT BE DELETED');
            return;
        }
        
        if (!this.documents[docId]) {
            this.showNotification('DOCUMENT NOT FOUND');
            return;
        }
        
        this.showConfirmDialog(
            'DELETE DOCUMENT?',
            'This document will be permanently deleted. This action cannot be undone.',
            () => {
                // Remove from documents
                delete this.documents[docId];
                
                // Remove from sidebar
                const docItem = document.querySelector(`[data-doc="${docId}"]`);
                if (docItem) {
                    docItem.remove();
                }
                
                // Remove from middle panel
                const noteItem = document.querySelector(`.note-list-item[data-note="${docId}"]`);
                if (noteItem) {
                    noteItem.remove();
                }
                
                // Save to localStorage
                try {
                    localStorage.setItem('brutalNotes_documents', JSON.stringify(this.documents));
                } catch (e) {
                    console.log('Could not save to localStorage:', e);
                }
                
                // Load getting started document
                this.loadDocument('getting-started');
                const firstItem = document.querySelector('.document-item[data-doc="getting-started"]');
                if (firstItem) {
                    this.setActiveDocument(firstItem);
                }
                
                this.showNotification('DOCUMENT DELETED BRUTALLY');
            }
        );
    }

    showConfirmDialog(title, message, onConfirm) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'confirm-dialog-overlay';
        
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <h2 class="confirm-dialog-title">${title}</h2>
            <p class="confirm-dialog-message">${message}</p>
            <div class="confirm-dialog-buttons">
                <button class="confirm-btn confirm-btn-no">NO</button>
                <button class="confirm-btn confirm-btn-yes">YES</button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Handle button clicks
        const yesBtn = dialog.querySelector('.confirm-btn-yes');
        const noBtn = dialog.querySelector('.confirm-btn-no');
        
        yesBtn.addEventListener('click', () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        });
        
        noBtn.addEventListener('click', () => {
            overlay.remove();
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    archiveCurrentDocument() {
        const docId = this.currentDocument;
        
        // Don't allow archiving default documents
        if (docId === 'getting-started' || docId === 'todo-list' || docId === 'kanban-board' || docId === 'profile' || docId === 'project' || docId === 'library') {
            this.showNotification('DEFAULT DOCUMENTS CANNOT BE ARCHIVED');
            return;
        }
        
        if (!this.documents[docId]) {
            this.showNotification('DOCUMENT NOT FOUND');
            return;
        }
        
        // Move to archived
        this.archivedDocuments[docId] = this.documents[docId];
        delete this.documents[docId];
        
        // Remove from sidebar
        const docItem = document.querySelector(`[data-doc="${docId}"]`);
        if (docItem) {
            docItem.remove();
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('brutalNotes_documents', JSON.stringify(this.documents));
            localStorage.setItem('brutalNotes_archived', JSON.stringify(this.archivedDocuments));
        } catch (e) {
            console.log('Could not save to localStorage:', e);
        }
        
        // Load getting started document
        this.loadDocument('getting-started');
        const firstItem = document.querySelector('.document-item[data-doc="getting-started"]');
        if (firstItem) {
            this.setActiveDocument(firstItem);
        }
        
        this.showNotification('DOCUMENT ARCHIVED');
    }

    renameCurrentDocument() {
        const docId = this.currentDocument;
        const titleElement = document.querySelector('.document-title');
        const newTitle = titleElement.value.trim() || 'NEW DOCUMENT';
        
        // Don't rename default documents
        if (docId === 'getting-started' || docId === 'todo-list' || docId === 'kanban-board' || docId === 'profile' || docId === 'project' || docId === 'library') {
            titleElement.value = this.getDocumentTitle(docId);
            this.showNotification('DEFAULT DOCUMENTS CANNOT BE RENAMED');
            return;
        }
        
        if (this.documents[docId]) {
            this.documents[docId].title = newTitle;
            this.documents[docId].name = newTitle;
            
            // Update in sidebar
            this.updateDocumentNameInSidebar(docId);
            
            // Save to localStorage
            try {
                localStorage.setItem('brutalNotes_documents', JSON.stringify(this.documents));
            } catch (e) {
                console.log('Could not save to localStorage:', e);
            }
        }
    }

    updateDocumentNameInSidebar(docId) {
        const docItem = document.querySelector(`[data-doc="${docId}"]`);
        if (docItem && this.documents[docId]) {
            const icon = docItem.querySelector('.doc-icon');
            if (icon) {
                docItem.innerHTML = icon.outerHTML + ' ' + this.documents[docId].name.toUpperCase();
            }
        }
    }

    searchDocuments(query) {
        const searchTerm = query.toLowerCase().trim();
        const documentList = document.querySelectorAll('.document-item');
        
        if (!searchTerm) {
            // Show all documents
            documentList.forEach(item => {
                item.style.display = '';
            });
            return;
        }
        
        // Filter documents
        documentList.forEach(item => {
            const docName = item.textContent.toLowerCase();
            const docId = item.dataset.doc;
            
            // Check if matches document name or is a default document
            if (docName.includes(searchTerm) || 
                (docId === 'getting-started' && 'getting started'.includes(searchTerm)) ||
                (docId === 'todo-list' && ('todo list'.includes(searchTerm) || 'to do list'.includes(searchTerm))) ||
                (docId === 'kanban-board' && 'kanban board'.includes(searchTerm)) ||
                (docId === 'profile' && 'profile'.includes(searchTerm)) ||
                (docId === 'home' && 'home'.includes(searchTerm)) ||
                (docId === 'project' && 'project'.includes(searchTerm)) ||
                (docId === 'library' && 'library'.includes(searchTerm)) ||
                (docId === 'pinned' && ('pinned'.includes(searchTerm) || 'pin'.includes(searchTerm) || 'block'.includes(searchTerm)))) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b35;
            color: #1D1D1B;
            padding: 16px 20px;
            border: 3px solid #1D1D1B;
            font-weight: 700;
            z-index: 10000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('Service Worker registered:', registration);
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                    });
            });
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BrutalNotesApp();
});