# FlowAccount Angular Application - CLAUDE.md

## Project Overview

This is a **frontend prototype** for the new version of FlowAccount.com, built with Angular 20. The purpose is to create a development-only prototype that represents the new branding, sales copy, design language, and in-app interface for FlowAccount's upcoming redesign. This allows for rapid, near-production-feel prototyping without backend dependencies.

> **📋 Strategic Context**: For comprehensive project purpose, deliverables, and Growth Book A/B testing integration strategy, see [`dev_files/context/context-project-purpose-and-deliverables.md`](dev_files/context/context-project-purpose-and-deliverables.md). This document defines the UX improvement pipeline workflow and documentation standards.

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
- **User Profile Testing System** for scenario-based UX validation

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
│   ├── shared/          # Common UI components
│   └── user-profile-testing/  # 🧪 UX Testing System
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

### User Profile Testing System (Critical UX Validation Tool)
Located in `components/user-profile-testing/`, this is a **comprehensive system for validating and recommending new user experiences** to the FlowAccount development team:

**Core Purpose**: Complete behavioral testing platform that simulates different user profiles and automatically adapts the entire app experience, with enterprise-grade management tools for creating and documenting UX variations.

**Key Components**:
- **Three-Tab Modal Interface**: Testing (live preview), Feature Flags (management), Changes (documentation)
- **Feature Flag Management UI**: Create, edit, archive flags with serialized naming and condition builder
- **Smart Floating Indicator**: Comprehensive status popup showing all cookie values and behavioral states
- **User-Editable Scenarios**: Create, edit, delete custom test personas with full profile data
- **Archive System**: Flag lifecycle management without deletion for audit trails
- **Auto-Generated Documentation**: Implementation instructions for development team

**Advanced Features**:
- **Serialized Naming System**: Unique flag IDs (e.g., `4834_checkout_flow_collapse`) prevent conflicts
- **Type Safety**: Boolean, String, Number flags with proper defaults and validation
- **Condition Builder**: Visual interface for complex behavioral logic
- **Profile Data Integration**: Name, email, company fields with sensible defaults
- **Session Persistence**: 30-day cookie retention for demo continuity
- **Change Instructions**: Markdown export for development team implementation

**Strategic Value**: 
- **Complete UX Platform**: Enterprise-grade system for comprehensive user experience testing
- **Non-Technical Flag Management**: Business users can create behavioral variations without code
- **Development Documentation**: Auto-generated specifications for production implementation
- **Stakeholder Demonstrations**: Professional interface for client presentations
- **Audit Trail**: Full history of all UX experiments and decisions

**Integration**: Components throughout the app use strongly-typed methods to demonstrate adaptive experiences, with clear integration patterns for rapid development.

> **📋 Complete Documentation**: See [`src/app/components/user-profile-testing/README.md`](src/app/components/user-profile-testing/README.md) for comprehensive implementation guide and AI usage instructions.

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

### User Profile Testing Services (Complete UX Validation Engine)

**UserProfileTestingService** (`services/user-profile-testing.service.ts`)
Comprehensive state management and scenario orchestration:
- **Cookie-based persistence**: 30-day retention with auto-save functionality
- **User profile management**: Core fields (role, business_type, package) + user info (name, email, company)
- **Scenario system**: Create, edit, delete custom test personas with full CRUD operations
- **Feature flag integration**: Managed flag creation, archiving, and change instruction generation
- **Modal state management**: Three-tab interface coordination and real-time updates
- **Testing mode detection**: Smart floating indicator state management

**FeatureFlagService** (`services/feature-flag.service.ts`) 
Advanced conditional logic engine with enterprise features:
- **Registry-driven evaluation**: Centralized behavior definitions with type safety
- **Strongly-typed methods**: Component integration with IntelliSense support
- **Real-time condition evaluation**: User profile changes trigger immediate flag updates
- **Graceful error handling**: Fallback to defaults with comprehensive logging
- **Debugging capabilities**: Complete flag state inspection and evaluation tracing
- **Performance optimized**: On-demand evaluation with minimal overhead

**Feature Flag Registry** (`config/feature-flag-registry.ts`)
Centralized behavioral configuration system:
- **Serialized naming**: Unique flag IDs with collision detection (e.g., `1001_dashboard_layout`)
- **Type system**: Boolean, String, Number flags with proper defaults
- **Condition logic**: Field-operator-value-result pattern with dropdown validation
- **Category organization**: UI, Behavior, Access, Flow, Integration, Experiment
- **Archive system**: Deprecation without deletion for audit trails
- **8+ behavioral variations**: Dashboard layouts, premium features, onboarding flows, etc.

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
- **Angular Templates**: Use `&#64;` HTML entity for @ symbols in templates (Angular 17+ interprets `@` as control flow blocks like `@if`, `@for`)

### User Profile Testing Integration (Critical for UX Recommendations)
**All new components should integrate with the User Profile Testing System** to demonstrate adaptive user experiences. The system now provides both UI-managed flags and strongly-typed methods:

```typescript
// Required integration pattern for components
import { FeatureFlagService } from '../../services/feature-flag.service';
import { UserProfileTestingService } from '../../services/user-profile-testing.service';

@Component({...})
export class MyComponent {
  private featureFlags = inject(FeatureFlagService);
  private userProfileTesting = inject(UserProfileTestingService);
  
  // Method 1: Use strongly-typed methods (for common behaviors)
  get dashboardLayout() {
    return this.featureFlags.getDashboardLayout();
  }
  
  shouldShowAdvancedFeatures() {
    return this.featureFlags.shouldShowAdvancedFeatures();
  }
  
  // Method 2: Use generic getFlag for UI-created flags
  get customFeature() {
    return this.featureFlags.getFlag<boolean>('1005_my_custom_feature');
  }
  
  // Method 3: Direct profile checking for simple conditions
  get isStudentUser() {
    return this.userProfileTesting.getCurrentTestingState().user_role === 'student';
  }
}
```

**Template patterns for adaptive UI:**
```typescript
// Conditional features based on user profile
@if (shouldShowAdvancedFeatures()) {
  <app-advanced-features />
} @else {
  <app-basic-features />
}

// Layout variations with dynamic classes
<div class="layout-{{ dashboardLayout }}">
  @switch (dashboardLayout) {
    @case ('simplified') { <app-simple-layout /> }
    @case ('advanced') { <app-advanced-layout /> }
    @default { <app-standard-layout /> }
  }
</div>

// UI-created flag integration
@if (customFeature) {
  <app-experimental-component />
}

// Profile-based styling
<nav [class.student-nav]="isStudentUser">
  <!-- Navigation adapts to user type -->
</nav>
```

**AI Integration Notes**:
- **Check current flags**: Use Feature Flags tab in testing modal or `featureFlagService.getAllFlags()`
- **Create new behaviors**: Use Feature Flags tab UI or add to registry file
- **Debug flag state**: Console logging automatically shows flag evaluation reasons
- **Test scenarios**: Use Testing tab to switch between user personas and see immediate effects

**Purpose**: This integration allows the FlowAccount development team to see exactly how features should behave for different user types, with both simple and complex behavioral logic, providing clear specifications for production implementation.

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
# Clone the private repository
git clone https://github.com/madewiththis/fa-angular.git

# Create feature branch for new designs
git checkout -b feature/new-hero-design

# Stage and commit changes
git add .
git commit -m "Update hero section with new branding"

# Push changes for team review
git push origin feature/new-hero-design
```

### Repository Details
- **URL**: https://github.com/madewiththis/fa-angular
- **Access**: Private repository (team members need access permissions)
- **Organization**: madewiththis
- **Hosting**: GitHub with Vercel integration for automatic deployments

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

## 🎯 Planning-Driven Task Management System  

**A strategic analysis approach with focused task implementation, designed for zero-context resumability and AI collaboration.**

### Planning Documents vs Tasks

**Planning Documents** (`/dev_files/planning/`): Strategic analysis for complex, multi-faceted problems
- **Purpose**: Problem identification, root cause analysis, solution evaluation
- **Structure**: Business impact → Root causes → Current state → Proposed solutions → Metrics
- **Template**: Uses structured template based on successful onboarding strategy approach
- **Scope**: Cross-system problems requiring strategic coordination

**Tasks** (`/dev_files/tasks/`): Focused implementation work with clear deliverables
- **Purpose**: Specific technical implementation building on strategic foundation
- **Structure**: Problem → Solution → Implementation → Acceptance criteria  
- **Scope**: Well-defined components, features, or fixes with clear boundaries

### Task Classification by Complexity

**Simple Tasks (S)**
- Single file changes, config updates, typos, styling fixes
- **Scope**: Isolated changes with minimal dependencies
- **Documentation**: TodoWrite tool only, no file creation needed

**Standard Tasks (M)**  
- Feature enhancements, new components, API endpoints, multi-file changes
- **Scope**: Well-defined changes with clear boundaries
- **Documentation**: Brief task file with clear context for resumption

**Complex Tasks (L)**
- New features, architectural changes, cross-system integrations
- **Scope**: Multiple components, potential breaking changes, research required
- **Documentation**: Comprehensive task file with decision logs and architecture notes

### Universal Task Flow

#### 1. Problem Understanding & Classification
- **Clarify the problem** and desired outcome with user
- **Classify complexity** (S/M/L) based on scope and dependencies
- **Confirm alignment** and document task appropriately

#### 2. Zero-Context Documentation Strategy

**For Simple Tasks (S):**
- Use TodoWrite tool only with descriptive task description
- Include file paths and specific changes needed

**For Standard Tasks (M):**
- Create task file: `/dev_files/tasks/active/{YYYY-MM-DD}-{brief-name}.md`
- Include enough context that a fresh AI instance can immediately understand and continue

**For Complex Tasks (L):**
- Create comprehensive task file with decision logs and research findings
- Document "AI handoff points" - everything needed to continue work

#### 3. AI-Resumable Implementation

**Status Progression:**
- `todo` - Task defined, not started
- `research` - Understanding current state and approach  
- `in_progress` - Active implementation
- `testing` - Verification phase
- `blocked` - Waiting for user input or external dependency
- `awaiting_user_approval` - Implementation complete, pending explicit user (project owner) quality/UX check
- `completed` - Only mark as completed after the user has explicitly approved the result
- `abandoned` - Stopped with documented reason

**MANDATORY USER APPROVAL:**
- Every task must include a step for explicit user (project owner) quality and UX check.
- The task is only marked as `completed` after the user has reviewed and explicitly stated that it passes their standards.
- Until then, the task remains in `awaiting_user_approval` status.

**AI Handoff Requirements:**
- Current understanding of the problem
- Files already examined/modified
- Key architectural decisions made
- Next specific steps to take
- Any blockers or dependencies discovered

### AI-Scannable File Organization

**Strategic analysis and task management:**
```
/dev_files/
├── planning/                  # Strategic analysis documents
│   ├── _PLANNING_DOCUMENT_TEMPLATE.md
│   └── {problem-area}-plan.md
├── tasks/
│   ├── _task_index.md         # AI-readable task overview (START HERE)
│   ├── active/                # Currently in progress
│   ├── completed/             # Finished tasks (reference)
│   └── abandoned/             # Stopped tasks with lessons
├── test-hypotheses/           # A/B test hypothesis documents
│   ├── README.md              # Test hypothesis building instructions
│   └── {test-name}.md         # Individual test hypotheses
```

**🚀 IMPORTANT FOR AI INSTANCES**: Always start by reading `/dev_files/tasks/_task_index.md` to understand current project state and active tasks.

### Task Templates for AI Resumability

**Standard Task Template (M):**
```markdown
# Task: {Brief Title}
**Date**: {YYYY-MM-DD} | **Complexity**: M | **Status**: {current_status}
**Component**: {frontend Angular component}

## Problem Summary
Clear one-paragraph description of what needs to be solved

## Current Understanding  
- **Root cause**: {what's causing the issue}
- **Affected files**: {list of files involved}  
- **Dependencies**: {what this connects to}

## Solution Approach
- **Strategy**: {high-level approach}
- **Files to modify**: {specific files and changes}
- **Testing approach**: {how to verify it works}

## AI Handoff State
**If someone else picks this up, they need to know:**
- Files already examined: {list with key findings}
- Decisions made: {architectural or implementation choices}
- Current progress: {what's done, what's next}
- Blockers: {anything waiting for user input}

## Implementation Checklist
- [ ] Research completed  
- [ ] Files identified and examined
- [ ] Implementation approach confirmed
- [ ] Changes implemented
- [ ] Tests written/updated
- [ ] Manual testing completed
- [ ] Code quality checks passed
- [ ] **Explicit user (project owner) quality/UX check and approval**

## Status Log
- {timestamp}: {status} - {what happened and key findings}
```

**Complex Task Template (L):**
```markdown
# Task: {Feature Name}
**Date**: {YYYY-MM-DD} | **Complexity**: L | **Status**: {current_status}
**Component**: {Angular components/services involved}

## Problem Statement
Detailed description of the business problem and user need

## Research & Analysis
### Codebase Investigation
- **Files examined**: {list with purpose of each}
- **Patterns discovered**: {existing conventions to follow}
- **Integration points**: {how this connects to existing features}

### Architecture Decisions
- **Approach chosen**: {why this approach over alternatives}
- **Breaking changes**: {any backwards compatibility issues}
- **Component structure**: {new components and services needed}

## Implementation Plan
### Phase 1: Foundation
- [ ] {specific deliverable with acceptance criteria}
- [ ] {specific deliverable with acceptance criteria}

### Phase 2: Integration  
- [ ] {specific deliverable with acceptance criteria}
- [ ] {specific deliverable with acceptance criteria}

## AI Handoff State
**Complete context for continuation:**
- **Current phase**: {which phase is active}
- **Files modified**: {what's been changed so far}
- **Key insights**: {important discoveries during implementation}
- **Next actions**: {immediate next steps to take}
- **Open questions**: {anything unclear that needs user input}

## Acceptance Criteria
- [ ] {specific, testable success criteria}
- [ ] {performance or UX requirements}
- [ ] {integration requirements}
- [ ] **Explicit user (project owner) quality/UX check and approval**

## Status Log
- {timestamp}: {status} - {detailed progress and decisions}
```

### Master Task Index (_task_index.md)
**Designed for AI to quickly scan and understand project state:**

```markdown
# Task Index - AI Quick Reference
**Last Updated**: {auto-updated timestamp}

## Currently Active (Pick up and continue)
- **2025-01-17-component-updates.md** (L) - `in_progress`
  - Landing page hero section improvements
  - NEXT: Implement responsive design fixes (research complete)
  - BLOCKER: None

- **2025-01-17-media-player-fixes.md** (M) - `research`  
  - Fix video player positioning issues
  - NEXT: Examine MediaPlayerService state management
  - BLOCKER: None

## Recently Completed (Reference for patterns)
- **2025-01-16-auth-component.md** (M) - Password protection styling updates
- **2025-01-16-routing-config.md** (S) - Route guard configuration

## Abandoned (Learn from failures)  
- **2025-01-15-complex-animation.md** (L) - Advanced hero animations
  - REASON: Too complex without performance impact analysis

## Quick Context for AI
**How to use this system:**
1. Scan this index to understand current state
2. Read the specific task file for detailed context  
3. Ask user which task to work on or continue
4. Update task file with progress and decisions
5. Update this index when status changes

**Project Patterns:**
- Components: Angular standalone components in `/src/app/components/`
- Services: Business logic in `/src/app/services/`
- Routing: Angular Router with lazy loading
- Styling: SCSS with Angular Material theming
- Testing: Jasmine/Karma co-located with components
```

### AI Workflow Integration

**Fresh Instance Onboarding:**
1. **ALWAYS START**: Read `/dev_files/tasks/_task_index.md` for immediate context
2. **Task Selection**: Ask user: "I see {X} active tasks. Which would you like me to work on?"
3. **Get Context**: Read specific task file in `/dev_files/tasks/active/` for detailed context
4. **Sync Status**: Update TodoWrite with current understanding
5. **Work & Update**: Proceed with implementation, updating task file with progress

**TodoWrite Integration:**
- Sync TodoWrite with task file status 
- Use TodoWrite for real-time progress within a session
- Update task file at completion or when blocked

**Git Integration:**
- Branch naming: `task/{date}-{brief-name}` (e.g., `task/2025-01-17-hero-fixes`)
- Commit messages reference task: `feat: implement hero responsive design (ref: 2025-01-17-component-updates.md)`
- Move task to completed/ folder after successful merge

**Quality Gates by Complexity:**
- **S**: Manual verification, basic testing
- **M**: Component testing + linting + type checking
- **L**: Full test suite + integration tests + performance verification

### System Benefits for AI Collaboration

1. **Zero Context Resumability**: Any AI can pick up any task immediately
2. **Complexity-Appropriate**: Simple fixes don't get buried in documentation  
3. **Decision Preservation**: Architecture choices and reasoning captured
4. **Progress Transparency**: Users can see exactly where things stand
5. **Learning System**: Completed tasks become reference patterns
6. **Failure Analysis**: Abandoned tasks document what didn't work and why

**Key Innovation**: The `_task_index.md` file serves as an **AI dashboard** - scan once to understand the entire project state, then dive deep into specific tasks as needed.

## Common Tasks

### Prototyping New Features
1. Create component in appropriate `components/` subdirectory
2. Add to routing if it's a page-level component
3. **CRITICAL**: Integrate with User Profile Testing System (see integration patterns above)
4. Import and use in parent components
5. Follow existing patterns for styling and TypeScript
6. Focus on visual fidelity over functional implementation
7. **Test with different user personas** to validate adaptive behavior

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

### Validating UX Recommendations for FlowAccount Team
1. **Use User Profile Testing System** to demonstrate different user experiences
2. **Test Key Scenarios**:
   - Student User: Simplified interface, beginner-friendly flows
   - Business Owner: Advanced features, comprehensive dashboard
   - Accountant: Professional tools, detailed reporting access
   - Enterprise Client: Full feature set, advanced configurations
3. **Document Behavioral Specifications**: Use live demonstrations to show exactly how features should adapt
4. **Generate Stakeholder Presentations**: Use preset personas for consistent demos
5. **Provide Development Recommendations**: Clear conditional logic that production team can implement

### Building Test Hypotheses for Growth Book A/B Testing
**IMPORTANT**: When the user says "build a test hypothesis" or "create a test hypothesis", this means:
1. **Use the Test Context Template** located at `/dev_files/deliverables/output-document-templates/_TEST_CONTEXT_TEMPLATE.md`
2. **Create the hypothesis document** in `/dev_files/test-hypotheses/` folder
3. **Follow the IF/THEN/BECAUSE format** for hypothesis statements
4. **Include all required metadata** for Growth Book configuration

**Quick Command Reference**:
- "Build a test hypothesis" → Create new test hypothesis document using template
- "Work on test hypothesis" → Continue editing existing test hypothesis
- "Show test status" → Display the test hypothesis index with all stages
- "Update test status" → Move a test hypothesis to a different stage

**Test Hypothesis Components**:
- **Observation**: Current user experience pain point with data
- **Impact**: How this affects user/business goals
- **Hypothesis**: IF [change] THEN [metric improvement] BECAUSE [theory]
- **Solution**: Detailed description of new UX to test
- **Metadata**: Device targeting, conversion phase, metrics, priority, segments

See `/dev_files/test-hypotheses/README.md` for detailed instructions.

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