'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

const BRAND = {
  blue: '#1d22d2',
  blueDark: '#1519a8',
  blueSoft: '#eef0ff',
  black: '#17191f',
  grey: '#686e79',
  border: '#e1e3e8',
}

export function RateCell({ rowData }: DefaultCellComponentProps) {
  const rate = (rowData as { rate?: number } | undefined)?.rate

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 72,
        padding: '7px 12px',
        borderRadius: 9,
        background: BRAND.blueSoft,
        border: `1px solid #dce0ff`,
        color: BRAND.black,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {typeof rate === 'number' ? `₹${rate}` : '—'}
    </span>
  )
}

export function PublishedStatusCell({
  rowData,
}: DefaultCellComponentProps) {
  const published =
    (rowData as { published?: boolean } | undefined)?.published ?? false

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 12px',
        borderRadius: 999,
        background: published ? '#eef0ff' : '#f5f5f6',
        border: `1px solid ${published ? '#dce0ff' : BRAND.border}`,
        color: published ? BRAND.blue : BRAND.grey,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: published ? BRAND.blue : '#9a9ea6',
          boxShadow: published
            ? '0 0 0 3px rgba(29, 34, 210, 0.10)'
            : 'none',
        }}
      />

      {published ? 'Published' : 'Draft'}
    </span>
  )
}

export default PublishedStatusCell