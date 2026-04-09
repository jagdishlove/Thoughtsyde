'use client';
import { toast } from 'sonner';

export function useToast() {
  return {
    toast: ({
      title,
      description,
      variant = 'info'
    }: {
      title: string;
      description?: string;
      variant?: 'success' | 'error' | 'destructive' | 'info';
    }) => {
      if (variant === 'error' || variant === 'destructive') {
        toast.error(title, { description });
      } else if (variant === 'success') {
        toast.success(title, { description });
      } else {
        toast(title, { description });
      }
    }
  };
}
