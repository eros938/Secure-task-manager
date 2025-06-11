# Secure Task Manager

A secure task management web application built with React and TailwindCSS.

## Features

- User authentication
- Input validation and output encoding
- Data persistence with localStorage
- Dark mode support
- Responsive design
- Security best practices implementation

## Technologies Used

- React
- TailwindCSS
- JavaScript
- HTML5/CSS3

## How to Run

1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Open http://localhost:3000 in your browser

## Credentials

Use the following credentials to log in:
- Username: admin
- Password: SecurePass123!

## Security Implementation Details

- Input validation on all user-submitted data
- Output encoding to prevent XSS attacks
- Secure authentication mechanism
- Data stored securely in localStorage
- Protection against common web vulnerabilities
- OWASP Top Ten considerations

## CI/CD Integration

To integrate with GitHub Actions:

1. Create `.github/workflows/react.yml`
2. Add workflow steps for testing and deployment
3. Push to GitHub repository

Example GitHub Actions workflow:

```yaml
name: React CI/CD

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16.x'
    - run: npm install
    - run: npm run build
    - run: npm test -- --watchAll=false

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
