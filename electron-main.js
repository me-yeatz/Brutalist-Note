// Electron Main Process for Brutal Notes
// This creates a native Windows/Mac/Linux desktop app

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'icons/icon-512x512.png'),
    title: 'Brutal Notes',
    backgroundColor: '#1D1D1B',
    show: false, // Don't show until ready
    autoHideMenuBar: false,
    frame: true
  });

  // Load the index.html
  mainWindow.loadFile('index.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development (comment out for production)
  // mainWindow.webContents.openDevTools();

  // Handle window closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Create application menu
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Document',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-document');
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('save-document');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Brutal Notes',
          click: () => {
            const aboutWindow = new BrowserWindow({
              width: 400,
              height: 300,
              resizable: false,
              parent: mainWindow,
              modal: true,
              show: false,
              webPreferences: {
                nodeIntegration: false
              }
            });
            aboutWindow.loadURL(`data:text/html,
              <html>
                <head>
                  <style>
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                      margin: 0;
                      padding: 40px;
                      text-align: center;
                      background: #EAE4DA;
                    }
                    h1 { color: #1D1D1B; font-size: 28px; margin: 20px 0 10px; }
                    p { color: #666; margin: 10px 0; }
                    .version { font-size: 14px; color: #999; }
                  </style>
                </head>
                <body>
                  <h1>📝 Brutal Notes</h1>
                  <p class="version">Version 1.0.0</p>
                  <p>Stop Taking Wimpy Notes</p>
                  <p style="margin-top: 40px;">Made with ❤️ by yeatz</p>
                </body>
              </html>
            `);
            aboutWindow.once('ready-to-show', () => {
              aboutWindow.show();
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

// App ready event
app.whenReady().then(createWindow);

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activate event (macOS)
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
