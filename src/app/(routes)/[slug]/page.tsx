import { getPayload } from 'payload'
import config from '@payload-config'
import { StaticRouteSections } from '@/components/StaticRouteSections'
import fs from 'fs'
import path from 'path'

type PageProps = { params: Promise<{ slug: string }> }

const SHARED_CONTENT_KEY = 'delhi-mumbai'

function readContentDir(key: string) {
  const dir = path.join(process.cwd(), 'src', 'static-content')
  return {
    heroTemplate: fs.readFileSync(path.join(dir, `${key}-hero.html`), 'utf-8'),
    sectionsHtml: fs.readFileSync(path.join(dir, `${key}-sections.html`), 'utf-8'),
    script: fs.readFileSync(path.join(dir, `${key}-script.js`), 'utf-8'),
  }
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function swapCityNames(content: string, originCity: string, destinationCity: string) {
  return content.replace(/\bDelhi\b/g, originCity).replace(/\bMumbai\b/g, destinationCity)
}

export default async function ShippingRoutePage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'shipping-route-pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const doc = docs[0]

  if (!doc || doc.published === false) {
    return <div style={{ padding: 40 }}>No route available right now for &quot;{slug}&quot;.</div>
  }

  const { heroTemplate, sectionsHtml, script } = readContentDir(SHARED_CONTENT_KEY)

  const originCity = doc.originCity || 'Delhi'
  const destinationCity = doc.destinationCity || 'Mumbai'
  const price = doc.rate ?? 45
  const days = `${doc.minDeliveryDays ?? 1}\u2013${doc.maxDeliveryDays ?? 2}`

  const heroHtml = swapCityNames(heroTemplate, originCity, destinationCity)
    .replace('{{H1}}', escapeHtml(doc.heroName))
    .replace('{{SUBHEAD}}', escapeHtml(doc.heroDescription))
    .replace('{{PRICE}}', String(price))
    .replace('{{DAYS}}', days)

  const swappedSectionsHtml = swapCityNames(sectionsHtml, originCity, destinationCity)
  const swappedScript = swapCityNames(script, originCity, destinationCity)

  return (
    <div className="page-wrapper">
      <div dangerouslySetInnerHTML={{ __html: heroHtml }} />
      <StaticRouteSections html={swappedSectionsHtml} script={swappedScript} />
    </div>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'shipping-route-pages', limit: 100 })
  return docs.map((doc) => ({ slug: doc.slug }))
}
