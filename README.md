# Error Boundary and Global Error Handling

Next.js (TypeScript), Tailwind and React only. No error libraries.

## Structure

| File | Purpose |
|---|---|
| `lib/errorLog.ts` | In-memory log (capped at 50) plus `console.error` |
| `components/ErrorBoundary.tsx` | Class boundary: `getDerivedStateFromError`, `componentDidCatch`, reset |
| `components/ErrorFallback.tsx` | Fallback with `role="alert"`, retry, details toggle |
| `components/GlobalErrorHandler.tsx` | `error` and `unhandledrejection` listeners |
| `components/ToastProvider.tsx` | Auto-dismissing toasts, announced with `role="alert"` |
| `components/AppShell.tsx` | Provider, handler, nav and the root boundary |
| `components/BrokenWidget.tsx`, `ErrorLog.tsx` | Demo crash trigger and live log view |

## Boundary placement

| Level | Boundary | Blast radius |
|---|---|---|
| 3 | One per widget | Only that widget is replaced |
| 2 | Around a section | Only that section is replaced |
| 1 | Root, around `<main>` | The page content is replaced; nav and toasts stay alive |

The root boundary wraps `<main>`, not the nav, so a crashed page always leaves the user a way out.
Inner boundaries sit where a partial failure still leaves a usable page.

## What catches what

| Failure | Caught by | User sees |
|---|---|---|
| Error while rendering | Nearest `ErrorBoundary` | Fallback with retry |
| Error in an event handler | `window` `error` listener | Toast |
| Error in `setTimeout` | `window` `error` listener | Toast |
| Unhandled promise rejection | `unhandledrejection` listener | Toast |

Every failure is also written to the console and the in-memory log, tagged with its source.

## Recovery
- **Try again** resets the boundary and remounts the children.
- **Route change:** the root boundary is keyed on the pathname, so navigating away clears a stuck error.
- **Go home** link on the root fallback.

## Development vs production
- The fallback shows the error message in both modes, and the stack **only in development**.
- In development, React re-throws caught errors to the Next overlay, and the window listener may also show a toast. This is expected.
- Verify real behaviour with `npm run build && npm start`.