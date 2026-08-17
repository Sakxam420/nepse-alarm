import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
          info: <Info className="h-5 w-5 text-cyan-400 shrink-0" />,
        }[toast.type];

        const borderGlow = {
          success: 'border-emerald-500/40 shadow-glow-emerald',
          error: 'border-rose-500/40 shadow-glow-rose',
          info: 'border-cyan-500/40 shadow-glow-cyan',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl glass-panel-elevated border ${borderGlow} transition-all duration-300 transform translate-y-0`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <div className="flex flex-col">
                {toast.title && <span className="text-xs font-bold text-white uppercase tracking-wider">{toast.title}</span>}
                <span className="text-xs text-slate-200 font-medium">{toast.message}</span>
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
