// Learning Content Library - TypeScript Master Data
// This is the master source of truth for all learning content
// Provides type safety and code editing capabilities

import {
  LearningTask,
  LearningWorkflow,
  LearningGoal,
  ContentLibrary,
  ContentAttachments
} from '../models/learning-content.types';

// Helper function to create default content attachments
function createContentAttachments(options: Partial<ContentAttachments> = {}): ContentAttachments {
  return {
    videoUrls: options.videoUrls || [],
    videoDurations: options.videoDurations || [],
    articleUrls: options.articleUrls || [],
    articleTitles: options.articleTitles || [],
    aiPrompts: options.aiPrompts || [],
    aiContexts: options.aiContexts || [],
    resourceUrls: options.resourceUrls || [],
    resourceDescriptions: options.resourceDescriptions || [],
    attachmentNotes: options.attachmentNotes || ''
  };
}

// ===== TASKS - Atomic learning units =====

export const LEARNING_TASKS: LearningTask[] = [
  // Cash Flow Improvement Tasks
  {
    id: 'task_1737722400_001',
    name: 'Review Pending Quotations',
    description: 'Find and assess all quotations awaiting customer response',
    outcome: 'Complete visibility of outstanding quotes and their status',
    estimatedTime: 8,
    difficulty: 'beginner',
    contentAttachments: createContentAttachments({
      videoUrls: ['https://example.com/quotations-review-demo.mp4'],
      aiPrompts: ['Help user review pending quotations efficiently', 'Generate follow-up reminders for old quotes'],
      aiContexts: ['Dashboard navigation assistance', 'Professional communication templates']
    }),
    instructions: {
      overview: 'Access your quotation dashboard to see all pending quotes and their aging',
      steps: [
        {
          stepNumber: 1,
          title: 'Navigate to Sales Dashboard',
          description: 'Go to the main sales overview to see quotation summary',
          action: 'navigate',
          target: '/dashboard/sales'
        },
        {
          stepNumber: 2,
          title: 'Open Quotations List',
          description: 'Click on "Pending Quotations" section',
          action: 'click',
          target: '[data-test="pending-quotations-link"]'
        },
        {
          stepNumber: 3,
          title: 'Review Quote Status',
          description: 'Check the age and amount of each pending quotation',
          action: 'review',
          target: '.quotation-list-item'
        }
      ],
      expectedResult: 'You should see a list of all pending quotations with their ages and amounts'
    },
    completionCriteria: {
      type: 'user_confirmation',
      criteria: [
        {
          field: 'user_visited_quotes_page',
          operator: 'equals',
          expectedValue: true
        }
      ]
    },
    tips: [
      'Focus on quotes older than 7 days first - these have the highest risk of being forgotten',
      'Sort by date to prioritize the oldest quotes'
    ],
    tags: ['quotations', 'sales', 'review', 'cash-flow'],
    category: 'Sales',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24'),
    averageCompletionTime: 6,
    completionRate: 85,
    difficultyRating: 2.1
  },

  {
    id: 'task_1737722400_002',
    name: 'Send Follow-Up Reminder',
    description: 'Send professional follow-up message to customer about pending quote',
    outcome: 'Customer receives gentle reminder about your quotation',
    estimatedTime: 12,
    difficulty: 'beginner',
    prerequisites: ['task_1737722400_001'],
    contentAttachments: createContentAttachments({
      aiPrompts: ['Generate professional follow-up email templates', 'Create customer re-engagement strategies']
    }),
    instructions: {
      overview: 'Send a professional follow-up email to re-engage customers about your quotation',
      steps: [
        {
          stepNumber: 1,
          title: 'Select Quote for Follow-up',
          description: 'Choose a pending quotation that needs attention (older than 5 days)',
          action: 'click',
          target: '[data-test="quote-row"]:first-child'
        },
        {
          stepNumber: 2,
          title: 'Open Follow-up Options',
          description: 'Click the follow-up action button',
          action: 'click',
          target: '[data-test="quote-followup-btn"]'
        },
        {
          stepNumber: 3,
          title: 'Customize Follow-up Message',
          description: 'Personalize the follow-up email with specific quote details',
          action: 'input',
          target: '[data-test="followup-message"]'
        },
        {
          stepNumber: 4,
          title: 'Send Follow-up',
          description: 'Send the follow-up email to the customer',
          action: 'click',
          target: '[data-test="send-followup-btn"]'
        }
      ],
      expectedResult: 'Customer receives follow-up email and quote status updates to "Follow-up Sent"'
    },
    completionCriteria: {
      type: 'system_check',
      criteria: [
        {
          field: 'followup_email_sent',
          operator: 'equals',
          expectedValue: true
        }
      ]
    },
    tips: [
      'Personalize the follow-up message with specific quote details',
      'Follow up within 3-5 business days for best results',
      'Include a clear call-to-action in your message'
    ],
    troubleshooting: [
      {
        commonIssue: 'Follow-up button not visible',
        solution: 'Ensure the quote is in "Pending" status and not already followed up',
        severity: 'medium'
      }
    ],
    tags: ['quotations', 'follow-up', 'sales', 'communication', 'cash-flow'],
    category: 'Sales',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24'),
    averageCompletionTime: 10,
    completionRate: 78,
    difficultyRating: 2.3
  },

  // Expense Management Tasks
  {
    id: 'task_1737722400_003',
    name: 'Set Up Expense Categories',
    description: 'Create organized categories for tracking business expenses',
    outcome: 'Clear expense categorization system for better reporting',
    estimatedTime: 10,
    difficulty: 'beginner',
    contentAttachments: createContentAttachments(),
    instructions: {
      overview: 'Organize your expenses into meaningful categories for better tracking and reporting',
      steps: [
        {
          stepNumber: 1,
          title: 'Access Expense Settings',
          description: 'Navigate to expense management configuration',
          action: 'navigate',
          target: '/expenses/settings'
        },
        {
          stepNumber: 2,
          title: 'Create Basic Categories',
          description: 'Add essential categories like Office Supplies, Travel, Marketing',
          action: 'click',
          target: '[data-test="add-category-btn"]'
        },
        {
          stepNumber: 3,
          title: 'Configure Category Details',
          description: 'Set category names, descriptions, and tax implications',
          action: 'input',
          target: '[data-test="category-form"]'
        }
      ],
      expectedResult: 'You should have at least 5 expense categories set up'
    },
    completionCriteria: {
      type: 'system_check',
      criteria: [
        {
          field: 'expense_categories_count',
          operator: 'greater_than',
          expectedValue: 3
        }
      ]
    },
    tips: [
      'Start with broad categories and add specific ones as needed',
      'Consider tax deductible categories separately',
      'Use consistent naming conventions'
    ],
    tags: ['expenses', 'categories', 'organization', 'cash-flow'],
    category: 'Expenses',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24')
  },

  // Tax Compliance Tasks
  {
    id: 'task_1737722400_004',
    name: 'Configure Tax Rates',
    description: 'Set up correct VAT and tax rates for your business type',
    outcome: 'Accurate tax calculations on all invoices and quotes',
    estimatedTime: 10,
    difficulty: 'intermediate',
    contentAttachments: createContentAttachments(),
    instructions: {
      overview: 'Configure the correct tax rates for Thai VAT and other applicable taxes',
      steps: [
        {
          stepNumber: 1,
          title: 'Access Tax Settings',
          description: 'Navigate to tax configuration in FlowAccount',
          action: 'navigate',
          target: '/settings/tax'
        },
        {
          stepNumber: 2,
          title: 'Set VAT Rate',
          description: 'Configure 7% VAT rate for standard business transactions',
          action: 'input',
          target: '[data-test="vat-rate-input"]',
          inputValue: '7'
        },
        {
          stepNumber: 3,
          title: 'Configure Tax Categories',
          description: 'Set up different tax rates for different product/service types',
          action: 'click',
          target: '[data-test="tax-category-setup"]'
        }
      ],
      expectedResult: 'Tax rates are correctly configured and will apply to all new invoices'
    },
    completionCriteria: {
      type: 'system_check',
      criteria: [
        {
          field: 'vat_rate_configured',
          operator: 'equals',
          expectedValue: true
        }
      ]
    },
    tips: [
      'Standard VAT rate in Thailand is 7% for most business transactions',
      'Some services may be VAT-exempt - check with your accountant if unsure',
      'Keep documentation of tax rate changes for audit purposes'
    ],
    tags: ['tax', 'vat', 'compliance', 'configuration'],
    category: 'Tax Compliance',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24')
  },

  // Team Management Tasks
  {
    id: 'task_1737722400_005',
    name: 'Add Team Member',
    description: 'Invite a team member and configure their access level',
    outcome: 'Team member can access FlowAccount with appropriate permissions',
    estimatedTime: 15,
    difficulty: 'beginner',
    contentAttachments: createContentAttachments(),
    instructions: {
      overview: 'Add team members to FlowAccount and set their permission levels',
      steps: [
        {
          stepNumber: 1,
          title: 'Access User Management',
          description: 'Navigate to team member management section',
          action: 'navigate',
          target: '/settings/users'
        },
        {
          stepNumber: 2,
          title: 'Invite Team Member',
          description: 'Click Add User and enter their email address',
          action: 'click',
          target: '[data-test="add-user-btn"]'
        },
        {
          stepNumber: 3,
          title: 'Set Permissions',
          description: 'Choose appropriate role: Staff, Manager, or Administrator',
          action: 'select',
          target: '[data-test="role-selector"]'
        },
        {
          stepNumber: 4,
          title: 'Send Invitation',
          description: 'Send the invitation email to the team member',
          action: 'click',
          target: '[data-test="send-invitation-btn"]'
        }
      ],
      expectedResult: 'Team member receives invitation email and can access FlowAccount'
    },
    completionCriteria: {
      type: 'system_check',
      criteria: [
        {
          field: 'team_member_invited',
          operator: 'equals',
          expectedValue: true
        }
      ]
    },
    tips: [
      'Start with Staff level permissions and upgrade as needed',
      'Administrators can access all financial data - use carefully',
      'Send a welcome message explaining their role'
    ],
    tags: ['team', 'users', 'permissions', 'collaboration'],
    category: 'Team Management',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24')
  }
];

// ===== WORKFLOWS - Process-based learning sequences =====

export const LEARNING_WORKFLOWS: LearningWorkflow[] = [
  {
    id: 'workflow_1737722400_001',
    name: 'Quotation Follow-Up Process',
    description: 'Systematic approach to converting quotes into sales',
    outcome: 'Increase quote acceptance rate and reduce sales cycle time',
    businessValue: 'Convert 30% more quotes into sales and reduce average sales cycle by 1 week',
    taskIds: ['task_1737722400_001', 'task_1737722400_002'],
    taskSequence: 'sequential',
    estimatedTime: 20,
    difficulty: 'beginner',
    contentAttachments: createContentAttachments(),
    category: 'Sales',
    completionCriteria: 'User has sent follow-up on at least one pending quotation',
    successIndicators: [
      'Quote response rate increase of 25%',
      'Average quote-to-close time reduced by 3-5 days',
      'Improved customer engagement metrics'
    ],
    expectedROI: '20-30% increase in quote conversion',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24')
  },

  {
    id: 'workflow_1737722400_002',
    name: 'Expense Management & Budget Control',
    description: 'Reduce unnecessary spending and improve expense visibility',
    outcome: 'Better control over business expenses and budget adherence',
    businessValue: 'Identify cost-saving opportunities worth 10-15% of monthly expenses',
    taskIds: ['task_1737722400_003'],
    taskSequence: 'sequential',
    estimatedTime: 10,
    difficulty: 'beginner',
    contentAttachments: createContentAttachments(),
    category: 'Expenses',
    completionCriteria: 'User has set up expense categories and reviewed monthly spending',
    successIndicators: [
      'Monthly expense variance reduced by 10-15%',
      'Better visibility of spending patterns',
      'Improved budget adherence'
    ],
    expectedROI: '10-15% reduction in unnecessary expenses',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24')
  },

  {
    id: 'workflow_1737722400_003',
    name: 'e-Tax Invoice Setup',
    description: 'Configure automated tax-compliant invoicing system',
    outcome: 'Automated tax-compliant invoicing with zero manual errors',
    businessValue: '100% tax compliance with automatic e-Tax submission, eliminating audit risks',
    taskIds: ['task_1737722400_004'],
    taskSequence: 'sequential',
    estimatedTime: 10,
    difficulty: 'intermediate',
    contentAttachments: createContentAttachments(),
    category: 'Tax Compliance',
    completionCriteria: 'User has successfully configured tax rates for e-Tax compliant invoicing',
    successIndicators: [
      '100% tax compliance',
      'Zero manual tax calculation errors',
      'Audit risk elimination'
    ],
    expectedROI: 'Eliminates potential tax penalties and audit costs',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24')
  },

  {
    id: 'workflow_1737722400_004',
    name: 'User Management & Permissions',
    description: 'Set up secure, role-based access for team members',
    outcome: 'Secure team collaboration with proper access controls',
    businessValue: 'Enable team productivity while maintaining financial data security',
    taskIds: ['task_1737722400_005'],
    taskSequence: 'sequential',
    estimatedTime: 15,
    difficulty: 'intermediate',
    contentAttachments: createContentAttachments(),
    category: 'Team Management',
    completionCriteria: 'User has added at least one team member with appropriate permissions',
    successIndicators: [
      'Team productivity increase',
      'Maintained data security',
      'Proper access control implementation'
    ],
    expectedROI: 'Increased team efficiency while maintaining security',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24')
  }
];

// ===== GOALS - High-level business objectives =====

export const LEARNING_GOALS: LearningGoal[] = [
  {
    id: 'goal_1737722400_001',
    name: 'Improve Cash Flow',
    description: 'Increase revenue collection speed and reduce unnecessary expenses to strengthen your financial position',
    businessValue: 'Typically improve monthly cash position by 20-25% through better quote conversion and expense control',
    priority: 1,
    contentAttachments: createContentAttachments(),
    workflowIds: ['workflow_1737722400_001', 'workflow_1737722400_002'],
    requiredWorkflows: ['workflow_1737722400_001'],
    optionalWorkflows: ['workflow_1737722400_002'],
    applicableRoles: ['owner', 'administrator', 'accountant'],
    applicableBusinessTypes: ['service', 'product', 'mixed', 'freelance', 'e_commerce', 'retail'],
    successMetrics: [
      'Quote acceptance rate increase of 15-30%',
      'Average payment collection time reduced by 1 week',
      'Monthly expense variance reduced by 10-15%'
    ],
    estimatedTotalTime: 30,
    expectedOutcome: 'Significant improvement in monthly cash flow and financial stability',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24')
  },

  {
    id: 'goal_1737722400_002',
    name: 'Ensure Tax Compliance',
    description: 'Maintain accurate tax records and automate tax reporting to avoid penalties',
    businessValue: 'Eliminate tax penalties and reduce tax preparation time by 80% through automation',
    priority: 2,
    contentAttachments: createContentAttachments(),
    workflowIds: ['workflow_1737722400_003'],
    requiredWorkflows: ['workflow_1737722400_003'],
    optionalWorkflows: [],
    applicableRoles: ['owner', 'accountant', 'administrator'],
    applicableBusinessTypes: ['service', 'product', 'mixed', 'freelance', 'e_commerce', 'retail', 'restaurant'],
    successMetrics: [
      '100% tax compliance with automatic e-Tax submission',
      'Zero manual tax calculation errors',
      'Monthly tax reporting time reduced from 8 hours to 30 minutes'
    ],
    estimatedTotalTime: 10,
    expectedOutcome: 'Complete tax compliance with automated processes',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24')
  },

  {
    id: 'goal_1737722400_003',
    name: 'Improve Team Productivity',
    description: 'Streamline team workflows and enable collaboration while maintaining proper controls',
    businessValue: 'Reduce team training time by 70% and ensure consistent professional output across all team members',
    priority: 3,
    contentAttachments: createContentAttachments(),
    workflowIds: ['workflow_1737722400_004'],
    requiredWorkflows: ['workflow_1737722400_004'],
    optionalWorkflows: [],
    applicableRoles: ['owner', 'administrator'],
    applicableBusinessTypes: ['service', 'product', 'mixed', 'e_commerce', 'retail', 'consulting'],
    successMetrics: [
      'Team member onboarding time reduced by 70%',
      'Consistent document formatting across all team output',
      'Proper access controls protecting sensitive financial data'
    ],
    estimatedTotalTime: 15,
    expectedOutcome: 'Efficient team collaboration with proper security controls',
    version: 1,
    status: 'published',
    lastUpdated: new Date('2025-01-24')
  }
];

// ===== MAIN EXPORT =====

export const CONTENT_LIBRARY: ContentLibrary = {
  goals: LEARNING_GOALS,
  workflows: LEARNING_WORKFLOWS,
  tasks: LEARNING_TASKS
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get all content in structured format
 */
export function getAllLearningContent(): ContentLibrary {
  return CONTENT_LIBRARY;
}

/**
 * Validate content relationships
 */
export function validateContentIntegrity(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check that all workflow task IDs exist
  LEARNING_WORKFLOWS.forEach(workflow => {
    workflow.taskIds.forEach(taskId => {
      if (!LEARNING_TASKS.find(t => t.id === taskId)) {
        errors.push(`Workflow "${workflow.name}" references non-existent task: ${taskId}`);
      }
    });
  });

  // Check that all goal workflow IDs exist
  LEARNING_GOALS.forEach(goal => {
    goal.workflowIds.forEach(workflowId => {
      if (!LEARNING_WORKFLOWS.find(w => w.id === workflowId)) {
        errors.push(`Goal "${goal.name}" references non-existent workflow: ${workflowId}`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors
  };
}