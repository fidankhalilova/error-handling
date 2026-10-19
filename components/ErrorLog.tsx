// Live view of the in-memory error log, updated through useSyncExternalStore.
'use client';

import { useSyncExternalStore } from 'react';
import { clearLog, getLog, getServerLog, subscribe } from '@/lib/errorLog';

export default function ErrorLog() {
  const entries = useSyncExternalStore(subscribe, getLog, getServerLog);

  return (
    <section aria-labelledby="log-title" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 id="log-title" className="font-semibold">Error log ({entries.length})</h2>
        <button onClick={clearLog} disabled={!entries.length} className="rounded border px-3 py-1 disabled:opacity-50">
          Clear
        </button>
      </div>
      {entries.length ? (
        <ul className="max-h-60 overflow-auto rounded border p-2 font-mono text-xs">
          {entries.map((e) => (
            <li key={e.id}>{e.time} [{e.source}] {e.message}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">No errors logged yet.</p>
      )}
    </section>
  );
}