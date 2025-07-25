# Learning Center Panel - UI Wireframe

> **📚 Documentation Navigation**: [README](README.md) | [Overview](OVERVIEW.md) | [Panel Docs](PANEL_DOCUMENTATION.md) | [Panel Integration](PANEL_CONTENT_INTEGRATION.md) | [API Reference](API_REFERENCE.md) | [Integration Guide](INTEGRATION_GUIDE.md) | **UI Wireframe** | [Dashboard Integration](LEARNING_CENTER_INTEGRATION.md)

## Overview
This directory contains the UI wireframe and documentation for the Learning Center Panel component. These files serve as the design specification and reference implementation for converting the wireframe into a production Angular component that integrates with the Learning Center content management system.

> **🎯 Implementation Reference**: For complete component behavior and technical specifications, see [PANEL_DOCUMENTATION.md](PANEL_DOCUMENTATION.md).

## Files

### `learning-center-panel.html`
- **Purpose**: Complete HTML wireframe of the Learning Center Panel
- **Status**: Design specification and functional prototype
- **Usage**: Reference for component structure, styling, and interactions
- **Features**: 
  - Fully functional interactive prototype
  - Complete CSS styling
  - JavaScript behavior implementations
  - Material Icons integration
  - Responsive modal system

### `LEARNING_CENTER_PANEL_DOCUMENTATION.md`
- **Purpose**: Comprehensive technical documentation
- **Contents**:
  - Component structure breakdown
  - Behavioral specifications
  - CSS class naming conventions
  - State management details
  - Integration requirements
  - Angular component hierarchy

## Development Workflow

### Phase 1: Wireframe (✅ Complete)
- [x] Interactive HTML prototype
- [x] Complete styling and behavior
- [x] Documentation and specifications

### Phase 2: Component Development (Next)
1. **Create Angular Component Structure**
   - Generate main `LearningCenterPanelComponent`
   - Create sub-components based on documented hierarchy
   - Implement service dependencies

2. **Convert HTML to Angular Templates**
   - Extract HTML sections into component templates
   - Implement Angular directives and bindings
   - Add TypeScript logic and state management

3. **Integrate with Application**
   - Add routing detection for page context
   - Connect to content management system
   - Implement AI service integration
   - Add support system connections

## Key Design Decisions

### **Three-Section Layout**
1. **Combined Header & CTA**: Title, close button, and primary actions
2. **Content View**: Contextual help and guide content
3. **AI Assistant**: Interactive chat interface

### **Dynamic View States**
- **Default**: 67% content, 33% chat
- **Content Primary**: Expanded content, collapsed chat with hint
- **Chat Primary**: Collapsed content with hint, expanded chat

### **Context Management**
- Always maintains original page context
- Allows temporary topic switching with easy return
- Preserves user's place in both content and chat

### **Support Integration**
- Multiple human support channels
- AI assistant with screenshot capability
- Seamless transition between self-service and human help

## Technical Specifications

### **Dimensions**
- Panel width: 400px (fixed)
- Panel height: 100vh (full screen)
- Modal size: 80% of remaining screen area

### **Dependencies**
- Material Symbols Outlined font
- CSS Grid and Flexbox
- JavaScript ES6+ features

### **Browser Support**
- Modern browsers with CSS Grid support
- Material Icons font loading
- JavaScript event handling

## Usage Instructions

### **Viewing the Wireframe**
1. Open `learning-center-panel.html` in a web browser
2. Test all interactive features:
   - Click section headers to expand/collapse
   - Try the "More Guides" navigation modal
   - Test the "Ask a human" support dropdown
   - Focus the chat input to trigger expansion

### **Development Reference**
1. Use the documentation as a specification guide
2. Reference HTML structure for component templates
3. Copy CSS classes for styling (convert to SCSS)
4. Implement JavaScript logic in TypeScript

## Next Steps

1. **Component Generation**
   ```bash
   ng generate component learning-center/learning-center-panel
   ng generate component learning-center/panel-header
   ng generate component learning-center/content-view
   ng generate component learning-center/navigation-modal
   ```

2. **Service Creation**
   ```bash
   ng generate service learning-center/learning-center-state
   ng generate service learning-center/content-loader
   ng generate service learning-center/ai-assistant
   ```

3. **Integration Planning**
   - Route detection service
   - Content management API
   - Support system integrations
   - Analytics tracking

## Notes

- The AI Assistant section is intentionally kept as a placeholder for separate development
- All interactive features are functional in the wireframe for testing
- CSS classes are designed to be easily converted to Angular component styles
- State management patterns are documented for TypeScript implementation 