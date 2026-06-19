# AI Resume Builder - Project Documentation

## Overview

AI Resume Builder is a full-stack, AI-powered resume creation and optimization platform. It provides an intuitive web interface for building resumes with AI assistance, live preview across multiple professional templates, and one-click PDF download with pixel-perfect formatting.

## Architecture

### Tech Stack

**Frontend (Client)**
- React 18.3 + Vite 6.0 for fast development and builds
- TypeScript 5.7 for type safety
- Zustand for state management (resume data & customization)
- Tailwind CSS 3.4 for styling
- @dnd-kit for drag-and-drop functionality (section reordering)
- Lucide React for icons

**Backend (Server)**
- Node.js with Express 4.21 for API
- TypeScript 5.7 for type safety
- Anthropic SDK 0.65 for Claude AI integration
- Puppeteer 24.0 for server-side PDF generation with Chromium
- CORS enabled for client communication
- dotenv for environment configuration

**AI Model**
- Claude Sonnet 4.6 via Anthropic API
- Graceful mock mode when API key is unavailable (for development/demo)

**Data Persistence**
- localStorage on client (no database required)
- No authentication layer (single-user/demo mode)

### Project Structure

```
AI Resume Builder/
├── client/                    # React frontend workspace
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/           # AI feature components
│   │   │   │   ├── ATSOptimizer.tsx      # ATS score optimization
│   │   │   │   ├── BulletGenerator.tsx   # Generate achievement bullets
│   │   │   │   └── Improver.tsx          # Content improvement
│   │   │   ├── form/         # Resume form sections
│   │   │   │   ├── PersonalInfoSection.tsx
│   │   │   │   ├── SummarySection.tsx
│   │   │   │   ├── ExperienceSection.tsx
│   │   │   │   ├── EducationSection.tsx
│   │   │   │   ├── SkillsSection.tsx
│   │   │   │   ├── ProjectsSection.tsx
│   │   │   │   ├── CertificationsSection.tsx
│   │   │   │   ├── CustomSectionsEditor.tsx
│   │   │   │   ├── BulletListEditor.tsx
│   │   │   │   ├── MonthYearPicker.tsx
│   │   │   │   ├── SortableSection.tsx
│   │   │   │   ├── EntryCard.tsx
│   │   │   │   └── FormPanel.tsx
│   │   │   ├── preview/      # Live preview and templates
│   │   │   │   ├── LivePreview.tsx
│   │   │   │   ├── ResumeDocument.tsx
│   │   │   │   ├── ResumeHeader.tsx
│   │   │   │   ├── CustomizationToolbar.tsx
│   │   │   │   ├── templates/
│   │   │   │   │   ├── ClassicTemplate.tsx
│   │   │   │   │   ├── MinimalTemplate.tsx
│   │   │   │   │   └── ModernTemplate.tsx
│   │   │   │   ├── blocks.tsx
│   │   │   │   ├── resumeStyles.ts
│   │   │   │   ├── formatters.ts
│   │   │   │   └── previewVars.ts
│   │   │   ├── ui/           # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Field.tsx
│   │   │   │   ├── Collapsible.tsx
│   │   │   │   ├── DiffView.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── CircularProgress.tsx
│   │   │   │   └── Tag.tsx
│   │   │   └── DownloadPdfButton.tsx
│   │   ├── hooks/
│   │   │   ├── useAI.ts       # AI service integration hook
│   │   │   └── useFitScale.ts # PDF layout scaling
│   │   ├── store/
│   │   │   ├── useResumeStore.ts        # Resume data state (Zustand)
│   │   │   ├── useCustomizationStore.ts # Template customization (Zustand)
│   │   │   └── defaults.ts
│   │   ├── types/
│   │   │   └── resume.ts      # TypeScript interfaces for resume data
│   │   ├── lib/
│   │   │   ├── cn.ts          # Tailwind classname utilities
│   │   │   └── id.ts          # ID generation utilities
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # React DOM entry
│   │   ├── index.css          # Global styles
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Express backend workspace
│   ├── src/
│   │   ├── routes/
│   │   │   ├── ai.ts          # AI endpoints (bullet generation, improvement, ATS)
│   │   │   └── pdf.ts         # PDF generation endpoint
│   │   ├── services/
│   │   │   ├── claude.ts      # Anthropic SDK wrapper & prompts
│   │   │   ├── mock.ts        # Mock AI responses (graceful fallback)
│   │   │   └── pdf.ts         # Puppeteer PDF generation
│   │   ├── types/
│   │   │   └── resume.ts      # Shared TypeScript interfaces
│   │   └── index.ts           # Express server setup
│   ├── tsconfig.json
│   └── package.json
│
├── package.json               # Root workspace config
├── .gitignore
├── README.md
└── CLAUDE.md                  # This file
```

## Features Implemented

### 1. Resume Form (Client-side)
- **Personal Information** - Name, email, phone, location, URL
- **Professional Summary** - Text area with character counter
- **Experience** - Multiple entries with company, title, dates, bullet points
- **Education** - Multiple entries with school, degree, field, dates
- **Skills** - Skill tags with add/remove functionality
- **Projects** - Portfolio items with descriptions
- **Certifications** - Professional certifications list
- **Custom Sections** - User can add/remove arbitrary sections
- **Drag-and-drop** - Reorder sections and entries using @dnd-kit
- **Date Picker** - Month/year picker for start/end dates
- **Undo/Redo** - State management via Zustand

### 2. AI Features (Server + Client)

#### Bullet Point Generator
- Takes job description/context
- Uses Claude Sonnet 4.6 to generate achievement bullets
- Returns multiple options with diff view showing improvements
- Gracefully falls back to mock data if no API key

#### Content Improver
- Improves existing resume bullets
- Enhances clarity, impact, and professionalism
- Shows before/after comparison
- Mock mode provides realistic sample improvements

#### ATS Optimizer
- Analyzes resume for Applicant Tracking System compatibility
- Scores resume on ATS-friendliness (0-100)
- Provides specific improvement suggestions
- Highlights keywords and formatting issues

### 3. Live Preview (Client-side)
Three fully-functional resume templates:
- **Classic Template** - Traditional professional look
- **Modern Template** - Contemporary design with accent colors
- **Minimal Template** - Clean, minimal aesthetic

Features:
- Real-time preview updates as user types
- Responsive preview across different screen sizes
- Section collapsing in preview
- Template switching without data loss

### 4. Customization Toolbar
- **Color themes** - Select accent colors
- **Font selection** - Choose from web fonts
- **Spacing controls** - Adjust section and item spacing
- **Template switching** - Change between 3 templates
- **Live updates** - Instant preview updates

### 5. PDF Export
- Server-side PDF generation using Puppeteer
- Pixel-perfect rendering matching live preview
- Proper page breaks and pagination
- Downloads as resume.pdf

## API Endpoints

### AI Routes (`/api/ai/*`)

**POST /api/ai/bullet-generator**
```json
{
  "context": "string",      // Job description or context
  "existingBullet": "string" // Optional: existing bullet to improve
}
```
Response: `{ bullets: string[], mockMode: boolean }`

**POST /api/ai/improver**
```json
{
  "text": "string",     // Resume text to improve
  "section": "string"   // Section type (experience, summary, etc.)
}
```
Response: `{ improved: string, mockMode: boolean }`

**POST /api/ai/ats-optimizer**
```json
{
  "resumeText": "string" // Full resume text
}
```
Response: `{ score: number, suggestions: string[], mockMode: boolean }`

### PDF Route (`/api/pdf/*`)

**POST /api/pdf/generate**
```json
{
  "html": "string",           // HTML content of resume
  "template": "string",       // Template name
  "customizations": {...}     // Customization settings
}
```
Response: PDF file (application/pdf)

## AI Integration Details

### Claude Integration (`server/src/services/claude.ts`)
- Uses Anthropic SDK `@anthropic-ai/sdk@0.65.0`
- Model: `claude-sonnet-4-6`
- Context: 200k token window
- Includes specialized prompts for:
  - Resume bullet generation (achievement-focused language)
  - Content improvement (clarity, impact, brevity)
  - ATS optimization (keyword analysis, structure)

### Mock Mode (`server/src/services/mock.ts`)
- Activates when `ANTHROPIC_API_KEY` is not set
- Returns realistic sample responses
- Allows full app functionality for development/demo
- No external API calls or costs

## State Management

### Resume Store (`client/src/store/useResumeStore.ts`)
- Zustand store managing all resume data
- Persisted to localStorage
- Tracks: personal info, sections, customizations
- Actions: update sections, add entries, remove entries, reset

### Customization Store (`client/src/store/useCustomizationStore.ts`)
- Template and styling customization state
- Selected template (classic/modern/minimal)
- Color theme, fonts, spacing
- Persisted to localStorage

## Development & Deployment

### Setup
```bash
# Install dependencies (both workspaces + Puppeteer Chromium)
npm install

# Copy environment file and optionally add API key
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY for real AI features

# Start development servers
npm run dev
# Client: http://localhost:5173
# Server: http://localhost:3001
```

### Available Scripts
- `npm run dev` - Start client + server concurrently
- `npm run dev:client` - Client only
- `npm run dev:server` - Server only
- `npm run build` - Build both workspaces
- `npm run typecheck` - Type-check both workspaces
- `npm run start` - Run production server

### Build
```bash
npm run build
# Outputs:
# - client/dist/ (Vite build, static assets)
# - server/dist/ (TypeScript compiled to JS)
```

### Production Deployment
1. Set `ANTHROPIC_API_KEY` environment variable
2. Run `npm run build`
3. Deploy `client/dist` as static files (CDN/static hosting)
4. Deploy `server` (node process or serverless)
5. Configure CORS for client domain

## Key Design Decisions

### localStorage for Persistence
- Simplifies deployment (no backend DB required)
- Suitable for single-user/demo scenarios
- Users can save multiple resumes by exporting/importing JSON

### Monorepo Workspace Structure
- Shared TypeScript types (`types/resume.ts` in both workspaces)
- Unified dependency management via root `package.json`
- Single deploy with coordinated builds

### Mock Mode
- Enables full feature demonstration without API key
- Graceful fallback for development environments
- Realistic sample responses for UX testing

### Server-side PDF Generation
- Puppeteer ensures pixel-perfect PDF matching live preview
- Server-side processing avoids client-side complexity
- Supports all template variations

### Drag-and-drop with @dnd-kit
- Modern, accessible drag-and-drop library
- Reorder entire sections or individual entries
- Smooth animations and touch support

## Testing & Type Safety
- TypeScript strict mode throughout
- Type-safe Zustand stores
- Shared type definitions between client and server
- Full type coverage for resume data structures

## Performance Considerations
- Vite for fast client-side development and builds
- React lazy loading for heavy components (AI features)
- localStorage caching reduces API calls
- Puppeteer PDF generation is CPU-intensive (runs server-side)

## Future Enhancement Opportunities
- Add user authentication for multi-user support
- Implement database for resume persistence
- Support for additional file formats (DOCX, JSON export)
- More resume templates and customization options
- AI-powered job application matching
- Built-in grammar and spell checking
- Analytics on resume improvements

## Notes

- The app runs in **mock mode** when `ANTHROPIC_API_KEY` is not set, providing full functionality for demos and development
- All resume data is stored in browser localStorage - no server-side storage
- PDF generation requires a working Chrome/Chromium installation (included via Puppeteer)
- AI features use Claude Sonnet 4.6 for optimal speed and cost balance
