import { getPayload } from 'payload'
import config from '../payload.config'
import { shippingRoutesSeed } from './shipping-routes.seed'

async function run() {
  const payload = await getPayload({ config })

  for (const doc of shippingRoutesSeed) {
    const existing = await payload.find({
      collection: 'shipping-route-pages',
      where: { slug: { equals: doc.slug } },
      limit: 1,
    })
    if (existing.docs.length) {
      console.log(`Skipping (already exists): ${doc.slug}`)
      continue
    }
    await payload.create({ collection: 'shipping-route-pages', data: doc })
    console.log(`Created: ${doc.slug}`)
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
