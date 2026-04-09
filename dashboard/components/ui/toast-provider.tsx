'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (options: { title: string; description?: string; variant?: ToastType }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: { title: string; description?: string; variant?: ToastType }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description,
      type: options.variant || 'info',
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg shadow-lg border max-w-sm animate-in slide-in-from-right",
              t.type === 'success' && "bg-green-50 border-green-200",
              t.type === 'error' && "bg-red-50 border-red-200",
              t.type === 'info' && "bg-blue-50 border-blue-200"
            )}
          >
            {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {t.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-medium text-sm",
                t.type === 'success' && "text-green-900",
                t.type === 'error' && "text-red-900",
                t.type === 'info' && "text-blue-900"
              )}>{t.title}</p>
              {t.description && (
                <p className={cn(
                  "text-sm mt-0.5",
                  t.type === 'success' && "text-green-700",
                  t.type === 'error' && "text-red-700",
                  t.type === 'info' && "text-blue-700"
                )}>{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className={cn(
                "shrink-0 p-1 rounded hover:bg-black/5",
                t.type === 'success' && "text-green-600",
                t.type === 'error' && "text-red-600",
                t.type === 'info' && "text-blue-600"
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { toast: () => {} };
  }
  return context;
}
