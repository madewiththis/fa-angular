# FlowAccount Angular Application - CLAUDE.md

## Project Overview

This is a **frontend prototype** for the new version of FlowAccount.com, built with Angular 20. The purpose is to create a development-only prototype that represents the new branding, sales copy, design language, and in-app interface for FlowAccount's upcoming redesign. This allows for rapid, near-production-feel prototyping without backend dependencies.

**Project Purpose:**
- Prototype new FlowAccount branding and design language
- Test new sales copy and user experience flows
- Demonstrate new in-app interface concepts
- Enable rapid iteration on design and UX decisions
- Provide production-quality feel for stakeholder review

**Key Features:**
- Landing page with role-based feature presentation
- Password-protected demo environment for stakeholder access
- Prototype dashboard with multiple business modules
- Advanced video player for feature demonstrations
- Responsive design showcasing new design system

## Architecture & Stack

**Framework:** Angular 20.0 with standalone components
**Language:** TypeScript 5.8.2
**Styling:** SCSS with Angular Material (Azure Blue theme)
**Video:** Video.js 8.23.3 with custom wrapper
**Build:** Angular CLI with Vite-based build system
**Testing:** Jasmine/Karma

## Project Structure

```
src/app/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── landing/         # Landing page sections
│   ├── media-player/    # Video player system
│   ├── navigation/      # Navigation components
│   └── shared/          # Common UI components
├── pages/               # Route-based page components
├── services/            # Business logic services
├── guards/              # Route protection
└── models/              # TypeScript interfaces
```

## Key Components

### Landing System
- **Home Page** (`pages/landing/home/`): Main landing page
- **Hero Section** (`components/landing/hero/`): Hero with bento grid layout
- **Features V2** (`components/landing/features-section-v2/`): Role-based feature showcase
- **Pricing Table** (`components/landing/pricing-table/`): Subscription plans

### Media Player System
Located in `components/media-player/`, this is a sophisticated video player with:
- **Floating Player**: Picture-in-picture style with draggable positioning
- **Fixed Player**: Full-screen embedded player
- **MediaPlayerService**: Centralized state management with RxJS
- **Position Persistence**: Saves video progress in localStorage
- **Analytics Integration**: Google Analytics event tracking

### Authentication (Prototype)
- **Demo Access**: Hardcoded password "liquidflow" for stakeholder demos
- **Session Management**: 30-minute timeout for prototype sessions
- **Auth Guard**: Simulates protected areas of the actual application

## Configuration

### Build Scripts
```bash
npm start          # Development server (ng serve)
npm run build      # Production build
npm run test       # Run unit tests
npm run watch      # Watch mode for development
```

### TypeScript Configuration
- **Base URL**: `./src` with path mapping for `@components/*`
- **Strict Mode**: Enabled with comprehensive type checking
- **Target**: ES2022 with ES2022 modules
- **Module Resolution**: Bundler mode for modern Angular builds
- **Import Helpers**: Enabled with tslib support

### Angular Configuration
- **Style Language**: SCSS
- **Bundle Budget**: 2MB warning, 5MB error
- **Component Styles**: 10kB warning, 20kB error
- **Video.js Dependencies**: Whitelisted in allowedCommonJsDependencies

## Services

### MediaPlayerService (`services/media-player.service.ts`)
Manages video playback state with features:
- Floating/fixed player modes
- Position saving/restoration  
- Volume control
- Picture-in-picture support
- Analytics tracking
- Skip forward/backward functionality

### AuthService (`services/auth.service.ts`)
Handles demo authentication:
- Password validation
- Session timeout management
- Automatic logout and redirection

## Routing Structure

```
/login                    # Password protection
/landing/home            # Main landing page
/landing/signup          # Signup page
/start                   # Getting started
/dashboard/              # Main dashboard
  ├── get-started        # Onboarding
  ├── overview           # Dashboard overview
  ├── accounts-receivable # AR module
  └── accounts-payable   # AP module
/sell/                   # Sales modules
/buy/                    # Purchase modules
/accounting/             # Accounting features
/reports/                # Business reports
/products/               # Product management
/contacts/               # Contact management
/expenses/               # Expense tracking
```

## Development Guidelines

### Prototyping Philosophy
- **Frontend-Only**: No backend integration required
- **Production Feel**: Code quality that feels like production
- **Rapid Iteration**: Easy to modify branding, copy, and layouts
- **Stakeholder Ready**: Polished enough for client presentations

### Component Architecture
- **Standalone Components**: All components use standalone: true for modularity
- **Self-Contained Features**: Each feature is designed to be as standalone as possible to facilitate easy adoption and integration into the production site
- **Reactive Patterns**: RxJS for state management
- **TypeScript Strict**: Full type safety enforced
- **SCSS Modules**: Component-scoped styling with minimal dependencies
- **Design System**: Consistent patterns for new FlowAccount brand
- **Minimal Coupling**: Components designed for easy extraction to production codebase

### Code Conventions
- **Path Aliases**: Use `@components/*` for component imports
- **Service Injection**: Use `inject()` function for dependency injection
- **Interfaces**: Define TypeScript interfaces for all data structures
- **Template/Style**: Separate HTML and SCSS files for components
- **Copy Management**: Sales copy and content easily modifiable for testing

### Media Player Usage
```typescript
// Launch floating player
this.mediaPlayerService.launchFloatingPlayer({
  id: 'unique-video-id',
  url: 'path/to/video.mp4',
  title: 'Video Title',
  description: 'Video description'
});

// Launch fixed player
this.mediaPlayerService.launchFixedPlayer(config);

// Listen to state changes
this.mediaPlayerService.state$.subscribe(state => {
  // Handle state updates
});
```

## Git Repository & Collaboration

### Repository Management
This project is managed as a Git repository to enable:
- **Version Control**: Track changes to design iterations and feature updates
- **Team Collaboration**: Multiple team members can contribute to the prototype
- **Branch Management**: Feature branches for testing different design approaches
- **Change History**: Complete audit trail of prototype evolution

### Git Workflow
```bash
# Clone the repository
git clone [repository-url]

# Create feature branch for new designs
git checkout -b feature/new-hero-design

# Stage and commit changes
git add .
git commit -m "Update hero section with new branding"

# Push changes for team review
git push origin feature/new-hero-design
```

### Team Access & Review
The prototype is hosted at **flowaccount.vercel.com** to provide access to the wider FlowAccount teams to:
- **Review**: Examine new features and UI designs in a production-like environment
- **Comment**: Provide feedback on design decisions and user experience flows
- **Understand Behavior**: See how updated features and UI should behave in the actual application
- **Stakeholder Demo**: Share with clients and stakeholders for approval

## Build & Deployment

### Development
```bash
ng serve                 # http://localhost:4200
```

### Production Build
```bash
ng build                 # Outputs to dist/
```

### Vercel Deployment
The project automatically deploys to flowaccount.vercel.com when changes are pushed to the main branch:
- **Automatic Deployment**: Vercel detects changes and rebuilds the site
- **Preview Deployments**: Feature branches get preview URLs for testing
- **Team Access**: All FlowAccount team members can access the live prototype
- **Stakeholder Sharing**: Easy URL sharing for client presentations

### Environment Configuration
- **Production**: Optimized bundles with output hashing
- **Development**: Source maps and fast rebuilds
- **Assets**: Automatic copying from src/assets and public/
- **Vercel**: Optimized for fast global CDN delivery

## Testing Strategy

### Unit Testing
- **Framework**: Jasmine with Karma
- **Coverage**: Run `ng test` for test execution
- **Spec Files**: Co-located with components

### E2E Testing
- **Framework**: Not configured (Angular CLI default)
- **Recommendation**: Add Cypress or Playwright for E2E testing

## Security Considerations

### Demo Environment
- Hardcoded password for demo access (not production-ready)
- Session timeout for security
- Route guards for protected areas

### Best Practices
- No sensitive data in localStorage
- Proper TypeScript typing for security
- Angular's built-in XSS protection

## Performance Optimizations

### Lazy Loading
- Route-based code splitting with `loadComponent()`
- Reduced initial bundle size

### Bundle Management
- Video.js dependencies properly configured
- Bundle size monitoring with budgets
- Tree-shaking enabled

### Media Player Optimizations
- Position persistence reduces re-watching
- Efficient state management with RxJS
- Memory cleanup on component destruction

## Common Tasks

### Prototyping New Features
1. Create component in appropriate `components/` subdirectory
2. Add to routing if it's a page-level component
3. Import and use in parent components
4. Follow existing patterns for styling and TypeScript
5. Focus on visual fidelity over functional implementation

### Updating Sales Copy
1. Locate content in component TypeScript files (e.g., features array in features-section-v2)
2. Modify titles, descriptions, and content strings
3. Test different messaging approaches quickly
4. Keep stakeholder feedback cycle short

### Branding & Design Updates
1. Update SCSS variables and Angular Material theme
2. Modify component styles for new design language
3. Update assets in `src/assets/` for new brand elements
4. Test responsive behavior across devices

### Adding Demo Content
1. Place video/image assets in `src/assets/`
2. Use MediaPlayerService for video demonstrations
3. Configure with descriptive IDs for easy management

## Known Issues & Limitations

### Prototype Constraints
- **Frontend Only**: No backend integration or real data
- **Demo Password**: Hardcoded authentication for prototype access
- **Static Content**: Feature demonstrations use placeholder content
- **Limited Functionality**: Focus on visual design over full functionality

### Media Player
- Fixed player mode requires manual exit
- Position saving depends on localStorage availability  
- Video.js dependencies require specific CommonJS whitelist

## Future Prototype Enhancements

### Design & UX Improvements
1. **A/B Testing**: Easy switching between design variations
2. **Content Management**: Dynamic content loading for copy testing
3. **Device Testing**: Enhanced mobile and tablet experiences
4. **Accessibility**: WCAG compliance for inclusive design
5. **Performance**: Optimize for fast stakeholder demos

### Prototype Features
1. **Interactive Demos**: More sophisticated feature simulations
2. **User Journeys**: Complete user flow demonstrations
3. **Data Visualization**: Chart and graph prototypes
4. **Integration Mockups**: Simulated third-party service connections
5. **Responsive Showcases**: Device-specific design variations

### Development Workflow
1. **Hot Reloading**: Faster design iteration cycles
2. **Component Library**: Reusable design system components
3. **Style Guide**: Living documentation for new brand
4. **Git Branches**: Feature branches for design experimentation
5. **Vercel Previews**: Automatic preview URLs for team review
6. **Live Deployment**: flowaccount.vercel.com for team access and stakeholder demos