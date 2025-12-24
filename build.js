const fs = require('fs');
const path = require('path');

const sourceDir = __dirname;
const destDir = path.join(__dirname, 'public');

// Create public directory
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
}

// Files to copy directly
const filesToCopy = [
    'index.html',
    'app.html',
    'landing.html',
    'styles.css',
    'script.js',
    'manifest.json',
    'sw.js',
    'logo.png',
    'Screenshot Desktop.png'
];

filesToCopy.forEach(file => {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to public/`);
    } else {
        console.warn(`Warning: ${file} not found.`);
    }
});

// Function to copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy icons folder if it exists
const iconsDir = path.join(sourceDir, 'icons');
const destIconsDir = path.join(destDir, 'icons');

if (fs.existsSync(iconsDir)) {
    copyDir(iconsDir, destIconsDir);
    console.log('Copied icons folder to public/');
} else {
    console.warn('Warning: icons folder not found.');
}

console.log('Build completed successfully.');
