// In-memory error store with console logging and a subscribe API for live views.
export type LogEntry = {
  id: number;
  time: string;
  source: string;
  message: string;
  stack?: string;
};

const MAX_ENTRIES = 50;
const empty: LogEntry[] = [];
const listeners = new Set<() => void>();
let entries = empty;
let nextId = 1;

const emit = () => listeners.forEach((l) => l());

export function logError(source: string, error: unknown, extra = '') {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error(`[${source}]`, err, extra);
  const entry = { id: nextId++, time: new Date().toLocaleTimeString(), source, message: err.message, stack: err.stack };
  entries = [entry, ...entries].slice(0, MAX_ENTRIES);
  emit();
}

export function clearLog() {
  entries = empty;
  emit();
}

export const getLog = () => entries;
export const getServerLog = () => empty;

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}