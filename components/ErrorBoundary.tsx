// Class-based error boundary: catches render errors, logs them, and resets on retry or key change.
'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logError } from '@/lib/errorLog';
import ErrorFallback, { type FallbackProps } from '@/components/ErrorFallback';

type Props = {
  name: string;
  children: ReactNode;
  resetKey?: string;
  fallback?: (props: FallbackProps) => ReactNode;
};
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logError(`boundary:${this.props.name}`, error, info.componentStack ?? '');
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.reset();
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const props = { error, reset: this.reset };
    return this.props.fallback ? this.props.fallback(props) : <ErrorFallback {...props} />;
  }
}