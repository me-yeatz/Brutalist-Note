# 🚀 Brutal Notes

**Stop Taking Wimpy Notes**

A no-nonsense, Neo-Brutalist note-taking Progressive Web App (PWA) that works on Web, iOS, and Android. Built with pure HTML, CSS, and JavaScript - no frameworks, no bloat, just raw productivity.

![Brutal Notes](https://img.shields.io/badge/Version-1.0.0-orange)
![License](https://img.shields.io/badge/License-MIT-green)
![PWA](https://img.shields.io/badge/PWA-Ready-blue)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)

![App Screenshot](./Screenshot%20Desktop.png)

## ✨ Features

- **Neo-Brutalist Design** - Bold, high-contrast UI that cuts through the noise
- **Progressive Web App** - Install on any device, works offline
- **Multi-Document Support** - Create unlimited documents
- **Editable Blocks** - Add, edit, and organize content blocks
- **Todo Lists** - Built-in task management
- **Local Storage** - All data saved locally in your browser
- **Fully Responsive** - Perfect on desktop, tablet, and mobile
- **iOS Ready** - Can be packaged as a native iOS app

## 🎨 Design Philosophy

> "Tired of pastel colors and unnecessary features? So are we."

Brutal Notes strips note-taking down to its bare essentials. No distractions. No bloat. Just a raw, focused space to capture your thoughts and get sh*t done.

## 🚀 Quick Start

### Web App (PWA)

1. Clone the repository:
```bash
git clone https://github.com/me-yeatz/brutal-notes.git
cd brutal-notes
```

2. Open `index.html` in a web browser, or serve it with a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

4. **Install as PWA:**
   - **Chrome/Edge**: Click the install icon in the address bar
   - **Safari (iOS)**: Tap Share → Add to Home Screen
   - **Firefox**: Click the install icon in the address bar

### iOS App (Native)

See [iOS Deployment Guide](#-ios-deployment) below.

## 📱 iOS Deployment

### Option 1: PWA (Easiest)

1. Deploy your app to a web server (GitHub Pages, Netlify, Vercel, etc.)
2. Open the app in Safari on iOS
3. Tap Share → Add to Home Screen
4. The app will work like a native app!

### Option 2: Native iOS App with Capacitor

1. Install Capacitor:
```bash
npm install -g @capacitor/cli
npm install @capacitor/core @capacitor/ios
```

2. Initialize Capacitor:
```bash
npx cap init "Brutal Notes" "com.yeatz.brutalnotes"
npx cap add ios
```

3. Build and sync:
```bash
npx cap sync ios
```

4. Open in Xcode:
```bash
npx cap open ios
```

5. Build and run from Xcode

### Option 3: Web-to-iOS with WebView

See `ios-deployment.md` for detailed instructions.

## 📁 Project Structure

```
brutal-notes/
├── index.html          # Main HTML file
├── styles.css          # All styles (Neo-Brutalist design)
├── script.js           # Application logic
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── README.md          # This file
├── LICENSE            # MIT License
└── icons/             # App icons (create this folder)
    ├── apple-touch-icon.png
    ├── icon-32x32.png
    ├── icon-16x16.png
    └── safari-pinned-tab.svg
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Neo-Brutalist styling with mobile-first responsive design
- **Vanilla JavaScript** - No frameworks, pure JS
- **Service Worker** - Offline support
- **LocalStorage** - Data persistence
- **PWA** - Progressive Web App standards

## 📝 Usage

1. **Create New Document**: Click "+ NEW DOCUMENT" button
2. **Edit Content**: Click on any heading or text block to edit
3. **Add Blocks**: Click "ADD BLOCK" button to add new content blocks
4. **Save**: Click "SAVE" button to save your work
5. **Navigate**: Click document names in sidebar to switch between documents

## 🎯 Roadmap

- [ ] Export documents as PDF
- [ ] Markdown support
- [ ] Dark/Light theme toggle
- [ ] Cloud sync (optional)
- [ ] Collaboration features
- [ ] Keyboard shortcuts
- [ ] Drag and drop blocks
- [ ] Rich text formatting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**me-yeatz**

- GitHub: [@me-yeatz](https://github.com/me-yeatz)

## 🙏 Acknowledgments

- Inspired by Neo-Brutalist design principles
- Built with pure web technologies
- Thanks to all contributors and users!

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Made with ❤️ and brutal honesty**

