import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Law's Story Generator",
  description: "Generate professional Agile user stories with AI. Built for product teams and agile practitioners.",
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
