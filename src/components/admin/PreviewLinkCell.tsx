'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

const BRAND = {
  primary: '#1d22d2',
  primaryDark: '#1519a8',
  background: '#eef0ff',
  border: '#d9ddff',
  font: "'Outfit', Helvetica, sans-serif",
}

export function PreviewLinkCell({ rowData }: DefaultCellComponentProps) {
  const slug = (rowData as { slug?: string } | undefined)?.slug

  if (!slug) {
    return (
      <span
        style={{
          color: '#8a8f99',
          fontSize: 13,
          fontFamily: BRAND.font,
        }}
      >
        —
      </span>
    )
  }

  const href = `/${slug}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 9,
        border: `1px solid ${BRAND.border}`,
        background: BRAND.background,
        fontFamily: BRAND.font,
        fontSize: 12,
        fontWeight: 700,
        textDecoration: 'none',
        color: BRAND.primary,
        whiteSpace: 'nowrap',
        transition: 'all 0.18s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = BRAND.primary
        e.currentTarget.style.borderColor = BRAND.primary
        e.currentTarget.style.color = '#ffffff'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = BRAND.background
        e.currentTarget.style.borderColor = BRAND.border
        e.currentTarget.style.color = BRAND.primary
      }}
    >
      Preview
      <span style={{ fontSize: 14 }}>↗</span>
    </a>
  )
}

export default PreviewLinkCell