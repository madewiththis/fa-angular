import { SurveyQuestion, TutorialGuide } from '../models/onboarding.interfaces';

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'primary_goal',
    text: 'What do you primarily want to test or accomplish with FlowAccount?',
    type: 'multiple-choice',
    options: [
      {
        id: 'send_quotations',
        text: 'Send quotations to customers',
        tutorialIds: ['quotations_basic', 'quotations_advanced']
      },
      {
        id: 'create_invoices',
        text: 'Create and send invoices',
        tutorialIds: ['invoices_basic', 'invoices_recurring']
      },
      {
        id: 'track_expenses',
        text: 'Track business expenses',
        tutorialIds: ['expenses_basic', 'expenses_categories']
      },
      {
        id: 'manage_inventory',
        text: 'Manage products and inventory',
        tutorialIds: ['products_basic', 'inventory_tracking']
      },
      {
        id: 'financial_reports',
        text: 'Generate financial reports',
        tutorialIds: ['reports_basic', 'reports_advanced']
      },
      {
        id: 'payment_tracking',
        text: 'Track payments and receivables',
        tutorialIds: ['payments_basic', 'receivables_management']
      }
    ]
  },
  {
    id: 'business_type',
    text: 'What type of business are you running?',
    type: 'single-choice',
    options: [
      {
        id: 'service_business',
        text: 'Service-based business',
        tutorialIds: ['service_workflow', 'time_tracking']
      },
      {
        id: 'retail_business',
        text: 'Retail/Product sales',
        tutorialIds: ['retail_workflow', 'inventory_management']
      },
      {
        id: 'freelancer',
        text: 'Freelancer/Consultant',
        tutorialIds: ['freelancer_workflow', 'project_billing']
      },
      {
        id: 'ecommerce',
        text: 'E-commerce business',
        tutorialIds: ['ecommerce_integration', 'online_payments']
      }
    ]
  },
  {
    id: 'urgency',
    text: 'What do you need to accomplish first?',
    type: 'single-choice',
    options: [
      {
        id: 'immediate_invoice',
        text: 'Send an invoice today',
        tutorialIds: ['quick_invoice_setup']
      },
      {
        id: 'setup_everything',
        text: 'Set up everything properly first',
        tutorialIds: ['complete_setup_guide', 'business_profile_setup']
      },
      {
        id: 'explore_features',
        text: 'Explore features to see if it fits my needs',
        tutorialIds: ['feature_overview', 'demo_walkthrough']
      }
    ]
  }
];

export const TUTORIAL_GUIDES: TutorialGuide[] = [
  // Quotation Tutorials
  {
    id: 'quotations_basic',
    title: 'Creating Your First Quotation',
    description: 'Learn how to create and send professional quotations to your customers.',
    videoConfig: {
      id: 'quotations_basic_tutorial',
      url: '/assets/tutorials/tutorial_quotation.mp4',
      title: 'Basic Quotations Tutorial',
      description: 'Step-by-step guide to creating quotations in FlowAccount'
    },
    estimatedDuration: '5 min',
    category: 'Sales'
  },
  {
    id: 'quotations_advanced',
    title: 'Advanced Quotation Features',
    description: 'Customize templates, add terms & conditions, and track quotation status.',
    videoConfig: {
      id: 'quotations_advanced_tutorial',
      url: '/assets/tutorials/advanced_quotations.mp4',
      title: 'Advanced Quotations',
      description: 'Advanced quotation features and customization'
    },
    estimatedDuration: '8 min',
    category: 'Sales'
  },
  
  // Invoice Tutorials
  {
    id: 'invoices_basic',
    title: 'Creating Professional Invoices',
    description: 'Create, customize, and send invoices to get paid faster.',
    videoConfig: {
      id: 'invoices_basic_tutorial',
      url: '/assets/tutorials/basic_invoices.mp4',
      title: 'Basic Invoice Creation',
      description: 'Learn to create professional invoices quickly'
    },
    estimatedDuration: '6 min',
    category: 'Billing'
  },
  {
    id: 'invoices_recurring',
    title: 'Setting Up Recurring Invoices',
    description: 'Automate recurring billing for subscription or regular services.',
    videoConfig: {
      id: 'recurring_invoices_tutorial',
      url: '/assets/tutorials/recurring_invoices.mp4',
      title: 'Recurring Invoices Setup',
      description: 'Automate your recurring billing process'
    },
    estimatedDuration: '7 min',
    category: 'Billing'
  },

  // Expense Tutorials
  {
    id: 'expenses_basic',
    title: 'Tracking Business Expenses',
    description: 'Record and categorize business expenses for better financial tracking.',
    videoConfig: {
      id: 'expenses_basic_tutorial',
      url: '/assets/tutorials/expense_tracking.mp4',
      title: 'Expense Tracking Basics',
      description: 'Learn to track and categorize business expenses'
    },
    estimatedDuration: '5 min',
    category: 'Expenses'
  },
  {
    id: 'expenses_categories',
    title: 'Organizing Expense Categories',
    description: 'Set up custom categories and tags for better expense organization.',
    videoConfig: {
      id: 'expense_categories_tutorial',
      url: '/assets/tutorials/expense_categories.mp4',
      title: 'Expense Categories Setup',
      description: 'Organize expenses with categories and tags'
    },
    estimatedDuration: '4 min',
    category: 'Expenses'
  },

  // Quick Setup Tutorials
  {
    id: 'quick_invoice_setup',
    title: 'Send Your First Invoice in 5 Minutes',
    description: 'Fast-track setup to send your first invoice immediately.',
    videoConfig: {
      id: 'quick_setup_tutorial',
      url: '/assets/tutorials/quick_invoice.mp4',
      title: 'Quick Invoice Setup',
      description: 'Get up and running with your first invoice fast'
    },
    estimatedDuration: '5 min',
    category: 'Quick Start'
  },
  {
    id: 'complete_setup_guide',
    title: 'Complete FlowAccount Setup',
    description: 'Comprehensive setup guide for business profile, preferences, and integrations.',
    videoConfig: {
      id: 'complete_setup_tutorial',
      url: '/assets/tutorials/complete_setup.mp4',
      title: 'Complete Setup Guide',
      description: 'Set up FlowAccount properly from start to finish'
    },
    estimatedDuration: '15 min',
    category: 'Setup'
  },

  // Overview Tutorials
  {
    id: 'feature_overview',
    title: 'FlowAccount Feature Overview',
    description: 'Tour of all major features to help you understand what FlowAccount can do.',
    videoConfig: {
      id: 'feature_overview_tutorial',
      url: 'https://www.youtube.com/watch?v=LiYV9XKnvjk',
      title: 'FlowAccount Features Overview',
      description: 'Complete overview of FlowAccount capabilities'
    },
    estimatedDuration: '10 min',
    category: 'Overview'
  }
];