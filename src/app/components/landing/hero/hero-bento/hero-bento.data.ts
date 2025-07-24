export interface BentoItem {
  id: number;
  word: string;
  description: string;
  icon: string;
  cta: string;
}

// Configuration constants
export const BENTO_CONFIG = {
  AUTO_ROTATION_INTERVAL: 5000, // 5 seconds
  HOVER_RESUME_DELAY: 5000, // 5 seconds
  MOUSE_LEAVE_RESUME_DELAY: 5000, // 5 seconds
  CTA_TEXT: "Try Now"
} as const;

export const BENTO_ITEMS: BentoItem[] = [
  {
    id: 1,
    word: "Support",
    description: "Build stunning designs with intuitive tools and templates that scale across platforms.",
    icon: "auto_awesome",
    cta: BENTO_CONFIG.CTA_TEXT,
  },
  {
    id: 2,
    word: "Community",
    description: "Enhance performance and user experience with smart analytics that drive results.",
    icon: "bolt",
    cta: BENTO_CONFIG.CTA_TEXT,
  },
  {
    id: 3,
    word: "SME's",
    description: "Reach the right audience with precision marketing tools that convert.",
    icon: "gps_fixed",
    cta: BENTO_CONFIG.CTA_TEXT,
  },
  {
    id: 4,
    word: "Mobile App",
    description: "Grow your business with enterprise-grade infrastructure that adapts to your needs.",
    icon: "trending_up",
    cta: BENTO_CONFIG.CTA_TEXT,
  },
  {
    id: 5,
    word: "eCommerce",
    description: "Build meaningful relationships through engagement tools and community features.",
    icon: "people",
    cta: BENTO_CONFIG.CTA_TEXT,
  },
  {
    id: 6,
    word: "eTax",
    description: "Take your business global with international platform features and localization.",
    icon: "public",
    cta: BENTO_CONFIG.CTA_TEXT,
  },
]; 