"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Menu, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "next-themes"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()
  const { theme, resolvedTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src={resolvedTheme === "dark" ? "/images/PeerEduLogo-05.png" : "/images/peeredu-logo.png"} 
              alt="PeerEdu Logo" 
              width={48} 
              height={48} 
              className="h-12 w-12" 
            />
            <span className="font-serif text-xl font-bold text-primary">PeerEdu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("nav.about")}
            </Link>
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("nav.login")}
            </Link>
            <Link href="/register" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("nav.register")}
            </Link>
          </div>

          {/* Theme and Language Controls */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageSwitcher />

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/login"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.register")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
