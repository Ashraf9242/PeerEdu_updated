"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationBell } from "@/components/notification-bell"
import { useLanguage } from "@/contexts/language-context"

type DashboardNavLink = {
  href: string
  labelKey: string
}

interface DashboardNavigationProps {
  links: DashboardNavLink[]
}

export function DashboardNavigation({ links }: DashboardNavigationProps) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    void signOut({ callbackUrl: "/" })
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(href)
  }

  const renderLinks = (className: string, onClick?: () => void) =>
    links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={onClick}
        className={`${className} ${
          isActive(link.href) ? "text-primary" : "text-foreground"
        }`}
      >
        {t(link.labelKey)}
      </Link>
    ))

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={
                mounted && resolvedTheme === "dark"
                  ? "/images/PeerEduLogo-05.png"
                  : "/images/peeredu-logo.png"
              }
              alt="PeerEdu Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="font-serif text-xl font-bold text-primary">
              PeerEdu
            </span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {renderLinks(
              "text-sm font-medium transition-colors hover:text-primary"
            )}
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <NotificationBell />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              {t("dashboard.nav.logout")}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t py-3 md:hidden">
            <div className="flex flex-col space-y-2">
              {renderLinks(
                "px-3 py-2 text-base font-medium transition-colors hover:text-primary",
                () => setIsMenuOpen(false)
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
