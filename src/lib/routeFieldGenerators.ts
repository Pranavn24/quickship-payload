export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateInternalTitle(origin: string, destination: string): string {
  return `${origin} → ${destination}`
}

export function generateSlug(origin: string, destination: string): string {
  return `shipping-rates-from-${slugify(origin)}-to-${slugify(destination)}`
}

export function generateHeroName(origin: string, destination: string): string {
  return `Shipping Rates from ${origin} to ${destination}`
}

export function generateHeroDescription(origin: string, destination: string): string {
  return `Are you looking for the cheapest shipping charges from ${origin} to ${destination}? Our Shipping Cost Calculator gives an estimate, comparing over 25 courier partners, so you can get the best deal.`
}
