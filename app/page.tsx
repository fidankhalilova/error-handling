// Demo page: three boundary levels plus a trigger for every error type the boundary cannot catch.
'use client';

import BrokenWidget from '@/components/BrokenWidget';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorLog from '@/components/ErrorLog';

const triggers = [
  { label: 'Throw in event handler', run: () => { throw new Error('Event handler error'); } },
  { label: 'Throw in setTimeout', run: () => { setTimeout(() => { throw new Error('Timer error'); }, 0); } },
  { label: 'Reject a promise', run: () => { Promise.reject(new Error('Unhandled rejection')); } },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Error handling demo</h1>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Level 3: widget boundaries</h2>
        <ErrorBoundary name="dashboard">
          <ErrorBoundary name="widget-a"><BrokenWidget name="Widget A" /></ErrorBoundary>
          <ErrorBoundary name="widget-b"><BrokenWidget name="Widget B" /></ErrorBoundary>
        </ErrorBoundary>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Level 2: section boundary</h2>
        <ErrorBoundary name="section"><BrokenWidget name="Section widget" /></ErrorBoundary>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Level 1: no boundary of its own (root catches)</h2>
        <BrokenWidget name="Page widget" />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Errors a boundary cannot catch (toast instead)</h2>
        <div className="flex flex-wrap gap-2">
          {triggers.map((t) => (
            <button key={t.label} onClick={t.run} className="rounded border px-3 py-1">{t.label}</button>
          ))}
        </div>
      </section>

      <ErrorLog />
    </div>
  );
}