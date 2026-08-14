import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'

import { ShippingRoutePages } from './collections/ShippingRoutePages.ts'
import { Leads } from './collections/Leads.ts'
import { Users } from './collections/Users.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default buildConfig({
  admin: {
    user: Users.slug,
    css: path.resolve(dirname, './styles/admin-custom.css'),
  },
  collections: [Users, ShippingRoutePages, Leads],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-env',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: [siteUrl],
  csrf: [siteUrl],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: false,
    migrationDir: path.resolve(dirname, './migrations'),
  }),
})