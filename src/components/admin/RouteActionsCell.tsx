'use client'

import React, { useState } from 'react'
import type { DefaultCellComponentProps } from 'payload'

const BRAND = {
  blue: '#1d22d2',
  black: '#17191f',
  grey: '#68707c',
  border: '#dfe2e8',
  greyBg: '#f5f6f8',
  blueSoft: '#eef0ff',
  font: "'Outfit', Helvetica, sans-serif",
}

type RowData = {
  id?: string | number
  slug?: string
  status?: 'active' | 'inactive'
  published?: boolean
}

export function RouteActionsCell({ rowData }: DefaultCellComponentProps) {
  const row = rowData as RowData | undefined
  const [status, setStatus] = useState(row?.status ?? 'active')
  const [published, setPublished] = useState(row?.published ?? true)
  const [saving, setSaving] = useState<'status' | 'published' | null>(null)

  if (!row?.id) return null

  async function patch(body: Record<string, unknown>) {
    await fetch(`/api/shipping-route-pages/${row!.id}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as 'active' | 'inactive'
    const nextPublished = next === 'active'
    setStatus(next)
    setPublished(nextPublished)
    setSaving('status')
    await patch({ status: next, published: nextPublished })
    setSaving(null)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: BRAND.font }} onClick={(e) => e.stopPropagation()}>
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={saving === 'status'}
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: `1px solid ${BRAND.border}`,
          background: '#ffffff',
          color: BRAND.black,
          fontFamily: BRAND.font,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 999,
          border: `1px solid ${published ? '#dce0ff' : BRAND.border}`,
          background: published ? BRAND.blueSoft : BRAND.greyBg,
          color: published ? BRAND.blue : BRAND.grey,
          fontFamily: BRAND.font,
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: published ? BRAND.blue : '#9a9ea6' }} />
        {published ? 'Published' : 'Unpublished'}
      </span>

      <a
        href={`/${row.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: '6px 12px',
          borderRadius: 8,
          border: `1px solid ${BRAND.border}`,
          background: '#ffffff',
          color: BRAND.black,
          fontFamily: BRAND.font,
          fontSize: 12,
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        View
      </a>
    </div>
  )
}

export default RouteActionsCell
