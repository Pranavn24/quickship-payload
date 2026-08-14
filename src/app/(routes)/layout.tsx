import type { ReactNode } from 'react'
// Next.js serves everything in /public at the site root, so these are
// plain <link> tags at runtime — importing here just gets them bundled.
import '../../../public/assets/css/globals.css'
import '../../../public/assets/css/styleguide.css'
import '../../../public/assets/css/responsive.css'
import '../../../public/assets/css/delhiMumbai.css'

export const metadata = {
  title: 'QuickShift',
  description: 'Compare shipping rates across 25+ courier partners.',
}

export default function RoutesLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
