/**
 * Utility function to get the correct path for assets like images
 * that accounts for basePath in production
 */
export function getBasePath() {
  // Use the same logic as in next.config.ts
  return process.env.NODE_ENV === 'production' ? '/SuperBrainGameHub' : '';
}

/**
 * Returns the correct path for an asset, considering the basePath in production
 */
export function withBasePath(path: string): string {
  if (path.startsWith('http')) {
    // External URLs don't need basePath
    return path;
  }
  
  const basePath = getBasePath();
  // Ensure we don't have double slashes
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
} 