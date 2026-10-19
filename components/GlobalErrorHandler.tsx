// Attaches window "error" and "unhandledrejection" listeners that log and show a toast.
'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/errorLog';
import { useToast } from '@/components/ToastProvider';

export default function GlobalErrorHandler() {
  const { notify } = useToast();

  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      logError('window:error', e.error ?? e.message);
      notify('Something went wrong. You can keep using the app.');
    };

    const onRejection = (e: PromiseRejectionEvent) => {
      logError('window:unhandledrejection', e.reason);
      notify('A background request failed. Please try again.');
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, [notify]);

  return null;
}