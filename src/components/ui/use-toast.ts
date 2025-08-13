// Simple toast utility
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

let toastId = 0;
const toastCallbacks: ((toast: Toast) => void)[] = [];

export function toast(options: Omit<Toast, 'id'>): Toast {
  const id = (++toastId).toString();
  const toastData: Toast = {
    id,
    ...options,
  };
  
  // Simple console log fallback
  console.log('Toast:', toastData.title || toastData.description);
  
  // Notify all listeners
  toastCallbacks.forEach(callback => callback(toastData));
  
  return toastData;
}

export function useToast() {
  return { toast };
}
