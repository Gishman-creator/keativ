// Dialog Components for SMMS Application
// Comprehensive dialog collection for plan management, CRM, and messaging

export { default as CreatePlanDialog } from './CreatePlanDialog';
export { default as EditPlanDialog } from './EditPlanDialog';
export { default as CreateContactDialog } from './CreateContactDialog';
export { default as EditContactDialog } from './EditContactDialog';
export { default as SendMessageDialog } from './SendMessageDialog';

// Common dialog utilities and configurations
export const DIALOG_SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg', 
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
  '2xl': 'max-w-4xl',
} as const;

export const DIALOG_ANIMATIONS = {
  scale: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
  slide: 'data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-left-1/2',
} as const;
