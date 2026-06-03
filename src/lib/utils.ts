export function getAssetPath(path: string): string {
  if (typeof window === 'undefined') {
    // Server side: check if we're in production
    if (process.env.NODE_ENV === 'production') {
      return `/interactive-map-site${path}`;
    }
    return path;
  }
  
  // Client side: check if current URL has basePath
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/interactive-map-site')) {
    return `/interactive-map-site${path}`;
  }
  return path;
}
