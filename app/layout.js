import "./globals.css"

export const metadata = {
  title: "RudeGPT - The AI That Hates You",
  description: "The only AI assistant that refuses to help and roasts you instead. Enter at your own risk.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
