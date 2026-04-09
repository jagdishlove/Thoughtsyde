'use client';
import { Toaster, toast } from 'sonner';

export { toast };

export function ToasterProvider() {
  return (
    <Toaster 
      position="bottom-right"
      richColors
      closeButton
      expand={false}
      theme="light"
    />
  );
}
