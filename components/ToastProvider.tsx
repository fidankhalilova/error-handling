// Toast context and container: stacked, auto-dismissing, announced with role="alert".
'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Toast = { id: number; message: string };

const DURATION_MS = 5000;
const MAX_TOASTS = 4;

const ToastContext = createContext<{ notify: (message: string) => void }>({ notify: () => {} });
export const useToast = () => useContext(ToastContext);

let nextId = 1;

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.id), DURATION_MS);
    return () => clearTimeout(id);
  }, [toast.id, onDismiss]);

  return (
    <div role="alert" className="flex items-start gap-3 rounded border border-red-600 bg-white p-3 text-sm text-red-700 shadow">
      <span>⚠ {toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">✕</button>
    </div>
  );
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string) => {
    setToasts((t) => [...t, { id: nextId++, message }].slice(-MAX_TOASTS));
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((t) => <ToastItem key={t.id} toast={t} onDismiss={dismiss} />)}
      </div>
    </ToastContext.Provider>
  );
}