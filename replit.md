# 3D Point Cloud Surface Application

## Overview

This is a React-based 3D visualization application that creates an interactive point cloud surface using Three.js and React Three Fiber. The application renders a dynamic, animated surface made of points that responds to mouse interactions and displays wave-like animations. It features a modern full-stack architecture with Express.js backend, PostgreSQL database integration via Drizzle ORM, and a comprehensive UI component library built with Radix UI and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Rendering**: React Three Fiber (@react-three/fiber) with Three.js
- **3D Utilities**: React Three Drei (@react-three/drei) for camera controls and utilities
- **Post-processing**: React Three Postprocessing for visual effects
- **State Management**: Zustand for global state (game state and audio management)
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with React plugin and GLSL shader support

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: TSX for TypeScript execution

### Data Flow
1. Client renders 3D scene using React Three Fiber
2. Point cloud surface is generated procedurally with mathematical wave functions
3. Mouse interactions are tracked and influence surface animations
4. Game state is managed through Zustand stores
5. Audio system provides feedback for interactions (with mute controls)
6. Backend provides API endpoints for potential user data and game state persistence

## Key Components

### 3D Visualization Components
- **PointCloudSurface**: Main component rendering the animated point cloud
- **Scene**: Orchestrates lighting, camera controls, and main surface
- **usePointCloud**: Custom hook for surface animation calculations

### Game System
- **Game State Store**: Manages game phases (ready, playing, ended)
- **Audio Store**: Handles sound effects and background music with mute controls
- **Interface**: Provides game controls and status display

### UI Infrastructure
- **Comprehensive component library** based on Radix UI primitives
- **Responsive design** with mobile detection hooks
- **Accessible controls** with proper ARIA labels and keyboard navigation

## External Dependencies

### Core 3D Libraries
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for React Three Fiber
- **@react-three/postprocessing**: Post-processing effects

### Database & Backend
- **@neondatabase/serverless**: Serverless PostgreSQL database
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **drizzle-kit**: Database migrations and introspection

### UI & Styling
- **@radix-ui/react-***: Accessible UI primitive components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for components

### State & Data Management
- **zustand**: Lightweight state management
- **@tanstack/react-query**: Server state management

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20
- **Port Configuration**: Application runs on port 5000, externally exposed on port 80
- **Hot Reload**: Vite development server with HMR enabled
- **Database**: Configured for PostgreSQL via DATABASE_URL environment variable

### Production Build
- **Frontend Build**: Vite builds static assets to `dist/public`
- **Backend Build**: ESBuild bundles server code to `dist/index.js`
- **Deployment**: Autoscale deployment target with build and run commands
- **Asset Handling**: Support for 3D models (.gltf, .glb) and audio files

### Database Management
- **Schema**: Defined in `shared/schema.ts` with Drizzle ORM
- **Migrations**: Generated in `./migrations` directory
- **Current Schema**: Basic user management with username/password authentication

## Changelog

```
Changelog:
- June 22, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```