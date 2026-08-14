import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'from_name',
    defaultColumns: ['from_name', 'reply_to', 'mobile', 'originCity', 'destinationCity', 'createdAt'],
    group: 'Leads',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user), // admin/team only
    create: () => true, // public form submits create leads
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'from_name', type: 'text', required: true, label: 'Full Name' },
    { name: 'reply_to', type: 'email', required: true, label: 'Email' },
    { name: 'mobile', type: 'text', required: true },
    { name: 'business_name', type: 'text' },
    { name: 'monthly_orders', type: 'text' },
    { name: 'category', type: 'text' },
    { name: 'originCity', type: 'text' },
    { name: 'destinationCity', type: 'text' },
    { name: 'source', type: 'text', defaultValue: 'hero_form' },
  ],
}
