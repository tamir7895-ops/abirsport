const base = import.meta.env.BASE_URL || '/'
export function assetUrl(path: string): string {
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`
}
