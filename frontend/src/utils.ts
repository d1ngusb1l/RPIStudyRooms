export function backendURL(path: string) {
  return `${window.location.protocol}//${window.location.hostname}:${
    import.meta.env.VITE_BACKEND_URL_PORT
  }${path}`;
}
