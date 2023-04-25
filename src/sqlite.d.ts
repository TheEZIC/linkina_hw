import backend from "./backend";

declare global {
  interface Window {
    API: Omit<typeof backend, 'initDatabase'>;
  }
}

declare var window: Window;