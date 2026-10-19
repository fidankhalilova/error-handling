// Default fallback UI: announced, with retry, optional home link and a details toggle (stack in dev only).
'use client';

import Link from 'next/link';
import { useId, useState } from 'react';

export type FallbackProps = { error: Error; reset: () => void };
type Props = FallbackProps & { title?: string; showHome?: boolean };

const isDev = process.env.NODE_ENV === 'development';

export default function ErrorFallback({ error, reset, title = 'Something went wrong', showHome = false }: Props) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <div role="alert" className="flex flex-col gap-3 rounded border border-red-600 p-4">
      <h2 className="font-semibold text-red-700">⚠ {title}</h2>
      <p className="text-sm">You can try again. If it keeps happening, reload the page.</p>
      <div className="flex gap-2">
        <button onClick={reset} className="rounded bg-black px-3 py-1 text-white">Try again</button>
        {showHome && <Link href="/" className="rounded border px-3 py-1">Go home</Link>}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={detailsId}
          className="rounded border px-3 py-1"
        >
          {open ? 'Hide details' : 'Show details'}
        </button>
      </div>
      <div id={detailsId} hidden={!open} className="text-xs">
        <p className="font-mono">{error.message}</p>
        {isDev && <pre className="mt-2 max-h-48 overflow-auto bg-gray-100 p-2">{error.stack}</pre>}
      </div>
    </div>
  );
}