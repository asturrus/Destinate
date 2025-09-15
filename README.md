# Destinate - Travel Website 🌍

A beautiful full-stack travel website showcasing popular destinations around the world with dark mode support.

Built with React frontend + Express backend using modern web technologies.

## Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/asturrus/Destinate.git
   cd Destinate
   npm install
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```
   
   This starts both the frontend and backend. The app will be available at **http://localhost:5000**

## Features

- ✈️ Stunning hero section with travel imagery
- 🌍 Popular destinations: Tokyo, Venice, Paris, London, Amsterdam, Santorini  
- 🌙 Dark/Light mode toggle with persistence
- 📱 Fully responsive design
- ⚡ Full-stack architecture (React + Express)

## Tech Stack

**Frontend:**
- React 18 with JSX
- Tailwind CSS for styling
- Vite for fast development
- Wouter for routing

**Backend:**
- Express.js server
- TypeScript with tsx runtime
- In-memory storage (easily extendable to database)

## Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking

## Troubleshooting

**❌ "tsx: not found" error?**
- Make sure you've run `npm install` first
- Use `npm run dev` (not `tsx` directly)
- Ensure Node.js 18+ is installed

**❌ "NODE_ENV is not recognized" on Windows?**
- Use `npm run dev` (the package handles cross-platform compatibility)
- Use PowerShell or Git Bash if Command Prompt fails

**❌ App not loading?**
- Ensure port 5000 isn't being used by another app
- Check that `npm install` completed successfully
- Try clearing browser cache and refreshing

## Development

The app uses a full-stack architecture:
- Frontend files are in `/client/src/`
- Backend files are in `/server/`
- Shared types/schemas in `/shared/`

Hot reloading is enabled for both frontend and backend development.