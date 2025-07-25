# Learning Center - Standalone Module

## Overview

The Learning Center is a complete help and guidance system for FlowAccount that combines content management, contextual assistance, and AI-powered support. It includes both a content management system and a slide-out panel interface for delivering help to users.

## 📚 **Complete Documentation**

**All comprehensive documentation is located in the [`docs/`](docs/) folder:**

👉 **[START HERE: Complete Documentation](docs/README.md)**

### Five Core Components
1. **[Admin UI](docs/OVERVIEW.md#content-management-system)** - Content management system
2. **[Learning Center Panel](docs/PANEL_DOCUMENTATION.md)** - Contextual help interface  
3. **[Content Finder](docs/CONTENT_FINDER.md)** - Content discovery and exploration
4. **[AI Assistant](docs/AI_ASSISTANT.md)** - Intelligent conversational help
5. **[Get Started Integration](docs/GET_STARTED_INTEGRATION.md)** - Dashboard onboarding gateway

### Technical Documentation
- **[System Overview](docs/OVERVIEW.md)** - Architecture and core concepts
- **[API Reference](docs/API_REFERENCE.md)** - Service methods and data types
- **[Integration Guide](docs/INTEGRATION_GUIDE.md)** - How to integrate with other components
- **[Panel Content Integration](docs/PANEL_CONTENT_INTEGRATION.md)** - How panel connects to content system
- **[UI Wireframe](docs/UI_WIREFRAME.md)** - Design specifications

## 🚀 **Quick Start**

### For Developers
```typescript
// Import the service
import { LearningContentService } from './components/learning-center/services/learning-content.service';

// Use in your component  
@Component({...})
export class YourComponent {
  private learningService = inject(LearningContentService);
  
  readonly availableTasks = computed(() => 
    this.learningService.tasks().filter(task => task.status === 'published')
  );
}
```

### For Content Managers
1. Access the Learning Center admin interface
2. Create Goals, Workflows, and Tasks
3. Content automatically appears throughout the application

### For Integration
```html
<!-- Display the Learning Center Panel -->
<app-learning-center-panel *ngIf="showLearningCenter"></app-learning-center-panel>
```

## 🎯 **Key Features**

- **5 Core Components**: Admin UI, Panel, Content Finder, AI Assistant, Get Started Integration
- **Content Management System**: Goals → Workflows → Tasks hierarchy with admin interface
- **Content Discovery**: Advanced content finder with search and filtering
- **Intelligent Help**: AI assistant with conversational interface and screenshot analysis
- **Dashboard Integration**: Dynamic onboarding experience with learning paths
- **Contextual Help**: Content relevant to current page/feature across all components
- **Support Integration**: Call, chat, callback, and seminars with seamless escalation
- **Progress Tracking**: User learning progress and completion across learning journeys

## 🏗️ **System Components**

```
learning-center/
├── docs/                          # 📚 Complete documentation (8 comprehensive files)
├── admin-ui/                      # 1️⃣ Content Management System  
├── learning-center-panel/         # 2️⃣ Contextual Help Interface
├── content-finder/                # 3️⃣ Content Discovery & Exploration (planned)
├── ai-assistant/                  # 4️⃣ Intelligent Conversational Help (planned)
├── get-started-integration/       # 5️⃣ Dashboard Onboarding Gateway (planned)
├── services/                      # Shared business logic
├── models/                        # TypeScript interfaces  
├── data/                          # Content storage
└── ui-wireframe/                  # Design specifications
```

## 📋 **Implementation Status**

### ✅ **Completed Components**
1. **Admin UI** - Complete content management interface ✅
2. **Learning Center Panel** - Complete UI component with support integration ✅

### 📋 **Ready for Implementation** 
3. **Content Finder** - Complete documentation and technical specifications
4. **AI Assistant** - Complete documentation and technical specifications  
5. **Get Started Integration** - Complete documentation and integration patterns

### 🔄 **Next Phase**
- **Component Implementation**: Convert documentation to Angular components
- **Folder Restructuring**: Organize into 5 core component folders
- **Contextual Content Loading**: Connect all components with content service  

## 🔗 **Dependencies**

- **Angular 17+** with standalone components
- **Angular Material** (optional, with fallbacks)
- **RxJS** for reactive patterns
- **TypeScript** strict mode

## 📖 **Next Steps**

1. **Read the complete documentation**: [`docs/README.md`](docs/README.md)
2. **Understand the architecture**: [`docs/OVERVIEW.md`](docs/OVERVIEW.md)  
3. **Review integration patterns**: [`docs/INTEGRATION_GUIDE.md`](docs/INTEGRATION_GUIDE.md)
4. **Implement contextual content loading**
5. **Connect AI assistant backend**

---

**For complete technical specifications, implementation details, and integration examples, see the [`docs/`](docs/) folder.**