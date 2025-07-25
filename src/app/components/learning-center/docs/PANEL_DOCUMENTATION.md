# Learning Center Panel - Component Documentation

> **📚 Documentation Navigation**: [README](README.md) | [Overview](OVERVIEW.md) | **Panel Docs** | [Panel Integration](PANEL_CONTENT_INTEGRATION.md) | [API Reference](API_REFERENCE.md) | [Integration Guide](INTEGRATION_GUIDE.md) | [UI Wireframe](UI_WIREFRAME.md) | [Dashboard Integration](LEARNING_CENTER_INTEGRATION.md)

## Overview
The Learning Center Panel is a comprehensive help and guidance interface that provides contextual assistance, AI chat support, and navigation to various learning resources. It's designed as a slide-out panel that appears on the right side of the application and integrates with the Learning Center content management system.

> **🎯 Content Integration**: This panel displays content from the Learning Center content management system ([Overview](OVERVIEW.md)) using the service layer ([API Reference](API_REFERENCE.md)).

---

## Visual Architecture Diagrams

### Panel Layout Structure
```
┌─────────────────────────────────────────────┐
│          Learning Center Panel (400px)       │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐    │
│  │      Panel Header Combined          │    │
│  │  ┌─────────────────────────────┐   │    │
│  │  │  📚 Learning Center    [X]  │   │    │
│  │  └─────────────────────────────┘   │    │
│  │  ┌───────────────┬─────────────┐   │    │
│  │  │ 💡 More Guides│ 🗣️ Ask human│   │    │
│  │  └───────────────┴─────────────┘   │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐    │
│  │        Content View (67%)           │    │
│  │  ┌─────────────────────────────┐   │    │
│  │  │ How to guides          ▼    │   │    │
│  │  └─────────────────────────────┘   │    │
│  │  ┌─────────────────────────────┐   │    │
│  │  │                             │   │    │
│  │  │    Content Body Area        │   │    │
│  │  │    - Highlighted content    │   │    │
│  │  │    - Format options         │   │    │
│  │  │    - Related guides         │   │    │
│  │  │                             │   │    │
│  │  └─────────────────────────────┘   │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐    │
│  │      AI Assistant (33%)             │    │
│  │  ┌─────────────────────────────┐   │    │
│  │  │ AI Assistant           ▼    │   │    │
│  │  └─────────────────────────────┘   │    │
│  │  ┌─────────────────────────────┐   │    │
│  │  │    Chat Messages            │   │    │
│  │  │    - Bot: Hi! I'm here...   │   │    │
│  │  └─────────────────────────────┘   │    │
│  │  ┌─────────────────────────────┐   │    │
│  │  │ [📸] [Type message...] [→]  │   │    │
│  │  └─────────────────────────────┘   │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### View State Transformations

#### State 1: Default (67/33 Split)
```
┌─────────────────┐
│ Header & CTAs   │
├─────────────────┤
│                 │
│  Content View   │ 67%
│     (flex: 1)   │
│                 │
├─────────────────┤
│  AI Assistant   │ 33%
│   (flex: 0.5)   │
└─────────────────┘
```

#### State 2: Content Primary
```
┌─────────────────┐
│ Header & CTAs   │
├─────────────────┤
│                 │
│                 │
│  Content View   │ ~87%
│    (flex: 7)    │
│                 │
│                 │
├─────────────────┤
│ AI (collapsed)  │ 95px
│ [Continue chat?]│
└─────────────────┘
```

#### State 3: Chat Primary
```
┌─────────────────┐
│ Header & CTAs   │
├─────────────────┤
│ Content(collapsed)│ 100px
│ [Continue reading?]│
├─────────────────┤
│                 │
│                 │
│  AI Assistant   │ ~87%
│    (flex: 9)    │
│                 │
│                 │
└─────────────────┘
```

### Navigation Modal Structure
```
┌────────────────────────────────────────────────────┐
│                 Navigation Modal                    │
├────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐     │
│  │  Learning Center Navigation         [X]  │     │
│  └──────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────┐     │
│  │  [← Back to help for quotations]        │     │
│  └──────────────────────────────────────────┘     │
├────────────────────────────────────────────────────┤
│  Master the Basics                                 │
│  ┌─────────────┬─────────────┬─────────────┐     │
│  │ Quotations  │  Invoices   │  Expenses   │     │
│  └─────────────┴─────────────┴─────────────┘     │
│                                                    │
│  Workflows                                         │
│  ┌─────────────┬─────────────┬─────────────┐     │
│  │Quote→Payment│Project Bill │Recurring    │     │
│  └─────────────┴─────────────┴─────────────┘     │
│                                                    │
│  Goals                                             │
│  ┌─────────────┬─────────────┬─────────────┐     │
│  │ Efficiency  │ Cash Flow   │ Visibility  │     │
│  └─────────────┴─────────────┴─────────────┘     │
└────────────────────────────────────────────────────┘
```

### Context Flow Diagram
```
Current Page: /quotation/create
         │
         ▼
┌─────────────────┐     User clicks        ┌─────────────────┐
│ Default Content │ ─────"More Guides"────► │ Navigation Modal│
│ "Help for this │                         │                 │
│     page"       │                         │ Select: Invoices│
└─────────────────┘                         └────────┬────────┘
         ▲                                           │
         │                                           ▼
         │                                  ┌─────────────────┐
         │          Click "Back to          │ Topic Content   │
         └──────────quotations"─────────────│ "How to use     │
                                           │   invoices"     │
                                           │ [← Back button] │
                                           └─────────────────┘
```

### Component Interaction Flow
```
User Action                Component              State Change
───────────                ─────────              ────────────
Click Header      ──────►  ContentView    ──────► Expand/Collapse
                                                  Toggle

Focus Input       ──────►  ChatInput      ──────► ChatView Expands
                                                  ContentView Collapses

Click "More       ──────►  CTAButton      ──────► NavModal Opens
Guides"                                          

Select Topic      ──────►  NavCard        ──────► Content Updates
                                                  Back Button Shows
                                                  Context Saved

Click Back        ──────►  BackButton     ──────► Original Content
                                                  Back Button Hides
                                                  Context Restored
```

---

## Component Structure

### 1. **PANEL HEADER COMBINED** (`panel-header-combined`)
The unified top section containing both title/controls and primary actions.

#### 1.1 Header Row (`header-row`)
- **Elements:**
  - `panel-title`: "Learning Center" title
  - `close-panel-button`: Close icon (×) to dismiss the entire panel
- **Behavior:** Title displays current panel name, close button hides panel

#### 1.2 CTA Row (`cta-row`) 
- **Elements:**
  - `explore-button`: "More Guides" - Opens navigation modal
  - `support-button`: "Ask a human" - Opens support options dropdown
- **Behavior:** Equal-width buttons for primary user actions

---

### 2. **CONTENT VIEW SECTION** (`content-view`)
The main content area displaying help materials relevant to the current page or selected topic.

#### 2.1 Content View Header (`content-view-header`)
- **Elements:**
  - Main text: "Help for this page" (or topic-specific title)
  - `back-to-page-button-inline`: Contextual back button (only visible when viewing non-current-page content)
  - `view-toggle-arrow`: Expand/collapse indicator
- **Behavior:** Clickable to expand/collapse content section

#### 2.2 Continue Content Hint (`continue-content-hint`)
- **Element:** "Continue reading?" bubble
- **Behavior:** Only visible when content view is collapsed; clickable to expand
- **Purpose:** Provides clear indication that content is available

#### 2.3 Content View Body (`content-view-body`)
- **Elements:**
  - `highlighted-content`: Primary content recommendation
  - `content-formats`: Available format options (Video, Guide, Quick Steps)
  - Additional content lists and resources
- **Behavior:** Scrollable area containing all help content

---

### 3. **AI ASSISTANT SECTION** (`chat-view`)
Interactive AI chat interface for real-time assistance.

#### 3.1 Chat View Header (`chat-view-header`)
- **Elements:**
  - Title: "AI Assistant"
  - `view-toggle-arrow`: Expand/collapse indicator
- **Behavior:** Clickable to expand/collapse chat section

#### 3.2 Continue Chat Hint (`continue-chat-hint`)
- **Element:** "Continue chat?" bubble
- **Behavior:** Only visible when chat view is collapsed; clickable to expand
- **Purpose:** Provides clear indication that chat is available

#### 3.3 Chat Messages (`chat-messages`)
- **Elements:**
  - `chat-message`: Individual message containers
  - `bot-message`: AI responses with specific styling
- **Behavior:** Scrollable conversation history

#### 3.4 Chat Input Area (`chat-input-area`)
- **Elements:**
  - `input-icon-button`: Screenshot capture tool
  - `chat-input`: Text input field
  - `send-button`: Message send button
- **Behavior:** Fixed at bottom, always visible, focus triggers chat expansion

---

### 4. **NAVIGATION MODAL** (`nav-modal-overlay`)
Full-featured content discovery and navigation interface.

#### 4.1 Modal Structure
- **`nav-modal-header`**: Title and close button
- **`nav-modal-body`**: Content sections and navigation cards
- **`back-to-page-button`**: Return to original page context

#### 4.2 Navigation Sections
- **Master the Basics**: Core functionality help
- **Workflows**: Process-based guidance  
- **Goals**: Outcome-focused assistance

---

## Behavioral Specifications

### View State Management
The panel operates in three primary view states:

#### **Default State (50/33 split)**
- Content View: `flex: 1` (67% height)
- AI Assistant: `flex: 0.5` (33% height)

#### **Content Primary State**
- Content View: `flex: 7` (expanded)
- AI Assistant: `height: 91px` (collapsed with continue hint)

#### **Chat Primary State**
- Content View: `height: 110px` (collapsed with continue hint)
- AI Assistant: `flex: 9` (expanded)

### Interaction Triggers

#### **Content View Expansion**
- **Trigger:** Click content view header
- **Behavior:** Content expands to primary, chat collapses to hint bubble

#### **Chat View Expansion**
- **Trigger:** Click chat header OR focus chat input
- **Behavior:** Chat expands to primary, content collapses to hint bubble

#### **Return to Default**
- **Trigger:** Click expanded section header again
- **Behavior:** Both sections return to default 67/33 split

### Context Management

#### **Current Page Context**
- Default state shows content relevant to current application page
- Header displays "Help for this page"
- Content is contextually relevant (e.g., quotation help on quotation page)

#### **Topic Switching**
- **Trigger:** User selects different topic from navigation modal
- **Behavior:** 
  - Content switches to selected topic
  - Header updates to reflect new topic
  - `back-to-page-button-inline` appears
  - Original page context is preserved

#### **Context Restoration**
- **Trigger:** Click any "Back to [page]" button
- **Behavior:**
  - Content returns to original page context
  - Header returns to "Help for this page"
  - Back button disappears

### Support Integration

#### **Human Support Options**
- **Call support**: Direct phone connection
- **Chat now**: Live chat system
- **Request call back**: Callback scheduling
- **Workshops**: Training session access

#### **AI Assistant Features**
- **Screenshot capture**: Page element selection for context
- **Text input**: Natural language queries
- **Contextual responses**: AI understands current page and user intent

---

## Technical Implementation Notes

### CSS Class Structure
```
.learning-center-panel
├── .panel-header-combined
│   ├── .header-row
│   └── .cta-row
├── .content-view
│   ├── .content-view-header
│   ├── .continue-content-hint
│   └── .content-view-body
├── .chat-view
│   ├── .chat-view-header
│   ├── .continue-chat-hint
│   ├── .chat-messages
│   └── .chat-input-area
└── .nav-modal-overlay
    └── .nav-modal
```

### State Management Variables
- `currentPageContext`: Tracks the original page context
- `previousPageContext`: Stores context for back button functionality

### Key Functions
- `toggleContentView()`: Manages content view expansion/collapse
- `toggleChatView()`: Manages chat view expansion/collapse
- `openNavModal()`: Opens navigation modal
- `selectNavContent(type)`: Switches to different topic content
- `backToCurrentPage()`: Restores original page context

---

## Integration Requirements

### Data Dependencies
1. **Page Context Detection**: System must identify current application page
2. **Content Repository**: Access to help content organized by topic
3. **AI Service**: Backend integration for chat functionality
4. **Support System**: Integration with call, chat, and callback systems

### Event Handlers Required
1. **Panel Visibility**: Show/hide panel based on trigger
2. **Context Detection**: Update content based on route changes
3. **Content Loading**: Fetch relevant content for selected topics
4. **AI Communication**: Handle chat messages and responses

### Responsive Considerations
- Fixed 400px width for desktop
- Full-screen modal adaptation for smaller screens
- Touch-friendly button sizing for mobile devices

---

## Future Enhancement Areas

### Phase 1 (MVP)
- Static content display
- Basic navigation modal
- Mock AI assistant
- Support option placeholders

### Phase 2 
- Dynamic content loading
- Real AI integration
- Live support connections
- User preference persistence

### Phase 3
- Advanced AI features (screenshot analysis)
- Content personalization
- Analytics integration
- Multi-language support

---

## Component Hierarchy for Angular Implementation

```
LearningCenterPanelComponent
├── PanelHeaderComponent
│   ├── NavigationButtonComponent
│   └── SupportDropdownComponent
├── ContentViewComponent
│   ├── ContentHeaderComponent
│   ├── ContinueContentHintComponent
│   └── ContentBodyComponent
├── AiAssistantComponent (future: separate component)
│   ├── ChatHeaderComponent
│   ├── ContinueChatHintComponent
│   ├── ChatMessagesComponent
│   └── ChatInputComponent
└── NavigationModalComponent
    ├── NavigationSectionComponent
    └── NavigationCardComponent
```

This structure allows for modular development, easy testing, and future feature additions while maintaining clear separation of concerns. 