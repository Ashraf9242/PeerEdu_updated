"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-primary">PeerEdu</h3>
            <p className="text-sm text-muted-foreground">
              Connecting university students for peer-to-peer learning and academic excellence.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">{t("footer.contact")}</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>mdashraf9242@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+968 92421050</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Samail, Al Dakhliyah, Oman</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">{t("footer.followUs")}</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">{t("footer.support")}</h4>
            <div className="space-y-2">
              <Link href="/faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("footer.faq")}
              </Link>
              <Link
                href="/privacy"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.policy")}
              </Link>
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  )
}
