// App shell: toast provider, global handler, nav, and a root boundary that resets on route change.
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import GlobalErrorHandler from '@/components/GlobalErrorHandler';
import ToastProvider from '@/components/ToastProvider';

const links = [
  { href: '/', label: 'Home' },
  { href: '/other', label: 'Other page' },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <GlobalErrorHandler />
      <nav aria-label="Main" className="flex gap-4 border-b p-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="underline">{l.label}</Link>
        ))}
      </nav>
      <ErrorBoundary
        name="root"
        resetKey={pathname}
        fallback={(p) => <ErrorFallback {...p} title="This page crashed" showHome />}
      >
        <main className="mx-auto max-w-2xl p-8">{children}</main>
      </ErrorBoundary>
    </ToastProvider>
  );
}