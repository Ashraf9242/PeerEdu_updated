import type React from "react"
import type { Metadata } from "next"
import { Source_Sans_3 } from "next/font/google"
import { Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "PeerEdu - Connect, Learn, Excel",
  description: "A peer-to-peer tutoring platform connecting university students in Oman",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${sourceSans.style.fontFamily};
  --font-source-sans: ${sourceSans.variable};
  --font-playfair: ${playfair.variable};
}
        `}</style>
      </head>
      <body className={`${sourceSans.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <LanguageProvider>{children}</LanguageProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
