// Goal Library - Sample goals for different user roles and business types
// Implementation of the task-based evaluation system

import { BusinessGoal } from '../models/goal-system.interfaces';

export const GOAL_LIBRARY: BusinessGoal[] = [
  // CASH FLOW IMPROVEMENT - Universal business goal
  {
    id: 'improve_cash_flow',
    name: 'Improve Cash Flow',
    description: 'Increase revenue collection speed and reduce unnecessary expenses to strengthen your financial position',
    applicableRoles: ['owner', 'administrator', 'accountant'],
    applicableBusinessTypes: ['service', 'product', 'mixed', 'freelance', 'e_commerce', 'retail'],
    priority: 1,
    overallBenefit: 'Typically improve monthly cash position by 20-25% through better quote conversion and expense control',
    estimatedTotalTime: 45,
    successMetrics: [
      'Quote acceptance rate increase of 15-30%',
      'Average payment collection time reduced by 1 week',
      'Monthly expense variance reduced by 10-15%'
    ],
    workflows: [
      {
        id: 'quotation_followup',
        name: 'Quotation Follow-Up Process',
        description: 'Systematic approach to converting quotes into sales',
        definedOutcome: 'Increase quote acceptance rate and reduce sales cycle time',
        benefitStatement: 'Convert 30% more quotes into sales and reduce average sales cycle by 1 week',
        estimatedTime: 25,
        difficulty: 'beginner',
        completionCriteria: 'User has sent follow-up on at least one pending quotation',
        tasks: [
          {
            id: 'review_pending_quotes',
            name: 'Review Pending Quotations',
            description: 'Find and assess all quotations awaiting customer response',
            taskOutcome: 'Complete visibility of outstanding quotes and their status',
            estimatedTime: 8,
            difficulty: 'beginner',
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
                }
              ],
              expectedResult: 'You should see a list of all pending quotations with their ages and amounts'
            },
            completionValidation: {
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
              'Focus on quotes older than 7 days first - these have the highest risk of being forgotten'
            ]
          },
          {
            id: 'send_quote_reminder',
            name: 'Send Follow-Up Reminder',
            description: 'Send professional follow-up message to customer about pending quote',
            taskOutcome: 'Customer receives gentle reminder about your quotation',
            estimatedTime: 12,
            difficulty: 'beginner',
            dependencies: ['review_pending_quotes'],
            instructions: {
              overview: 'Send a professional follow-up email to re-engage customers about your quotation',
              steps: [
                {
                  stepNumber: 1,
                  title: 'Select Quote for Follow-up',
                  description: 'Choose a pending quotation that needs attention',
                  action: 'click',
                  target: '[data-test="quote-row"]:first-child'
                },
                {
                  stepNumber: 2,
                  title: 'Send Follow-up Email',
                  description: 'Use FlowAccount\'s follow-up feature to send reminder',
                  action: 'click',
                  target: '[data-test="quote-followup-btn"]'
                }
              ],
              expectedResult: 'Customer receives follow-up email and quote status updates to "Follow-up Sent"'
            },
            completionValidation: {
              type: 'system_check',
              criteria: [
                {
                  field: 'followup_email_sent',
                  operator: 'equals',
                  expectedValue: true
                }
              ]
            }
          }
        ]
      },
      {
        id: 'expense_management',
        name: 'Expense Management & Budget Control',
        description: 'Reduce unnecessary spending and improve expense visibility',
        definedOutcome: 'Better control over business expenses and budget adherence',
        benefitStatement: 'Identify cost-saving opportunities worth 10-15% of monthly expenses',
        estimatedTime: 20,
        difficulty: 'intermediate',
        completionCriteria: 'User has set up expense categories and reviewed monthly spending',
        tasks: [
          {
            id: 'setup_expense_categories',
            name: 'Set Up Expense Categories',
            description: 'Create organized categories for tracking business expenses',
            taskOutcome: 'Clear expense categorization system for better reporting',
            estimatedTime: 10,
            difficulty: 'beginner',
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
                  title: 'Create Expense Categories',
                  description: 'Add categories like Office Supplies, Travel, Marketing',
                  action: 'click',
                  target: '[data-test="add-category-btn"]'
                }
              ],
              expectedResult: 'You should have at least 5 expense categories set up'
            },
            completionValidation: {
              type: 'system_check',
              criteria: [
                {
                  field: 'expense_categories_count',
                  operator: 'greater_than',
                  expectedValue: 3
                }
              ]
            }
          }
        ]
      }
    ]
  },

  // TAX COMPLIANCE - Critical for all businesses
  {
    id: 'ensure_tax_compliance',
    name: 'Ensure Tax Compliance',
    description: 'Maintain accurate tax records and automate tax reporting to avoid penalties',
    applicableRoles: ['owner', 'accountant', 'administrator'],
    applicableBusinessTypes: ['service', 'product', 'mixed', 'freelance', 'e_commerce', 'retail', 'restaurant'],
    priority: 2,
    overallBenefit: 'Eliminate tax penalties and reduce tax preparation time by 80% through automation',
    estimatedTotalTime: 35,
    successMetrics: [
      '100% tax compliance with automatic e-Tax submission',
      'Zero manual tax calculation errors',
      'Monthly tax reporting time reduced from 8 hours to 30 minutes'
    ],
    workflows: [
      {
        id: 'etax_invoice_setup',
        name: 'e-Tax Invoice Setup',
        description: 'Configure automated tax-compliant invoicing system',
        definedOutcome: 'Automated tax-compliant invoicing with zero manual errors',
        benefitStatement: '100% tax compliance with automatic e-Tax submission, eliminating audit risks',
        estimatedTime: 20,
        difficulty: 'intermediate',
        completionCriteria: 'User has successfully sent at least one e-Tax compliant invoice',
        tasks: [
          {
            id: 'configure_tax_rates',
            name: 'Configure Tax Rates',
            description: 'Set up correct VAT and tax rates for your business type',
            taskOutcome: 'Accurate tax calculations on all invoices and quotes',
            estimatedTime: 10,
            difficulty: 'intermediate',
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
                }
              ],
              expectedResult: 'Tax rates are correctly configured and will apply to all new invoices'
            },
            completionValidation: {
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
              'Some services may be VAT-exempt - check with your accountant if unsure'
            ]
          }
        ]
      }
    ]
  },

  // TEAM PRODUCTIVITY - For businesses with employees
  {
    id: 'improve_team_productivity',
    name: 'Improve Team Productivity',
    description: 'Streamline team workflows and enable collaboration while maintaining proper controls',
    applicableRoles: ['owner', 'administrator'],
    applicableBusinessTypes: ['service', 'product', 'mixed', 'e_commerce', 'retail', 'consulting'],
    priority: 3,
    overallBenefit: 'Reduce team training time by 70% and ensure consistent professional output across all team members',
    estimatedTotalTime: 40,
    successMetrics: [
      'Team member onboarding time reduced by 70%',
      'Consistent document formatting across all team output',
      'Proper access controls protecting sensitive financial data'
    ],
    workflows: [
      {
        id: 'user_management_setup',
        name: 'User Management & Permissions',
        description: 'Set up secure, role-based access for team members',
        definedOutcome: 'Secure team collaboration with proper access controls',
        benefitStatement: 'Enable team productivity while maintaining financial data security',
        estimatedTime: 25,
        difficulty: 'intermediate',
        completionCriteria: 'User has added at least one team member with appropriate permissions',
        tasks: [
          {
            id: 'add_team_member',
            name: 'Add Team Member',
            description: 'Invite a team member and configure their access level',
            taskOutcome: 'Team member can access FlowAccount with appropriate permissions',
            estimatedTime: 15,
            difficulty: 'beginner',
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
                  action: 'click',
                  target: '[data-test="role-selector"]'
                }
              ],
              expectedResult: 'Team member receives invitation email and can access FlowAccount'
            },
            completionValidation: {
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
              'Administrators can access all financial data - use carefully'
            ]
          }
        ]
      }
    ]
  },

  // CLIENT MANAGEMENT - For service businesses and accounting firms
  {
    id: 'scale_client_operations',
    name: 'Scale Client Operations',
    description: 'Manage multiple clients efficiently with professional reporting and streamlined processes',
    applicableRoles: ['accounting_firm', 'owner', 'administrator'],
    applicableBusinessTypes: ['service', 'consulting', 'freelance'],
    priority: 2,
    overallBenefit: 'Handle 3x more clients with the same resources through process automation and professional reporting',
    estimatedTotalTime: 50,
    successMetrics: [
      'Client capacity increased by 200% without additional staff',
      'Professional reports delivered automatically to all clients',
      'Client onboarding time reduced by 60%'
    ],
    workflows: [
      {
        id: 'client_portal_setup',
        name: 'Client Portal Configuration',
        description: 'Set up professional client portals for transparent communication',
        definedOutcome: 'Clients have self-service access to their financial data',
        benefitStatement: 'Reduce client support requests by 50% through self-service portals',
        estimatedTime: 30,
        difficulty: 'advanced',
        completionCriteria: 'At least one client portal is configured and accessible',
        tasks: [
          {
            id: 'create_client_portal',
            name: 'Create Client Portal',
            description: 'Set up branded client portal with appropriate access controls',
            taskOutcome: 'Professional client portal ready for client access',
            estimatedTime: 20,
            difficulty: 'advanced',
            instructions: {
              overview: 'Create a branded portal where clients can access their financial reports and data',
              steps: [
                {
                  stepNumber: 1,
                  title: 'Access Client Portal Settings',
                  description: 'Navigate to client portal configuration',
                  action: 'navigate',
                  target: '/settings/client-portal'
                },
                {
                  stepNumber: 2,
                  title: 'Configure Branding',
                  description: 'Upload your logo and set brand colors',
                  action: 'upload',
                  target: '[data-test="logo-upload"]'
                }
              ],
              expectedResult: 'Client portal is configured with your branding and ready for client access'
            },
            completionValidation: {
              type: 'user_confirmation',
              criteria: [
                {
                  field: 'client_portal_configured',
                  operator: 'equals',
                  expectedValue: true
                }
              ]
            }
          }
        ]
      }
    ]
  },

  // DATA-DRIVEN DECISIONS - For growth-focused businesses
  {
    id: 'make_data_driven_decisions',
    name: 'Make Data-Driven Decisions',
    description: 'Set up business intelligence dashboards and key performance metrics tracking',
    applicableRoles: ['owner', 'administrator'],
    applicableBusinessTypes: ['service', 'product', 'mixed', 'e_commerce', 'retail'],
    priority: 4,
    overallBenefit: 'Make informed business decisions 5x faster with real-time insights and automated reporting',
    estimatedTotalTime: 35,
    successMetrics: [
      'Key business metrics visible in real-time dashboard',
      'Monthly business review reports generated automatically',
      'Decision-making time reduced by 80% with instant data access'
    ],
    workflows: [
      {
        id: 'business_intelligence_setup',
        name: 'Business Intelligence Dashboard',
        description: 'Configure key performance indicators and automated reporting',
        definedOutcome: 'Real-time visibility into key business performance metrics',
        benefitStatement: 'Make informed decisions 5x faster with instant access to critical business data',
        estimatedTime: 25,
        difficulty: 'intermediate',
        completionCriteria: 'Dashboard shows at least 5 key business metrics with current data',
        tasks: [
          {
            id: 'setup_kpi_dashboard',
            name: 'Set Up KPI Dashboard',
            description: 'Configure key performance indicators for your business',
            taskOutcome: 'Real-time dashboard showing critical business metrics',
            estimatedTime: 15,
            difficulty: 'intermediate',
            instructions: {
              overview: 'Create a dashboard that shows the most important metrics for your business success',
              steps: [
                {
                  stepNumber: 1,
                  title: 'Access Dashboard Settings',
                  description: 'Navigate to business intelligence configuration',
                  action: 'navigate',
                  target: '/dashboard/settings'
                },
                {
                  stepNumber: 2,
                  title: 'Select Key Metrics',
                  description: 'Choose metrics like Revenue, Cash Flow, Outstanding Invoices',
                  action: 'click',
                  target: '[data-test="metric-selector"]'
                }
              ],
              expectedResult: 'Dashboard displays real-time key performance indicators'
            },
            completionValidation: {
              type: 'system_check',
              criteria: [
                {
                  field: 'kpi_dashboard_configured',
                  operator: 'equals',
                  expectedValue: true
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

// Goal Recommendation Logic - Maps user characteristics to recommended goals
export function getRecommendedGoals(userRole: string, businessType: string, limit: number = 3): BusinessGoal[] {
  return GOAL_LIBRARY
    .filter(goal => 
      goal.applicableRoles.includes(userRole as any) && 
      goal.applicableBusinessTypes.includes(businessType as any)
    )
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit);
}

// Search goals by keyword
export function searchGoals(keyword: string): BusinessGoal[] {
  const lowerKeyword = keyword.toLowerCase();
  return GOAL_LIBRARY.filter(goal =>
    goal.name.toLowerCase().includes(lowerKeyword) ||
    goal.description.toLowerCase().includes(lowerKeyword) ||
    goal.workflows.some(workflow => 
      workflow.name.toLowerCase().includes(lowerKeyword) ||
      workflow.description.toLowerCase().includes(lowerKeyword)
    )
  );
}

// Get goal by ID
export function getGoalById(goalId: string): BusinessGoal | undefined {
  return GOAL_LIBRARY.find(goal => goal.id === goalId);
}