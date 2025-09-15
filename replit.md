# Overview

This is a full-stack web application built with React, Express, and TypeScript. The project follows a modern architecture with a React frontend, Express.js backend, and PostgreSQL database integration using Drizzle ORM. The application is designed as a starter template with user management capabilities and a comprehensive UI component system built on top of Tailwind CSS and Radix UI primitives.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and JSX
- **Styling**: Tailwind CSS with a custom design system based on shadcn/ui components
- **Component Library**: Extensive use of Radix UI primitives for accessibility and functionality
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation resolvers
- **Build Tool**: Vite for fast development and optimized production builds
- **Design System**: Custom Tailwind configuration with CSS variables for theming, supporting both light and dark modes

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Development**: Hot reloading with Vite middleware integration
- **Request Handling**: Express middleware for JSON parsing, URL encoding, and request logging
- **Error Handling**: Centralized error handling middleware with status code management
- **Storage Interface**: Abstracted storage layer with in-memory implementation (designed for database extension)

## Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: Configured for PostgreSQL with Neon serverless support
- **Schema Management**: Centralized schema definitions with Zod validation
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Connection**: Environment-based database URL configuration

## Development Experience
- **Monorepo Structure**: Shared TypeScript types and schemas between client and server
- **Path Aliases**: Configured path mapping for clean imports (@/, @shared/, @assets/)
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared modules
- **Development Server**: Integrated Vite dev server with Express API proxy

## Design System
- **Component Strategy**: Utility-first approach with Tailwind CSS
- **Theme System**: CSS custom properties for consistent theming
- **Typography**: Inter font family from Google Fonts
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities
- **Color Palette**: Neutral-based color system with primary blue accents
- **Component Variants**: Class Variance Authority (CVA) for component styling patterns

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Connection Pooling**: Configured for serverless environments

## UI and Styling
- **Radix UI**: Complete set of accessible React components including dialogs, dropdowns, navigation, forms, and layout primitives
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Class Management**: clsx and tailwind-merge for conditional styling
- **Carousel**: Embla Carousel React for interactive content display

## Development Tools
- **Replit Integration**: Custom Vite plugins for Replit environment support
- **PostCSS**: Autoprefixer and Tailwind CSS processing
- **ESBuild**: Fast bundling for production server builds

## Form and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **Drizzle Zod**: Integration between Drizzle schemas and Zod validation

## Utility Libraries
- **Date Handling**: date-fns for date manipulation and formatting
- **Command Palette**: cmdk for command interface functionality
- **State Management**: TanStack React Query for server state and caching
- **Session Management**: connect-pg-simple for PostgreSQL session storage

## Build and Runtime
- **Vite**: Frontend build tool and development server
- **TypeScript**: Full-stack type safety
- **ESM**: Native ES modules throughout the application