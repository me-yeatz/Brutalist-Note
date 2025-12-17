const fs = require('fs');
const path = require('path');

const sourceIcon = 'logo.png';
const iconsDir = 'icons';
const iconNames = [
    'icon-72x72.png',
    'icon-96x96.png',
    'icon-128x128.png',
    'icon-144x144.png',
    'icon-152x152.png',
    'icon-192x192.png',
    'icon-384x384.png',
    'icon-512x512.png',
    'apple-touch-icon.png',
    'icon-32x32.png',
    'icon-16x16.png'
];

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

iconNames.forEach(name => {
    fs.copyFileSync(sourceIcon, path.join(iconsDir, name));
    console.log(`Created ${name}`);
});

// Create a simple SVG for safari-pinned-tab
const svgContent = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#000"/></svg>`;
fs.writeFileSync(path.join(iconsDir, 'safari-pinned-tab.svg'), svgContent);
console.log('Created safari-pinned-tab.svg');
