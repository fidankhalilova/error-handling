// Widget that throws on render once "Break" is clicked, so retry remounts it with fresh state.
'use client';

import { useState } from 'react';

export default function BrokenWidget({ name }: { name: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) throw new Error(`${name} crashed on purpose`);

  return (
    <div className="flex items-center justify-between gap-3 rounded border p-3">
      <span>{name}</span>
      <button onClick={() => setBroken(true)} className="rounded border px-3 py-1">
        Break
      </button>
    </div>
  );
}