type SeedDoc = {
  internalTitle: string
  slug: string
  originCity: string
  destinationCity: string
  heroName: string
  heroDescription: string
}

export const shippingRoutesSeed: SeedDoc[] = [
  {
    internalTitle: 'Delhi → Mumbai',
    slug: 'shipping-rates-from-delhi-to-mumbai',
    originCity: 'Delhi',
    destinationCity: 'Mumbai',
    heroName: 'Shipping Rates from Delhi to Mumbai',
    heroDescription:
      'Are you looking for the cheapest shipping charges from Delhi to Mumbai? Our Shipping Cost Calculator gives an estimate, comparing over 25 courier partners, so you can get the best deal.',
  },
]
