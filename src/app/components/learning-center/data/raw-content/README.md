# Learning Content Structure

## Overview

This directory contains the raw learning content for FlowAccount's Learning Center. The content is structured to link learning tasks to specific features in the application, allowing the Learning Center to display relevant help content based on the user's current location in the app.

## File Structure

```
raw-content/
├── tasks-draft.json         # Draft learning tasks ready for review
├── tasks.json              # Production learning tasks (after approval)
├── workflows.json          # Learning workflows that group tasks
├── goals.json              # Learning goals that group workflows
├── feature-mapping.json    # Complete mapping of all FlowAccount features
└── README.md              # This file
```

## Key Concepts

### 1. Feature Linking

Each learning task includes a `featureLink` object that maps the task to specific features in FlowAccount:

```json
"featureLink": {
  "mainFeature": "sell",           // Main menu item (e.g., "sell", "buy", "dashboard")
  "subFeature": "quotation",       // Sub-menu item (e.g., "quotation", "tax-invoice")
  "route": "/sell/quotation",      // Actual route in the app
  "displayLocation": ["sell", "quotation", "overview"]  // Where to show this task
}
```

### 2. Content Structure

#### Tasks
- Individual learning units (e.g., "How to create a quotation")
- Include video links, articles, and AI prompts
- Have step-by-step instructions
- Can be linked to specific features

#### Workflows
- Groups of related tasks (e.g., "Complete Sales Process")
- Define task sequence (sequential, parallel, or flexible)
- Calculate total time from included tasks

#### Goals
- Business objectives (e.g., "Master Sales Management")
- Groups of workflows
- Target specific user roles and business types

### 3. Feature Mapping

The `feature-mapping.json` file contains a complete hierarchy of all FlowAccount features:

```json
{
  "features": {
    "sell": {
      "name": "Sell",
      "nameTH": "ขาย",
      "icon": "shopping_cart",
      "route": "/sell",
      "subFeatures": {
        "quotation": {
          "name": "Quotation",
          "nameTH": "ใบเสนอราคา",
          "route": "/sell/quotation"
        }
        // ... more sub-features
      }
    }
    // ... more main features
  }
}
```

## Task Structure Example

```json
{
  "id": "task_quotation_001",
  "name": "ขายของต้องออกเอกสารอะไรใน FlowAccount",
  "englishName": "What documents do you need to issue when selling in FlowAccount?",
  "description": "เรียนรู้ประเภทเอกสารขายทั้งหมดใน FlowAccount และการเลือกใช้ให้เหมาะสม",
  "category": "Sales",
  "featureLink": {
    "mainFeature": "sell",
    "subFeature": "quotation",
    "route": "/sell/quotation",
    "displayLocation": ["sell", "quotation", "overview"]
  },
  "estimatedTime": 8,
  "difficulty": "beginner",
  "tags": ["sales", "documents", "quotation"],
  "contentAttachments": {
    "videoUrls": ["https://www.youtube.com/watch?v=GQIWk1Hmb-I"],
    "videoDurations": [456],
    "articleUrls": ["https://www.flowaccount.com/ultimateguide/guide/..."],
    "aiPrompts": [
      "เอกสารขายใน FlowAccount มีกี่ประเภท แต่ละประเภทใช้เมื่อไหร่",
      "ความแตกต่างระหว่างใบเสนอราคา ใบวางบิล และใบกำกับภาษี"
    ],
    "attachmentNotes": "วิดีโอความยาว 7:36 นาที พร้อมคู่มือเสริม"
  },
  "instructions": {
    "overview": "ทำความเข้าใจกับเอกสารขายทุกประเภทและการใช้งานที่เหมาะสม",
    "steps": [
      {
        "stepNumber": 1,
        "title": "เรียนรู้ประเภทเอกสาร",
        "description": "ศึกษาเอกสารขายทั้ง 7 ประเภท",
        "action": "review"
      }
    ],
    "expectedResult": "เข้าใจและเลือกใช้เอกสารขายได้อย่างถูกต้องตามสถานการณ์"
  },
  "completionCriteria": {
    "type": "user_confirmation",
    "criteria": []
  },
  "tips": ["ใบเสนอราคาใช้เสนอราคาสินค้า/บริการ ยังไม่มีผลทางภาษี"],
  "status": "draft",
  "version": 1
}
```

## How to Add New Tasks

1. **Identify the Feature**: Determine which feature/page the task relates to
2. **Check Feature Mapping**: Look up the correct mainFeature, subFeature, and route in `feature-mapping.json`
3. **Create Task Structure**: Follow the example structure above
4. **Add to tasks-draft.json**: Add your new task to the draft file for review
5. **Test Feature Link**: Ensure the route and displayLocation match actual app routes

## Integration with Learning Center

The Learning Center can query tasks based on the current route:

```typescript
// Example: Get tasks for current page
const currentRoute = '/sell/quotation';
const relevantTasks = tasks.filter(task => 
  task.featureLink?.route === currentRoute ||
  task.featureLink?.displayLocation.includes('quotation')
);
```

## Best Practices

1. **Use Consistent Feature Names**: Always reference features using the exact names from `feature-mapping.json`
2. **Multiple Display Locations**: A task can appear in multiple locations using the displayLocation array
3. **Language Support**: Include both Thai and English names for accessibility
4. **Video Duration**: Always include video durations in seconds for time estimates
5. **AI Prompts**: Provide helpful prompts that users can ask AI assistants about the topic

## Review Process

1. Tasks start in `tasks-draft.json` with status "draft"
2. After review and approval, move to `tasks.json` with status "published"
3. Update version number when making significant changes
4. Keep archived versions for reference

## Current Status

- 9 draft tasks created covering Dashboard, Sales (Quotation, Billing Note, Tax Invoice), and Mobile features
- Feature mapping complete for all FlowAccount modules
- Ready for review and expansion with more learning content