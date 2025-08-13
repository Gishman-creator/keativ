import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple toast notification utility
interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function toast(options: ToastOptions) {
  // For now, use console.log - can be replaced with actual toast library later
  console.log(`[${options.variant || 'default'}] ${options.title}${options.description ? ': ' + options.description : ''}`);
  
  // You can integrate with your preferred toast library here
  // For example: react-hot-toast, sonner, or custom implementation
}
