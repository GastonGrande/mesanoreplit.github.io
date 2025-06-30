# replit.md

## Overview

This is a full-stack web application built with Express.js backend and React frontend, designed to handle consultation requests and send data to external webhooks (specifically n8n). The application allows users to select a month and year for consultation purposes, validates the input, and forwards the data to an external webhook service.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Form Management**: React Hook Form with Zod validation

## Key Components

### Backend Architecture (`server/`)
- **Express Server** (`server/index.ts`): Main application server with middleware for logging and error handling
- **Routes** (`server/routes.ts`): API endpoints, primarily the consultation webhook endpoint at `/api/consultation`
- **Storage Layer** (`server/storage.ts`): Abstraction layer for data persistence with in-memory implementation (ready for database integration)
- **Vite Integration** (`server/vite.ts`): Development server setup with HMR support

### Frontend Architecture (`client/`)
- **React App** (`client/src/App.tsx`): Main application with routing using Wouter
- **Form Component** (`client/src/components/consultation-form.tsx`): Main consultation form with validation
- **Pages**: Home page with consultation form and 404 error page
- **UI Components** (`client/src/components/ui/`): Complete shadcn/ui component library
- **Utilities**: Query client setup, form validation, and styling utilities

### Shared Layer (`shared/`)
- **Database Schema** (`shared/schema.ts`): Drizzle ORM schema definitions for users and webhook requests
- **Type Safety**: Shared TypeScript types and Zod validation schemas

## Data Flow

1. **User Input**: User selects month and year through the consultation form
2. **Client Validation**: Form data is validated using Zod schemas on the client side
3. **API Request**: Validated data is sent to `/api/consultation` endpoint
4. **Server Processing**: 
   - Server validates the request again using shared schemas
   - Creates a webhook request record in storage
   - Forwards data to configured n8n webhook URL
5. **Response Handling**: Client receives success/error feedback and displays appropriate toast notifications

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling
- **zod**: Runtime type validation
- **@radix-ui/***: Headless UI primitives for shadcn/ui

### Development Tools
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development
- Frontend served by Vite dev server with HMR
- Backend runs with tsx for TypeScript execution
- Integrated development experience with shared types

### Production Build Process
1. **Frontend**: `vite build` creates optimized client bundle in `dist/public`
2. **Backend**: `esbuild` bundles server code to `dist/index.js`
3. **Static Serving**: Express serves built frontend assets in production

### Environment Configuration
- **N8N_WEBHOOK_URL** or **WEBHOOK_URL**: URL del webhook de n8n donde se enviarán los datos (requerido)
- **DATABASE_URL**: PostgreSQL connection string (opcional para desarrollo)
- **NODE_ENV**: Environment detection for conditional behavior

### Configuración del Webhook
Para configurar la URL del webhook de n8n:
1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega la línea: `N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/tu-webhook-id`
3. Reemplaza la URL con tu webhook real de n8n
4. Reinicia la aplicación para aplicar los cambios

### Database Setup
- Uses Drizzle migrations stored in `./migrations`
- Schema defined in `shared/schema.ts` with PostgreSQL dialect
- Ready for database provisioning via `npm run db:push`

## Changelog
- June 30, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.