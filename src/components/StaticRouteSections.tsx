'use client'

import Script from 'next/script'

type StaticRouteSectionsProps = {
  /** Raw HTML for everything below the Hero — read server-side and passed in. */
  html: string
  /** The route's original inline <script> content (rate table, accordion, calculator). */
  script: string
}

/**
 * Renders the static (non-CMS) part of a route page: stats strip, rate
 * table, courier comparison, transit times, calculation breakdown,
 * feature grid, and FAQ — pulled verbatim from the original site so the
 * design/copy/behavior matches exactly. Only the Hero above this is
 * CMS-driven; this block is the same for every visit to this route.
 */
export function StaticRouteSections({ html, script }: StaticRouteSectionsProps) {
  return (
    <>
      {/* Bootstrap JS bundle powers the accordion (FAQ) and any tab/toggle UI */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />

      <div dangerouslySetInnerHTML={{ __html: html }} />

      {/* Original page behavior: rate table population, form validation, calculator */}
      <Script id="route-static-behavior" strategy="afterInteractive">
        {script}
      </Script>
    </>
  )
}
