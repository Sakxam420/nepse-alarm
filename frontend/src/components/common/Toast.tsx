import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  title?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 p-3.5 rounded-xl border shadow-xl fade-in"
          style={{ background: '#161b27', borderColor: 'rgba(255,255,255,0.09)' }}
        >
          {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            {toast.title && <p className="text-xs font-semibold text-white mb-0.5">{toast.title}</p>}
            <p className="text-xs text-slate-400 leading-relaxed">{toast.message}</p>
          </div>
          <button onClick={() => onDismiss(toast.id)} className="p-0.5 text-slate-500 hover:text-white transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
