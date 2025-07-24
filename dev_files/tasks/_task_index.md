# Task Index - AI Quick Reference
**Last Updated**: 2025-01-24 | **Project**: FlowAccount Angular Prototype

## 🎯 Strategic Context
**Planning-Driven Approach**: Strategic problems are analyzed in `/dev_files/planning/` documents, then broken into focused implementation tasks

**Active Planning Documents**:
- **Onboarding Strategy Master Plan**: [`/dev_files/planning/onboarding-strategy-master-plan.md`](../planning/onboarding-strategy-master-plan.md) - Cohesive strategy for all onboarding initiatives

## Currently Active (Pick up and continue)
- **2025-01-23-learning-center-walkthrough.md** (L) - `todo`
  - **RE-SCOPED**: Migrate existing Learning Center panel UI to use new content system
  - Connect new Goals → Workflows → Tasks content to existing slide-out panel
  - NEXT: Update LearningPanelService and component to use LearningContentService
  - BLOCKER: None - foundation is complete

## On Hold Tasks (Deprioritized)
- **2025-01-23-task-based-evaluation-onboarding.md** (L) - `on_hold`
  - Task-based evaluation system - shift from "product tutorial" to "value evaluation through task completion"
  - Complex solution, testing simpler approaches first
  - ON HOLD: Until simpler onboarding solutions validated

- **2025-01-22-onboarding-experience.md** (L) - `on_hold`
  - Personalized onboarding with survey-driven recommendations - CORE COMPLETED
  - Integration with User Profile Testing Service - FULLY WORKING
  - ON HOLD: Validating simpler solutions before adding complexity

## Recently Completed (Reference for patterns)
- **2025-01-24-learning-content-foundation.md** (L) - **LEARNING CONTENT FOUNDATION ✅**
  - ✅ Complete Goals → Workflows → Tasks content management system
  - ✅ Self-contained Learning Center module with full CRUD operations
  - ✅ Admin interface for content management with relationships
  - ✅ Comprehensive documentation and integration guides
  - ✅ Ready for system-wide integration - foundation for ALL onboarding solutions

- **2025-01-24-learning-center-admin-ui.md** (L) - **LEARNING CENTER ADMIN INTERFACE ✅**
  - ✅ Complete admin dashboard with Goals, Workflows, Tasks, Get Started tabs
  - ✅ Advanced table features: bulk actions, search, column filters, filter pills
  - ✅ Quick Guide Categories management for Get Started dashboard integration
  - ✅ CRUD operations for all content types with relationship management

- **2025-01-23-revolutionize-company-setup-modal.md** (L) - **COMPANY SETUP TRANSFORMATION**
  - ✅ Transformed boring form into "Make your documents look professional" experience
  - ✅ Live document preview with real-time updates as users type
  - ✅ User-friendly "How do you get paid?" payment method selection
  - ✅ Interactive document explorer with tabbed interface
  - ✅ Part of Onboarding Strategy: Creates motivation for completing first steps

- **2025-01-23-popular-first-steps-onboarding.md** (M) - **QUICK WINS APPROACH**
  - ✅ Popular first steps with progressive unlock system
  - ✅ Cookie-based completion tracking for easy reset
  - ✅ Motivational "Make your documents look good" as first action
  - ✅ Visual disabled states guide optimal user path
  - ✅ Part of Onboarding Strategy Solution 1: Quick Wins

- **2025-01-22-expand-user-profile-testing-tool.md** (L) - **MAJOR SYSTEM EXPANSION COMPLETED**
  - ✅ Comprehensive User Profile Testing System with 8+ behavioral variations
  - ✅ Feature Flag Management UI with serialized naming, condition builder, archive system
  - ✅ Three-tab modal interface: Testing, Feature Flags, Changes with live preview
  - ✅ Cookie-based state persistence with user profile fields (name, email, company)
  - ✅ Smart floating indicator with all cookie values displayed in status popup
  - ✅ User-editable scenario system with preset demo personas 
  - ✅ Ready for stakeholder demonstrations - complete UX validation tool
  - Files: Entire `/src/app/components/user-profile-testing/` system + supporting services
- **2025-01-22-checkout-exit-survey.md** (M) - Checkout abandonment exit survey with unified tracking system
  - Exit intent detection triggers when cursor moves to top of viewport
  - Variable naming system for personalized user experiences (COST, QUESTIONS, APPROVAL, etc.)
  - Dynamic textarea for "Others" option with smart validation
  - Unified with existing UserProfileTestingService for single cookie management
  - Files: `/src/app/components/checkout/exit-survey/` and updated UserProfileTestingService
- **2025-01-22-alt-checkout-flow.md** (M) - Alternative checkout page with sectional approach
  - Built payment method selection and tax invoice sections
  - Sectional development approach for better quality control
  - Files: `/src/app/components/checkout/checkout-page-alt/` (TypeScript, HTML, SCSS)
  - Route: `/checkout-alt` accessible from package selection flow

- **2025-01-21-checkout-order-summary.md** (M) - Fixed checkout order summary package display
  - Resolved query parameter mismatches between package selection and checkout
  - Synchronized package data, pricing, and billing period display
  - Enhanced order summary with comprehensive package details and savings calculation
  - Files: `checkout-page.component.ts` and `checkout-page.component.html`

## Abandoned (Learn from failures)  
*No abandoned tasks yet*

## Quick Context for AI
**How to use this system:**
1. Scan this index to understand current state
2. Read the specific task file for detailed context  
3. Ask user which task to work on or continue
4. Update task file with progress and decisions
5. Update this index when status changes

**Project Patterns:**
- **Components**: Angular standalone components in `/src/app/components/`
- **Services**: Business logic in `/src/app/services/`
- **Routing**: Angular Router with lazy loading
- **Styling**: SCSS with Angular Material theming
- **Testing**: Jasmine/Karma co-located with components
- **Assets**: Media files and images in `/src/assets/`

**Current Project Focus:**
- FlowAccount.com prototype development
- New branding and design language testing
- Stakeholder demo preparation at flowaccount.vercel.com
- Frontend-only prototype (no backend integration needed)

**Common Task Areas:**
- Landing page components and hero sections
- Media player functionality and positioning
- Authentication/password protection for demos
- Responsive design improvements
- Component styling and branding updates
- Video asset integration and management

**Development Environment:**
- Local development: `ng serve` (port 4200)
- Production build: `ng build`
- Live demo: flowaccount.vercel.com
- Repository: Private GitHub repo (madewiththis/fa-angular)

**Documentation Output:**
- **Location**: `/dev_files/deliverables/` - PRDs, implementation guides, and demo materials
- **Purpose**: Document UX improvements for team implementation and Growth Book testing
- **Created When**: UX improvements are completed in prototype

**Context Knowledge Base:**
- **Location**: `/dev_files/context/` - Universal project knowledge and business insights
- **Available Contexts**:
  - `project-purpose-and-deliverables.md` - **CRITICAL**: Ultimate purpose and expected deliverables
  - `conversion-funnel-fallouts.md` - Key areas where users drop off in signup/onboarding
  - *(More contexts will be added as needed)*
- **Usage**: Reference relevant context files when working on tasks that impact user experience, conversion, or business goals
- **⚠️ IMPORTANT**: Always read project-purpose-and-deliverables.md to understand the ultimate goal

## Planning-Driven Task Management

### When to Create Planning Documents vs Tasks

**Create Planning Document** (`/dev_files/planning/`) when:
- Multi-faceted problem requiring strategic analysis
- Multiple root causes need identification and prioritization
- Business impact needs measurement and metric definition
- Multiple solution approaches need evaluation
- Cross-system implications require coordination

**Create Task** (`/dev_files/tasks/active/`) when:
- Clear, focused deliverable with defined scope
- Implementation work building on strategic foundation
- Specific technical component or feature development
- Well-understood problem with straightforward solution

### Planning Document → Task Workflow
1. **Strategic Analysis**: Create planning document using template
2. **Problem Decomposition**: Identify root causes and solutions
3. **Task Generation**: Break solutions into focused implementation tasks
4. **Linking**: Reference planning document in task strategic context
5. **Execution**: Implement tasks with clear deliverable focus

### Instructions for Starting New Work
1. **Assess scope**: Multi-faceted problem or focused deliverable?
2. **Planning document**: Use template for strategic analysis
3. **Task classification**: S/M/L complexity for implementation work
4. **Create appropriately**: Planning doc → tasks or direct task creation
5. **Update index**: Link planning documents and tasks appropriately 