import { Component, type ReactNode } from "react";

/** Evita que un fallo de WebGL o de partículas tumbe la página: muestra un respaldo y sigue. */
export default class SafeBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override componentDidCatch(error: unknown) { console.warn("Hero visual fallback:", error); }
  override render() { return this.state.failed ? (this.props.fallback ?? null) : this.props.children; }
}
