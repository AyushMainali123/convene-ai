# AI SaaS Platform

A comprehensive AI-powered SaaS platform for conducting intelligent video meetings with AI agents. Built with Next.js, this platform enables users to create custom AI agents, schedule meetings, and leverage real-time AI capabilities during video calls.

## 🎯 Features

- **AI Agent Management**: Create and customize AI agents with specific instructions and personalities
- **Video Meetings**: Real-time video conferencing powered by Stream Video
- **AI-Powered Interactions**: Real-time AI conversations using Google's Gemini AI
- **Meeting Analytics**: Automated transcription, recording, and AI-generated summaries
- **Authentication**: Secure authentication with Better Auth and Polar.sh integration
- **Dashboard**: Comprehensive dashboard with analytics and meeting management
- **Subscription Management**: Integrated premium features and subscription handling

## 🏗️ Architecture

### Project Structure

```
ai-saas/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── dashboard/  # Dashboard routes (agents, meetings, settings)
│   │   ├── api/          # API routes and webhooks
│   │   ├── auth/         # Authentication pages
│   │   └── call/         # Video call interface
│   ├── modules/          # Feature modules
│   │   ├── agents/       # Agent management module
│   │   ├── auth/         # Authentication module
│   │   ├── call/         # Video call module
│   │   ├── dashboard/    # Dashboard module
│   │   ├── landing/      # Landing page module
│   │   ├── meetings/     # Meeting management module
│   │   ├── premium/      # Premium features module
│   │   └── settings/     # User settings module
│   ├── components/       # Shared UI components
│   ├── db/               # Database schema and configuration
│   ├── hooks/            # Custom React hooks
│   ├── inngest/          # Background job processing
│   ├── lib/              # Utility libraries and configurations
│   └── trpc/             # tRPC API setup and routers
├── drizzle/              # Database migrations
└── public/               # Static assets
```

### Tech Stack

#### Core Framework
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development

#### Backend & API
- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript ORM for database operations
- **PostgreSQL** - Primary database (Neon serverless)
- **Inngest** - Background job processing and workflows

#### AI & Video
- **Google AI SDK** - AI model integration (Gemini)
- **Stream Video SDK** - Real-time video conferencing
- **OpenAI Realtime API** - Real-time AI agent interactions
- **Inngest Agent Kit** - AI agent orchestration

#### Authentication & Payments
- **Better Auth** - Modern authentication library
- **Polar.sh** - Subscription and payment management

#### UI Components
- **Radix UI** - Accessible component primitives
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components

#### Form & State Management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **TanStack Query** - Server state management
- **nuqs** - URL state management

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ 
- pnpm
- PostgreSQL database (Neon recommended)
- Google AI API key
- Stream Video API credentials
- Polar.sh account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-saas
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the variables specified in the `.env.example` file.


4. **Set up the database**
   ```bash
   # Generate migrations
   pnpm db:generate

   # Run migrations
   pnpm db:migrate

   # Or push schema directly (development)
   pnpm db:push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Tools

```bash
# Database Studio (Drizzle)
pnpm db:studio

# Inngest Dev Server
pnpm inngest:dev

# Ngrok Tunnel (for webhooks)
pnpm tunnel

# Linting
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📊 Database Schema

### Core Entities

- **Users**: User accounts with authentication details
- **Sessions**: User session management
- **Accounts**: OAuth provider accounts
- **Agents**: Custom AI agents with instructions
- **Meetings**: Video meetings with AI agents
  - Status: `upcoming`, `active`, `completed`, `processing`, `cancelled`
  - Includes: transcripts, recordings, AI summaries

### Key Features

- **User Management**: Full authentication system with session handling
- **Agent System**: Create customizable AI agents with specific personas
- **Meeting Lifecycle**: Track meetings from creation through completion
- **Automated Processing**: Background jobs for transcription and summarization

## 🎨 UI/UX

The application features a modern, professional saas design with:

- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Premium Aesthetics**: Polished UI with smooth animations
- **Consistent Design System**: Defined in `src/app/globals.css`

## 🔐 Authentication

Authentication is powered by Better Auth with:

- Email/Password authentication
- OAuth providers support
- Session management
- Protected routes
- Integration with Polar.sh for premium subscriptions

## 🤖 AI Capabilities

### AI Agent Features

- **Custom Instructions**: Define agent behavior and personality
- **Real-time Conversations**: AI agents can speak and respond during video calls
- **Context Awareness**: Agents maintain conversation context
- **Multi-modal Support**: Text and voice interactions

### Meeting Intelligence

- **Live Transcription**: Real-time speech-to-text
- **AI Summaries**: Automatic meeting summaries
- **Recording Management**: Automated recording storage
- **Searchable Transcripts**: Full-text search capabilities

## 📦 Module System

The application uses a modular architecture with feature-based organization:

- **agents**: Agent CRUD operations and management
- **meetings**: Meeting scheduling and management
- **call**: Video call interface and controls
- **dashboard**: Analytics and overview
- **settings**: User preferences and configuration
- **premium**: Subscription and upgrade flows

Each module contains:
- `ui/`: React components
- Type definitions and utilities


## 🚢 Deployment

### Build

```bash
pnpm build
```

### Production

The application is optimized for deployment on:
- **Vercel** (recommended)
- Any Node.js hosting platform

### Environment Requirements

- Node.js 20+
- PostgreSQL database
- External API access for:
  - Google AI
  - Stream Video
  - Polar.sh

## 📝 Development Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint configuration included
- React Compiler enabled for optimizations

### Database Changes

1. Modify schema in `src/db/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Apply migration: `pnpm db:migrate`

### Adding New Features

1. Create module in `src/modules/[feature-name]`
2. Define data layer with tRPC procedures
3. Build UI components
4. Add routes in `src/app`

## 🔧 Troubleshooting

### Common Issues

- **Database Connection**: Ensure `DATABASE_URL` is correctly set
- **AI API Errors**: Verify `GOOGLE_API_KEY` is valid
- **Video Issues**: Check Stream Video credentials
- **Webhook Failures**: Use ngrok tunnel for local development

## 📄 License

Private - All rights reserved

## 🤝 Contributing

This is a private project. For questions or issues, please contact the development team.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
