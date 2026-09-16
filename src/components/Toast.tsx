import React from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: 'success' | 'info' | 'reward';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-primary text-white p-4 rounded-2xl shadow-2xl border border-tertiary-fixed/30 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-lg">
              {t.type === 'reward' ? 'stars' : 'check'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-headline-md text-sm text-white font-bold">{t.title}</h4>
            <p className="font-body-sm text-xs text-white/80 mt-0.5">{t.description}</p>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-white/60 hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
