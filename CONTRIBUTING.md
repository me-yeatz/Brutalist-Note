# Contributing to Brutal Notes

Thank you for your interest in contributing to Brutal Notes! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Be open to different perspectives

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/device information
   - Screenshots if applicable

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/brutal-notes.git
cd brutal-notes
```

2. Open `index.html` in a browser or use a local server:
```bash
python -m http.server 8000
# or
npx serve .
```

3. Make your changes
4. Test in multiple browsers and devices

## Coding Standards

- **HTML**: Use semantic HTML5 elements
- **CSS**: Follow existing Neo-Brutalist design patterns
- **JavaScript**: Use modern ES6+ syntax, keep functions small and focused
- **Comments**: Add comments for complex logic
- **Naming**: Use descriptive variable and function names

## Testing

Before submitting a PR, please:

- [ ] Test in Chrome, Firefox, Safari, and Edge
- [ ] Test on mobile devices (iOS and Android)
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Check for console errors
- [ ] Verify responsive design

## Commit Messages

Use clear, descriptive commit messages:

- `Add feature: [description]`
- `Fix bug: [description]`
- `Update: [description]`
- `Refactor: [description]`
- `Docs: [description]`

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

Thank you for contributing! 🚀

